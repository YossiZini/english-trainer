import topicMeta, { metaOf, subjectOfTopic } from './topicMeta';

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
    expect(subjectOfTopic(18)).toBe('english');
  });
});
