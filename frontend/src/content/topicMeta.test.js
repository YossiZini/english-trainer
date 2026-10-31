import topicMeta, { metaOf, subjectOfTopic, displayTopic, displaySubtopic, getSubtopicExamples } from './topicMeta';

describe('subject metadata', () => {
  test('every subject names its page for links back to it', () => {
    Object.values(topicMeta).forEach((meta) => {
      expect(meta.title).toBeTruthy();
      expect(meta.route).toMatch(/^\//);
      expect(meta.indexLabel).toBeTruthy();
    });
    expect(metaOf('english').indexLabel).toBe('נושאים');
    expect(metaOf('arabic').indexLabel).toBe('ערבית');
  });

  test('a lesson without a subject is English', () => {
    expect(metaOf(undefined)).toBe(topicMeta.english);
    expect(subjectOfTopic(201)).toBe('arabic');
    expect(subjectOfTopic(101)).toBe('math');
    expect(subjectOfTopic(100)).toBe('math');
    expect(subjectOfTopic(99)).toBe('english');
    expect(subjectOfTopic(18)).toBe('english');
  });
});

describe('topic numbers on screen', () => {
  test('each subject counts from 1; the multiplication table is math chapter 1', () => {
    expect([displayTopic(100), displayTopic(101), displayTopic(104)]).toEqual([1, 2, 5]);
    expect([displaySubtopic('100.1'), displaySubtopic('101.3')]).toEqual(['1.1', '2.3']);
    expect([displayTopic(3), displaySubtopic('201.2')]).toEqual([3, '1.2']);
  });
});

describe('math example badges', () => {
  // The page is right-to-left: without an isolate "56 ÷ 8 = 7" shows as "7 = 8 ÷ 56".
  test('every badge with an equation is a left-to-right isolate', () => {
    const badges = ['100.1', '100.2', '100.3', '101.1', '101.2', '101.3', '101.4', '101.5', '101.6']
      .flatMap((sub) => getSubtopicExamples(Number(sub.split('.')[0]), sub));
    const equations = badges.filter((b) => /[=<>×÷+−]/.test(b));
    expect(equations.length).toBeGreaterThanOrEqual(15);
    equations.forEach((b) => expect(b).toMatch(/^\u2066[^\u2066\u2069]+\u2069$/));
    expect(getSubtopicExamples(100, '100.2')[0]).toBe('\u206656 ÷ 8 = 7\u2069');
  });
});
