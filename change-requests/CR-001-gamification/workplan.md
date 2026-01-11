# CR-001 Gamification: Implementation Workplan

**Status**: 📝 Planning
**Estimated Duration**: 5 days
**Dependencies**: None

---

## Phase 1: Database & Backend Core (Day 1)

### Objective
Add database columns and core User model methods for points and levels.

### Tasks

#### 1.1 Database Migration
**File**: `/backend/src/database/migrations/add-gamification-columns.sql` (NEW)

Create migration script:
```sql
-- Add gamification columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS gamification_level INTEGER DEFAULT 1 NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points);
CREATE INDEX IF NOT EXISTS idx_users_gamification_level ON users(gamification_level);

-- Update existing users to have default values
UPDATE users
SET total_points = 0, gamification_level = 1
WHERE total_points IS NULL OR gamification_level IS NULL;
```

Run migration:
```bash
psql -U postgres -d english_learning -f add-gamification-columns.sql
```

#### 1.2 User Model Updates
**File**: `/backend/src/models/User.js`

Add methods:
```javascript
// Calculate level from points
static calculateLevel(totalPoints) {
  return Math.floor(totalPoints / 20) + 1;
}

// Add points to user (with floor at 0)
static async addPoints(userId, pointsToAdd) {
  const result = await pool.query(
    `UPDATE users
     SET total_points = GREATEST(0, total_points + $1),
         gamification_level = GREATEST(1, FLOOR((GREATEST(0, total_points + $1)) / 20) + 1)
     WHERE id = $2
     RETURNING total_points, gamification_level`,
    [pointsToAdd, userId]
  );
  return result.rows[0];
}

// Get user's gamification data
static async getGamificationData(userId) {
  const result = await pool.query(
    `SELECT total_points, gamification_level FROM users WHERE id = $1`,
    [userId]
  );
  if (result.rows.length === 0) return null;

  const { total_points, gamification_level } = result.rows[0];
  const pointsToNextLevel = (gamification_level * 20) - total_points;

  return {
    totalPoints: total_points,
    currentLevel: gamification_level,
    pointsToNextLevel: pointsToNextLevel > 0 ? pointsToNextLevel : 0,
    arenaName: this.getArenaName(gamification_level)
  };
}

// Get arena name for level
static getArenaName(level) {
  const arenas = {
    1: 'Training Camp',
    2: 'Goblin Stadium',
    3: 'Bone Pit',
    4: 'Barbarian Bowl',
    5: "P.E.K.K.A's Playhouse",
    6: 'Royal Arena'
  };
  return arenas[level] || arenas[6]; // Fallback to Royal Arena for level 6+
}
```

#### 1.3 Points Calculation Logic
**File**: `/backend/src/services/exercise.service.js`

Modify `submitExercise` method to calculate points:
```javascript
// After calculating score...
const correctAnswers = results.filter(r => r.isCorrect).length;
const wrongAnswers = results.filter(r => !r.isCorrect).length;
const score = Math.round((correctAnswers / totalQuestions) * 100);

// Calculate gamification points
let pointsEarned = 0;
pointsEarned += correctAnswers * 1;  // +1 per correct
pointsEarned += wrongAnswers * (-2); // -2 per wrong
if (score >= 70) {
  pointsEarned += 3; // +3 bonus for completing
}

// Update user's points
const previousLevel = await User.getGamificationData(userId);
const newGamificationData = await User.addPoints(userId, pointsEarned);
const leveledUp = newGamificationData.gamification_level > previousLevel.currentLevel;

// Return in response
return {
  // ... existing fields
  gamification: {
    pointsEarned,
    totalPoints: newGamificationData.total_points,
    currentLevel: newGamificationData.gamification_level,
    leveledUp,
    arenaName: User.getArenaName(newGamificationData.gamification_level)
  }
};
```

### Verification
- [ ] Migration runs without errors
- [ ] Users table has new columns
- [ ] User.addPoints() correctly updates points and level
- [ ] Points calculation matches spec (+1, -2, +3)
- [ ] Points floor at 0 works

---

## Phase 2: API & Services (Day 2)

### Objective
Expose gamification data through APIs and create dedicated gamification service.

### Tasks

#### 2.1 Gamification Service
**File**: `/backend/src/services/gamification.service.js` (NEW)

Create service:
```javascript
const User = require('../models/User');

class GamificationService {
  // Get full gamification status for a user
  static async getUserGamificationStatus(userId) {
    return await User.getGamificationData(userId);
  }

  // Award points for completing an exercise
  static async awardExercisePoints(userId, correctCount, wrongCount, score) {
    let pointsEarned = 0;
    pointsEarned += correctCount * 1;      // +1 per correct
    pointsEarned += wrongCount * (-2);      // -2 per wrong
    if (score >= 70) {
      pointsEarned += 3;                   // +3 bonus
    }

    const previousData = await User.getGamificationData(userId);
    const newData = await User.addPoints(userId, pointsEarned);

    return {
      pointsEarned,
      totalPoints: newData.total_points,
      currentLevel: newData.gamification_level,
      leveledUp: newData.gamification_level > previousData.currentLevel,
      arenaName: User.getArenaName(newData.gamification_level)
    };
  }

  // Get level image filename
  static getLevelImagePath(level) {
    const imageLevel = Math.min(level, 6); // Cap at level 6 image
    return `/images/levels/level-${imageLevel}.png`;
  }

  // Get points breakdown for transparency
  static calculatePointsBreakdown(correctCount, wrongCount, score) {
    const correctPoints = correctCount * 1;
    const wrongPoints = wrongCount * (-2);
    const bonusPoints = score >= 70 ? 3 : 0;
    const total = Math.max(0, correctPoints + wrongPoints + bonusPoints);

    return {
      correctPoints,
      wrongPoints,
      bonusPoints,
      totalEarned: total,
      breakdown: [
        { type: 'correct', count: correctCount, points: correctPoints },
        { type: 'wrong', count: wrongCount, points: wrongPoints },
        { type: 'bonus', awarded: score >= 70, points: bonusPoints }
      ]
    };
  }
}

module.exports = GamificationService;
```

#### 2.2 Update Progress Service
**File**: `/backend/src/services/progress.service.js`

Modify `getDashboardData` to include gamification:
```javascript
const gamification = await GamificationService.getUserGamificationStatus(userId);

return {
  stats,
  completion,
  nextLesson,
  recentActivity,
  mistakeStats,
  gamification  // Add this
};
```

#### 2.3 Update Exercise Controller
**File**: `/backend/src/controllers/exercise.controller.js`

Update `submitExercise` response to include gamification data from service.

#### 2.4 Create Gamification Routes (Optional for future)
**File**: `/backend/src/routes/gamification.routes.js` (NEW - Optional)

For future endpoints like leaderboards or detailed stats.

### Verification
- [ ] Dashboard API returns gamification object
- [ ] Exercise submission returns gamification data
- [ ] Points are calculated correctly in service
- [ ] Level-up detection works

---

## Phase 3: Frontend & Assets (Day 3-4)

### Objective
Generate level images, update dashboard UI, add level-up celebration.

### Tasks

#### 3.1 Generate Level Images
**Tool**: Use AI image generation (DALL-E, Midjourney, or similar)

**Prompts for each level**:
1. **Level 1 - Training Camp**:
   "Clash Royale style training camp arena, wooden training grounds, beginner friendly, cartoon style, bright colors, 400x300px"

2. **Level 2 - Goblin Stadium**:
   "Clash Royale style forest arena with goblin decorations, green trees, adventure theme, cartoon style, 400x300px"

3. **Level 3 - Bone Pit**:
   "Clash Royale style dark cave arena with skulls and bones, purple shadows, spooky but fun, cartoon style, 400x300px"

4. **Level 4 - Barbarian Bowl**:
   "Clash Royale style warrior arena with red banners and battle flags, strong theme, cartoon style, 400x300px"

5. **Level 5 - P.E.K.K.A's Playhouse**:
   "Clash Royale style futuristic tech arena with robots, blue and silver, advanced theme, cartoon style, 400x300px"

6. **Level 6 - Royal Arena**:
   "Clash Royale style royal arena with gold and purple, crowns and gems, elite prestigious theme, cartoon style, 400x300px"

**Storage**:
```bash
mkdir -p frontend/public/images/levels
```

Save images as:
- `level-1.png` through `level-6.png`

#### 3.2 Update Dashboard Component
**File**: `/frontend/src/components/dashboard/Dashboard.jsx`

Add gamification display:
```jsx
// In Dashboard component

// Add to state
const [gamification, setGamification] = useState(null);

// Update loadDashboard to set gamification
setGamification(data.gamification);

// Add gamification section in JSX (after welcome message)
{gamification && (
  <div className="gamification-section">
    <div className="level-image-container">
      <img
        src={`/images/levels/level-${Math.min(gamification.currentLevel, 6)}.png`}
        alt={`Level ${gamification.currentLevel} - ${gamification.arenaName}`}
        className="level-image"
      />
      <div className="level-badge">
        <span className="level-number">Level {gamification.currentLevel}</span>
        <span className="arena-name">{gamification.arenaName}</span>
      </div>
    </div>

    <div className="gamification-stats">
      <div className="points-display">
        <span className="points-icon">⭐</span>
        <span className="points-value">{gamification.totalPoints}</span>
        <span className="points-label">Total Points</span>
      </div>

      <div className="level-progress">
        <div className="progress-label">
          Progress to Level {gamification.currentLevel + 1}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((20 - gamification.pointsToNextLevel) / 20) * 100}%`
            }}
          />
        </div>
        <div className="progress-text">
          {20 - gamification.pointsToNextLevel} / 20 points
        </div>
      </div>
    </div>
  </div>
)}
```

#### 3.3 Add Level-Up Modal
**File**: `/frontend/src/components/common/LevelUpModal.jsx` (NEW)

Create modal component:
```jsx
import React from 'react';
import './LevelUpModal.css';

const LevelUpModal = ({ level, arenaName, onClose }) => {
  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confetti">🎉</div>
        <h2>Level Up!</h2>
        <div className="level-up-content">
          <img
            src={`/images/levels/level-${Math.min(level, 6)}.png`}
            alt={`Level ${level}`}
            className="level-up-image"
          />
          <div className="level-info">
            <span className="level-number">Level {level}</span>
            <span className="arena-name">{arenaName}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-continue">
          Awesome! Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
```

#### 3.4 Update Results Page
**File**: `/frontend/src/components/results/ResultsPage.jsx`

Show points earned:
```jsx
// Add to results display
{gamification && (
  <div className="points-earned">
    <h3>Points Earned</h3>
    <div className="points-breakdown">
      <div>Correct Answers: +{gamification.pointsEarned > 0 ? correctAnswers : 0}</div>
      <div>Wrong Answers: {wrongAnswers * -2}</div>
      {score >= 70 && <div>Completion Bonus: +3</div>}
      <div className="total-points">
        Total: {gamification.pointsEarned} points
      </div>
    </div>
  </div>
)}

// Trigger level-up modal if leveledUp is true
{gamification?.leveledUp && showLevelUpModal && (
  <LevelUpModal
    level={gamification.currentLevel}
    arenaName={gamification.arenaName}
    onClose={() => setShowLevelUpModal(false)}
  />
)}
```

#### 3.5 Styling
**Files**:
- `/frontend/src/components/dashboard/Dashboard.css` - Add gamification styles
- `/frontend/src/components/common/LevelUpModal.css` (NEW) - Modal styles

Add CSS for:
- Level image container with badge overlay
- Points display with star icon
- Progress bar to next level
- Level-up modal with confetti animation
- Responsive design for mobile

### Verification
- [ ] All 6 level images exist and look good
- [ ] Dashboard displays level image correctly
- [ ] Points and level show on dashboard
- [ ] Progress bar animates correctly
- [ ] Level-up modal appears when user levels up
- [ ] Styling is polished and responsive

---

## Phase 4: Testing & Polish (Day 5)

### Objective
Test all functionality, handle edge cases, polish UX.

### Tasks

#### 4.1 Unit Tests
**Files**:
- `/backend/tests/models/User.test.js` - Test points methods
- `/backend/tests/services/gamification.service.test.js` - Test calculations

Test cases:
- Points calculation with various scenarios
- Level calculation formula
- Points floor at 0
- Level-up detection

#### 4.2 Integration Tests
Test exercise submission flow end-to-end:
- Submit exercise → check points awarded → verify database updated

#### 4.3 Manual Testing Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| First exercise | Complete exercise with 8/10 correct | +8-4+3 = +7 points, Level 1 |
| Level up | Get user to 19 points, complete exercise to reach 20+ | Level-up modal appears, Level 2 displayed |
| Negative calculation | User at 3 points, fails exercise (-5 points) | Points set to 0, remain Level 1 |
| High level | User at 105 points (Level 6) | Level 6 image shows (Royal Arena) |
| Dashboard load | Navigate to dashboard | Level image, points, progress bar all show correctly |
| Mobile view | Open on mobile | Gamification section is responsive |

#### 4.4 Edge Case Handling

| Edge Case | Solution |
|-----------|----------|
| User level > 6 | Use level-6.png as fallback |
| Missing level image | Show placeholder or default image |
| Negative points calculation | Floor at 0 using GREATEST(0, points) in SQL |
| Database migration failure | Rollback script ready |
| Level-up modal dismissed | Can be re-shown from profile/settings |

#### 4.5 Polish & UX Improvements
- [ ] Add loading states while gamification data loads
- [ ] Add tooltips explaining point system
- [ ] Add sound effect on level-up (optional)
- [ ] Ensure animations are smooth (60fps)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Accessibility: keyboard navigation for modal, ARIA labels

#### 4.6 Documentation
- [ ] Update main README with gamification feature
- [ ] Add API documentation for gamification endpoints
- [ ] Create user guide/help section explaining points and levels

### Verification
- [ ] All acceptance criteria from PRD are met
- [ ] No console errors in frontend
- [ ] Database performance is good (queries < 50ms)
- [ ] Code review completed
- [ ] Ready for deployment

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Database migration script tested on staging
- [ ] Level images uploaded to CDN (if using)
- [ ] Environment variables set (if any)
- [ ] Rollback plan documented

### Deployment Steps
1. Run database migration:
   ```bash
   psql -U postgres -d english_learning -f add-gamification-columns.sql
   ```

2. Deploy backend:
   ```bash
   cd backend
   npm run build
   pm2 restart backend
   ```

3. Deploy frontend:
   ```bash
   cd frontend
   npm run build
   # Copy build folder to web server
   ```

4. Verify deployment:
   - Check dashboard loads
   - Complete test exercise
   - Verify points updated

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Plan for iteration/improvements

---

## Rollback Plan

If critical issues arise:

1. **Database Rollback**:
   ```sql
   ALTER TABLE users DROP COLUMN IF EXISTS total_points;
   ALTER TABLE users DROP COLUMN IF EXISTS gamification_level;
   ```

2. **Code Rollback**: Revert to previous git commit

3. **Frontend**: Clear cache, deploy previous version

---

## Success Criteria

- [ ] Users see their points and level on dashboard
- [ ] Points are awarded correctly after each exercise
- [ ] Level-up celebration appears when users level up
- [ ] Level images match Clash Royale theme
- [ ] No performance degradation
- [ ] No bugs reported in first week
- [ ] Positive user feedback (>80% satisfaction)

---

## Future Enhancements (Post-v1)

1. **Leaderboards** (CR-002):
   - Weekly/monthly top scorers
   - Class/school leaderboards

2. **Achievements System** (CR-003):
   - Badges for milestones
   - Point bonuses for achievements

3. **Point Shop** (CR-004):
   - Avatar customization
   - Theme unlocks

4. **Social Features** (CR-005):
   - Friend points comparison
   - Challenge friends

---

## Notes

- Keep PRD updated with any scope changes
- Document any deviations from plan
- Hold daily standups to track progress
- Celebrate when shipped! 🎉
