"""The coach: caps and the fast path never call the agent."""
import json
from datetime import date

import httpx
import respx

from app import replies
from app.api_client import TrainerApi
from app.coach import Coach
from app.limits import DailyTurnCounter

API = "http://api.test/api"
WORD = {"id": "w", "english": "cat", "prompt": "cat", "options": ["חתול", "כלב", "סוס", "פרה"]}
WORD_LINES = "(1/20) cat\n1) חתול\n2) כלב\n3) סוס\n4) פרה"


class NoAgentRunner:
    """Stands in for the ADK runner: any call is a test failure."""
    async def run_async(self, **_):
        raise AssertionError("the agent must not be called on the fast path")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def progress(i):
    return {"round": 1, "index": i, "total": 20, "failedInRound": 0}


def test_daily_turn_counter_resets_per_day():
    counter = DailyTurnCounter(2)
    assert counter.allow("a", date(2026, 1, 1)) and counter.allow("a", date(2026, 1, 1))
    assert not counter.allow("a", date(2026, 1, 1))
    assert counter.allow("b", date(2026, 1, 1))
    assert counter.allow("a", date(2026, 1, 2))


@respx.mock
async def test_code_start_level_answer_and_end_take_the_fast_path():
    respx.post(f"{API}/bot/link").mock(return_value=ok({"linked": True}))
    respx.post(f"{API}/bot/session/start").mock(return_value=ok({
        "sessionId": "s", "setup": "level", "options": [{"key": 1, "label": "קל"}, {"key": 2, "label": "בינוני"}, {"key": 3, "label": "קשה"}]}))
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"sessionId": "s", "started": True, "level": "קל", "word": WORD, "progress": progress(1)}),
        ok({"correct": True, "chosen": "חתול", "expected": None, "points": 1, "roundStarted": False, "done": False,
            "word": {"id": "w2", "english": "dog"}, "progress": progress(2)}),
    ])
    respx.post(f"{API}/bot/session/end").mock(return_value=ok({
        "done": True, "summary": {"words": 20, "rounds": 1, "correct": 1, "wrong": 0, "remainingFailed": 19}}))
    c = coach()
    assert (await c.handle("7", "123456")).text == replies.LINKED
    setup = await c.handle("7", "/words")
    assert setup.text == "מתחילים תרגול של 20 מילים.\nאיזו רמה?\n1. קל\n2. בינוני\n3. קשה" and setup.buttons == ["1", "2", "3"]
    started = await c.handle("7", "1")
    # The word with its four options, numbered, and the options as buttons, two a row.
    assert started.text == "רמה קל. בחרו את התרגום לעברית (\"?\" למשפט לדוגמה):\n" + WORD_LINES
    assert started.buttons == WORD["options"] and started.columns == 2
    assert (await c.handle("7", "חתול")).text.startswith("✅ נכון! +1")
    assert "נשארו 19 מילים" in (await c.handle("7", "end")).text


@respx.mock
async def test_a_text_that_is_not_an_option_asks_again_and_a_double_tap_says_so():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "vocab", "word": WORD, "progress": progress(1)}))
    route = respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"invalid": True, "word": WORD, "progress": progress(1)}),
        ok({"alreadyAnswered": True, "word": {"id": "w2", "english": "dog", "prompt": "dog", "options": ["כלב", "חתול", "דג", "דוב"]},
            "progress": progress(2)}),
    ])
    c = coach()
    again = await c.handle("7", "חתלתול")
    assert again.text == replies.NOT_AN_OPTION + "\n" + WORD_LINES
    assert again.buttons == WORD["options"] and again.columns == 2
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "text": "חתלתול"}
    twin = await c.handle("7", "חתול")
    assert twin.text == replies.WORD_ALREADY_ANSWERED + "\n(2/20) dog\n1) כלב\n2) חתול\n3) דג\n4) דוב"


@respx.mock
async def test_unlinked_chat_is_told_without_the_model():
    respx.get(f"{API}/bot/session/status").mock(return_value=httpx.Response(403, json={"code": "not_linked"}))
    assert (await coach().handle("9", "שלום")).text == replies.NOT_LINKED


async def test_turn_cap_short_circuits():
    c = coach()
    c.turns = DailyTurnCounter(1)
    assert (await c.handle("5", "")).text == replies.HELP  # empty text never counts
    with respx.mock:
        respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
        respx.post(f"{API}/bot/session/start").mock(return_value=ok({
            "sessionId": "s", "setup": "level", "options": [{"key": 1, "label": "קל"}]}))
        assert (await c.handle("5", "words")).text.startswith("מתחילים")
    assert (await c.handle("5", "words")).text == replies.RATE_LIMITED


@respx.mock
async def test_question_mark_shows_the_example_sentence_and_repeats_the_word():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"example": True, "sentence": "The cat is sleeping.", "word": WORD, "progress": progress(1)}),
        ok({"example": True, "sentence": None, "word": WORD, "progress": progress(1)}),
    ])
    c = coach()
    example = await c.handle("7", "?")
    assert example.text == "💡 The cat is sleeping.\n" + WORD_LINES and example.buttons == WORD["options"]
    assert (await c.handle("7", "?")).text == replies.NO_EXAMPLE + "\n" + WORD_LINES


def test_the_help_names_the_five_word_levels_and_fits_one_message():
    words = replies.HELP.split("📚 אוצר מילים")[1].split("✏️")[0]
    for name in ("מתחיל", "קל", "בינוני", "מתקדם", "קשה"):
        assert name in words
    assert "בלי להקליד" in words
    assert len(replies.HELP) <= 4096  # Telegram's limit for one message


DIRECTIONS = [{"key": 1, "label": "מאנגלית לעברית"}, {"key": 2, "label": "מעברית לאנגלית"}]


@respx.mock
async def test_direction_buttons_start_a_hebrew_to_english_exam():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    route = respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"sessionId": "s", "level": "קל", "setup": "direction", "options": DIRECTIONS}),
        ok({"sessionId": "s", "started": True, "level": "קל", "direction": "he-en", "directionLabel": "מעברית לאנגלית",
            "word": {"id": "w", "direction": "he-en", "prompt": "חתול", "options": ["cat", "cap", "dog", "etc."]},
            "progress": progress(1)}),
        ok({"correct": False, "chosen": "cap", "expected": "cat", "points": 0, "roundStarted": False, "done": False,
            "word": {"id": "w2", "direction": "he-en", "prompt": "כלב", "options": ["dig", "dog", "cow", "bird"]},
            "progress": progress(2)}),
    ])
    c = coach()
    question = await c.handle("7", "1")
    assert question.text == "רמה קל.\nבאיזה כיוון?\n1. מאנגלית לעברית\n2. מעברית לאנגלית"
    assert question.buttons == ["מאנגלית לעברית", "מעברית לאנגלית"]
    started = await c.handle("7", "מעברית לאנגלית")
    # English options read left to right inside the Hebrew message (a final "." stays at its end).
    iso = lambda s: f"⁦{s}⁩"  # noqa: E731
    assert started.text == ("רמה קל, מעברית לאנגלית. בחרו את התרגום לאנגלית (\"?\" למשפט לדוגמה):\n(1/20) חתול\n"
                            f"1) {iso('cat')}\n2) {iso('cap')}\n3) {iso('dog')}\n4) {iso('etc.')}")
    assert started.buttons == ["cat", "cap", "dog", "etc."]
    assert json.loads(route.calls[1].request.content)["text"] == "מעברית לאנגלית"
    from app.encouragement import LINES
    wrong = await c.handle("7", "cap")
    assert wrong.text == (f"{LINES[0]}\nהתרגום: {iso('cat')}\n(2/20) כלב\n"
                          f"1) {iso('dig')}\n2) {iso('dog')}\n3) {iso('cow')}\n4) {iso('bird')}")


@respx.mock
async def test_summary_button_repeats_the_same_words_the_other_way_round():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
    respx.post(f"{API}/bot/session/end").mock(return_value=ok({"done": True, "summary": {
        "words": 20, "rounds": 1, "correct": 20, "wrong": 0, "remainingFailed": 0,
        "switchTo": {"direction": "he-en", "label": "מעברית לאנגלית"}}}))
    switch = respx.post(f"{API}/bot/session/switch").mock(side_effect=[
        ok({"sessionId": "s2", "started": True, "switched": True, "level": "קל", "direction": "he-en",
            "directionLabel": "מעברית לאנגלית", "word": {"id": "w", "direction": "he-en", "prompt": "חתול"},
            "progress": progress(1)}),
        httpx.Response(404, json={"success": False, "code": "no_session"}),
    ])
    c = coach()
    ended = await c.handle("7", "end")
    assert ended.buttons == ["🔄 אותן מילים מעברית לאנגלית"]
    again = await c.handle("7", ended.buttons[0])
    assert again.text == "אותן מילים, מעברית לאנגלית. בחרו את התרגום לאנגלית (\"?\" למשפט לדוגמה):\n(1/20) חתול"
    assert (await c.handle("7", "/switch")).text == replies.NO_WORDS_TO_SWITCH
    assert switch.call_count == 2


@respx.mock
async def test_in_a_words_exam_a_bare_command_word_is_the_answer():
    # "review", "report", "help" and "math" are words of the list: as buttons (or typed bare), they are answers.
    word = {"id": "w", "direction": "he-en", "prompt": "סקירה", "options": ["review", "report", "help", "math"]}
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "vocab", "word": word, "progress": progress(3)}))
    answer = respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"correct": True, "points": 1, "done": False, "word": {"id": "w2", "direction": "he-en", "prompt": "לדווח"},
         "progress": progress(4)}))
    review = respx.post(f"{API}/bot/review/start")
    c = coach()
    for word in ("review", "report", "help", "math"):
        reply = await c.handle("7", word)
        assert reply.text.startswith("✅ נכון!")
        assert json.loads(answer.calls.last.request.content)["text"] == word
    assert not review.called


@respx.mock
async def test_stop_is_an_answer_when_it_is_an_option_and_ends_the_exam_otherwise():
    # "stop" is a word of the list (לעצור): its button answers; "end", not an option, ends; "/stop" always ends.
    word = {"id": "w", "direction": "he-en", "prompt": "לעצור", "options": ["store", "stop", "step", "start"]}
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "vocab", "word": word, "progress": progress(3)}))
    answer = respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"correct": True, "points": 1, "done": False, "word": word, "progress": progress(4)}))
    end = respx.post(f"{API}/bot/session/end").mock(return_value=ok(
        {"done": True, "summary": {"words": 20, "rounds": 1, "correct": 4, "wrong": 0, "remainingFailed": 16}}))
    c = coach()
    assert (await c.handle("7", "stop")).text.startswith("✅ נכון!")
    assert json.loads(answer.calls.last.request.content)["text"] == "stop" and not end.called
    assert (await c.handle("7", "end")).text.startswith("סיימנו להיום.")
    assert (await c.handle("7", "/stop")).text.startswith("סיימנו להיום.")
    assert end.call_count == 2 and answer.call_count == 1
