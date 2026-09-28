import React, { useEffect, useState } from 'react';
import telegramService from '../../services/telegramService';
import './TelegramLinkPage.css';

const BOT_NAME = process.env.REACT_APP_TELEGRAM_BOT || 'EnglishTrainerBot';

/** Link the student's Telegram chat to the account with a one-time code. */
const TelegramLinkPage = () => {
  const [link, setLink] = useState(null);
  const [code, setCode] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setLink(await telegramService.getLink());
    } catch (e) {
      setError('שגיאה בטעינת המצב');
    }
  };
  useEffect(() => { load(); }, []);

  const requestCode = async () => {
    setBusy(true); setError('');
    try {
      setCode(await telegramService.requestCode());
    } catch (e) {
      setError('לא הצלחנו להנפיק קוד, נסו שוב');
    } finally { setBusy(false); }
  };

  const unlink = async () => {
    setBusy(true); setError('');
    try {
      await telegramService.unlink();
      setCode(null);
      await load();
    } catch (e) {
      setError('הניתוק נכשל, נסו שוב');
    } finally { setBusy(false); }
  };

  return (
    <div className="telegram-page">
      <div className="telegram-card">
        <h1>תרגול מילים בטלגרם</h1>
        <p className="telegram-intro">
          הבוט שולח מילה באנגלית, אתם עונים בעברית, והוא בודק. בסוף חוזרים על המילים שטעיתם בהן עד שכולן נכונות.
        </p>

        {link && (
          <p className={`telegram-status ${link.linked ? 'on' : 'off'}`}>
            {link.linked ? 'הטלגרם שלכם מחובר לחשבון' : 'הטלגרם עדיין לא מחובר'}
          </p>
        )}

        {code ? (
          <div className="telegram-code-box">
            <div className="telegram-code" dir="ltr">{code.code}</div>
            <p>שלחו את הקוד לבוט בתוך 10 דקות</p>
          </div>
        ) : (
          <button className="telegram-btn primary" onClick={requestCode} disabled={busy}>
            {link?.linked ? 'קוד חדש (חיבור מכשיר אחר)' : 'קבלו קוד חיבור'}
          </button>
        )}

        <ol className="telegram-steps">
          <li>פתחו בטלגרם את <a href={`https://t.me/${BOT_NAME}`} target="_blank" rel="noreferrer" dir="ltr">@{BOT_NAME}</a> ולחצו Start.</li>
          <li>שלחו לבוט את הקוד בן 6 הספרות.</li>
          <li>כתבו <strong>מילים</strong> כדי להתחיל תרגול, ו<strong>סיים</strong> כדי לעצור.</li>
        </ol>

        {link?.linked && (
          <button className="telegram-btn danger" onClick={unlink} disabled={busy}>נתקו את הטלגרם</button>
        )}
        {error && <p className="telegram-error">{error}</p>}
      </div>
    </div>
  );
};

export default TelegramLinkPage;
