"""/unseen: an English reading text first, then its questions; the list of texts."""
import json
from pathlib import Path

import httpx
import respx

from app import replies
from app import unseen_replies as ur
from app.api_client import TrainerApi
from app.coach import Coach, parse_command
from app.encouragement import LINES

API = "http://api.test/api"
LRI, PDI = "⁦", "⁩"
TEXTS = Path(__file__).resolve().parents[2] / "backend" / "data" / "static" / "unseen_paragraphs.json"
TELEGRAM_MAX = 4096  # characters in one message, counted in UTF-16 units

READING = {"number": 1, "count": 15, "title": "A Day at the Zoo", "titleHe": "יום בגן החיות", "level": 1}
OPTIONS = ["To the zoo", "To the park", "To school", "To the beach"]
PASSAGE = "We went to the zoo.\n\nIt was fun."


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("a reading never goes through the model")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def question(number, text="Where did the family go?", options=OPTIONS):
    return {"number": number, "total": 5, "type": "multiple_choice", "text": text, "options": options}


def question_text(number, text="Where did the family go?", options=OPTIONS):
    lines = [f"❓ שאלה {number}/5 · A Day at the Zoo", text] + [f"{i}) {o}" for i, o in enumerate(options, start=1)]
    return "\n".join(lines)


BUTTONS = ["1", "2", "3", "4", "?", "📄"]
START = {"kind": "unseen", "sessionId": "u", "reading": READING, "passage": PASSAGE, "question": question(1)}


def reading_status(number=2):
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "unseen", "sessionId": "u", "reading": READING, "question": question(number)}))


def test_unseen_commands_with_or_without_slash():
    for text in ("/unseen", "unseen", "UNSEEN", "/unseen@trainer_bot"):
        assert parse_command(text) == ("unseen", {}), text
    for text in ("unseen 7", "/unseen 7", "Unseen 7", "/unseen_7"):
        assert parse_command(text) == ("unseen", {"number": 7}), text
    for text in ("unseen list", "/unseen list", "/unseen_list", "unseen_list", "/unseen_list@trainer_bot"):
        assert parse_command(text) == ("unseen_list", {}), text
    for text in ("unseen 0", "unseen 7 8", "unseen please", "unseen list 2"):
        assert parse_command(text) is None, text


@respx.mock
async def test_unseen_sends_the_text_first_then_the_first_question():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
    route = respx.post(f"{API}/bot/unseen/start").mock(return_value=ok(START))
    for text, body in (("/unseen", {"chatId": "7"}), ("unseen", {"chatId": "7"}), ("unseen 3", {"chatId": "7", "number": 3})):
        reply = await coach().handle("7", text)
        assert json.loads(route.calls.last.request.content) == body
        assert reply.before == [f"📖 A Day at the Zoo\nיום בגן החיות · קטע 1 מתוך 15 · רמה 1\n\n{PASSAGE}"]
        assert reply.text == f"{ur.START_INTRO}\n{question_text(1)}"
        assert reply.buttons == BUTTONS
        assert reply.messages == [*reply.before, reply.text]


@respx.mock
async def test_during_a_reading_numbers_and_question_marks_are_answers_and_bare_commands_still_work():
    reading_status(2)
    hint = {"words": [{"word": "zoo", "translation": "גן חיות"}, {"word": "fun", "translation": "כיף"}],
            "questionHe": "לאן הלכה המשפחה?"}
    answer = respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"kind": "unseen", "hintAsked": True, "hint": hint, "reading": READING, "question": question(2)}),
        ok({"kind": "unseen", "chooseNumber": True, "reading": READING, "question": question(2)}),
    ])
    c = coach()
    helped = await c.handle("7", "?")
    assert json.loads(answer.calls.last.request.content) == {"chatId": "7", "text": "?"}
    assert helped.text == "\n".join(["💡 מילים קשות בקטע:", "zoo – גן חיות", "fun – כיף",
                                     "השאלה בעברית: לאן הלכה המשפחה?", question_text(2)])
    assert helped.buttons == BUTTONS
    again = await c.handle("7", "7")
    assert again.text == f"ענו במספר בין 1 ל-4, או ? לעזרה:\n{question_text(2)}"
    # A multiple-choice question: a bare command word is still the command.
    assert (await c.handle("7", "help")).text == replies.HELP
    assert answer.call_count == 2


@respx.mock
async def test_the_text_again_button_sends_the_text_then_the_same_question():
    reading_status(3)
    answer = respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"kind": "unseen", "passageAgain": True, "passage": PASSAGE, "reading": READING, "question": question(3)}))
    again = await coach().handle("7", ur.TEXT_AGAIN)
    assert json.loads(answer.calls.last.request.content) == {"chatId": "7", "text": "📄"}
    assert again.before == [f"📖 A Day at the Zoo\nיום בגן החיות · קטע 1 מתוך 15 · רמה 1\n\n{PASSAGE}"]
    assert again.text == f"{ur.TEXT_AGAIN_INTRO}\n{question_text(3)}" and again.buttons == BUTTONS


def test_verdicts_right_and_wrong_with_the_explanation_then_the_next_question():
    right = ur.unseen_answer_reply({"kind": "unseen", "done": False, "reading": READING, "question": question(3),
                                    "verdict": {"correct": True, "wrongCount": 0, "wrongStreak": 0}})
    assert right.text == f"✅ נכון!\n\n{question_text(3)}"
    assert right.buttons == BUTTONS
    wrong = ur.unseen_answer_reply({
        "kind": "unseen", "done": False, "reading": READING, "question": question(4),
        "verdict": {"correct": False, "given": "To school", "correctOption": 2, "correctAnswer": "To the park",
                    "explanation": "בקטע כתוב שהם הלכו לפארק.", "wrongCount": 1, "wrongStreak": 1}})
    assert wrong.text == f"{LINES[0]}\nהתשובה: 2) To the park\n📖 בקטע כתוב שהם הלכו לפארק.\n\n{question_text(4)}"


def test_options_and_answers_without_letters_keep_their_order():
    # "30%" in a Hebrew message could show as "%30": it goes in a left-to-right isolate.
    options = ["30%", "50%", "Most of them", "None"]
    reply = ur.question_reply({"reading": READING, "question": question(2, "How many?", options)})
    assert f"1) {LRI}30%{PDI}" in reply.text.split("\n") and "3) Most of them" in reply.text.split("\n")
    verdict = ur.verdict_text({"correct": False, "correctOption": 2, "correctAnswer": "50%", "wrongCount": 1, "wrongStreak": 1})
    assert f"התשובה: 2) {LRI}50%{PDI}" in verdict


def test_the_last_answer_gives_the_count_the_score_kind_words_and_what_next():
    done = ur.unseen_answer_reply({
        "kind": "unseen", "done": True, "reading": READING,
        "verdict": {"correct": True},
        "result": {"correct": 4, "total": 5, "score": 80, "bestScore": 80, "attempts": 1,
                   "next": {"number": 2, "title": "My Favorite Sport"}}})
    assert done.text == "\n".join([
        "✅ נכון!", "",
        "🏁 סיימתם את \"A Day at the Zoo\": 4 מתוך 5 נכונות, ציון 80. כל הכבוד! 👏 כמעט הכול.",
        "הקטע הבא: My Favorite Sport. כתבו /unseen כדי להמשיך."])
    assert done.buttons == []
    last = ur.result_text({"reading": READING, "result": {"correct": 2, "total": 5, "score": 40, "bestScore": 100,
                                                          "attempts": 3, "next": None}})
    assert "התחלה טובה" in last and "הציון הכי גבוה שלכם בקטע הזה: 100." in last
    assert "קראתם את כל הקטעים" in last and "/unseen_list" in last
    assert "מושלם" in ur.praise(5, 5) and "יפה מאוד" in ur.praise(3, 5) and "התחלה טובה" in ur.praise(0, 5)


def test_a_twin_answer_shows_where_the_reading_is():
    twin = ur.unseen_answer_reply({"kind": "unseen", "alreadyAnswered": True, "reading": READING, "question": question(3)})
    assert twin.text == f"{ur.ALREADY_ANSWERED}\n{question_text(3)}"


@respx.mock
async def test_end_and_status_of_a_reading():
    respx.post(f"{API}/bot/session/end").mock(side_effect=[
        ok({"kind": "unseen", "done": True, "ended": True, "reading": READING, "answered": 2, "correct": 1, "total": 5}),
        ok({"kind": "unseen", "done": True, "ended": True, "pickClosed": True}),
    ])
    ended = await coach().handle("7", "/end")
    assert ended.text == ("עצרנו באמצע \"A Day at the Zoo\" (2/5 שאלות, 1 נכונות). "
                          "הקטע לא נשמר כגמור; כתבו /unseen כדי להתחיל מחדש.")
    assert (await coach().handle("7", "/end")).text == ur.PICK_CLOSED
    reading_status(4)
    status = replies.status_reply(await TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()).status("7"))
    assert status.text == f"הקריאה ממשיכה:\n{question_text(4)}"


LIST = {
    "kind": "unseen", "pick": True, "sessionId": "u", "count": 3, "allDone": False,
    "items": [
        {"n": 1, "title": "A Day at the Zoo", "titleHe": "יום בגן החיות", "level": 1, "status": "done", "bestScore": 80},
        {"n": 2, "title": "My Favorite Sport", "titleHe": "הספורט האהוב עלי", "level": 1, "status": "next", "bestScore": None},
        {"n": 3, "title": "The School Library", "titleHe": None, "level": 2, "status": "open", "bestScore": None},
    ],
}
LIST_LINES = ["📚 קטעי קריאה באנגלית (3)",
              "1. ✅ יום בגן החיות · רמה 1 · ציון 80",
              "2. ▶️ הספורט האהוב עלי · רמה 1",
              "3. The School Library · רמה 2",
              "שלחו את מספר הקטע (✅ קראתם, ▶️ הבא בתור), או /end כדי לסגור."]


@respx.mock
async def test_the_list_of_texts_and_picking_one():
    route = respx.post(f"{API}/bot/unseen/list").mock(return_value=ok(LIST))
    for text in ("/unseen_list", "/unseen list"):
        reply = await coach().handle("7", text)
        assert json.loads(route.calls.last.request.content) == {"chatId": "7"}
        assert reply.text == "\n".join(LIST_LINES)
        assert reply.buttons == []  # the number is typed
    invalid = ur.unseen_answer_reply({**LIST, "invalid": True})
    assert invalid.text == "\n".join([ur.PICK_INVALID, *LIST_LINES])
    # A number from the list: the text, then its first question.
    picked = ur.unseen_answer_reply(START)
    assert picked.before == [f"📖 A Day at the Zoo\nיום בגן החיות · קטע 1 מתוך 15 · רמה 1\n\n{PASSAGE}"]
    assert picked.text.startswith(ur.START_INTRO) and picked.buttons == BUTTONS
    # Every text read: /unseen opens the list to read one again.
    all_read = ur.unseen_start_reply({"ok": True, "data": {**LIST, "allDone": True}})
    assert all_read.before == [] and all_read.text == "\n".join([ur.ALL_DONE, *LIST_LINES])
    assert ur.unseen_status_reply({**LIST, "active": True}).text == "\n".join(LIST_LINES)


@respx.mock
async def test_errors():
    respx.post(f"{API}/bot/unseen/start").mock(side_effect=[
        httpx.Response(404, json={"code": "text_not_found"}),
        httpx.Response(403, json={"code": "not_linked"}),
        httpx.Response(429, json={"message": "הגעת למכסת ההודעות היומית. נמשיך מחר!"}),
    ])
    c = coach()
    assert (await c.handle("7", "/unseen 99")).text == ur.UNSEEN_ERRORS["text_not_found"]
    assert (await c.handle("7", "/unseen")).text == replies.NOT_LINKED
    assert (await c.handle("7", "/unseen")).text == "הגעת למכסת ההודעות היומית. נמשיך מחר!"


def test_help_the_pointers_and_the_menu_name_unseen():
    assert "📖 קטע קריאה באנגלית (unseen): /unseen" in replies.HELP and "/unseen_list" in replies.HELP
    assert "/unseen" in replies.NO_SESSION and "/unseen" in replies.LINKED
    assert len(replies.HELP.encode("utf-16-le")) // 2 <= TELEGRAM_MAX
    from app.telegram import COMMANDS
    assert {"unseen", "unseen_list"} <= {name for name, _ in COMMANDS}


class ToolCtx:
    """What a tool sees: the chat from the session state, and the event's actions."""
    def __init__(self):
        from google.adk.events.event_actions import EventActions
        self.state = {"chat_id": "7"}
        self.actions = EventActions()


class OneToolRunner:
    """Stands in for the ADK runner: the model calls one tool, and the tool's result comes back as an event."""
    def __init__(self, name, tool, ctx):
        self.name, self.tool, self.ctx = name, tool, ctx

    async def run_async(self, **_):
        from google.adk.events import Event
        from google.genai import types
        yield Event(author="practice_coach", content=types.Content(role="model", parts=[
            types.Part(function_call=types.FunctionCall(name=self.name, args={}))]))
        result = await self.tool(self.ctx)
        yield Event(author="practice_coach", actions=self.ctx.actions, content=types.Content(role="user", parts=[
            types.Part(function_response=types.FunctionResponse(name=self.name, response=result))]))


class TextRunner:
    """Stands in for the ADK runner: the model answers in text."""
    async def run_async(self, **_):
        from google.adk.events import Event
        from google.genai import types
        yield Event(author="practice_coach", content=types.Content(role="model", parts=[types.Part(text="שלום! במה אפשר לעזור?")]))


@respx.mock
async def test_a_free_form_request_through_the_agent_gets_the_whole_text_and_question():
    from app import tools
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
    respx.post(f"{API}/bot/unseen/start").mock(return_value=ok(START))
    respx.post(f"{API}/bot/unseen/list").mock(return_value=ok(LIST))
    c = coach()
    ctx = ToolCtx()
    c.runner = OneToolRunner("start_unseen", tools.start_unseen, ctx)
    reply = await c.handle("7", "אני רוצה לקרוא קטע באנגלית")
    # The tool's reply as it is: longer than the model may write, so the model is not asked to repeat it.
    assert ctx.actions.skip_summarization is True
    assert reply.before == [f"📖 A Day at the Zoo\nיום בגן החיות · קטע 1 מתוך 15 · רמה 1\n\n{PASSAGE}"]
    assert reply.text == f"{ur.START_INTRO}\n{question_text(1)}" and reply.buttons == BUTTONS
    c.runner = OneToolRunner("list_unseen_texts", tools.list_unseen_texts, ToolCtx())
    listed = await c.handle("7", "איזה קטעים יש?")
    assert listed.text == "\n".join(LIST_LINES) and listed.before == []
    # Any other agent reply is still the model's own text.
    c.runner = TextRunner()
    assert (await c.handle("7", "היי")).text == "שלום! במה אפשר לעזור?"
    assert tools.start_unseen in tools.TOOLS and tools.list_unseen_texts in tools.TOOLS


def test_every_real_text_fits_one_telegram_message():
    texts = json.loads(TEXTS.read_text(encoding="utf-8"))
    assert len(texts) >= 15
    for n, p in enumerate(texts, start=1):
        reading = {"number": n, "count": len(texts), "title": p["title_en"], "titleHe": p["title_he"],
                   "level": p["complexity_level"]}
        message = ur.passage_text({"reading": reading, "passage": p["content"]})
        assert len(message.encode("utf-16-le")) // 2 <= TELEGRAM_MAX, p["title_en"]
        assert message.endswith(p["content"])
