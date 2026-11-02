const { MATH_CHAPTER_ORDER } = require('../config/subjects');

/**
 * Curriculum order of lessons: the topic's place (topicRank), then subtopic
 * (1.2 before 1.10), then order_index. English lessons store order_index per
 * topic (1, 2, 3 in every topic), so sorting by order_index alone
 * interleaves topics.
 */

/** A topic's place: math chapters by MATH_CHAPTER_ORDER (100, 101…), others by number. */
function topicRank(topicNumber) {
  const i = MATH_CHAPTER_ORDER.indexOf(Number(topicNumber));
  return i < 0 ? Number(topicNumber) : 100 + i;
}

function subtopicMinor(lesson) {
  const minor = String(lesson.subtopic_number ?? '').split('.')[1];
  return minor === undefined ? 0 : Number(minor);
}

function compareLessons(a, b) {
  return (topicRank(a.topic_number) - topicRank(b.topic_number))
    || (subtopicMinor(a) - subtopicMinor(b))
    || ((a.order_index ?? 0) - (b.order_index ?? 0));
}

module.exports = { compareLessons, topicRank };
