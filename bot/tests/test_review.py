"""/review in Telegram (any linked student), with a fake review agent (no model)."""
import json

import httpx
import respx

from app import replies, review_replies as rr
from app.api_client import TrainerApi
from app.coach import Coach, parse_command

API = "http://api.test/api"


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("review never goes through the chat agent")
        yield  # pragma: no cover


class FakeReviewer:
    def __init__(self, proposals=None, fail=False):
        self.proposals = list(proposals or [])
        self.fail = fail
        self.calls = []

    async def propose(self, item):
        self.calls.append(("propose", item.get("key", item.get("exerciseId")), None))
        if self.fail:
            raise TimeoutError()
        return self.proposals.pop(0)

    async def revise(self, item, proposal, instruction):
        self.calls.append(("revise", item.get("key", item.get("exerciseId")), instruction))
        return self.proposals.pop(0)


def coach(reviewer, reserve=None):
    # Each agent call first takes one unit of the daily review cap.
    respx.post(f"{API}/bot/review/reserve").mock(return_value=reserve or ok({"reserved": True}))
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None, reviewer=reviewer)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def item(eid, text="She _______ to school."):
    return {"exerciseId": eid, "lesson": {"title": "Present Simple", "subject": "english"},
            "question": {"text": text, "options": ["go", "goes", "going"], "answer": "goes", "explanation": None},
            "reports": [{"reason": "two_answers", "note": None, "source": "web"}]}


def queue(eid, remaining=2, **extra):
    return {"kind": "review", "mode": "manual", "item": item(eid), "proposal": None, "remaining": remaining,
            "done": False, "counts": {}, **extra}


KEEP = {"decision": "keep", "reason": "רק goes נכון."}
CHANGE = {"decision": "change", "reason": "חסר נושא ביחיד.", "change": {
    "question_text_he": "She _______ to school every day.", "options": ["go", "goes", "going"],
    "correct_answer": "goes", "explanation_he": "תשובה נכונה: goes."}}


def test_parse_review():
    assert parse_command("/review") == ("review", {"mode": "manual"})
    assert parse_command("/review auto") == ("review", {"mode": "auto"})
    # The menu entries.
    assert parse_command("/review_manual") == ("review", {"mode": "manual"})
    assert parse_command("/review_auto") == ("review", {"mode": "auto"})
    assert parse_command("/review_later") is None
    assert parse_command("review later") is None


@respx.mock
async def test_manual_review_proposes_approves_and_revises_on_a_typed_correction():
    status = respx.get(f"{API}/bot/session/status")
    respx.post(f"{API}/bot/review/start").mock(return_value=ok(queue("e1")))
    propose = respx.post(f"{API}/bot/review/proposal").mock(side_effect=lambda req: ok(
        {**queue(json.loads(req.content)["proposal"].get("_eid", "e1")), "proposal": json.loads(req.content)["proposal"]}))
    act = respx.post(f"{API}/bot/review/act").mock(return_value=ok(
        {**queue("e2", remaining=1), "decided": {"exerciseId": "e1", "decision": "change", "closed": 1}}))
    reviewer = FakeReviewer([CHANGE, KEEP, CHANGE])
    c = coach(reviewer)

    first = await c.handle("1", "/review")
    assert "🧐 שאלה בבדיקה (נותרו 2)" in first.text and "She _______ to school." in first.text
    assert "🤖 הצעה: לתקן. חסר נושא ביחיד." in first.text and "2) goes ✓" in first.text
    assert first.buttons == [rr.APPROVE, rr.KEEP, rr.REMOVE, rr.SKIP]
    assert json.loads(propose.calls[0].request.content)["proposal"] == CHANGE

    status.mock(return_value=ok({"active": True, **queue("e1"), "proposal": CHANGE}))
    approved = await c.handle("1", rr.APPROVE)
    assert json.loads(act.calls[0].request.content)["action"] == "approve"
    assert approved.text.startswith("✔️ נשמר.") and "🤖 הצעה: להשאיר כמו שהיא." in approved.text

    # A typed message is the admin's correction: the agent revises, nothing is decided.
    status.mock(return_value=ok({"active": True, **queue("e2", remaining=1), "proposal": KEEP}))
    revised = await c.handle("1", "the answer should be 'goes', add every day")
    assert reviewer.calls[-1] == ("revise", "e2", "the answer should be 'goes', add every day")
    assert "🤖 הצעה: לתקן." in revised.text
    assert act.call_count == 1


@respx.mock
async def test_agent_failure_leaves_the_manual_buttons():
    respx.post(f"{API}/bot/review/start").mock(return_value=ok(queue("e1")))
    reply = await coach(FakeReviewer(fail=True)).handle("1", "/review manual")
    assert "סוכן הבדיקה לא זמין כרגע" in reply.text and reply.buttons == [rr.KEEP, rr.REMOVE, rr.SKIP]


@respx.mock
async def test_at_the_daily_review_cap_the_agent_is_not_called():
    respx.post(f"{API}/bot/review/start").mock(return_value=ok(queue("e1")))
    capped = httpx.Response(409, json={"success": False, "code": "review_cap"})
    reviewer = FakeReviewer([KEEP])
    reply = await coach(reviewer, reserve=capped).handle("1", "/review_manual")
    assert reviewer.calls == []
    assert rr.REVIEW_CAP in reply.text and reply.buttons == [rr.KEEP, rr.REMOVE, rr.SKIP]
    # Auto stops at the cap and leaves the rest under review.
    respx.post(f"{API}/bot/review/start").mock(return_value=ok({**queue("e1"), "mode": "auto"}))
    act = respx.post(f"{API}/bot/review/act")
    auto = await coach(reviewer, reserve=capped).handle("1", "/review_auto")
    assert rr.REVIEW_CAP in auto.text and not act.called and reviewer.calls == []


@respx.mock
async def test_auto_applies_valid_proposals_and_skips_rejected_ones():
    respx.post(f"{API}/bot/review/start").mock(return_value=ok({**queue("e1"), "mode": "auto"}))
    respx.post(f"{API}/bot/review/proposal").mock(return_value=ok(queue("e1")))
    act = respx.post(f"{API}/bot/review/act").mock(side_effect=[
        ok({**queue("e2", remaining=1), "decided": {"exerciseId": "e1", "decision": "change", "closed": 1}}),
        ok({**queue("e2", remaining=1), "rejected": "there must be 3 or 4 options"}),
        ok({"kind": "review", "item": None, "done": True, "remaining": 0, "counts": {"change": 1, "skip": 1}}),
    ])
    reply = await coach(FakeReviewer([CHANGE, KEEP])).handle("1", "/review auto")
    assert [json.loads(call.request.content)["action"] for call in act.calls] == ["approve", "approve", "skip"]
    assert "✏️ She _______ to school.: לתקן." in reply.text
    assert "ההצעה לא תקינה (there must be 3 or 4 options)" in reply.text
    assert "סיימנו: 1 תוקנו, 1 דולגו." in reply.text and reply.buttons == []


WORD_ITEM = {"kind": "word", "key": "word:w1", "wordId": "w1",
             "word": {"english": "glad", "hebrew": "עצוב", "sentence": "I am glad to see you.", "difficulty": 2},
             "reports": [{"reason": "wrong_translation", "note": None, "source": "bot", "direction": "en-he", "given": "שמח"}]}
WORD_CHANGE = {"decision": "change", "reason": "glad פירושו שמח.",
               "change": {"hebrew_translation": "שמח / מרוצה", "sentence_en": "I am glad to see you."}}


@respx.mock
async def test_manual_review_of_a_word_shows_the_word_its_reports_and_the_new_translation():
    data = {"kind": "review", "mode": "manual", "item": WORD_ITEM, "proposal": None, "remaining": 1, "done": False, "counts": {}}
    respx.post(f"{API}/bot/review/start").mock(return_value=ok(data))
    respx.post(f"{API}/bot/review/proposal").mock(return_value=ok({**data, "proposal": WORD_CHANGE}))
    reviewer = FakeReviewer([WORD_CHANGE])
    reply = await coach(reviewer).handle("1", "/review")
    assert reviewer.calls == [("propose", "word:w1", None)]
    assert "🔤 מילה בבדיקה (נותרו 1)" in reply.text and "glad = עצוב" in reply.text
    assert "• התרגום שגוי (ענה: שמח, מאנגלית לעברית)" in reply.text
    assert "המילה המתוקנת:\nשמח / מרוצה" in reply.text
    assert reply.buttons == [rr.APPROVE, rr.KEEP, rr.REMOVE, rr.SKIP]


def test_word_prompt_fences_the_student_answer_as_data():
    from app.review_agent import _prompt, WordProposal
    text = _prompt(WORD_ITEM, instruction="add שמח")
    assert text.startswith("<word>") and '"student_answer": "שמח"' in text
    assert "<question>" not in text and text.endswith("Reviewer's correction: add שמח")
    assert WordProposal.model_validate(WORD_CHANGE).change.hebrew_translation == "שמח / מרוצה"
    assert rr.item_title(WORD_ITEM) == "glad = עצוב"



@respx.mock
async def test_auto_stops_with_a_summary_when_a_call_fails():
    respx.post(f"{API}/bot/review/start").mock(return_value=ok({**queue("e1"), "mode": "auto"}))
    respx.post(f"{API}/bot/review/proposal").mock(return_value=ok(queue("e1")))
    respx.post(f"{API}/bot/review/act").mock(side_effect=[
        ok({**queue("e2", remaining=1), "decided": {"key": "e1", "decision": "change", "closed": 1}}),
        httpx.Response(429, json={"success": False, "code": "rate_limited", "message": "הגעת למכסת ההודעות היומית."}),
    ])
    reply = await coach(FakeReviewer([CHANGE, KEEP])).handle("1", "/review_auto")
    assert "✏️ She _______ to school.: לתקן." in reply.text
    assert "הגעת למכסת ההודעות היומית." in reply.text
    assert "נותרו 1 לבדיקה." in reply.text and reply.buttons == [rr.CONTINUE]


@respx.mock
async def test_auto_starts_no_agent_call_that_cannot_end_inside_the_round(monkeypatch):
    from app import config
    monkeypatch.setattr(config, "REVIEW_TIMEOUT_SECONDS", 30)
    monkeypatch.setattr(config, "REVIEW_AUTO_BUDGET_SECONDS", 25)
    respx.post(f"{API}/bot/review/start").mock(return_value=ok({**queue("e1"), "mode": "auto"}))
    reviewer = FakeReviewer([KEEP])
    reply = await coach(reviewer).handle("1", "/review_auto")
    assert reviewer.calls == [] and reply.buttons == [rr.CONTINUE]


@respx.mock
async def test_a_decision_someone_else_made_first_moves_on_without_changing_it():
    status = respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, **queue("e1"), "proposal": KEEP}))
    respx.post(f"{API}/bot/review/act").mock(return_value=ok({**queue("e2", remaining=1), "alreadyDecided": "e1"}))
    respx.post(f"{API}/bot/review/proposal").mock(return_value=ok(queue("e2", remaining=1)))
    reply = await coach(FakeReviewer([KEEP])).handle("1", rr.KEEP)
    assert reply.text.startswith(rr.ALREADY_DECIDED)
    assert status.called
