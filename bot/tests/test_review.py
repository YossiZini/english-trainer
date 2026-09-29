"""The admin's /review in Telegram, with a fake review agent (no model)."""
import json

import httpx
import respx

from app import review_replies as rr
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
        self.calls.append(("propose", item["exerciseId"], None))
        if self.fail:
            raise TimeoutError()
        return self.proposals.pop(0)

    async def revise(self, item, proposal, instruction):
        self.calls.append(("revise", item["exerciseId"], instruction))
        return self.proposals.pop(0)


def coach(reviewer):
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
async def test_agent_failure_leaves_the_manual_buttons_and_non_admins_are_refused():
    respx.post(f"{API}/bot/review/start").mock(side_effect=[
        ok(queue("e1")), httpx.Response(403, json={"success": False, "code": "not_admin"})])
    reply = await coach(FakeReviewer(fail=True)).handle("1", "/review manual")
    assert "סוכן הבדיקה לא זמין כרגע" in reply.text and reply.buttons == [rr.KEEP, rr.REMOVE, rr.SKIP]
    assert (await coach(FakeReviewer()).handle("2", "/review")).text == rr.ADMIN_ONLY


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
