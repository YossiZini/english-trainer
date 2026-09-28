"""Settings of the Telegram bot service, all from the environment.

Secrets (TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, BOT_API_KEY) are
injected from Secret Manager on Cloud Run; nothing here has a real default.
Every cap has a default and can be changed without a code change.
"""
import os


def _int(name: str, default: int) -> int:
    try:
        value = int(os.environ.get(name, ""))
    except ValueError:
        return default
    return value if value > 0 else default


API_URL = os.environ.get("API_URL", "http://localhost:5000/api").rstrip("/")
BOT_API_KEY = os.environ.get("BOT_API_KEY", "")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_WEBHOOK_SECRET = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
TELEGRAM_API = os.environ.get("TELEGRAM_API", "https://api.telegram.org")

MODEL = os.environ.get("MODEL", "gemini-2.5-flash")
APP_NAME = "english-trainer-bot"

# Budget caps (see docs/telegram-bot.md).
MAX_OUTPUT_TOKENS = _int("MAX_OUTPUT_TOKENS", 200)
MAX_LLM_CALLS_PER_TURN = _int("MAX_LLM_CALLS_PER_TURN", 4)
MAX_TURNS_PER_CHAT_PER_DAY = _int("MAX_TURNS_PER_CHAT_PER_DAY", 400)
HISTORY_EVENTS = _int("HISTORY_EVENTS", 12)
API_TIMEOUT_SECONDS = _int("API_TIMEOUT_SECONDS", 10)
# Answers inside an active session go straight to the API, without a model
# call: the verdict comes from the API anyway, and it keeps the bill flat.
FAST_PATH_ANSWERS = os.environ.get("FAST_PATH_ANSWERS", "true").lower() != "false"

# A Hebrew answer that misses the dictionary gets one short Gemini check.
JUDGE_ANSWERS = os.environ.get("JUDGE_ANSWERS", "true").lower() != "false"
JUDGE_MODEL = os.environ.get("JUDGE_MODEL", MODEL)
MAX_JUDGES_PER_CHAT_PER_DAY = _int("MAX_JUDGES_PER_CHAT_PER_DAY", 100)
JUDGE_MAX_OUTPUT_TOKENS = _int("JUDGE_MAX_OUTPUT_TOKENS", 30)

END_WORDS = {"end", "stop", "quit", "סיים", "סיום", "סיימתי", "די", "עצור"}
START_WORDS = {"words", "word", "start", "מילים", "מילה", "התחל", "תרגול"}
