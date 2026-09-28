const { compareLessons } = require('../src/utils/lessonOrder');
const lessons = require('../data/static/lessons.json');

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
    expect(math.slice(0, 7)).toEqual(['101.1', '101.2', '101.3', '101.4', '101.5', '101.6', '102.1']);
  });
});
