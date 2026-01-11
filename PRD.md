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
- 25-30 exercises split across difficulty levels:
  - Easy (8-10 exercises)
  - Medium (9-11 exercises)
  - Hard (7-10 exercises)

### 2. Exercise System

**Exercise Types:**
- **Multiple Choice**: 4 options, click to select
- **Fill in the Blank**: Text input with auto-focus

**Smart Behavior:**
- Auto-focus text inputs immediately
- Enter key submits answer
- After feedback, Enter advances to next question
- Random selection from chosen difficulty level
- Different questions each practice session

**Difficulty Selection:**
- User manually chooses: Easy, Medium, or Hard
- No automatic progression
- Can practice any level anytime
- System suggests level based on past performance (but doesn't enforce)

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

### Keyboard Shortcuts

**Global:**
- `Enter` = Submit current form / Continue / Next
- `Esc` = Go back / Close dialog
- `Tab` = Navigate forward
- `Shift+Tab` = Navigate backward

**Exercise Page:**
- `Enter` = Check answer (if not checked) OR Next question (if checked)
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

## Appendix: Example User Journey

**Sarah, 11 years old, first time user:**

1. Opens website → Login page, username field already focused
2. Types username → Cursor auto-moves to password
3. Types password, presses Enter → Logged in
4. Sees 3 topics, clicks "Present Simple"
5. Reads theory (2 minutes)
6. Clicks "Easy" difficulty button → First question appears immediately
7. Sees fill-in-blank question, input is focused, types answer
8. Presses Enter → Answer checked, feedback shown
9. Presses Enter again → Next question
10. Completes 10 questions in 8 minutes
11. Results page auto-appears
12. Sees score: 8/10 (80%)
13. Clicks "Practice Again" → Gets 10 different questions at same level

**Total clicks: 5**
**Total keyboard actions: 12 (mostly Enter)**
**Time: 10 minutes**
**Friction points: 0**

---

*Last Updated: 2026-01-11*
