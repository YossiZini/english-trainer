const { compareLessons, topicRank } = require('../src/utils/lessonOrder');
const { MATH_CHAPTER_ORDER } = require('../src/config/subjects');
const LessonService = require('../src/services/lesson.service');
const lessons = require('../data/static/lessons.json');
const { initializeDatabase } = require('./helpers');
const Lesson = require('../src/models/Lesson');

describe('compareLessons', () => {
  test('English lessons follow topic then subtopic, not the per-topic order_index', () => {
    const english = lessons.filter(l => (l.subject || 'english') === 'english').sort(compareLessons);
    expect(english.slice(0, 3).map(l => String(l.subtopic_number))).toEqual(['1.1', '1.2', '1.3']);
    for (let i = 1; i < english.length; i++) {
      expect(english[i].topic_number).toBeGreaterThanOrEqual(english[i - 1].topic_number);
    }
  });

  test('a two-digit subtopic sorts after a one-digit one; Math keeps its order', () => {
    const l = (topic, sub, idx = 0) => ({ topic_number: topic, subtopic_number: sub, order_index: idx });
    expect([l(1, '1.10'), l(1, '1.2')].sort(compareLessons).map(x => x.subtopic_number)).toEqual(['1.2', '1.10']);
    const math = lessons.filter(x => x.subject === 'math').sort(compareLessons).map(x => String(x.subtopic_number));
    const chapters = [...new Set(math.map(s => Number(s.split('.')[0])))];
    expect(chapters).toEqual(MATH_CHAPTER_ORDER.filter(t => chapters.includes(t)));
    expect(math.slice(0, 3)).toEqual(['100.1', '100.2', '100.3']);
  });

  test('math chapters follow MATH_CHAPTER_ORDER: division (105) comes right after the multiplication table', () => {
    const l = (topic, sub) => ({ topic_number: topic, subtopic_number: sub, order_index: 0 });
    const sorted = [l(101, '101.1'), l(105, '105.2'), l(100, '100.3'), l(105, '105.1'), l(104, '104.1')].sort(compareLessons);
    expect(sorted.map(x => x.subtopic_number)).toEqual(['100.3', '105.1', '105.2', '101.1', '104.1']);
    // English and Arabic keep their numbers; every math topic in the data has a place.
    expect([topicRank(1), topicRank(14), topicRank(201)]).toEqual([1, 14, 201]);
    const mathTopics = new Set(lessons.filter(x => x.subject === 'math').map(x => x.topic_number));
    mathTopics.forEach(t => expect([t, MATH_CHAPTER_ORDER.includes(t)]).toEqual([t, true]));
  });
});

describe('the lesson list', () => {
  beforeAll(initializeDatabase);

  test('groups each subject\'s lessons by chapter in curriculum order', async () => {
    for (const subject of ['english', 'math', 'arabic']) {
      const topics = await LessonService.getAllLessons('no-such-user', { subject });
      const ranks = topics.map(t => topicRank(t.topicNumber));
      expect([subject, ranks]).toEqual([subject, [...ranks].sort((a, b) => a - b)]);
    }
  });
});

describe('lesson page navigation (d5)', () => {
  beforeAll(initializeDatabase);

  test.each(['english', 'math', 'arabic'])('every %s lesson links to its curriculum neighbours', async (subject) => {
    const ordered = lessons.filter(l => (l.subject || 'english') === subject).sort(compareLessons);
    for (let i = 0; i < ordered.length; i++) {
      const next = await Lesson.getNextLesson(ordered[i]);
      const prev = await Lesson.getPreviousLesson(ordered[i]);
      expect([ordered[i].subtopic_number, next && next.id]).toEqual([ordered[i].subtopic_number, ordered[i + 1] ? ordered[i + 1].id : null]);
      expect([ordered[i].subtopic_number, prev && prev.id]).toEqual([ordered[i].subtopic_number, i > 0 ? ordered[i - 1].id : null]);
    }
  });
});
