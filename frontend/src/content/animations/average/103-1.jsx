import React from 'react';
import { BarChart, Expr, Eq, Note } from '../primitives';

// 103.1 ממוצע — one scene per rule of the written theory. Bars show the
// numbers, the dashed line is the average, "levelled" bars share equally.
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });
const tests = (vals) => vals.map((value, i) => ({ label: `מבחן ${i + 1}`, value }));

const scenes = [
  {
    name: 'מחברים ומחלקים',
    steps: [
      {
        caption: 'הממוצע של 80, 90 ו-100. שלושה ציונים, שלושה עמודים בגבהים שונים.',
        draw: () => (<>
          <BarChart y={40} h={180} values={tests([80, 90, 100])} max={100} />
        </>),
      },
      {
        caption: 'מחברים: 80 + 90 + 100 = 270. מחלקים בכמות המספרים: 270 ÷ 3 = 90.',
        draw: () => (<>
          <Expr y={100} size={26} tokens={['80', '+', '90', '+', '100', '=', R('270')]} anim="fadein" />
          <Expr y={190} size={26} tokens={['270', '÷', '3', '=', R('90', 'pop d4')]} />
        </>),
      },
      {
        caption: 'הממוצע הוא 90: אם מיישרים את העמודים לגובה אחד, כולם בגובה 90.',
        draw: () => (<>
          <BarChart y={40} h={180} values={tests([80, 90, 100])} max={100} mean={90} levelled />
        </>),
      },
    ],
  },
  {
    name: 'מהממוצע לסכום',
    steps: [
      {
        caption: 'הממוצע של 4 ציונים הוא 85. כאילו כל ארבעת הציונים הם 85.',
        draw: () => (<>
          <BarChart y={40} h={180} values={tests([85, 85, 85, 85])} max={100} mean={85} />
        </>),
      },
      {
        caption: 'סכום = ממוצע × כמות: 85 × 4 = 340.',
        draw: () => (<>
          <Note x={320} y={70} anim="fadein">סכום = ממוצע × כמות</Note>
          <Expr y={160} tokens={['85', '×', '4', '=', R('340')]} />
        </>),
      },
    ],
  },
  {
    name: 'מוצאים מספר חסר',
    steps: [
      {
        caption: 'דנה קיבלה 70 ו-90, והממוצע של שלושת המבחנים הוא 80. הציון השלישי חסר.',
        draw: () => (<>
          <BarChart y={40} h={180} values={[{ label: 'מבחן 1', value: 70 }, { label: 'מבחן 2', value: 90 }, { label: 'מבחן 3', value: null }]} max={100} mean={80} />
          <Eq x={453} y={170} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'הסכום הדרוש: ממוצע × כמות, 80 × 3 = 240.',
        draw: () => (<>
          <Expr y={140} tokens={['80', '×', '3', '=', R('240')]} />
        </>),
      },
      {
        caption: 'מחסרים את מה שידוע: 240 − 70 − 90 = 80. הציון החסר הוא 80.',
        draw: () => (<>
          <Expr y={50} size={26} tokens={['240', '−', '70', '−', '90', '=', R('80')]} />
          <BarChart y={95} h={140} values={[{ label: 'מבחן 1', value: 70 }, { label: 'מבחן 2', value: 90 }, { label: 'מבחן 3', value: 80, color: 'sum' }]} max={100} mean={80} />
        </>),
      },
    ],
  },
  {
    name: 'מוסיפים מספר',
    steps: [
      {
        caption: 'הממוצע של 3 מספרים הוא 10, כלומר הסכום 30. מוסיפים את המספר 18, שגדול מהממוצע.',
        draw: () => (<>
          <BarChart y={40} h={180} values={[{ value: 10 }, { value: 10 }, { value: 10 }, { value: 18, color: 'b' }]} max={20} mean={10} />
        </>),
      },
      {
        caption: 'הסכום החדש 30 + 18 = 48, הכמות החדשה 4. הממוצע החדש 48 ÷ 4 = 12: הממוצע עלה.',
        draw: () => (<>
          <Expr y={70} size={26} tokens={['30', '+', '18', '=', R('48')]} anim="fadein" />
          <Expr y={150} size={26} tokens={['48', '÷', '4', '=', R('12', 'pop d4')]} />
          <Note x={320} y={235} anim="fadein d5">מספר גדול מהממוצע: הממוצע עולה מ-10 ל-12</Note>
        </>),
      },
      {
        caption: 'ואם מוסיפים מספר קטן מהממוצע, למשל 2: הסכום 32, והממוצע 32 ÷ 4 = 8. הממוצע ירד.',
        draw: () => (<>
          <BarChart y={40} h={160} values={[{ value: 10 }, { value: 10 }, { value: 10 }, { value: 2, color: 'b' }]} max={20} mean={8} />
          <Note x={320} y={250} anim="fadein d4">32 ÷ 4 = 8</Note>
        </>),
      },
    ],
  },
  {
    name: 'בעיות מילוליות',
    steps: [
      {
        caption: 'הטמפרטורות בארבעה ימים היו 20, 24, 22 ו-26 מעלות.',
        draw: () => (<>
          <BarChart y={40} h={180} values={[{ label: 'יום א', value: 20 }, { label: 'יום ב', value: 24 }, { label: 'יום ג', value: 22 }, { label: 'יום ד', value: 26 }]} max={30} />
        </>),
      },
      {
        caption: 'מחברים: 20 + 24 + 22 + 26 = 92. מחלקים ב-4 ימים: 92 ÷ 4 = 23 מעלות.',
        draw: () => (<>
          <Expr y={100} size={26} tokens={['20', '+', '24', '+', '22', '+', '26', '=', R('92')]} anim="fadein" />
          <Expr y={190} size={26} tokens={['92', '÷', '4', '=', R('23', 'pop d4')]} />
        </>),
      },
      {
        caption: 'הממוצע 23 עובר באמצע: יומיים חמים ממנו ויומיים קרים ממנו.',
        draw: () => (<>
          <BarChart y={40} h={180} values={[{ label: 'יום א', value: 20 }, { label: 'יום ב', value: 24 }, { label: 'יום ג', value: 22 }, { label: 'יום ד', value: 26 }]} max={30} mean={23} />
        </>),
      },
    ],
  },
];

export default scenes;
