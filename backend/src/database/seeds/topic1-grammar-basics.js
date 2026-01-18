const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 1: Grammar Basics - Introduction (יסודות דקדוק)
const lessonsData = [
  // ==================== SUBTOPIC 1.1: Parts of Speech ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.1',
    titleEn: 'Parts of Speech',
    titleHe: 'חלקי הדיבור',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>חלקי הדיבור (Parts of Speech)</h2>

<p>חלקי הדיבור הם הקטגוריות הבסיסיות שלתוכן מתחלקות המילים בשפה האנגלית. כל מילה במשפט שייכת לאחד מחלקי הדיבור.</p>

<div class="rules">
  <h3>8 חלקי הדיבור העיקריים:</h3>
  <ul>
    <li><strong>1. Noun (שם עצם):</strong> מילה המציינת אדם, מקום, דבר או רעיון<br>
    דוגמאות: <em>teacher, London, book, happiness</em></li>

    <li><strong>2. Pronoun (כינוי):</strong> מילה המחליפה שם עצם<br>
    דוגמאות: <em>I, you, he, she, it, we, they, this, that</em></li>

    <li><strong>3. Verb (פועל):</strong> מילה המתארת פעולה או מצב<br>
    דוגמאות: <em>run, eat, sleep, is, have, think</em></li>

    <li><strong>4. Adjective (שם תואר):</strong> מילה המתארת שם עצם<br>
    דוגמאות: <em>beautiful, big, red, happy, old</em></li>

    <li><strong>5. Adverb (תואר הפועל):</strong> מילה המתארת פועל, שם תואר או תואר פועל אחר<br>
    דוגמאות: <em>quickly, very, well, often, yesterday</em></li>

    <li><strong>6. Preposition (מילת יחס):</strong> מילה המראה יחס בין מילים במשפט<br>
    דוגמאות: <em>in, on, at, by, with, from, to</em></li>

    <li><strong>7. Conjunction (מילת חיבור):</strong> מילה המחברת בין מילים, צירופים או משפטים<br>
    דוגמאות: <em>and, but, or, because, so, although</em></li>

    <li><strong>8. Interjection (מילת קריאה):</strong> מילה המבטאת רגש<br>
    דוגמאות: <em>wow!, ouch!, oh!, hey!, oops!</em></li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות במשפט:</h3>
  <p><strong>The happy boy quickly ran to the park.</strong></p>
  <ul>
    <li><em>The</em> - Article (מאמר)</li>
    <li><em>happy</em> - Adjective (שם תואר)</li>
    <li><em>boy</em> - Noun (שם עצם)</li>
    <li><em>quickly</em> - Adverb (תואר פועל)</li>
    <li><em>ran</em> - Verb (פועל)</li>
    <li><em>to</em> - Preposition (מילת יחס)</li>
    <li><em>the</em> - Article (מאמר)</li>
    <li><em>park</em> - Noun (שם עצם)</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> הבנת חלקי הדיבור היא הבסיס לבניית משפטים נכונים באנגלית!
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "book"?',
        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
        correctAnswer: 'Noun',
        explanationHe: 'תשובה נכונה: Noun. "book" הוא שם עצם המציין דבר (ספר).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "run"?',
        options: ['Noun', 'Verb', 'Adjective', 'Preposition'],
        correctAnswer: 'Verb',
        explanationHe: 'תשובה נכונה: Verb. "run" הוא פועל המתאר פעולה של ריצה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "happy"?',
        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
        correctAnswer: 'Adjective',
        explanationHe: 'תשובה נכונה: Adjective. "happy" הוא שם תואר המתאר רגש של שמחה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'המילה "quickly" היא _______ (תואר הפועל/שם תואר)',
        correctAnswer: 'תואר הפועל',
        explanationHe: 'תשובה נכונה: תואר הפועל (Adverb). "quickly" מתארת איך מתבצעת הפעולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "in"?',
        options: ['Preposition', 'Pronoun', 'Conjunction', 'Verb'],
        correctAnswer: 'Preposition',
        explanationHe: 'תשובה נכונה: Preposition. "in" היא מילת יחס המראה מיקום.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "and"?',
        options: ['Conjunction', 'Preposition', 'Adjective', 'Noun'],
        correctAnswer: 'Conjunction',
        explanationHe: 'תשובה נכונה: Conjunction. "and" היא מילת חיבור המחברת בין מילים או משפטים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'המילה "I" היא _______ (כינוי/שם עצם)',
        correctAnswer: 'כינוי',
        explanationHe: 'תשובה נכונה: כינוי (Pronoun). "I" הוא כינוי גוף המחליף את שם האדם המדבר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'מהו חלק הדיבור של המילה "wow"?',
        options: ['Interjection', 'Verb', 'Noun', 'Adverb'],
        correctAnswer: 'Interjection',
        explanationHe: 'תשובה נכונה: Interjection. "wow" היא מילת קריאה המבטאת הפתעה או התפעלות.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The cat sleeps quietly", מהו חלק הדיבור של "quietly"?',
        options: ['Adverb', 'Adjective', 'Verb', 'Noun'],
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "quietly" מתאר את הפועל "sleeps" - איך החתול ישן.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "She is beautiful", המילה "beautiful" היא _______ (Adjective/Adverb)',
        correctAnswer: 'Adjective',
        explanationHe: 'תשובה נכונה: Adjective. "beautiful" מתאר את "she" (שם עצם/כינוי), ולכן זה שם תואר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "I went to school", מהו חלק הדיבור של "to"?',
        options: ['Preposition', 'Verb', 'Conjunction', 'Adverb'],
        correctAnswer: 'Preposition',
        explanationHe: 'תשובה נכונה: Preposition. "to" היא מילת יחס המראה כיוון.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Tom and Mary are friends", המילה "and" היא _______ (Conjunction/Preposition)',
        correctAnswer: 'Conjunction',
        explanationHe: 'תשובה נכונה: Conjunction. "and" מחברת בין שני שמות העצם "Tom" ו-"Mary".',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "They play football", מהו חלק הדיבור של "They"?',
        options: ['Pronoun', 'Noun', 'Verb', 'Adjective'],
        correctAnswer: 'Pronoun',
        explanationHe: 'תשובה נכונה: Pronoun. "They" הוא כינוי גוף המחליף קבוצה של אנשים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I am very tired", המילה "very" היא _______ (Adverb/Adjective)',
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "very" מתאר את שם התואר "tired" - עד כמה עייף.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Ouch! That hurts!", מהו חלק הדיבור של "Ouch"?',
        options: ['Interjection', 'Verb', 'Noun', 'Adjective'],
        correctAnswer: 'Interjection',
        explanationHe: 'תשובה נכונה: Interjection. "Ouch" היא מילת קריאה המבטאת כאב.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "She sings beautifully", המילה "beautifully" היא _______ (Adverb/Adjective)',
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "beautifully" מתאר את הפועל "sings" - איך היא שרה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "I like apples but not oranges", מהו חלק הדיבור של "but"?',
        options: ['Conjunction', 'Preposition', 'Adverb', 'Verb'],
        correctAnswer: 'Conjunction',
        explanationHe: 'תשובה נכונה: Conjunction. "but" היא מילת חיבור המראה ניגוד בין שני חלקי המשפט.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The red car is fast", המילה "red" היא _______ (Adjective/Noun)',
        correctAnswer: 'Adjective',
        explanationHe: 'תשובה נכונה: Adjective. "red" מתאר את שם העצם "car" - איזה צבע המכונית.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The book on the table is mine", מהו חלק הדיבור של "on"?',
        options: ['Preposition', 'Conjunction', 'Adverb', 'Adjective'],
        correctAnswer: 'Preposition',
        explanationHe: 'תשובה נכונה: Preposition. "on" היא מילת יחס המראה את מיקום הספר ביחס לשולחן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I will go because I want to", המילה "because" היא _______ (Conjunction/Preposition)',
        correctAnswer: 'Conjunction',
        explanationHe: 'תשובה נכונה: Conjunction. "because" היא מילת חיבור המראה סיבה ומחברת בין שני משפטים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "She runs faster than him", מהו חלק הדיבור של "faster"?',
        options: ['Adverb', 'Adjective', 'Verb', 'Noun'],
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "faster" מתאר את הפועל "runs" ומשווה בין שני אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Wow! This is amazing!", המילה "amazing" היא _______ (Adjective/Interjection)',
        correctAnswer: 'Adjective',
        explanationHe: 'תשובה נכונה: Adjective. "amazing" מתאר את "this". "Wow" היא ה-Interjection במשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "I can swim well", מהו חלק הדיבור של "well"?',
        options: ['Adverb', 'Adjective', 'Verb', 'Noun'],
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "well" מתאר את הפועל "swim" - עד כמה טוב אני שוחה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "He is extremely tall", המילה "extremely" היא _______ (Adverb/Adjective)',
        correctAnswer: 'Adverb',
        explanationHe: 'תשובה נכונה: Adverb. "extremely" מתאר את שם התואר "tall" - עד כמה גבוה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Reading is fun", מהו חלק הדיבור של "Reading"?',
        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
        correctAnswer: 'Noun',
        explanationHe: 'תשובה נכונה: Noun. "Reading" כאן הוא gerund (שם פעולה) ומתפקד כשם עצם - הנושא של המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "This is my book", המילה "This" היא _______ (Pronoun/Adjective)',
        correctAnswer: 'Pronoun',
        explanationHe: 'תשובה נכונה: Pronoun. "This" הוא demonstrative pronoun (כינוי הצבעה) ומתפקד כנושא המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "She looks good", מהו חלק הדיבור של "good"?',
        options: ['Adjective', 'Adverb', 'Verb', 'Noun'],
        correctAnswer: 'Adjective',
        explanationHe: 'תשובה נכונה: Adjective. אחרי "look" (במשמעות להיראות) משתמשים בשם תואר, לא תואר פועל. "good" מתאר את "She".',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I go to school by bus", המילה "by" היא _______ (Preposition/Adverb)',
        correctAnswer: 'Preposition',
        explanationHe: 'תשובה נכונה: Preposition. "by" היא מילת יחס המראה אמצעי תחבורה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The children played happily", כמה שמות תואר יש במשפט?',
        options: ['0', '1', '2', '3'],
        correctAnswer: '0',
        explanationHe: 'תשובה נכונה: 0. "happily" הוא תואר פועל (Adverb), לא שם תואר. אין שמות תואר במשפט זה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Although it rained, we went out", המילה "Although" היא _______ (Conjunction/Preposition)',
        correctAnswer: 'Conjunction',
        explanationHe: 'תשובה נכונה: Conjunction. "Although" היא מילת חיבור (subordinating conjunction) המראה ניגוד.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.2: Sentence Structure ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.2',
    titleEn: 'Sentence Structure',
    titleHe: 'מבנה המשפט',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>מבנה המשפט הבסיסי (Sentence Structure)</h2>

<p>משפט הוא קבוצה של מילים המביעה מחשבה שלמה. כל משפט חייב להכיל לפחות נושא (Subject) ופועל (Verb).</p>

<div class="rules">
  <h3>המבנה הבסיסי של משפט באנגלית:</h3>
  <p><strong>Subject + Verb + Object (SVO)</strong></p>
  <ul>
    <li><strong>Subject (נושא):</strong> מי או מה שמבצע את הפעולה<br>
    דוגמה: <em>The cat</em> sleeps.</li>

    <li><strong>Verb (פועל):</strong> הפעולה או המצב<br>
    דוגמה: The cat <em>sleeps</em>.</li>

    <li><strong>Object (מושא):</strong> מי או מה שמקבל את הפעולה<br>
    דוגמה: I eat <em>an apple</em>.</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות למשפטים מלאים:</h3>
  <p><strong>1. Subject + Verb</strong> (משפט פשוט)</p>
  <ul>
    <li>Birds <strong>fly</strong>. - ציפורים עפות</li>
    <li>She <strong>sings</strong>. - היא שרה</li>
  </ul>

  <p><strong>2. Subject + Verb + Object</strong> (משפט עם מושא)</p>
  <ul>
    <li>I <strong>love</strong> <em>pizza</em>. - אני אוהב פיצה</li>
    <li>Tom <strong>reads</strong> <em>books</em>. - טום קורא ספרים</li>
  </ul>

  <p><strong>3. Subject + Verb + Complement</strong> (עם תוספת)</p>
  <ul>
    <li>She <strong>is</strong> <em>a teacher</em>. - היא מורה</li>
    <li>The house <strong>looks</strong> <em>beautiful</em>. - הבית נראה יפה</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> סדר המילים באנגלית חשוב מאוד! הסדר הנכון הוא: נושא → פועל → מושא
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מהו הסדר הנכון של משפט באנגלית?',
        options: ['Subject + Verb + Object', 'Verb + Subject + Object', 'Object + Subject + Verb', 'Subject + Object + Verb'],
        correctAnswer: 'Subject + Verb + Object',
        explanationHe: 'תשובה נכונה: Subject + Verb + Object. זהו הסדר הבסיסי של משפט באנגלית (SVO).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The dog barks", המילה "The dog" היא ה_______ (נושא/פועל)',
        correctAnswer: 'נושא',
        explanationHe: 'תשובה נכונה: נושא (Subject). "The dog" הוא מי שמבצע את הפעולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מהו הפועל במשפט "She eats breakfast"?',
        options: ['She', 'eats', 'breakfast', 'She eats'],
        correctAnswer: 'eats',
        explanationHe: 'תשובה נכונה: eats. זוהי הפעולה במשפט - מה שהנושא עושה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I read a book", המילה "a book" היא ה_______ (נושא/מושא)',
        correctAnswer: 'מושא',
        explanationHe: 'תשובה נכונה: מושא (Object). "a book" הוא מה שמקבל את הפעולה של הקריאה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהמשפטים הבאים נכון?',
        options: ['I pizza eat', 'Pizza I eat', 'I eat pizza', 'Eat I pizza'],
        correctAnswer: 'I eat pizza',
        explanationHe: 'תשובה נכונה: I eat pizza. הסדר הנכון: נושא (I) + פועל (eat) + מושא (pizza).',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'משפט חייב להכיל לפחות _______ ופועל (נושא/מושא)',
        correctAnswer: 'נושא',
        explanationHe: 'תשובה נכונה: נושא. כל משפט מלא חייב להכיל לפחות נושא ופועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מהו המושא במשפט "They play football"?',
        options: ['They', 'play', 'football', 'They play'],
        correctAnswer: 'football',
        explanationHe: 'תשובה נכונה: football. המושא הוא מה שמקבל את הפעולה - מה הם משחקים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Birds fly", האם יש מושא? (כן/לא)',
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. זהו משפט פשוט עם רק נושא (Birds) ופועל (fly), ללא מושא.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה חלק חסר במשפט "The beautiful flowers"?',
        options: ['Subject', 'Verb', 'Object', 'Adjective'],
        correctAnswer: 'Verb',
        explanationHe: 'תשובה נכונה: Verb. יש נושא (flowers) אבל אין פועל, לכן זה לא משפט מלא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'סדר את המילים למשפט נכון: "homework / does / She / her" ← _______',
        correctAnswer: 'She does her homework',
        explanationHe: 'תשובה נכונה: She does her homework. הסדר: נושא (She) + פועל (does) + מושא (her homework).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "My brother plays the guitar", מהו הנושא המלא?',
        options: ['My', 'brother', 'My brother', 'brother plays'],
        correctAnswer: 'My brother',
        explanationHe: 'תשובה נכונה: My brother. הנושא כולל את שם העצם ואת המילה המתארת אותו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "She is a doctor", המילה "a doctor" היא _______ (Object/Complement)',
        correctAnswer: 'Complement',
        explanationHe: 'תשובה נכונה: Complement. אחרי הפועל "to be" באה תוספת (complement) שמשלימה את המשפט, לא מושא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט בנוי נכון?',
        options: ['Quickly runs he', 'He runs quickly', 'Runs he quickly', 'He quickly runs'],
        correctAnswer: 'He runs quickly',
        explanationHe: 'תשובה נכונה: He runs quickly. הסדר: נושא (He) + פועל (runs) + תואר פועל (quickly).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'סדר את המילים: "a book / reading / am / I" ← _______',
        correctAnswer: 'I am reading a book',
        explanationHe: 'תשובה נכונה: I am reading a book. הסדר: נושא (I) + פועל (am reading) + מושא (a book).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The cat sleeps on the sofa", מהו הפועל?',
        options: ['The cat', 'sleeps', 'on', 'the sofa'],
        correctAnswer: 'sleeps',
        explanationHe: 'תשובה נכונה: sleeps. זוהי הפעולה שהנושא (The cat) מבצע.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'האם "In the park" משפט מלא? (כן/לא)',
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. זה צירוף מילים (phrase), לא משפט. חסר נושא ופועל.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['Birds fly', 'The sun shines', 'My friend', 'I love pizza'],
        correctAnswer: 'My friend',
        explanationHe: 'תשובה נכונה: My friend. זה לא משפט מלא - יש רק נושא, חסר פועל.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Tom and Sarah play tennis", הנושא הוא _______ (Tom/Tom and Sarah)',
        correctAnswer: 'Tom and Sarah',
        explanationHe: 'תשובה נכונה: Tom and Sarah. שני השמות ביחד יוצרים את הנושא המלא של המשפט.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "My sister gave me a present", מהו המושא הישיר (Direct Object)?',
        options: ['My sister', 'me', 'a present', 'gave'],
        correctAnswer: 'a present',
        explanationHe: 'תשובה נכונה: a present. המושא הישיר הוא מה שניתן. "me" הוא מושא עקיף (Indirect Object).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The teacher gave the students homework", המושא העקיף הוא _______ (the students/homework)',
        correctAnswer: 'the students',
        explanationHe: 'תשובה נכונה: the students. המושא העקיף הוא למי ניתן משהו. "homework" הוא המושא הישיר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Running is healthy", מהו הנושא?',
        options: ['Running', 'is', 'healthy', 'is healthy'],
        correctAnswer: 'Running',
        explanationHe: 'תשובה נכונה: Running. זהו gerund (שם פעולה) המתפקד כנושא המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'סדר את המילים למשפט: "early / gets up / every day / She" ← _______',
        correctAnswer: 'She gets up early every day',
        explanationHe: 'תשובה נכונה: She gets up early every day. נושא + פועל + תואר פועל + ביטוי זמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "There are many books on the shelf", מהו הנושא האמיתי?',
        options: ['There', 'many books', 'the shelf', 'There are'],
        correctAnswer: 'many books',
        explanationHe: 'תשובה נכונה: many books. במבנה "There is/are", הנושא האמיתי בא אחרי הפועל. "There" הוא dummy subject.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "What she said was interesting", ה-subject clause הוא _______ (What she said/was interesting)',
        correctAnswer: 'What she said',
        explanationHe: 'תשובה נכונה: What she said. זהו subject clause (משפט נושא) - משפט שלם המתפקד כנושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מכיל Compound Subject (נושא מורכב)?',
        options: ['She and I are friends', 'She is my friend', 'I have many friends', 'My friend lives here'],
        correctAnswer: 'She and I are friends',
        explanationHe: 'תשובה נכונה: She and I are friends. "She and I" הוא נושא מורכב - שני נושאים מחוברים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "To learn English is important", הנושא הוא _______ (To learn English/English)',
        correctAnswer: 'To learn English',
        explanationHe: 'תשובה נכונה: To learn English. infinitive phrase (צירוף פועל שם) מתפקד כנושא המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The book that I bought is interesting", מהו הנושא העיקרי?',
        options: ['The book', 'that I bought', 'I', 'The book that I bought'],
        correctAnswer: 'The book',
        explanationHe: 'תשובה נכונה: The book. זהו הנושא העיקרי. "that I bought" הוא relative clause המתאר את הספר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "My car needs washing", המילה "washing" היא _______ (Gerund/Present Participle)',
        correctAnswer: 'Gerund',
        explanationHe: 'תשובה נכונה: Gerund. "washing" מתפקד כמושא של הפועל "needs" (שם פעולה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מכיל Compound Verb (פועל מורכב)?',
        options: ['I can swim', 'I swim fast', 'I love swimming', 'Swimming is fun'],
        correctAnswer: 'I can swim',
        explanationHe: 'תשובה נכונה: I can swim. "can swim" הוא פועל מורכב (modal + main verb).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "It is important to study", מהו ה-real subject? _______ (It/to study)',
        correctAnswer: 'to study',
        explanationHe: 'תשובה נכונה: to study. "It" הוא dummy subject. הנושא האמיתי הוא "to study".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.3: Types of Sentences ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.3',
    titleEn: 'Types of Sentences',
    titleHe: 'סוגי משפטים',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>סוגי משפטים (Types of Sentences)</h2>

<p>קיימים ארבעה סוגים עיקריים של משפטים באנגלית, כל אחד משרת מטרה שונה.</p>

<div class="rules">
  <h3>ארבעה סוגי משפטים:</h3>
  <ul>
    <li><strong>1. Declarative Sentence (משפט חיווי):</strong><br>
    משפט המצהיר על עובדה או דעה ומסתיים בנקודה (.)<br>
    דוגמה: <em>I like pizza.</em> - אני אוהב פיצה</li>

    <li><strong>2. Interrogative Sentence (משפט שאלה):</strong><br>
    משפט השואל שאלה ומסתיים בסימן שאלה (?)<br>
    דוגמה: <em>Do you like pizza?</em> - אתה אוהב פיצה?</li>

    <li><strong>3. Imperative Sentence (משפט ציווי):</strong><br>
    משפט המצווה, מורה או מבקש משהו. הנושא מושמט.<br>
    דוגמה: <em>Close the door.</em> - סגור את הדלת</li>

    <li><strong>4. Exclamatory Sentence (משפט קריאה):</strong><br>
    משפט המביע רגש חזק ומסתיים בסימן קריאה (!)<br>
    דוגמה: <em>What a beautiful day!</em> - איזה יום יפה!</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות נוספות:</h3>
  <p><strong>Declarative:</strong></p>
  <ul>
    <li>The sky is blue. - השמיים כחולים</li>
    <li>She lives in London. - היא גרה בלונדון</li>
  </ul>

  <p><strong>Interrogative:</strong></p>
  <ul>
    <li>Where do you live? - איפה אתה גר?</li>
    <li>Is she your sister? - היא אחותך?</li>
  </ul>

  <p><strong>Imperative:</strong></p>
  <ul>
    <li>Please sit down. - בבקשה שב</li>
    <li>Don't touch that! - אל תיגע בזה!</li>
  </ul>

  <p><strong>Exclamatory:</strong></p>
  <ul>
    <li>How amazing! - כמה מדהים!</li>
    <li>That's incredible! - זה מדהים!</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> סימן הפיסוק בסוף המשפט עוזר לזהות את סוג המשפט!
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה סוג משפט הוא "I love reading"?',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Declarative',
        explanationHe: 'תשובה נכונה: Declarative. משפט המצהיר עובדה ומסתיים בנקודה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'משפט השואל שאלה נקרא _______ sentence (Interrogative/Declarative)',
        correctAnswer: 'Interrogative',
        explanationHe: 'תשובה נכונה: Interrogative. משפט שאלה מסתיים בסימן שאלה (?).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'באיזה סימן פיסוק מסתיים Imperative Sentence?',
        options: ['.', '?', '!', ','],
        correctAnswer: '.',
        explanationHe: 'תשובה נכונה: נקודה (.). משפט ציווי רגיל מסתיים בנקודה. (אלא אם יש רגש חזק - אז !)',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'משפט "Close the window" הוא משפט _______ (ציווי/שאלה)',
        correctAnswer: 'ציווי',
        explanationHe: 'תשובה נכונה: ציווי (Imperative). המשפט מצווה לעשות משהו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט הוא Exclamatory?',
        options: ['I am happy', 'Are you happy?', 'How happy I am!', 'Be happy'],
        correctAnswer: 'How happy I am!',
        explanationHe: 'תשובה נכונה: How happy I am! משפט קריאה המביע רגש ומסתיים בסימן קריאה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Do you like coffee?" הוא משפט _______ (שאלה/חיווי)',
        correctAnswer: 'שאלה',
        explanationHe: 'תשובה נכונה: שאלה (Interrogative). המשפט שואל שאלה ומסתיים ב-?',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מהו סוג המשפט: "The cat is sleeping."',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Declarative',
        explanationHe: 'תשובה נכונה: Declarative. משפט המצהיר עובדה על החתול.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'משפט המביע רגש חזק נקרא _______ sentence (Exclamatory/Declarative)',
        correctAnswer: 'Exclamatory',
        explanationHe: 'תשובה נכונה: Exclamatory. משפט קריאה מסתיים בסימן קריאה (!).',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מהו סוג המשפט: "Please help me."',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Imperative',
        explanationHe: 'תשובה נכונה: Imperative. משפט המבקש משהו (אף שמנומס עם "please").',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "What a wonderful surprise!" הוא משפט _______ (קריאה/חיווי)',
        correctAnswer: 'קריאה',
        explanationHe: 'תשובה נכונה: קריאה (Exclamatory). מביע הפתעה ושמחה עם סימן קריאה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט הוא Interrogative?',
        options: ['She is coming', 'Is she coming?', 'Come here!', 'What a nice dress!'],
        correctAnswer: 'Is she coming?',
        explanationHe: 'תשובה נכונה: Is she coming? זהו משפט שאלה עם סימן שאלה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Don\'t run in the hallway" הוא משפט _______ שלילי (ציווי/שאלה)',
        correctAnswer: 'ציווי',
        explanationHe: 'תשובה נכונה: ציווי (Imperative). מצווה לא לעשות משהו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מהו סוג המשפט: "How beautiful this flower is!"',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Exclamatory',
        explanationHe: 'תשובה נכונה: Exclamatory. משפט המביע התפעלות מהפרח.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט Imperative, הנושא בדרך כלל _______ (מוזכר/מושמט)',
        correctAnswer: 'מושמט',
        explanationHe: 'תשובה נכונה: מושמט. במשפט ציווי, הנושא (You) בדרך כלל לא מופיע.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה סוג משפט מסתיים תמיד בסימן שאלה?',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Interrogative',
        explanationHe: 'תשובה נכונה: Interrogative. רק משפטי שאלה מסתיימים בסימן שאלה (?).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Where are you going?" הוא משפט _______ (שאלה/חיווי)',
        correctAnswer: 'שאלה',
        explanationHe: 'תשובה נכונה: שאלה (Interrogative). שאלה עם מילת שאלה "Where".',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'מהו סוג המשפט: "Let\'s go to the park."',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Imperative',
        explanationHe: 'תשובה נכונה: Imperative. זוהי הצעה בצורת ציווי (Let\'s = suggestion).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "My dog loves to play" הוא משפט _______ (חיווי/ציווי)',
        correctAnswer: 'חיווי',
        explanationHe: 'תשובה נכונה: חיווי (Declarative). מצהיר עובדה על הכלב.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'המשפט "If only I could fly!" הוא משפט:',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Exclamatory',
        explanationHe: 'תשובה נכונה: Exclamatory. מביע משאלה עם רגש חזק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "You will study hard." הוא Declarative, אבל אם נגיד "Study hard!" זה _______ (Imperative/Interrogative)',
        correctAnswer: 'Imperative',
        explanationHe: 'תשובה נכונה: Imperative. הסרת הנושא והוספת סימן קריאה הופכת את זה לציווי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט אינו Imperative?',
        options: ['Open the door', 'Let me help you', 'Please be quiet', 'You should be quiet'],
        correctAnswer: 'You should be quiet',
        explanationHe: 'תשובה נכונה: You should be quiet. זהו Declarative - יש נושא מפורש (You).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Aren\'t you coming?" הוא שאלה _______ (חיובית/שלילית)',
        correctAnswer: 'שלילית',
        explanationHe: 'תשובה נכונה: שלילית. זוהי negative question (שאלה שלילית) - Interrogative.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'המשפט "What did he say?" הוא:',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Interrogative',
        explanationHe: 'תשובה נכונה: Interrogative. שאלה עקיפה שעדיין מסתיימת בסימן שאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Be kind to others" הוא Imperative עם הפועל _______ (be/is)',
        correctAnswer: 'be',
        explanationHe: 'תשובה נכונה: be. ציווי עם הפועל "to be" משתמש ב-base form (be).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט הוא גם Declarative וגם Exclamatory?',
        options: ['I love this!', 'I love this.', 'Do I love this?', 'Love this!'],
        correctAnswer: 'I love this!',
        explanationHe: 'תשובה נכונה: I love this! יכול להיחשב Exclamatory בגלל סימן הקריאה והרגש.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Tag question כמו "You like it, don\'t you?" הוא סוג של משפט _______ (Interrogative/Declarative)',
        correctAnswer: 'Interrogative',
        explanationHe: 'תשובה נכונה: Interrogative. Tag question הוא סוג של שאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'המשפט "How I wish I were there!" הוא:',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 'Exclamatory',
        explanationHe: 'תשובה נכונה: Exclamatory. מביע משאלה עם רגש חזק, למרות שמתחיל ב-How.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Never give up!" הוא Imperative _______ (חיובי/שלילי)',
        correctAnswer: 'שלילי',
        explanationHe: 'תשובה נכונה: שלילי. "Never" הופך את הציווי לשלילי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט יכול להיות גם Declarative בהקשר אחד וגם Imperative בהקשר אחר?',
        options: ['You go now.', 'Where are you?', 'How nice!', 'I am happy'],
        correctAnswer: 'You go now.',
        explanationHe: 'תשובה נכונה: You go now. יכול להיות Declarative (תצהיר) או Imperative (ציווי) לפי טון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "What beautiful eyes you have!" הוא _______ (Exclamatory/Interrogative)',
        correctAnswer: 'Exclamatory',
        explanationHe: 'תשובה נכונה: Exclamatory. למרות ש-What מופיע, זה לא שאלה אלא קריאת התפעלות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.4: Subject and Predicate ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.4',
    titleEn: 'Subject and Predicate',
    titleHe: 'נושא ונשוא',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>נושא ונשוא (Subject and Predicate)</h2>

<p>כל משפט מורכב משני חלקים עיקריים: הנושא (Subject) והנשוא (Predicate).</p>

<div class="rules">
  <h3>הנושא (Subject):</h3>
  <ul>
    <li>מי או מה שהמשפט עוסק בו</li>
    <li>מי או מה שמבצע את הפעולה</li>
    <li>בדרך כלל בא בתחילת המשפט</li>
    <li>יכול להיות שם עצם, כינוי, או צירוף שם עצם</li>
  </ul>

  <h3>הנשוא (Predicate):</h3>
  <ul>
    <li>מספר מה הנושא עושה או מה מצבו</li>
    <li>תמיד כולל את הפועל</li>
    <li>כולל את הפועל וכל המילים שבאות אחריו</li>
    <li>מספק מידע על הנושא</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p><strong>1. משפט פשוט:</strong></p>
  <p><span style="color:blue">The dog</span> <span style="color:green">barks</span>.</p>
  <ul>
    <li>Subject: The dog (הכלב)</li>
    <li>Predicate: barks (נובח)</li>
  </ul>

  <p><strong>2. משפט ארוך יותר:</strong></p>
  <p><span style="color:blue">My best friend</span> <span style="color:green">lives in London</span>.</p>
  <ul>
    <li>Subject: My best friend (החבר הכי טוב שלי)</li>
    <li>Predicate: lives in London (גר בלונדון)</li>
  </ul>

  <p><strong>3. נושא מורכב:</strong></p>
  <p><span style="color:blue">Tom and Sarah</span> <span style="color:green">play tennis every weekend</span>.</p>
  <ul>
    <li>Compound Subject: Tom and Sarah</li>
    <li>Predicate: play tennis every weekend</li>
  </ul>

  <p><strong>4. נשוא מורכב:</strong></p>
  <p><span style="color:blue">She</span> <span style="color:green">sings and dances beautifully</span>.</p>
  <ul>
    <li>Subject: She</li>
    <li>Compound Predicate: sings and dances beautifully</li>
  </ul>
</div>

<div class="warning">
  <strong>טיפ:</strong> כדי למצוא את הנושא, שאל "מי?" או "מה?" לפני הפועל.
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מהו הנושא במשפט "The cat sleeps"?',
        options: ['The', 'cat', 'The cat', 'sleeps'],
        correctAnswer: 'The cat',
        explanationHe: 'תשובה נכונה: The cat. הנושא כולל את המאמר ואת שם העצם.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Birds fly", הנשוא הוא _______ (Birds/fly)',
        correctAnswer: 'fly',
        explanationHe: 'תשובה נכונה: fly. הנשוא כולל את הפועל וכל המילים שאחריו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מהו הפועל במשפט "She reads books"?',
        options: ['She', 'reads', 'books', 'reads books'],
        correctAnswer: 'reads',
        explanationHe: 'תשובה נכונה: reads. הפועל הוא תמיד חלק מהנשוא.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I love pizza", הנושא הוא _______ (I/love)',
        correctAnswer: 'I',
        explanationHe: 'תשובה נכונה: I. הכינוי "I" הוא הנושא - מי שמבצע את הפעולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'מהו הנשוא במשפט "The sun shines"?',
        options: ['The sun', 'sun', 'shines', 'The'],
        correctAnswer: 'shines',
        explanationHe: 'תשובה נכונה: shines. הנשוא מספר מה הנושא עושה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'כדי למצוא את הנושא, שואלים _______ לפני הפועל (מי/איך)',
        correctAnswer: 'מי',
        explanationHe: 'תשובה נכונה: מי. שואלים "מי?" או "מה?" לפני הפועל כדי למצוא את הנושא.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "My brother plays football", מהו הנושא המלא?',
        options: ['My', 'brother', 'My brother', 'plays'],
        correctAnswer: 'My brother',
        explanationHe: 'תשובה נכונה: My brother. הנושא המלא כולל את כל המילים המתארות את מי שמבצע את הפעולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'הנשוא תמיד כולל את ה_______ (נושא/פועל)',
        correctAnswer: 'פועל',
        explanationHe: 'תשובה נכונה: פועל. הנשוא (Predicate) תמיד כולל את הפועל.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The little girl sings beautifully", מהו הנושא?',
        options: ['The', 'girl', 'The little girl', 'little girl'],
        correctAnswer: 'The little girl',
        explanationHe: 'תשובה נכונה: The little girl. הנושא המלא כולל את כל המילים שמתארות את הילדה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "She runs fast every morning", הנשוא המלא הוא _______ (runs/runs fast every morning)',
        correctAnswer: 'runs fast every morning',
        explanationHe: 'תשובה נכונה: runs fast every morning. הנשוא כולל את הפועל וכל המילים שאחריו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Tom and Sarah are friends", מהו סוג הנושא?',
        options: ['Simple Subject', 'Compound Subject', 'Complete Subject', 'Complex Subject'],
        correctAnswer: 'Compound Subject',
        explanationHe: 'תשובה נכונה: Compound Subject. נושא מורכב משני שמות עצם מחוברים ב-and.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The books on the table are mine", הנושא הפשוט (Simple Subject) הוא _______ (The books/books)',
        correctAnswer: 'books',
        explanationHe: 'תשובה נכונה: books. הנושא הפשוט הוא רק שם העצם המרכזי, ללא תוספות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "She sings and dances", מהו סוג הנשוא?',
        options: ['Simple Predicate', 'Compound Predicate', 'Complete Predicate', 'Complex Predicate'],
        correctAnswer: 'Compound Predicate',
        explanationHe: 'תשובה נכונה: Compound Predicate. נשוא מורכב משני פעלים מחוברים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "My best friend lives in London", הנושא המלא (Complete Subject) הוא _______ (friend/My best friend)',
        correctAnswer: 'My best friend',
        explanationHe: 'תשובה נכונה: My best friend. הנושא המלא כולל את כל המילים שמתארות את הנושא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Running is healthy", מהו הנושא?',
        options: ['Running', 'is', 'healthy', 'is healthy'],
        correctAnswer: 'Running',
        explanationHe: 'תשובה נכונה: Running. gerund (שם פעולה) יכול לשמש כנושא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The cat and the dog play together", יש נושא _______ (פשוט/מורכב)',
        correctAnswer: 'מורכב',
        explanationHe: 'תשובה נכונה: מורכב. "The cat and the dog" הוא Compound Subject.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "There are many books on the shelf", מהו הנושא האמיתי?',
        options: ['There', 'many books', 'the shelf', 'There are'],
        correctAnswer: 'many books',
        explanationHe: 'תשובה נכונה: many books. במבנה "There is/are", הנושא בא אחרי הפועל.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "She studies hard and gets good grades", הנשוא הוא _______ (מורכב/פשוט)',
        correctAnswer: 'מורכב',
        explanationHe: 'תשובה נכונה: מורכב. יש שני פעלים מחוברים: "studies" ו-"gets".',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "To learn English is important", מהו הנושא?',
        options: ['To learn', 'English', 'To learn English', 'is important'],
        correctAnswer: 'To learn English',
        explanationHe: 'תשובה נכונה: To learn English. infinitive phrase יכול לשמש כנושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "What she said was interesting", ה-subject clause הוא _______ (What she said/was interesting)',
        correctAnswer: 'What she said',
        explanationHe: 'תשובה נכונה: What she said. זהו noun clause המתפקד כנושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The book that I bought is interesting", מהו הנושא הפשוט (Simple Subject)?',
        options: ['The book', 'book', 'I', 'The book that I bought'],
        correctAnswer: 'book',
        explanationHe: 'תשובה נכונה: book. הנושא הפשוט הוא רק שם העצם המרכזי, ללא relative clause.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Here comes the bus", הנושא הוא _______ (Here/the bus)',
        correctAnswer: 'the bus',
        explanationHe: 'תשובה נכונה: the bus. במשפטים שמתחילים ב-Here/There, הנושא בא אחרי הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Neither Tom nor Sarah wants to go", מהו הפועל שמתאים לנושא?',
        options: ['want', 'wants', 'wanting', 'to want'],
        correctAnswer: 'wants',
        explanationHe: 'תשובה נכונה: wants. עם Neither...nor, הפועל מתאים לנושא הקרוב יותר (Sarah = יחיד).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Close the door", הנושא הוא _______ מושמט (You/I)',
        correctAnswer: 'You',
        explanationHe: 'תשובה נכונה: You. במשפט ציווי, הנושא "You" מושמט אבל מובן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "Each of the students has a book", מהו הנושא?',
        options: ['Each', 'students', 'Each of the students', 'the students'],
        correctAnswer: 'Each of the students',
        explanationHe: 'תשובה נכונה: Each of the students. הנושא המלא כולל את כל הביטוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "It is raining", המילה "It" היא נושא _______ (dummy/real)',
        correctAnswer: 'dummy',
        explanationHe: 'תשובה נכונה: dummy. "It" כאן הוא dummy subject שלא מתייחס לדבר ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "My car and my bike are in the garage", איזה סוג נושא יש?',
        options: ['Simple Subject', 'Compound Subject', 'Complex Subject', 'Implied Subject'],
        correctAnswer: 'Compound Subject',
        explanationHe: 'תשובה נכונה: Compound Subject. שני נושאים מחוברים ב-and.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Whoever comes first wins", הנושא הוא _______ (Whoever/Whoever comes first)',
        correctAnswer: 'Whoever comes first',
        explanationHe: 'תשובה נכונה: Whoever comes first. זהו noun clause המתפקד כנושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The man wearing a blue shirt is my teacher", מהו הנושא הפשוט?',
        options: ['The man', 'man', 'wearing a blue shirt', 'The man wearing a blue shirt'],
        correctAnswer: 'man',
        explanationHe: 'תשובה נכונה: man. הנושא הפשוט הוא רק שם העצם המרכזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Swimming and running are good exercises", הנושא הוא _______ (מורכב/פשוט)',
        correctAnswer: 'מורכב',
        explanationHe: 'תשובה נכונה: מורכב. שני gerunds מחוברים ב-and יוצרים Compound Subject.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.5: Capitalization Rules ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.5',
    titleEn: 'Capitalization Rules',
    titleHe: 'כללי אותיות גדולות',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>כללי אותיות גדולות (Capitalization Rules)</h2>

<p>באנגלית יש כללים ברורים מתי להשתמש באותיות גדולות (Capital Letters).</p>

<div class="rules">
  <h3>מתי משתמשים באות גדולה:</h3>
  <ul>
    <li><strong>1. תחילת משפט:</strong> תמיד מתחילים משפט באות גדולה<br>
    <em>The cat is sleeping.</em></li>

    <li><strong>2. הכינוי "I":</strong> תמיד באות גדולה<br>
    <em>I am happy.</em> (לא: i am happy)</li>

    <li><strong>3. שמות עצם פרטיים (Proper Nouns):</strong></li>
    <ul>
      <li>שמות אנשים: <em>Tom, Sarah, Mr. Smith</em></li>
      <li>שמות מקומות: <em>London, Israel, Egypt</em></li>
      <li>שמות חברות: <em>Apple, Google, Microsoft</em></li>
      <li>ימי השבוע: <em>Monday, Tuesday, Wednesday</em></li>
      <li>חודשים: <em>January, February, March</em></li>
      <li>חגים: <em>Christmas, Easter, Hanukkah</em></li>
    </ul>

    <li><strong>4. כותרות:</strong> המילה הראשונה והמילים החשובות<br>
    <em>The Lord of the Rings</em></li>

    <li><strong>5. שפות ולאומים:</strong><br>
    <em>English, Hebrew, French, American</em></li>

    <li><strong>6. תארי כבוד:</strong> לפני שם<br>
    <em>Dr. Brown, President Biden, Queen Elizabeth</em></li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p>✅ <strong>נכון:</strong> I live in Tel Aviv.</p>
  <p>❌ <strong>שגוי:</strong> i live in tel aviv.</p>

  <p>✅ <strong>נכון:</strong> My teacher, Ms. Johnson, speaks English and French.</p>
  <p>❌ <strong>שגוי:</strong> my teacher, ms. johnson, speaks english and french.</p>
</div>

<div class="warning">
  <strong>שים לב:</strong> עונות השנה (seasons) לא מתחילות באות גדולה: spring, summer, autumn/fall, winter
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים צריך להתחיל באות גדולה?',
        options: ['cat', 'Monday', 'book', 'red'],
        correctAnswer: 'Monday',
        explanationHe: 'תשובה נכונה: Monday. ימי השבוע תמיד מתחילים באות גדולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'הכינוי "I" תמיד נכתב _______ (באות גדולה/באות קטנה)',
        correctAnswer: 'באות גדולה',
        explanationHe: 'תשובה נכונה: באות גדולה. "I" (אני) תמיד נכתב I, לא i.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['i like pizza', 'I like pizza', 'I Like Pizza', 'i Like pizza'],
        correctAnswer: 'I like pizza',
        explanationHe: 'תשובה נכונה: I like pizza. תחילת משפט ו-I תמיד באות גדולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'שמות מדינות כמו "Israel" מתחילים ב_______ (אות גדולה/אות קטנה)',
        correctAnswer: 'אות גדולה',
        explanationHe: 'תשובה נכונה: אות גדולה. שמות מקומות הם Proper Nouns ומתחילים באות גדולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה צריכה להתחיל באות גדולה?',
        options: ['summer', 'January', 'morning', 'yesterday'],
        correctAnswer: 'January',
        explanationHe: 'תשובה נכונה: January. חודשים תמיד מתחילים באות גדולה. עונות השנה לא.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'שמות אנשים כמו "Tom" הם _______ (proper nouns/common nouns)',
        correctAnswer: 'proper nouns',
        explanationHe: 'תשובה נכונה: proper nouns. שמות פרטיים תמיד מתחילים באות גדולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She lives in london', 'she lives in London', 'She lives in London', 'she Lives in london'],
        correctAnswer: 'She lives in London',
        explanationHe: 'תשובה נכונה: She lives in London. תחילת משפט ושם עיר באות גדולה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'המילה הראשונה במשפט תמיד מתחילה ב_______ (אות גדולה/אות קטנה)',
        correctAnswer: 'אות גדולה',
        explanationHe: 'תשובה נכונה: אות גדולה. זהו כלל בסיסי - כל משפט מתחיל באות גדולה.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט כתוב נכון?',
        options: ['I speak english and Hebrew', 'I speak English and hebrew', 'I speak English and Hebrew', 'i speak English and Hebrew'],
        correctAnswer: 'I speak English and Hebrew',
        explanationHe: 'תשובה נכונה: I speak English and Hebrew. "I" ושמות שפות תמיד באות גדולה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'בכותרת "Harry Potter and the Goblet of Fire", המילה _______ לא צריכה אות גדולה (the/Potter)',
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. בכותרות, מילות חיבור קצרות (and, of, the) בדרך כלל באות קטנה אלא אם הן מתחילות את הכותרת.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה צריכה אות גדולה?',
        options: ['winter', 'Tuesday', 'morning', 'yesterday'],
        correctAnswer: 'Tuesday',
        explanationHe: 'תשובה נכונה: Tuesday. ימי שבוע תמיד באות גדולה. עונות שנה, חלקי יום ותיאורי זמן לא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תאר כבוד כמו "Dr." לפני שם תמיד מתחיל ב_______ (אות גדולה/אות קטנה)',
        correctAnswer: 'אות גדולה',
        explanationHe: 'תשובה נכונה: אות גדולה. Dr., Mr., Ms., President - כולם באות גדולה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['My Birthday is in april', 'My birthday is in April', 'my birthday is in april', 'My Birthday is in April'],
        correctAnswer: 'My birthday is in April',
        explanationHe: 'תשובה נכונה: My birthday is in April. תחילת משפט ושם חודש באות גדולה. "birthday" הוא common noun - אות קטנה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'בכותרת ספר, המילה הראשונה _______ מתחילה באות גדולה (תמיד/לפעמים)',
        correctAnswer: 'תמיד',
        explanationHe: 'תשובה נכונה: תמיד. המילה הראשונה בכותרת תמיד באות גדולה, ללא קשר למה היא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט כתוב נכון?',
        options: ['president Biden lives in america', 'President biden lives in America', 'President Biden lives in America', 'president biden lives in america'],
        correctAnswer: 'President Biden lives in America',
        explanationHe: 'תשובה נכונה: President Biden lives in America. תואר כבוד, שם פרטי ושם מדינה - כולם באות גדולה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'שם חג כמו "Christmas" תמיד מתחיל ב_______ (אות גדולה/אות קטנה)',
        correctAnswer: 'אות גדולה',
        explanationHe: 'תשובה נכונה: אות גדולה. חגים הם proper nouns - Christmas, Easter, Hanukkah.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['i love Summer', 'I love summer', 'I Love Summer', 'i Love summer'],
        correctAnswer: 'I love summer',
        explanationHe: 'תשובה נכונה: I love summer. "I" באות גדולה, אבל עונות השנה (summer, winter) באות קטנה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'שם חברה כמו "Google" הוא _______ (proper noun/common noun)',
        correctAnswer: 'proper noun',
        explanationHe: 'תשובה נכונה: proper noun. שמות חברות ומותגים הם שמות עצם פרטיים.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט כתוב נכון לחלוטין?',
        options: ['dr. Smith teaches english at Harvard university', 'Dr. smith teaches English at Harvard University', 'Dr. Smith teaches English at Harvard University', 'Dr. Smith teaches english at harvard university'],
        correctAnswer: 'Dr. Smith teaches English at Harvard University',
        explanationHe: 'תשובה נכונה: Dr. Smith teaches English at Harvard University. תואר, שם, שפה ושם אוניברסיטה - כולם באות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'בכותרת "The Catcher in the Rye", המילה "in" _______ באות קטנה (נשארת/לא נשארת)',
        correctAnswer: 'נשארת',
        explanationHe: 'תשובה נכונה: נשארת. מילות יחס קצרות (in, on, at, of) בכותרות בדרך כלל באות קטנה אלא אם מתחילות את הכותרת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזו אפשרות נכונה?',
        options: ['I am studying french and spanish', 'I am studying French and Spanish', 'I am studying French and spanish', 'i am studying French and Spanish'],
        correctAnswer: 'I am studying French and Spanish',
        explanationHe: 'תשובה נכונה: I am studying French and Spanish. שמות כל השפות תמיד באות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'בביטוי "the Pacific Ocean", המילה "the" _______ באות קטנה (נשארת/לא נשארת)',
        correctAnswer: 'נשארת',
        explanationHe: 'תשובה נכונה: נשארת. "the" בדרך כלל באות קטנה, גם לפני שמות פרטיים. "Pacific Ocean" באותיות גדולות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Next monday is my birthday', 'Next Monday is my Birthday', 'Next Monday is my birthday', 'next Monday is my birthday'],
        correctAnswer: 'Next Monday is my birthday',
        explanationHe: 'תשובה נכונה: Next Monday is my birthday. תחילת משפט ויום שבוע באות גדולה. "birthday" הוא common noun.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'כינוי לאום כמו "American" או "Israeli" תמיד מתחיל ב_______ (אות גדולה/אות קטנה)',
        correctAnswer: 'אות גדולה',
        explanationHe: 'תשובה נכונה: אות גדולה. כינויי לאום נגזרים משמות מקומות ולכן הם Proper Adjectives.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'בכותרת, איזו מילה לא צריכה אות גדולה (אלא אם היא ראשונה)?',
        options: ['Ocean', 'of', 'Dream', 'Story'],
        correctAnswer: 'of',
        explanationHe: 'תשובה נכונה: of. מילות יחס קצרות, מאמרים (a, an, the) ומילות חיבור (and, but, or) בדרך כלל באות קטנה בכותרות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'בביטוי "Queen Elizabeth II", המילה "Queen" היא _______ ולכן באות גדולה (תואר כבוד/common noun)',
        correctAnswer: 'תואר כבוד',
        explanationHe: 'תשובה נכונה: תואר כבוד. כאשר "Queen" מופיע לפני השם, זה תואר כבוד ובאות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['We celebrate Hanukkah in December', 'We celebrate hanukkah in december', 'we celebrate Hanukkah in December', 'We Celebrate Hanukkah In December'],
        correctAnswer: 'We celebrate Hanukkah in December',
        explanationHe: 'תשובה נכונה: We celebrate Hanukkah in December. תחילת משפט, שם חג ושם חודש באות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'בביטוי "the Roman Empire", המילה "Roman" באות גדולה כי זה _______ (proper adjective/common adjective)',
        correctAnswer: 'proper adjective',
        explanationHe: 'תשובה נכונה: proper adjective. שמות תואר הנגזרים משמות פרטיים תמיד באות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי נכון?',
        options: ['the President of the United states', 'the president of the United States', 'The President of the United States', 'the President of The United States'],
        correctAnswer: 'the President of the United States',
        explanationHe: 'תשובה נכונה: the President of the United States. "President" ו-"United States" באות גדולה. "the" ו-"of" קטנות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'בביטוי "Mount Everest", שתי המילים באות גדולה כי זה _______ (proper noun/common noun)',
        correctAnswer: 'proper noun',
        explanationHe: 'תשובה נכונה: proper noun. שם ספציפי של הר הוא שם עצם פרטי - כל המילים באות גדולה.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.6: Punctuation Basics ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.6',
    titleEn: 'Punctuation Basics',
    titleHe: 'יסודות סימני פיסוק',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>יסודות סימני פיסוק (Punctuation Basics)</h2>

<p>סימני פיסוק עוזרים לנו להבין את המשפט נכון ולקרוא אותו בצורה ברורה.</p>

<div class="rules">
  <h3>סימני פיסוק עיקריים:</h3>
  <ul>
    <li><strong>נקודה (Period) - .</strong><br>
    משמשת בסוף משפט חיווי (Declarative)<br>
    דוגמה: <em>I like pizza.</em></li>

    <li><strong>סימן שאלה (Question Mark) - ?</strong><br>
    משמש בסוף משפט שאלה<br>
    דוגמה: <em>Do you like pizza?</em></li>

    <li><strong>סימן קריאה (Exclamation Mark) - !</strong><br>
    משמש בסוף משפט המביע רגש חזק<br>
    דוגמה: <em>What a beautiful day!</em></li>

    <li><strong>פסיק (Comma) - ,</strong><br>
    משמש להפרדה בין מילים או ביטויים ברשימה<br>
    דוגמה: <em>I bought apples, oranges, and bananas.</em></li>

    <li><strong>אפוסטרוף (Apostrophe) - '</strong><br>
    משמש לקיצורים ולשייכות<br>
    דוגמאות: <em>I'm (I am), Sarah's book</em></li>

    <li><strong>גרשיים (Quotation Marks) - " "</strong><br>
    משמשות לציטוט<br>
    דוגמה: <em>She said, "I love you."</em></li>

    <li><strong>נקודתיים (Colon) - :</strong><br>
    משמש להציג רשימה או הסבר<br>
    דוגמה: <em>I need three things: milk, bread, and eggs.</em></li>

    <li><strong>נקודה-פסיק (Semicolon) - ;</strong><br>
    משמש לחיבור שני משפטים קשורים<br>
    דוגמה: <em>I love pizza; my brother loves pasta.</em></li>
  </ul>
</div>

<div class="examples">
  <h3>שימוש בפסיקים:</h3>
  <p><strong>1. ברשימה:</strong> I like apples, oranges, and bananas.</p>
  <p><strong>2. לפני "and"/"but":</strong> I wanted to go, but it was raining.</p>
  <p><strong>3. אחרי מבוא:</strong> After lunch, I went to the park.</p>
  <p><strong>4. כתובת:</strong> She lives in London, England.</p>
</div>

<div class="warning">
  <strong>זכור:</strong> באנגלית, סימני הפיסוק תמיד צמודים למילה שלפניהם, עם רווח אחריהם!
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'באיזה סימן פיסוק מסתיים משפט שאלה?',
        options: ['.', '?', '!', ','],
        correctAnswer: '?',
        explanationHe: 'תשובה נכונה: ?. משפט שאלה תמיד מסתיים בסימן שאלה (Question Mark).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'משפט חיווי רגיל מסתיים ב_______ (נקודה/סימן קריאה)',
        correctAnswer: 'נקודה',
        explanationHe: 'תשובה נכונה: נקודה (Period). משפט חיווי רגיל מסתיים בנקודה (.).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה סימן משמש להפרדה ברשימה?',
        options: ['Period', 'Comma', 'Question Mark', 'Exclamation Mark'],
        correctAnswer: 'Comma',
        explanationHe: 'תשובה נכונה: Comma. פסיק (,) משמש להפרדה בין פריטים ברשימה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'סימן הקריאה (!) משמש למשפטים עם _______ (רגש חזק/שאלה)',
        correctAnswer: 'רגש חזק',
        explanationHe: 'תשובה נכונה: רגש חזק. סימן קריאה מסמן התרגשות, הפתעה, או רגש חזק.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['What time is it?', 'What time is it.', 'What time is it!', 'What time is it'],
        correctAnswer: 'What time is it?',
        explanationHe: 'תשובה נכונה: What time is it? שאלה צריכה להסתיים בסימן שאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'אפוסטרוף (\') משמש ל_______ ולשייכות (קיצורים/רשימות)',
        correctAnswer: 'קיצורים',
        explanationHe: 'תשובה נכונה: קיצורים. אפוסטרוף משמש לקיצורים (I\'m, don\'t) ולשייכות (Tom\'s book).',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I like apples oranges and bananas', 'I like apples, oranges, and bananas', 'I like apples oranges, and bananas', 'I like apples, oranges and, bananas'],
        correctAnswer: 'I like apples, oranges, and bananas',
        explanationHe: 'תשובה נכונה: I like apples, oranges, and bananas. פסיקים מפרידים בין פריטים ברשימה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'גרשיים (" ") משמשות ל_______ (ציטוט/שייכות)',
        correctAnswer: 'ציטוט',
        explanationHe: 'תשובה נכונה: ציטוט. גרשיים משמשות כשמצטטים משהו שמישהו אמר.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש נכון בפסיק?',
        options: ['After lunch I went home', 'After lunch, I went home', 'After, lunch I went home', 'After lunch I, went home'],
        correctAnswer: 'After lunch, I went home',
        explanationHe: 'תשובה נכונה: After lunch, I went home. אחרי ביטוי מבוא (introductory phrase) משתמשים בפסיק.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'בציטוט, הפסיק בא _______ הגרשיים (לפני/אחרי)',
        correctAnswer: 'לפני',
        explanationHe: 'תשובה נכונה: לפני. הפסיק בא לפני סגירת הגרשיים: She said, "I love you."',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I wanted to go but it rained', 'I wanted to go, but it rained', 'I wanted to go but, it rained', 'I wanted, to go but it rained'],
        correctAnswer: 'I wanted to go, but it rained',
        explanationHe: 'תשובה נכונה: I wanted to go, but it rained. לפני מילות חיבור (but, and, or) שמחברות משפטים שמים פסיק.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'כדי להראות שייכות, משתמשים ב_______\'s (אפוסטרוף/גרשיים)',
        correctAnswer: 'אפוסטרוף',
        explanationHe: 'תשובה נכונה: אפוסטרוף. לשייכות: Tom\'s book, Sarah\'s car.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש נכון בנקודתיים?',
        options: ['I need: milk and bread', 'I need three things: milk, bread, and eggs', 'I need three things milk: bread and eggs', 'I: need milk and bread'],
        correctAnswer: 'I need three things: milk, bread, and eggs',
        explanationHe: 'תשובה נכונה: I need three things: milk, bread, and eggs. נקודתיים באים לפני רשימה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'המילה "don\'t" היא קיצור של _______ (do not/does not)',
        correctAnswer: 'do not',
        explanationHe: 'תשובה נכונה: do not. האפוסטרוף מחליף את האות "o".',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['He said "Hello"', 'He said, "Hello."', 'He said "Hello."', 'He said, "Hello"'],
        correctAnswer: 'He said, "Hello."',
        explanationHe: 'תשובה נכונה: He said, "Hello." פסיק לפני הציטוט, נקודה לפני סגירת הגרשיים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'בכתובת "London, England", הפסיק מפריד בין ה_______ והמדינה (עיר/רחוב)',
        correctAnswer: 'עיר',
        explanationHe: 'תשובה נכונה: עיר. בכתובות, פסיק מפריד בין עיר למדינה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה שימוש באפוסטרוף שגוי?',
        options: ["Tom's book", "It's raining", "apple's and orange's", "I'm happy"],
        correctAnswer: "apple's and orange's",
        explanationHe: 'תשובה נכונה: apple\'s and orange\'s (שגוי). רבים רגילים לא צריכים אפוסטרוף - הנכון: apples and oranges.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'סימן פיסוק תמיד _______ למילה שלפניו (צמוד/מרוחק)',
        correctAnswer: 'צמוד',
        explanationHe: 'תשובה נכונה: צמוד. באנגלית, סימני פיסוק צמודים למילה שלפניהם, עם רווח אחריהם.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש נכון בנקודה-פסיק?',
        options: ['I love pizza my brother loves pasta', 'I love pizza; my brother loves pasta', 'I love pizza, my brother loves pasta', 'I love pizza: my brother loves pasta'],
        correctAnswer: 'I love pizza; my brother loves pasta',
        explanationHe: 'תשובה נכונה: I love pizza; my brother loves pasta. נקודה-פסיק מחברת שני משפטים עצמאיים קשורים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'ברשימה ארוכה עם פסיקים פנימיים, משתמשים ב_______ להפרדה (נקודה-פסיק/פסיק)',
        correctAnswer: 'נקודה-פסיק',
        explanationHe: 'תשובה נכונה: נקודה-פסיק. דוגמה: I visited Paris, France; Rome, Italy; and Madrid, Spain.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['The childrens\' toys', 'The children\'s toys', 'The childrens toys', 'The children toys\''],
        correctAnswer: 'The children\'s toys',
        explanationHe: 'תשובה נכונה: The children\'s toys. "children" כבר רבים, אז מוסיפים \'s (לא s\').',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'כשיש ציטוט בתוך ציטוט, משתמשים ב_______ גרשיים (יחיד/כפול)',
        correctAnswer: 'יחיד',
        explanationHe: 'תשובה נכונה: יחיד. דוגמה: He said, "She told me \'hello\' yesterday."',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש נכון בפסיקים בסדרת שמות תואר?',
        options: ['She is a tall beautiful smart woman', 'She is a tall, beautiful, smart woman', 'She is a tall beautiful, smart woman', 'She is a, tall, beautiful, smart, woman'],
        correctAnswer: 'She is a tall, beautiful, smart woman',
        explanationHe: 'תשובה נכונה: She is a tall, beautiful, smart woman. פסיקים מפרידים בין שמות תואר רצופים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'למילה "its" (של זה) _______ אפוסטרוף (יש/אין)',
        correctAnswer: 'אין',
        explanationHe: 'תשובה נכונה: אין. "its" = של זה (ללא אפוסטרוף). "it\'s" = it is (עם אפוסטרוף).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['The teacher asked, "Who did this"?', 'The teacher asked, "Who did this?"', 'The teacher asked "Who did this?"', 'The teacher asked, "Who did this?".'],
        correctAnswer: 'The teacher asked, "Who did this?"',
        explanationHe: 'תשובה נכונה: The teacher asked, "Who did this?" סימן השאלה בא לפני סגירת הגרשיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'ברבים שמסתיים ב-s, מוסיפים רק _______ לשייכות (אפוסטרוף/\'s)',
        correctAnswer: 'אפוסטרוף',
        explanationHe: 'תשובה נכונה: אפוסטרוף. דוגמה: the teachers\' room (חדר המורים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['However I disagree', 'However, I disagree', 'However I, disagree', 'However; I disagree'],
        correctAnswer: 'However, I disagree',
        explanationHe: 'תשובה נכונה: However, I disagree. אחרי מילות מעבר (transition words) בתחילת משפט, שמים פסיק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'Non-restrictive clause (מידע נוסף לא חיוני) מופרד ב_______ (פסיקים/גרשיים)',
        correctAnswer: 'פסיקים',
        explanationHe: 'תשובה נכונה: פסיקים. דוגמה: My brother, who lives in London, is a doctor.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה שימוש באפוסטרוף נכון?',
        options: ["Its raining", "It's a nice day", "The dog wagged it's tail", "Its' been a long day"],
        correctAnswer: "It's a nice day",
        explanationHe: 'תשובה נכונה: It\'s a nice day. "It\'s" = It is. "Its" (ללא אפוסטרוף) = של זה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'Oxford comma (פסיק לפני "and" האחרון ברשימה) הוא _______ (אופציונלי/חובה)',
        correctAnswer: 'אופציונלי',
        explanationHe: 'תשובה נכונה: אופציונלי. שני הסגנונות נכונים: "A, B, and C" או "A, B and C".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 1.7: Common Grammar Terms ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.7',
    titleEn: 'Common Grammar Terms',
    titleHe: 'מונחי דקדוק נפוצים',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>מונחי דקדוק נפוצים (Common Grammar Terms)</h2>

<p>הכרת מונחי דקדוק בסיסיים תעזור לך להבין הסברים דקדוקיים ולשפר את האנגלית שלך.</p>

<div class="rules">
  <h3>מונחים חשובים:</h3>
  <ul>
    <li><strong>Singular (יחיד):</strong> מילה המתייחסת לאחד<br>
    דוגמה: <em>cat, book, child</em></li>

    <li><strong>Plural (רבים):</strong> מילה המתייחסת ליותר מאחד<br>
    דוגמה: <em>cats, books, children</em></li>

    <li><strong>Countable (בר-ספירה):</strong> דבר שניתן לספור<br>
    דוגמה: <em>one apple, two apples, three apples</em></li>

    <li><strong>Uncountable (לא בר-ספירה):</strong> דבר שאי אפשר לספור<br>
    דוגמה: <em>water, money, information</em> (לא: one water, two waters)</li>

    <li><strong>Tense (זמן):</strong> מתי הפעולה מתרחשת<br>
    דוגמאות: <em>Past (עבר), Present (הווה), Future (עתיד)</em></li>

    <li><strong>Phrase (צירוף מילים):</strong> קבוצת מילים שאינה משפט מלא<br>
    דוגמה: <em>in the park, after lunch</em></li>

    <li><strong>Clause (פסוקית):</strong> קבוצת מילים עם נושא ופועל<br>
    דוגמה: <em>when I arrived, because she is smart</em></li>

    <li><strong>Modifier (מַשנה):</strong> מילה או ביטוי שמתאר מילה אחרת<br>
    דוגמה: <em>very big, running quickly</em></li>

    <li><strong>Article (מאמר):</strong> a, an, the</li>

    <li><strong>Auxiliary Verb (פועל עזר):</strong> פועל המסייע לפועל אחר<br>
    דוגמה: <em>is, are, have, will, can</em></li>

    <li><strong>Modal Verb (פועל מודאלי):</strong> פועל המבטא אפשרות/יכולת/חובה<br>
    דוגמה: <em>can, must, should, may, might</em></li>

    <li><strong>Gerund (שם פעולה):</strong> פועל בצורת -ing שמתפקד כשם עצם<br>
    דוגמה: <em>Swimming is fun. (שחייה היא כיף)</em></li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות למונחים:</h3>
  <p><strong>Countable vs. Uncountable:</strong></p>
  <ul>
    <li>Countable: I have <strong>three books</strong>. ✅</li>
    <li>Uncountable: I have <strong>much money</strong>. ✅ (לא: many moneys ❌)</li>
  </ul>

  <p><strong>Phrase vs. Clause:</strong></p>
  <ul>
    <li>Phrase: <em>in the morning</em> (אין פועל)</li>
    <li>Clause: <em>when I wake up</em> (יש נושא ופועל)</li>
  </ul>

  <p><strong>Gerund:</strong></p>
  <ul>
    <li><strong>Reading</strong> is my hobby. (Reading = שם עצם)</li>
    <li>I enjoy <strong>reading</strong>. (reading = שם עצם, מושא של enjoy)</li>
  </ul>
</div>

<div class="warning">
  <strong>טיפ:</strong> הבנת המונחים האלה תעזור לך להבין הסברים דקדוקיים בספרי לימוד!
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מהו ה-plural של "book"?',
        options: ['book', 'books', 'bookes', 'bookies'],
        correctAnswer: 'books',
        explanationHe: 'תשובה נכונה: books. רבים רגיל נוצר בהוספת s-.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'המילה "water" היא _______ (countable/uncountable)',
        correctAnswer: 'uncountable',
        explanationHe: 'תשובה נכונה: uncountable. לא אומרים "one water, two waters". אומרים "some water" או "a glass of water".',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה היא Article?',
        options: ['run', 'the', 'beautiful', 'quickly'],
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. המאמרים הם: a, an, the.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'הפועל "can" הוא _______ verb (modal/regular)',
        correctAnswer: 'modal',
        explanationHe: 'תשובה נכונה: modal. can, must, should, may, might הם modal verbs.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Singular?',
        options: ['cats', 'books', 'child', 'children'],
        correctAnswer: 'child',
        explanationHe: 'תשובה נכונה: child. זה יחיד. "children" הוא הרבים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Present, Past, Future הם סוגי _______ (tense/noun)',
        correctAnswer: 'tense',
        explanationHe: 'תשובה נכונה: tense (זמן). הם מראים מתי הפעולה מתרחשת.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "I am reading", מהו ה-auxiliary verb?',
        options: ['I', 'am', 'reading', 'am reading'],
        correctAnswer: 'am',
        explanationHe: 'תשובה נכונה: am. "am" הוא פועל עזר ש"עוזר" לפועל "reading".',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Gerund הוא פועל בצורת _______ (-ing/-ed)',
        correctAnswer: '-ing',
        explanationHe: 'תשובה נכונה: -ing. Gerund הוא פועל ב-ing שמתפקד כשם עצם: Swimming is fun.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Phrase (לא Clause)?',
        options: ['when I arrived', 'because she is smart', 'in the park', 'after he left'],
        correctAnswer: 'in the park',
        explanationHe: 'תשובה נכונה: in the park. זה phrase - אין פועל. השאר הם clauses - יש נושא ופועל.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "The very big dog", המילה "very" היא _______ (modifier/noun)',
        correctAnswer: 'modifier',
        explanationHe: 'תשובה נכונה: modifier. "very" משנה/מתאר את "big" - עד כמה גדול.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Uncountable?',
        options: ['apple', 'book', 'information', 'car'],
        correctAnswer: 'information',
        explanationHe: 'תשובה נכונה: information. לא אומרים "one information, two informations".',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "Swimming is fun", המילה "Swimming" היא _______ (gerund/verb)',
        correctAnswer: 'gerund',
        explanationHe: 'תשובה נכונה: gerund. פועל ב-ing שמתפקד כשם עצם (נושא המשפט).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "She can swim", מהו ה-Modal Verb?',
        options: ['She', 'can', 'swim', 'can swim'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. זהו modal verb המבטא יכולת.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'המילים "a", "an", "the" נקראות _______ (articles/pronouns)',
        correctAnswer: 'articles',
        explanationHe: 'תשובה נכונה: articles (מאמרים). אלו מילים שבאות לפני שמות עצם.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזו צורה היא Past Tense של "go"?',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'went',
        explanationHe: 'תשובה נכונה: went. זוהי הצורה בעבר של הפועל "go".',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'צירוף מילים עם נושא ופועל נקרא _______ (phrase/clause)',
        correctAnswer: 'clause',
        explanationHe: 'תשובה נכונה: clause. phrase אין בו פועל, ב-clause יש נושא ופועל.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "I have eaten", מהו ה-Auxiliary Verb?',
        options: ['I', 'have', 'eaten', 'have eaten'],
        correctAnswer: 'have',
        explanationHe: 'תשובה נכונה: have. "have" הוא פועל עזר ב-Present Perfect.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Countable noun יכול להיות ב_______ (רק יחיד/יחיד או רבים)',
        correctAnswer: 'יחיד או רבים',
        explanationHe: 'תשובה נכונה: יחיד או רבים. דוגמה: one apple (יחיד), two apples (רבים).',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Dependent Clause?',
        options: ['I love pizza', 'She is smart', 'when I arrived', 'They play football'],
        correctAnswer: 'when I arrived',
        explanationHe: 'תשובה נכונה: when I arrived. זהו dependent clause - לא יכול לעמוד לבד כמשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'במשפט "I enjoy reading", המילה "reading" היא _______ (gerund/present participle)',
        correctAnswer: 'gerund',
        explanationHe: 'תשובה נכונה: gerund. "reading" מתפקד כשם עצם (מושא של "enjoy").',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Collective Noun?',
        options: ['cats', 'team', 'books', 'children'],
        correctAnswer: 'team',
        explanationHe: 'תשובה נכונה: team. Collective noun הוא שם עצם המייצג קבוצה: team, family, class.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'Infinitive הוא הפועל עם _______ לפניו (to/for)',
        correctAnswer: 'to',
        explanationHe: 'תשובה נכונה: to. Infinitive = to + base form: to run, to eat, to sleep.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "She is running", מהו ה-Present Participle?',
        options: ['She', 'is', 'running', 'is running'],
        correctAnswer: 'running',
        explanationHe: 'תשובה נכונה: running. Present Participle הוא הפועל ב-ing בזמן ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Abstract noun הוא שם עצם ש_______ (מוחשי/מופשט)',
        correctAnswer: 'מופשט',
        explanationHe: 'תשובה נכונה: מופשט. דוגמאות: happiness, love, freedom - דברים שאי אפשר לגעת בהם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Proper Adjective?',
        options: ['big', 'beautiful', 'American', 'happy'],
        correctAnswer: 'American',
        explanationHe: 'תשובה נכונה: American. Proper Adjective נגזר משם פרטי ומתחיל באות גדולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Transitive verb זקוק ל_______ (מושא/נושא)',
        correctAnswer: 'מושא',
        explanationHe: 'תשובה נכונה: מושא. Transitive verb צריך מושא: "I eat pizza" (eat = transitive).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'במשפט "The man who lives next door", מהו ה-Relative Pronoun?',
        options: ['The', 'man', 'who', 'lives'],
        correctAnswer: 'who',
        explanationHe: 'תשובה נכונה: who. Relative pronouns: who, which, that, whom, whose.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'Compound sentence מורכב מ_______ משפטים עצמאיים (שני/שלושה)',
        correctAnswer: 'שני',
        explanationHe: 'תשובה נכונה: שני. Compound sentence = שני independent clauses מחוברים: "I love pizza, but she loves pasta."',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא Reflexive Pronoun?',
        options: ['he', 'him', 'himself', 'his'],
        correctAnswer: 'himself',
        explanationHe: 'תשובה נכונה: himself. Reflexive pronouns: myself, yourself, himself, herself, itself, ourselves, themselves.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'Imperative mood משמש ל_______ (ציווי/שאלה)',
        correctAnswer: 'ציווי',
        explanationHe: 'תשובה נכונה: ציווי. Imperative = צורת ציווי: "Close the door." "Be quiet."',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic1() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 1: Grammar Basics...');

    for (const lessonData of lessonsData) {
      const lesson = await Lesson.create({
        topicNumber: lessonData.topicNumber,
        subtopicNumber: lessonData.subtopicNumber,
        titleEn: lessonData.titleEn,
        titleHe: lessonData.titleHe,
        level: lessonData.level,
        orderIndex: lessonData.orderIndex,
        theoryContentHe: lessonData.theoryContentHe
      });

      console.log(`  Created lesson: ${lessonData.subtopicNumber} - ${lessonData.titleEn}`);

      for (const exerciseData of lessonData.exercises) {
        await Exercise.create({
          lessonId: lesson.id,
          questionNumber: exerciseData.questionNumber,
          type: exerciseData.type,
          questionTextHe: exerciseData.questionTextHe,
          options: exerciseData.options || null,
          correctAnswer: exerciseData.correctAnswer,
          explanationHe: exerciseData.explanationHe,
          difficulty: exerciseData.difficulty
        });
      }

      console.log(`    Created ${lessonData.exercises.length} exercises`);
    }

    await client.query('COMMIT');
    console.log('✅ Topic 1: Grammar Basics seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 1:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seedTopic1()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic1, lessonsData };
