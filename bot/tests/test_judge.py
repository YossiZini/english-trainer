"""The Gemini judge: strict JSON, safe fallbacks, daily cap."""
from app.judge import AnswerJudge


class Response:
    def __init__(self, text):
        self.text = text


class FakeModels:
    def __init__(self, outcome):
        self.outcome = outcome
        self.calls = []

    async def generate_content(self, **kwargs):
        self.calls.append(kwargs)
        if isinstance(self.outcome, Exception):
            raise self.outcome
        return Response(self.outcome)


class FakeClient:
    def __init__(self, outcome):
        self.aio = type("Aio", (), {})()
        self.aio.models = FakeModels(outcome)


async def test_accepts_only_an_explicit_true():
    assert await AnswerJudge(FakeClient('{"acceptable": true}')).accepts("1", "cat", "חתול", "חתלתול") is True
    assert await AnswerJudge(FakeClient('{"acceptable": false}')).accepts("1", "cat", "חתול", "כלב") is False
    assert await AnswerJudge(FakeClient('{"acceptable": "yes"}')).accepts("1", "cat", "חתול", "כלב") is False
    assert await AnswerJudge(FakeClient("not json")).accepts("1", "cat", "חתול", "כלב") is False
    assert await AnswerJudge(FakeClient(RuntimeError("quota"))).accepts("1", "cat", "חתול", "כלב") is False


async def test_the_prompt_fences_the_answer_and_the_output_is_bounded():
    client = FakeClient('{"acceptable": true}')
    await AnswerJudge(client).accepts("1", "table", "שולחן", "שולחן כתיבה")
    call = client.aio.models.calls[0]
    assert "<answer>שולחן כתיבה</answer>" in call["contents"]
    assert "English word or phrase: table" in call["contents"]
    assert call["config"].temperature == 0
    assert call["config"].max_output_tokens <= 50
    assert call["config"].response_mime_type == "application/json"


async def test_daily_cap_stops_calling_the_model():
    client = FakeClient('{"acceptable": true}')
    judge = AnswerJudge(client, cap=2)
    assert await judge.accepts("c", "a", "ב", "ג") and await judge.accepts("c", "a", "ב", "ג")
    assert await judge.accepts("c", "a", "ב", "ג") is False
    assert len(client.aio.models.calls) == 2
