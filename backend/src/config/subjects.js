/**
 * The subjects students learn, in display order. The single list for the
 * API: lesson filters, the home page, the chat bot's lessons. Lesson topic
 * numbers keep them apart: English 1–99, math 101–199, Arabic 201–299.
 */
const SUBJECTS = ['english', 'math', 'arabic'];

const isSubject = (s) => SUBJECTS.includes(s);

module.exports = { SUBJECTS, isSubject };
