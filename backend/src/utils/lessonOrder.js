/**
 * Curriculum order of lessons: topic number, then subtopic (1.2 before 1.10),
 * then order_index. English lessons store order_index per topic (1, 2, 3 in
 * every topic), so sorting by order_index alone interleaves topics.
 */
function subtopicMinor(lesson) {
  const minor = String(lesson.subtopic_number ?? '').split('.')[1];
  return minor === undefined ? 0 : Number(minor);
}

function compareLessons(a, b) {
  return (a.topic_number - b.topic_number)
    || (subtopicMinor(a) - subtopicMinor(b))
    || ((a.order_index ?? 0) - (b.order_index ?? 0));
}

module.exports = { compareLessons };
