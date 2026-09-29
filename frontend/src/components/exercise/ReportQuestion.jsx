import React, { useState } from 'react';
import reportService from '../../services/reportService';
import './ReportQuestion.css';

export const REASONS = [
  { key: 'wrong_answer', label: 'התשובה הנכונה שגויה' },
  { key: 'two_answers', label: 'יש יותר מתשובה נכונה אחת' },
  { key: 'unclear', label: 'השאלה לא ברורה' },
  { key: 'other', label: 'משהו אחר' }
];

/**
 * "Report this question": a small link under the question card that opens
 * the reasons as buttons. One tap sends the report; "other" asks for a short
 * optional note first. Reporting never touches the answer or the score.
 * Render it with `key={exerciseId}` so its state resets per question.
 */
const ReportQuestion = ({ exerciseId }) => {
  const [open, setOpen] = useState(false);
  const [other, setOther] = useState(false);
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  const send = async (reason, text) => {
    setState('sending');
    try {
      await reportService.reportQuestion(exerciseId, reason, text);
      setState('sent');
      setOpen(false);
    } catch (error) {
      setState('error');
      // The api client rejects with the response body; only the daily cap has a Hebrew message.
      setMessage(error?.code === 'report_cap' && error.message ? error.message : 'לא הצלחנו לשלוח את הדיווח. נסו שוב.');
    }
  };

  if (state === 'sent') {
    return <p className="report-question-thanks" role="status">🚩 תודה! נבדוק את השאלה.</p>;
  }

  return (
    <div className={`report-question${open ? ' open' : ''}`}>
      {!open ? (
        <button type="button" className="report-question-link" onClick={() => setOpen(true)}>
          🚩 דיווח על טעות בשאלה
        </button>
      ) : (
        <div className="report-question-panel" role="group" aria-label="סיבת הדיווח">
          <p className="report-question-title">מה לא בסדר בשאלה?</p>
          {!other ? (
            <div className="report-question-reasons">
              {REASONS.map(r => (
                <button
                  key={r.key}
                  type="button"
                  className="report-question-reason"
                  disabled={state === 'sending'}
                  onClick={() => (r.key === 'other' ? setOther(true) : send(r.key))}
                >
                  {r.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="report-question-other">
              <input
                type="text"
                maxLength={200}
                value={note}
                placeholder="כמה מילים (לא חובה)"
                onChange={e => setNote(e.target.value)}
              />
              <button type="button" className="report-question-reason" disabled={state === 'sending'}
                onClick={() => send('other', note.trim())}>
                שליחה
              </button>
            </div>
          )}
          {state === 'error' && <p className="report-question-error" role="alert">{message}</p>}
          <button type="button" className="report-question-cancel"
            onClick={() => { setOpen(false); setOther(false); setState('idle'); }}>
            ביטול
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportQuestion;
