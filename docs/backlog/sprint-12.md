# Sprint 12 — Arabic: a new subject (archived backlog)

**Goal:** Add Arabic as a third subject, with a first unit that prepares students for the 11.10 Arabic test (book pages 13–25): six letters, alif with and without hamza, the vowels, and eight words, for reading and recognition only.
**Period:** 2026-09-30 → 2026-09-30
**Items:** 14 (4 stories), all done

## Scope

- Arabic as a subject next to English and math: home page, lesson list, progress and points work as for the others (web first)
- Lesson 1, letters د و ذ ا ر ز: recognise each letter inside a word, its Arabic name, and its Hebrew counterpart
- Lesson 2, alif and hamza: أ (a consonant, carries a vowel) vs ا (silent, no vowel, a mother of reading after the previous letter's vowel)
- Lesson 3, vowels: fatha (a, patah), damma (u, kubutz), kasra (i, hiriq) and sukun (no vowel), by sign, name, sound and Hebrew counterpart
- Lesson 4, vocabulary: دَار وِدَاد دَاوُد وَرْد أَرْز أَرَادَ زَارَ أَو read with their Hebrew meaning; a review test mixing all four
- Multiple-choice exercises only (no writing in Arabic script, as the teacher says), Arabic shown right-to-left with vowel marks, checked by an independent content review before release
- Deadline: live before the test on 11.10 (Saturday); docs/topics-status.md, docs and system map updated

## Stories

### P1 s1 · Arabic as a subject on the website

As a student, I want an Arabic subject next to English and math so that I can practise for the Arabic test. Topic numbers 201+ (shown as 1+). Many places branch 'math, else english' and the website infers the subject from the topic number: all become a three-way mapping. Size L.

- [x] /api/lessons?subject=arabic returns only Arabic lessons; progress, next lesson and home-page data work per subject
- [x] The navbar, home page and dashboard show ערבית; /arabic lists its lessons; back links return to /arabic
- [x] Arabic questions, options, explanations and the mistakes page render right-to-left with readable vowel marks (Arabic web font)
- [x] English and math pages unchanged (existing tests and the viewport check pass)

*Closing note:* Wiring, RTL and font done; viewport check passes on 201.1/201.2; ships in PR with s2

| Task | Owner | Note |
|---|---|---|
| Backend subject wiring | Claude | config/subjects.js single list; ?subject=arabic filters; backend 101 pass |
| Website: route, navbar, home page, topicMeta | Claude | /arabic, navbar, home page, topicMeta range mapping, back links from topicMeta |
| Right-to-left Arabic and an Arabic font | Claude | RTL Arabic options/mistakes, bidi knows Arabic, Noto Naskh Arabic via .arabic; screenshots after content |

### P1 s2 · Arabic unit 1: the content for the 11.10 test

As a student, I want lessons and exercises on exactly the test material (book pp. 13–25) so that I arrive ready. Topic 201 with 5 lessons: 201.1 letters د و ذ ا ر ز (in a word, Arabic name, Hebrew counterpart), 201.2 alif with and without hamza, 201.3 vowels (fatha, damma, kasra, sukun), 201.4 the 8 words, 201.5 a review test mixing all. Each: a short Hebrew teaching page and 30 multiple-choice questions (10 easy, 10 medium, 10 hard). No writing in Arabic script. Size L.

- [x] Every question is multiple choice, 3–4 distinct options, exactly one right (content test)
- [x] Only the teacher's material: the six letters, hamza vs alif, the four vowel signs, the eight words; no other letters as answers the student must know
- [x] An independent second review checks every question and teaching page for Arabic and Hebrew correctness before release; doubts are listed for the owner
- [x] docs/arabic-content-guide.md written (like the math guide); topics-status updated

*Closing note:* 150 questions reviewed and fixed; in the sprint PR

| Task | Owner | Note |
|---|---|---|
| Arabic content guide and seed helpers | Claude | facts.js + common.js (10/10/10, distinct, no positional options, words checked against their marks); docs/arabic-content-guide.md |
| Lessons 201.1 letters and 201.2 alif/hamza | Claude | 201.1, 201.2 written and loading |
| Lessons 201.3 vowels and 201.4 vocabulary | Claude | 201.3, 201.4 written and loading |
| Lesson 201.5 review test | Claude | 201.5 written; 150 exercises generated; backend 101 tests pass |
| Independent content review and fixes | Claude | Independent review: 7 must-fix + 10 style, all applied; regenerated; backend 101 pass |

### P1 s3 · Arabic in the Telegram bot

As a student, I want /arabic and /lessons_arabic in Telegram so that I can practise Arabic from my phone. Size M.

- [x] /arabic starts the next Arabic lesson; /lessons_arabic lists them; 'arabic 3' and levels work as for the others
- [x] Both commands in the menu and /help; the lessons button offers Arabic too
- [x] Free-form requests ('תרגול בערבית') reach Arabic through the agent's tools
- [x] Arabic options are shown correctly in Telegram (checked with a real lesson's text)

*Closing note:* Ships in the sprint PR; Telegram rendering of Arabic options checked live after deploy

| Task | Owner | Note |
|---|---|---|
| API and bot subject lists | Claude | config SUBJECTS, replies, tools._subject, agent instruction; API validators from config/subjects.js |
| Menu, help, buttons and tests | Claude | menu, help, lessons buttons; bot 51 tests pass |

### P2 s4 · Docs and system map

As the maintainer, I want the docs to cover the third subject. topics-status (Arabic section and log), CLAUDE.md pointer to the Arabic guide, telegram-bot.md commands, system map. Size S.

- [x] topics-status has an Arabic table and log entries
- [x] CLAUDE.md points Arabic content to docs/arabic-content-guide.md
- [x] System map updated and republished

*Closing note:* topics-status, arabic-content-guide, CLAUDE.md, telegram-bot.md, system map v13

