const BotSession = require('../../models/BotSession');
const BotService = require('../bot.service');
const ExerciseSession = require('./exerciseSession');
const { REASONS, WORD_REASONS } = require('../report.service');

/**
 * /report in the chat bot: what the student reports is what is in front of
 * them. An open words exam → its word; an open lesson → its question; with
 * nothing open, the words exam or lesson that ended last, within the hour.
 * Without a reason the bot learns the target and its reasons (to show them
 * as buttons); with one, the report is filed.
 */
const WINDOW_MS = 60 * 60 * 1000;

const recent = (s) => s && s.status === 'ended'
  && Date.now() - new Date(s.ended_at || s.started_at).getTime() <= WINDOW_MS;

async function findTarget(user, chatId) {
  const open = await BotSession.findOpenByChat(chatId);
  if (open) {
    const kind = BotSession.kindOf(open);
    if (kind === 'vocab') return open.status === 'active' ? { kind: 'word', session: open } : null;
    return kind === 'exercise' ? { kind: 'question' } : null;
  }
  const words = await BotSession.findLastFinishedVocab(chatId, user.id);
  const lesson = await BotSession.findLatestExercise(chatId, user.id);
  const candidates = [
    recent(words) && words.last_word_id ? { kind: 'word', session: words, at: words.ended_at } : null,
    recent(lesson) ? { kind: 'question', at: lesson.ended_at } : null
  ].filter(Boolean);
  candidates.sort((a, b) => new Date(b.at) - new Date(a.at));
  return candidates[0] || null;
}

async function report(user, chatId, reason) {
  const target = await findTarget(user, chatId);
  if (!target) return { error: 'no_session' };
  const reasons = target.kind === 'word' ? WORD_REASONS : REASONS;
  if (!reason) return { ask: true, target: target.kind, reasons };
  if (!reasons.includes(reason)) return { error: 'bad_reason' };
  return target.kind === 'word'
    ? BotService.reportWord(user, target.session, reason)
    : ExerciseSession.report(user, chatId, reason);
}

module.exports = { report, findTarget };
