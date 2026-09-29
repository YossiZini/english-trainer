"""Hebrew replies for the admin's review of reported questions (/review).

The question, its reports and the review agent's proposal are shown as data
from the API and the agent; the admin answers with the buttons below, or
types a correction for the agent."""
from .replies import Reply

APPROVE = "✅ לאשר את ההצעה"
KEEP = "↩️ להשאיר כמו שהיה"
REMOVE = "🗑 להסיר את השאלה"
SKIP = "⏭ לדלג"
CONTINUE = "▶️ להמשיך"
ACTIONS = {APPROVE: "approve", KEEP: "keep", REMOVE: "remove", SKIP: "skip"}

ADMIN_ONLY = "הפקודה /review מיועדת למנהל בלבד."
NOTHING = "אין שאלות שמחכות לבדיקה. 🎉"
AGENT_DOWN = ("סוכן הבדיקה לא זמין כרגע ({model}). אפשר להחליט בעצמכם בכפתורים, "
              "או לנסות שוב מאוחר יותר.")
DECISION_NAME = {"keep": "להשאיר כמו שהיא", "change": "לתקן", "remove": "להסיר"}
REASON_NAME = {"wrong_answer": "התשובה הנכונה שגויה", "two_answers": "יותר מתשובה נכונה אחת",
               "unclear": "השאלה לא ברורה", "other": "משהו אחר"}


def _options(options: list[str], answer: str) -> list[str]:
    return [f"{i}) {o}" + (" ✓" if o == answer else "") for i, o in enumerate(options, 1)]


def item_text(data: dict) -> str:
    item = data["item"]
    q = item["question"]
    lesson = item.get("lesson") or {}
    lines = [f"🧐 שאלה בבדיקה (נותרו {data['remaining']})"]
    if lesson.get("title"):
        lines.append(f"📘 {lesson['title']}")
    lines += [q["text"], *_options(q["options"], q["answer"])]
    if q.get("explanation"):
        lines.append(f"💡 {q['explanation']}")
    lines.append("דיווחים:")
    for r in item.get("reports", []):
        lines.append(f"• {REASON_NAME.get(r['reason'], r['reason'])}" + (f": {r['note']}" if r.get("note") else ""))
    return "\n".join(lines)


def proposal_text(proposal: dict) -> str:
    lines = [f"🤖 הצעה: {DECISION_NAME.get(proposal['decision'], proposal['decision'])}. {proposal.get('reason', '')}"]
    change = proposal.get("change")
    if proposal["decision"] == "change" and change:
        lines += ["השאלה המתוקנת:", change["question_text_he"], *_options(change["options"], change["correct_answer"])]
        if change.get("explanation_he"):
            lines.append(f"💡 {change['explanation_he']}")
    return "\n".join(lines)


def review_reply(data: dict, proposal: dict | None, intro: str = "", agent_error: str = "") -> Reply:
    """One question under review with the proposal (or the agent's failure) and the decision buttons."""
    if data.get("done") or not data.get("item"):
        return summary_reply(data, intro)
    parts = [intro] if intro else []
    parts.append(item_text(data))
    buttons = [KEEP, REMOVE, SKIP]
    if proposal:
        parts.append(proposal_text(proposal))
        parts.append("כדי לשנות את ההצעה, כתבו מה לתקן.")
        buttons = [APPROVE, *buttons]
    elif agent_error:
        parts.append(agent_error)
    return Reply("\n\n".join(parts), buttons)


def counts_text(counts: dict | None) -> str:
    counts = counts or {}
    names = [("change", "תוקנו"), ("keep", "נשארו"), ("remove", "הוסרו"), ("skip", "דולגו")]
    done = [f"{counts[k]} {label}" for k, label in names if counts.get(k)]
    return ", ".join(done) if done else "לא הוחלט על אף שאלה"


def summary_reply(data: dict, intro: str = "") -> Reply:
    parts = [intro] if intro else []
    parts.append(NOTHING if not data.get("counts") else f"סיימנו את הבדיקה: {counts_text(data.get('counts'))}.")
    return Reply("\n\n".join(parts))


def auto_reply(results: list[str], data: dict) -> Reply:
    """What /review auto did in this round, and a button to go on when questions remain."""
    lines = ["🤖 בדיקה אוטומטית:"] + (results or ["לא נבדקו שאלות בסבב הזה."])
    if data.get("done") or not data.get("item"):
        lines.append(f"\nסיימנו: {counts_text(data.get('counts'))}.")
        return Reply("\n".join(lines))
    lines.append(f"\nנותרו {data['remaining']} שאלות.")
    return Reply("\n".join(lines), [CONTINUE])
