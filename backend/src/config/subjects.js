/**
 * The subjects students learn, in display order. The single list for the
 * API: lesson filters, the home page, the chat bot's lessons. Lesson topic
 * numbers keep them apart: English 1–99, math 100–199 (the multiplication
 * table, 100, comes first), Arabic 201–299.
 */
const SUBJECTS = ['english', 'math', 'arabic'];

const isSubject = (s) => SUBJECTS.includes(s);

/**
 * Math chapters in teaching order, by topic number. A chapter added later
 * gets a free number and its place here (division, 105, comes right after
 * the multiplication table), so no existing lesson is renumbered. The
 * website shows chapters in this order too (frontend topicMeta.topicOrder).
 */
const MATH_CHAPTER_ORDER = [100, 105, 101, 102, 103, 104];

module.exports = { SUBJECTS, isSubject, MATH_CHAPTER_ORDER };
