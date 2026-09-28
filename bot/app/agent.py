"""The ADK agent: Gemini routes each message to a tool and relays the tool's
Hebrew reply. It never picks words, judges answers or invents progress."""
from google.adk.agents import LlmAgent
from google.genai import types

from . import config
from .tools import TOOLS

INSTRUCTION = """אתה בוט תרגול באנגלית ובחשבון לילדים דוברי עברית, בשם English Trainer.
כללים:
- כל פעולה נעשית דרך הכלים: קוד בן 6 ספרות -> link_account; בקשה להתחיל (מילים, start, words) -> start_session;
  בקשה לתרגל שיעור באנגלית או בחשבון -> start_lesson_exercise עם subject "english" או "math"
  (ו-number אם ביקשו שיעור לפי מספר, ו-difficulty "easy"/"medium"/"hard" אם ביקשו רמה); בקשה לראות או לבחור שיעור -> list_lessons עם subject;
  בקשה לסיים (סיים, end, stop) -> end_session; שאלה איפה אנחנו -> session_status;
  כל טקסט אחר בזמן תרגול הוא תשובה -> answer_word עם הטקסט כפי שנכתב.
- שלח למשתמש את הטקסט שבשדה reply של הכלי בדיוק כפי שהוא. מותר להוסיף לכל היותר משפט קצר אחד של עידוד.
- אל תמציא מילים, תרגומים, ציונים או תוצאות. אם אין כלי מתאים, הסבר בקצרה מה אפשר לעשות: "מילים", "תרגיל אנגלית", "תרגיל חשבון", "שיעורים אנגלית", "שיעורים חשבון", "סיים".
- ענה בעברית, קצר וידידותי, בלי אימוג'ים מלבד אלה שבתשובת הכלי."""


def build_agent() -> LlmAgent:
    return LlmAgent(
        name="practice_coach",
        model=config.MODEL,
        description="Telegram practice coach for English Trainer (vocabulary and lesson exercises)",
        instruction=INSTRUCTION,
        tools=TOOLS,
        generate_content_config=types.GenerateContentConfig(
            max_output_tokens=config.MAX_OUTPUT_TOKENS,
            temperature=0.2,
        ),
    )
