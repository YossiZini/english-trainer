# Re-levelling the vocabulary (Sprint 21)

The 3,287 words had levels from the source lists: Band II words 1–10 (with
levels 9–10 cut by the alphabet: dark, daughter, dinner) and Band III words
8–9. The bot's easy level (1–5) was 69% levels 4–5. This folder proposes a
new level 1–10 for every word, harder level by level, for a Hebrew-speaking
student.

| File | What it is |
|---|---|
| `relevel.py` | The score and the proposal (run it to regenerate the two files below) |
| `moves.csv` | Moves made by hand, each with its reason (edit this, then rerun) |
| `proposal.csv` | Every word: old level, score parts, new level, the hand move's reason |
| `report.md` | Per level, before and after: size, median frequency, Band III share, concrete share, multi-word share, patterns, first letters |
| `apply.py` | Writes `proposal.csv`'s new levels into `backend/data/static/vocabulary_words.json` (by id) and `docs/words/words.csv` (the level field only, in place), and proves every id and every other field unchanged |

The owner approved the levels on 2026-11-06 and they were applied with
`apply.py`. `node backend/scripts/checks/word-levels.js` checks the applied
levels: sizes, first letters, no pattern, phrasal verb or 3+ word phrase
below level 5, falling frequency, and the CSV, the JSON and the proposal
agreeing for every word.

Do not regenerate the vocabulary with `npm run generate-data -- --all`
to change a level: the generator gives every word a new id, which would cut
students' scores off their words. Edit `moves.csv` (or the score), rerun
`relevel.py`, then `apply.py`.

Run from the repository root with a Python that has `wordfreq` (a dev-time
tool; the app never imports it):

```
python -m venv /tmp/wf && /tmp/wf/bin/pip install wordfreq
/tmp/wf/bin/python docs/words/relevel/relevel.py
```

## The score (higher = harder)

| Part | Value | Why |
|---|---|---|
| Frequency | 1.2 × (6 − zipf), zipf capped at 6 | A word met ten times less often is about one level harder (wordfreq's zipf scale) |
| Band | Band II 0, Band III 0.6, Band III lexis 1.0, other 0.3 | The curriculum teaches Band III later; heavier weights broke the frequency order |
| Curated basic | −1.0 | Band II's hand-picked first levels (old 1–4: apple, big, cat) |
| Concrete group | −1.8 | In a concrete group of `backend/src/data/wordGroups.json` (animals, food, body, family, colours…): a child learns "cow" before "would" |
| Everyday group | −0.7 | Speaking, thinking, having, ordinals, possessives |
| Grammar / abstract | +1.2 (zipf ≥ 5.5) / +0.8 (zipf 5.0–5.5) | A frequent word in no group and not curated: would, yet; issue, process. Hard to translate alone |
| Length | +0.12 per letter beyond 6 | Long single words are harder and often abstract (opportunity, environment) |
| Shape | +0.6 two words, +1.2 three or more; +1.0 pattern; +0.5 phrasal verb | `as...as`, `sth`, `sb`, `etc`, `-th`; "pick up" |

Then the words, in score order, fill levels 1 to 10 to the planned sizes
150, 200, 250, 300, 330, 360, 400, 420, 440 and the rest (437). A pattern, a
phrasal verb or a phrase of three or more words is never below level 5. A
word in `moves.csv` is pinned to its level and takes one of its places.

## What the result looks like

See `report.md`. Frequency falls from level 1 (median zipf 5.3) to level 10
(4.0), and the Band III share rises from 1% to 99%. Frequency is not strictly
falling at every step: levels 1–3 hold concrete words (cow, tooth) that are
rarer in adult English than the grammar and abstract words placed above them,
on purpose.
