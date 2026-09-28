"""Caps enforced before any model call."""
from datetime import date


class DailyTurnCounter:
    """Turns per chat per day, in memory (the API's daily cap is the durable one)."""

    def __init__(self, cap: int):
        self.cap = cap
        self._day = date.today()
        self._counts: dict[str, int] = {}

    def allow(self, chat_id: str, today: date | None = None) -> bool:
        today = today or date.today()
        if today != self._day:
            self._day, self._counts = today, {}
        count = self._counts.get(chat_id, 0) + 1
        self._counts[chat_id] = count
        return count <= self.cap
