// The words shown at the end of a test in place of a score (Hebrew, plural
// like the rest of the site). Always optimistic, and the better it went the
// stronger the words: the top line is kept for a test with every answer
// right. The API still computes and saves the score; only the screen shows
// words. The tiers use the score as the API rounds it, so "good" and above
// line up with the lesson pass mark (70).

export const TIERS = [
  { min: 100, tone: 'perfect', icon: '🏆', title: 'מושלם!', text: 'כל התשובות נכונות. אין עליכם!' },
  { min: 90, tone: 'excellent', icon: '🌟', title: 'מצוין!', text: 'כמעט הכול נכון. עבודה מעולה!' },
  { min: 80, tone: 'great', icon: '🎉', title: 'יפה מאוד!', text: 'רוב התשובות נכונות. רואים שאתם שולטים בחומר!' },
  { min: 70, tone: 'good', icon: '👏', title: 'כל הכבוד!', text: 'עבודה טובה! עוד קצת תרגול ותגיעו לפסגה.' },
  { min: 50, tone: 'growing', icon: '💪', title: 'בדרך הנכונה!', text: 'כבר יודעים הרבה. עוד סיבוב תרגול וזה שלכם!' },
  { min: 25, tone: 'starting', icon: '🌱', title: 'התחלה טובה!', text: 'כל תרגול מוסיף ידע. בסיבוב הבא יהיה קל יותר!' },
  { min: 0, tone: 'first', icon: '🚀', title: 'יצאתם לדרך!', text: 'הצעד הראשון הכי חשוב. ממשיכים לתרגל – וזה יגיע!' }
];

/** The words for `correct` right answers out of `total`. */
export function assessmentFor(correct, total) {
  const right = Math.max(0, Number(correct) || 0);
  const all = Math.max(0, Number(total) || 0);
  if (all > 0 && right >= all) return TIERS[0];
  const score = all > 0 ? Math.round((right / all) * 100) : 0;
  return TIERS.slice(1).find((tier) => score >= tier.min);
}
