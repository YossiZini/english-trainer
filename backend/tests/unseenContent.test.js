/**
 * The reading texts (Unseen), on the website and in Telegram: the committed
 * JSON is exactly what their seed generates with every id kept, and every
 * text follows the content rules in backend/create-unseen.md.
 */
const paragraphs = require('../data/static/unseen_paragraphs.json');
const questions = require('../data/static/unseen_questions.json');
const { buildUnseenRecords, loadUnseenSeed } = require('../src/data/generateJsonData');

const words = (text) => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
/** The hard word, or a form of it (the same first six letters), is in the text: "pharaoh" in "pharaohs". */
const inText = (word, content) => {
  const parts = words(word);
  const text = words(content);
  const stem = (w) => w.slice(0, 6);
  return text.some((_, i) => parts.every((p, j) => text[i + j] && stem(text[i + j]) === stem(p)));
};

describe('Reading texts (Unseen) content', () => {
  test('the JSON is what the seed generates, with every id kept (npm run generate-data -- --unseen)', () => {
    expect(buildUnseenRecords(loadUnseenSeed(), { paragraphs, questions })).toEqual({ paragraphs, questions });
  });

  test('a new text gets new ids, existing texts and questions keep theirs, and titles are unique', () => {
    const seed = loadUnseenSeed();
    const built = buildUnseenRecords([...seed, { ...seed[0], titleEn: 'A Brand New Text' }], { paragraphs, questions });
    expect(built.paragraphs.slice(0, seed.length)).toEqual(paragraphs);
    expect(built.questions.slice(0, questions.length)).toEqual(questions);
    const added = built.paragraphs[seed.length];
    expect(paragraphs.map(p => p.id)).not.toContain(added.id);
    const addedQuestions = built.questions.filter(q => q.paragraph_id === added.id);
    expect(addedQuestions).toHaveLength(seed[0].questions.length);
    addedQuestions.forEach(q => expect(questions.map(o => o.id)).not.toContain(q.id));
    expect(() => buildUnseenRecords([...seed, seed[1]])).toThrow(/Two reading texts are called/);
  });

  test('every text: titles, a topic, a level 1–5, 2–4 paragraphs, 7 hard words found in the text', () => {
    expect(new Set(paragraphs.map(p => p.title_en)).size).toBe(paragraphs.length);
    for (const p of paragraphs) {
      const at = p.title_en;
      expect([at, p.title_he && p.title_he.trim().length > 0]).toEqual([at, true]);
      expect([at, typeof p.topic === 'string' && p.topic.length > 0]).toEqual([at, true]);
      expect([at, [1, 2, 3, 4, 5].includes(p.complexity_level)]).toEqual([at, true]);
      const blocks = p.content.split(/\n\s*\n/).filter(b => b.trim());
      expect([at, blocks.length >= 2 && blocks.length <= 4]).toEqual([at, true]);
      expect([at, p.hard_words.length]).toEqual([at, 7]);
      for (const w of p.hard_words) {
        expect([at, w.word, inText(w.word, p.content)]).toEqual([at, w.word, true]);
        expect([at, w.word, /[֐-׿]/.test(w.translation)]).toEqual([at, w.word, true]);
      }
    }
  });

  test('every question: 5 per text, 4 distinct options, one right answer, Hebrew question and explanation', () => {
    for (const p of paragraphs) {
      const own = questions.filter(q => q.paragraph_id === p.id);
      expect([p.title_en, own.map(q => q.question_number).sort()]).toEqual([p.title_en, [1, 2, 3, 4, 5]]);
      for (const q of own) {
        const at = `${p.title_en} #${q.question_number}`;
        expect([at, q.options.length]).toEqual([at, 4]);
        expect([at, new Set(q.options.map(o => o.trim().toLowerCase())).size]).toEqual([at, 4]);
        expect([at, Number.isInteger(q.correct_answer) && q.correct_answer >= 0 && q.correct_answer < 4]).toEqual([at, true]);
        expect([at, q.question_text_en.trim().length > 0, /[֐-׿]/.test(q.question_text_he)]).toEqual([at, true, true]);
        expect([at, /[֐-׿]/.test(q.explanation_he)]).toEqual([at, true]);
        // Options may be shown in any order: none may point at another option.
        for (const o of q.options) {
          expect([at, o, /\b(all|none) of the above\b|\bboth\b.*\band\b|\boption [a-d1-4]\b/i.test(o)]).toEqual([at, o, false]);
        }
      }
    }
  });

  test('every English quote in an explanation is word for word in its text (or an option)', () => {
    // Letters and digits only, so quote marks and commas inside a quote do not
    // matter, but a changed word does; "..." splits a quote into pieces.
    const plain = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
    for (const p of paragraphs) {
      for (const q of questions.filter(x => x.paragraph_id === p.id)) {
        const at = `${p.title_en} #${q.question_number}`;
        const quotes = [...q.explanation_he.matchAll(/"([^"]*[A-Za-z][^"]*)"/g)].flatMap(m => m[1].split(/\.\.\.|…/));
        for (const piece of quotes.map(plain).filter(x => x.trim())) {
          const found = plain(p.content).includes(piece) || q.options.some(o => plain(o).includes(piece));
          expect([at, piece, found]).toEqual([at, piece, true]);
        }
      }
    }
  });
});
