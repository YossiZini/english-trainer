const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const VocabularyUserHistory = require('../models/VocabularyUserHistory');
const UnseenSession = require('../models/UnseenSession');
const BotSession = require('../models/BotSession');

/**
 * Who practised lately: every student's participation over the last 7 and
 * 30 days (/usage in the bot, open to every linked student). Participation
 * only — never scores, points or right/wrong counts.
 *
 * Sources, each read through its model with one date-range query:
 * lessons (exercise_results, web and bot), word answers (web quiz history
 * and bot words exams, dated by the exam's start), reading texts
 * (unseen_sessions). Days are Israel dates; a window includes today.
 * The summary is cached for a few minutes per instance.
 */
const WINDOWS = { week: 7, month: 30 };
const CACHE_MS = 10 * 60 * 1000;
const TIME_ZONE = 'Asia/Jerusalem';

let cache = null;
let cachedAt = 0;

const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
/** The Israel date (YYYY-MM-DD) of an ISO timestamp or Date. */
const israelDay = (t) => dayFormat.format(new Date(t));

/** The date `n` days before the Israel date `day` (both YYYY-MM-DD). */
function daysBefore(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10);
}

const emptyCounts = () => ({ activeDays: 0, lessons: 0, words: 0, reading: 0 });

class UsageService {
  static clearCache() {
    cache = null;
  }

  static async summary(now = new Date()) {
    if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
    const today = israelDay(now);
    const firstDay = { week: daysBefore(today, WINDOWS.week - 1), month: daysBefore(today, WINDOWS.month - 1) };
    // One day of slack before the month's first Israel day covers the time-zone offset.
    const since = new Date(Date.parse(`${firstDay.month}T00:00:00Z`) - 24 * 3600 * 1000).toISOString();

    // Activity events: { userId, day, kind, amount }.
    const events = [];
    for (const r of await UserProgress.resultsSince(since)) events.push({ userId: r.user_id, day: israelDay(r.completed_at), kind: 'lessons', amount: 1 });
    for (const a of await VocabularyUserHistory.answersSince(since)) events.push({ userId: a.user_id, day: israelDay(a.answered_at), kind: 'words', amount: 1 });
    for (const s of await BotSession.vocabAnswersSince(since)) events.push({ userId: s.userId, day: israelDay(s.startedAt), kind: 'words', amount: s.answers });
    for (const s of await UnseenSession.completedSince(since)) {
      if (s.completed_at) events.push({ userId: s.user_id, day: israelDay(s.completed_at), kind: 'reading', amount: 1 });
    }

    const byUser = new Map();
    for (const e of events) {
      if (!e.userId || e.day < firstDay.month || e.day > today) continue;
      if (!byUser.has(e.userId)) byUser.set(e.userId, { week: emptyCounts(), month: emptyCounts(), days: { week: new Set(), month: new Set() }, lastActive: e.day });
      const u = byUser.get(e.userId);
      for (const w of Object.keys(WINDOWS)) {
        if (e.day < firstDay[w]) continue;
        u[w][e.kind] += e.amount;
        u.days[w].add(e.day);
      }
      if (e.day > u.lastActive) u.lastActive = e.day;
    }

    const names = await User.namesOf([...byUser.keys()]);
    const students = [...byUser.entries()]
      .filter(([id]) => names.has(id))
      .map(([id, u]) => ({
        name: names.get(id),
        week: { ...u.week, activeDays: u.days.week.size },
        month: { ...u.month, activeDays: u.days.month.size },
        lastActive: u.lastActive
      }))
      .sort((a, b) => b.week.activeDays - a.week.activeDays || b.month.activeDays - a.month.activeDays
        || b.lastActive.localeCompare(a.lastActive) || a.name.localeCompare(b.name));

    cache = {
      today,
      windows: { week: { from: firstDay.week, to: today }, month: { from: firstDay.month, to: today } },
      students,
      inactive: Math.max(0, (await User.count()) - students.length)
    };
    cachedAt = Date.now();
    return cache;
  }
}

module.exports = UsageService;
module.exports.israelDay = israelDay;
module.exports.daysBefore = daysBefore;
