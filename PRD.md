# Product Requirements Document (PRD)
## English Tutorial Learning System

### Product Overview
A web-based English learning platform for Hebrew-speaking children (age 10+) with focus on grammar practice through interactive exercises.

---

## Core Principles

### 1. User Experience Philosophy

**Minimize Clicks & Friction**
- Default to the most likely user action
- Auto-focus input elements when waiting for user input
- Use keyboard shortcuts (Enter key) for common actions
- Pre-select sensible defaults
- Never require unnecessary confirmation dialogs

**Smart Assumptions**
- Auto-advance after feedback on multiple choice questions
- Remember user's last difficulty selection
- Auto-save progress continuously
- Predict next likely action and optimize for it

**Keyboard-First Design**
- Every action should be achievable via keyboard
- Enter key = Submit/Continue/Next
- Tab = Navigate between options
- Arrow keys = Navigate questions (when appropriate)

---

## Features

### 1. Topic-Based Learning

**Structure:**
- Multiple grammar topics (Present Simple, Past Simple, Present Continuous, etc.)
- Each topic has ONE lesson with theory + exercises
- All topics accessible immediately (no locking)

**Content Per Topic:**
- Hebrew theory explanation
- **20 advanced exercises minimum** per lesson:
  - **Hard: 20 exercises** - Complex scenarios, edge cases, exceptions, common mistakes
- Focus on quality over quantity - each exercise must have comprehensive explanations

### 2. Exercise System

**Exercise Types:**
- **Multiple Choice**: 4 options, keyboard or click to select
  - First option is auto-selected by default
  - Arrow keys (↑↓) navigate between options
  - Visual indicator shows selected option (●)
- **Fill in the Blank**: Text input with auto-focus

**Smart Behavior:**
- Auto-focus text inputs immediately
- Multiple choice: first option pre-selected for instant submission
- Arrow keys (↑↓) navigate between multiple choice options
- Enter key submits answer
- After feedback, Enter advances to next question
- Random selection from chosen difficulty level
- Different questions each practice session

**Difficulty Selection:**
- User manually chooses: Easy, Medium, or Hard
- No automatic progression
- Can practice any level anytime
- System suggests level based on past performance (but doesn't enforce)

**Exercise Quality Requirements:**

*Every exercise MUST include:*

1. **Clear Question** in Hebrew (questionTextHe)
2. **Correct Answer** (correctAnswer)
3. **Comprehensive Explanation** (explanationHe) that MUST include ALL of the following:
   - **תשובה נכונה:** (Correct answer) - State the correct answer explicitly
   - **כלל:** (Rule) - Explain the relevant grammar rule in detail
   - **שים לב:** (Pay attention) - Highlight important points or nuances
   - **טעות נפוצה:** (Common mistake) - Explain what students often get wrong and why

   **Example format:**
   ```
   "תשובה נכונה: doesn't. כלל: משתמשים ב-does not (doesn't) עם he/she/it.
   שים לב: הפועל אחרי doesn't בצורת הבסיס ללא s.
   טעות נפוצה: לכתוב doesn't plays - הפועל אחרי doesn't תמיד בצורת הבסיס."
   ```

*Advanced Level Focus (20 exercises per lesson):*

- **Edge cases and exceptions** - Test unusual or irregular patterns
- **Common native-speaker traps** - Mistakes that even fluent speakers make
- **Multiple grammar points tested** - Combine several rules in one question
- **Subtle distinctions** - Differentiate between similar constructions
- **Context-dependent scenarios** - Require understanding, not just memorization
- **Tricky vocabulary** - Words that follow unexpected rules

*Exercise Types Mix:*
- 60% Multiple Choice (clear distractors that represent common errors)
- 40% Fill in the Blank (requires active recall)

### 3. Progress Tracking

**What's Tracked:**
- Best score per topic
- Number of attempts
- Completion status
- Last attempted date

**What's NOT Enforced:**
- No lesson locks/prerequisites
- No forced progression
- No minimum score requirements

**Progress Visibility Features:**

*Previous Attempt Reminder Modal:*
- Appears when user returns to a previously completed exercise
- Shows: best score, number of attempts, last attempt date
- Provides encouraging message based on score level (90%+: מצוין, 80%+: כל הכבוד, 70%+: יופי, <70%: אל תוותר)
- Options: "כן, בוא נתחיל!" (Continue) or "חזרה לנושאים" (Go back)
- Icon changes based on score: 🏆 (90%+), ⭐ (80%+), ✅ (70%+), 📝 (<70%)
- Does NOT appear in retry mode (reviewing mistakes)

*Enhanced Topics List:*
- Status icons reflect achievement level:
  - 🏆 Trophy for 90%+ scores
  - ⭐ Star for 80-89% scores
  - ✅ Checkmark for 70-79% scores (completed)
  - ⏳ Hourglass for in-progress lessons
  - 📝 Pencil for not-started lessons
- Score badges displayed next to completed lessons showing exact percentage
- Color-coded badges:
  - Gold gradient (90%+): "Excellent"
  - Green gradient (80-89%): "Great"
  - Blue gradient (70-79%): "Good"
  - Yellow gradient (<70%): "Needs work"
- Progress bars in topic headers showing completion (e.g., "4/5 הושלמו")
- Visual distinction:
  - Completed lessons: subtle green background tint with green right border
  - In-progress lessons: yellow right border
  - Not started: default appearance

### 4. Feedback & Results

**Immediate Feedback:**
- Show correct/incorrect immediately after checking
- Display correct answer if wrong
- Show Hebrew explanation
- Visual indicators (✓/✗, colors)

**Session Results:**
- Overall score percentage
- Number correct/total
- List of mistakes for review
- Option to retry

---

## User Flows

### Primary Flow: Practice a Topic

1. **Login** (auto-focus username field)
2. **Select Topic** from main page
3. **Read Theory** (optional, can skip directly to practice)
4. **Choose Difficulty** (3 large buttons: Easy/Medium/Hard)
5. **Answer Questions** (10 random from chosen difficulty)
   - For fill-in-blank: input is auto-focused
   - For multiple-choice: click option
   - Press Enter to submit
   - See feedback
   - Press Enter to continue to next
6. **View Results** (automatic after last question)
7. **Choose Next Action**:
   - Retry same difficulty (different questions)
   - Try different difficulty
   - Return to topics

### Smart Defaults:
- First visit to topic → Auto-suggest Easy difficulty (but show all 3 buttons)
- Returning user → Show last attempted difficulty as "recommended"
- After completing exercise → One-click to retry with new questions
- Any page → Press Esc to return to previous screen

---

## UX Guidelines

### Input Focus Management

**Always Auto-Focus:**
- Login username field on page load
- Password field after entering username
- Fill-in-blank input fields when question appears
- Search boxes when opening search dialogs
- Any text input waiting for user entry

**Never:**
- Auto-focus when it would interfere with reading
- Auto-focus on mobile if it triggers keyboard unexpectedly
- Auto-focus after user has clicked elsewhere

### Default Selection (Multiple Choice)

**Smart Defaults:**
- **First option auto-selected**: When a multiple choice question appears, the first option is automatically selected by default
- **Reduces friction**: User can immediately press Enter to submit if the first option is their choice
- **Still allows navigation**: User can use arrow keys (↑↓) or click to select different options
- **Visual feedback**: Selected option is clearly highlighted with a filled circle (●) indicator
- **Keyboard-first**: Optimizes for keyboard users who can navigate with arrows and submit with Enter without ever touching the mouse

**Benefits:**
- Reduces one click per question (from 2 clicks to 1 for first option)
- Enables pure keyboard navigation (arrows + Enter)
- Maintains clear visual state (always shows which option is selected)
- Aligns with "minimize friction" principle

### Keyboard Shortcuts

**Global:**
- `Enter` = Submit current form / Continue / Next
- `Esc` = Go back / Close dialog
- `Tab` = Navigate forward
- `Shift+Tab` = Navigate backward

**Exercise Page:**
- `Enter` = Check answer (if not checked) OR Next question (if checked)
- `↑↓` = Navigate between multiple choice options (Arrow Up/Down)
- `1-4` = Select multiple choice option 1-4
- `←→` = Previous/Next question (with warning if unanswered)

### Click Minimization

**Before (Bad UX):**
1. Click "Practice"
2. Choose difficulty
3. Click "Start"
4. Answer question
5. Click "Check Answer"
6. Click "Next Question"
7. Repeat...
8. Click "Finish"
9. Click "View Results"

**After (Good UX):**
1. Click difficulty button (goes directly to first question)
2. Answer + Press Enter (check + advance in one action)
3. Repeat...
4. Auto-show results after last question

**Savings:** Reduced from 9 clicks/question to 2 clicks/question

### Button Placement & Size

**Primary Actions:**
- Large, prominent buttons
- Positioned where user expects them
- Clear visual hierarchy
- Use color to indicate action type:
  - Green = Start/Continue/Success
  - Yellow = Caution/Review
  - Red = Stop/Delete/Danger
  - Blue = Information/Learn

**Secondary Actions:**
- Smaller, less prominent
- Still accessible but not competing for attention

### Form Behavior

**Smart Forms:**
- Auto-advance to next field after completing current
- Auto-submit when all required fields are filled
- Show inline validation (not after submit)
- Clear error messages in Hebrew
- Pre-fill known information

**Login Form:**
```
Username: [auto-focused]
         ↓ (press Enter or auto-advance)
Password: [cursor moves here]
         ↓ (press Enter)
      [auto-submit]
```

### Loading States

**Instead of Blocking:**
- Show skeleton loaders
- Display partial content as it loads
- Allow interaction with loaded portions
- Never show "Loading..." for more than 1 second if data is cached

### Error Handling

**User-Friendly Errors:**
- Never show technical error messages
- Translate errors to Hebrew
- Provide actionable solutions
- Auto-retry failed requests
- Graceful degradation (show offline mode if possible)

### Mobile Considerations

**Touch-Optimized:**
- Large tap targets (minimum 44x44px)
- Swipe gestures for navigation
- Avoid hover states
- Test auto-focus on mobile (may trigger keyboard)
- Bottom navigation for common actions

---

## Technical Requirements

### Performance

**Speed Targets:**
- Page load: < 2 seconds
- Question transition: < 100ms
- Answer submission: < 500ms response
- No perceived lag on keyboard input

**Optimization:**
- Pre-fetch next question while user reads current
- Cache exercises for offline practice
- Lazy load theory content
- Optimize images and assets

### Accessibility

**Keyboard Navigation:**
- All functionality available via keyboard
- Clear focus indicators
- Logical tab order
- Skip navigation links

**Screen Readers:**
- Semantic HTML
- ARIA labels where needed
- Announce dynamic content changes
- Alternative text for all images

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile: iOS Safari, Chrome Android

---

## Future Enhancements

### Phase 2 (Next)
- Speech recognition for pronunciation practice
- Adaptive difficulty (auto-adjust based on performance)
- Spaced repetition system
- Gamification (points, badges, streaks)
- Multiplayer challenges

### Phase 3 (Future)
- AI-generated personalized exercises
- Voice-based lessons
- Video explanations
- Social features (compete with friends)
- Teacher dashboard for monitoring

---

## Success Metrics

### User Engagement
- Average session duration: > 15 minutes
- Questions completed per session: > 20
- Return rate: > 60% within 7 days
- Completion rate per topic: > 70%

### Learning Outcomes
- Average improvement in test scores: > 20%
- User-reported confidence increase: > 30%
- Time to master topic: < 5 hours

### UX Metrics
- Average clicks per exercise: < 3
- Keyboard shortcut usage: > 40% of power users
- Error rate: < 5%
- User satisfaction (NPS): > 8/10

---

## Design System

### Colors
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#22c55e)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### Typography
- Headings: System UI font (Hebrew: system default)
- Body: System UI font
- Code/English: Monospace

### Spacing
- Base unit: 8px
- Scale: 8px, 16px, 24px, 32px, 48px, 64px

### Components
- Buttons: Rounded (8px), gradient backgrounds
- Inputs: Rounded (8px), clear borders, auto-focus
- Cards: Rounded (12px), subtle shadows
- Badges: Rounded (12px), small, colored by type

---

## Content Guidelines: Mixing Hebrew & English

### The Challenge
Hebrew is RTL (right-to-left) and English is LTR (left-to-right). When mixed together without proper structure, they create confusing layouts that are hard to read.

### Principles for Theory Content

**1. Clear Language Separation**
- Use Hebrew for explanations and context
- Use English for examples, formulas, and grammar rules
- Never mix languages within a single sentence unless using `<span dir="ltr">` tags

**2. Use `dir="ltr"` for English Text Blocks**
```html
<!-- Good: English examples with explicit LTR direction -->
<div class="examples" dir="ltr">
  <p>• I don't like coffee.</p>
  <p>• They don't work on weekends.</p>
</div>

<!-- Bad: Mixed without direction, creates RTL chaos -->
<ul>
  <li>I don't like coffee.</li>
</ul>
```

**3. Structure Pattern for Grammar Lessons**

```html
<h2>כותרת בעברית</h2>
<p class="subtitle">English Translation</p>

<div class="formula">
  <div class="formula-title">מבנה המשפט:</div>
  <div class="formula-content" dir="ltr">Subject + verb + object</div>
  <div class="formula-explanation">(תרגום: נושא + פועל + מושא)</div>
</div>

<div class="rules">
  <h3>כללים:</h3>

  <div class="rule-section">
    <p class="rule-header"><strong>כותרת הכלל בעברית:</strong></p>
    <p class="rule-explanation">הסבר מפורט בעברית</p>
    <div class="examples" dir="ltr">
      <p>• English example sentence here.</p>
      <p>• Another English example.</p>
    </div>
  </div>
</div>
```

**4. Inline English Terms in Hebrew Text**
When mentioning English words/terms within Hebrew sentences:
```html
<!-- Good: Wrap English in span with LTR -->
<p>הפועל אחרי <span dir="ltr">doesn't</span> תמיד בצורת הבסיס</p>

<!-- Bad: No wrapping -->
<p>הפועל אחרי doesn't תמיד בצורת הבסיס</p>
```

**5. Comparison Boxes (Right/Wrong)**
```html
<div class="comparison">
  <p class="wrong">❌ <span dir="ltr">She doesn't plays</span></p>
  <p class="correct">✅ <span dir="ltr">She doesn't play</span></p>
</div>
```

### Visual Hierarchy

**Use Containers:**
- `.formula` - Blue box for grammar formulas
- `.rules` - Yellow box for rules and explanations
- `.examples` - Gray box with green border for English examples (always `dir="ltr"`)
- `.warning` - Yellow box for important notes
- `.tip` - Green box for helpful tips
- `.rule-section` - White cards within rules for organized content

### Example: Well-Structured Content

**Before (Confusing):**
```html
<h2>משפטים שליליים בזמן הווה פשוט</h2>
<div class="formula">
  <strong>Subject + do/does + not + verb</strong>
</div>
<p><strong>I / You / We / They - משתמשים ב-don't:</strong></p>
<ul>
  <li>I don't like coffee.</li>
</ul>
```

**After (Clear):**
```html
<h2>משפטים שליליים בזמן הווה פשוט</h2>
<p class="subtitle">Negative Sentences in Present Simple</p>

<div class="formula">
  <div class="formula-title">מבנה המשפט:</div>
  <div class="formula-content" dir="ltr">Subject + do/does + not + verb</div>
  <div class="formula-explanation">(נושא + do/does + not + פועל)</div>
</div>

<div class="rules">
  <h3>כללים:</h3>

  <div class="rule-section">
    <p class="rule-header"><strong>עם I / You / We / They:</strong></p>
    <p class="rule-explanation">משתמשים ב-<span dir="ltr"><strong>don't</strong></span></p>
    <div class="examples" dir="ltr">
      <p>• I don't like coffee.</p>
      <p>• They don't work on weekends.</p>
    </div>
  </div>
</div>
```

### Benefits of This Approach

1. **Visual Clarity**: Hebrew and English are clearly separated into distinct blocks
2. **Correct Text Flow**: LTR blocks prevent English text from being mangled by RTL
3. **Consistent Structure**: Every lesson follows the same pattern
4. **Professional Look**: Clean, organized, easy to scan
5. **Accessibility**: Screen readers can properly handle directional changes

### CSS Classes Summary

| Class | Purpose | Direction |
|-------|---------|-----------|
| `.subtitle` | English translation of Hebrew heading | LTR |
| `.formula-content` | English grammar formulas | LTR |
| `.formula-explanation` | Hebrew translation of formula | RTL (default) |
| `.rule-header` | Hebrew rule title | RTL (default) |
| `.rule-explanation` | Hebrew explanation | RTL (default) |
| `.examples` | English example sentences | LTR (always) |
| `<span dir="ltr">` | Inline English terms in Hebrew text | LTR |

---

## Appendix: Example User Journey

**Sarah, 11 years old, first time user:**

1. Opens website → Login page, username field already focused
2. Types username → Cursor auto-moves to password
3. Types password, presses Enter → Logged in
4. Sees 3 topics, clicks "Present Simple"
5. Reads theory (2 minutes)
6. Clicks "Easy" difficulty button → First question appears immediately
7. Question 1: Multiple choice - first option already selected
8. Uses arrow down key (↓) to select option 3, presses Enter → Answer checked, feedback shown
9. Presses Enter again → Next question
10. Question 2: Fill-in-blank, input is focused, types answer, presses Enter
11. Continues with arrow keys and Enter for navigation
12. Completes 10 questions in 8 minutes
13. Results page auto-appears
14. Sees score: 8/10 (80%)
15. Clicks "Practice Again" → Gets 10 different questions at same level

**Total clicks: 3** (Login, Select Topic, Select Difficulty)
**Total keyboard actions: ~25** (arrows for navigation, Enter for submit/continue, typing answers)
**Time: 10 minutes**
**Friction points: 0**
**Pure keyboard navigation: ✅ Possible**

---

*Last Updated: 2026-01-12*
*Latest addition: Progress Tracking Visibility Features (Previous Attempt Modal & Enhanced Topics List)*
