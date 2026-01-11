# CR-001: Gamification Feature

**Status**: 📝 Planning
**Created**: 2026-01-11
**Owner**: Product Team
**Target Version**: v2.0

---

## Overview

Add a gamification system to the English Learning Platform to increase student engagement and motivation. Students earn points for correct answers and completing exercises, and progress through Clash Royale-themed levels displayed on their dashboard.

---

## Problem Statement

Currently, the platform tracks user progress through lesson completion percentages and scores, but lacks immediate rewards and visual progression that appeal to 10-year-old students. Students need more engaging feedback that celebrates their achievements and encourages continued learning.

---

## Goals

1. **Increase Engagement**: Make learning feel like a game with immediate rewards
2. **Motivate Progress**: Provide visual level progression that students can work towards
3. **Celebrate Achievement**: Show students their growth through appealing level imagery
4. **Maintain Balance**: Encourage accuracy by penalizing wrong answers

---

## Success Metrics

- Increased daily active users (DAU)
- Increased average session duration
- Increased exercise completion rate
- Decreased dropout rate between lessons
- Positive user feedback on gamification features

---

## User Stories

### Student (10 years old)
- As a student, I want to see immediate points when I answer correctly so I feel rewarded for my effort
- As a student, I want to see my level and cool arena images so I feel proud of my progress
- As a student, I want to level up when I earn enough points so I feel like I'm advancing
- As a student, I want to see a celebration when I level up so the achievement feels special

### Parent
- As a parent, I want my child to be motivated to practice English regularly
- As a parent, I want to see my child's level as a quick indicator of their progress

---

## Requirements

### Functional Requirements

#### 1. Points System

**Points Calculation:**
| Action | Points Awarded |
|--------|----------------|
| Correct answer | +1 point |
| Wrong answer | -2 points |
| Complete questionnaire (score ≥ 70%) | +3 bonus points |

**Rules:**
- Points are calculated immediately after exercise submission
- Total points are cumulative across all exercises
- Points cannot go below 0 (floor at zero)
- Points are stored per user in the database

**Example Scenario:**
```
Exercise with 10 questions:
- 8 correct answers: 8 × 1 = +8 points
- 2 wrong answers: 2 × (-2) = -4 points
- Score: 80% (≥ 70%, questionnaire completed): +3 bonus points
Total points earned: 8 - 4 + 3 = 7 points
```

#### 2. Level System

**Level Calculation:**
```
Level = floor(totalPoints / 20) + 1
```

**Level Tiers:**
| Level | Points Required | Arena Name |
|-------|-----------------|------------|
| 1 | 0-19 | Training Camp |
| 2 | 20-39 | Goblin Stadium |
| 3 | 40-59 | Bone Pit |
| 4 | 60-79 | Barbarian Bowl |
| 5 | 80-99 | P.E.K.K.A's Playhouse |
| 6+ | 100+ | Royal Arena (and beyond) |

**Level-Up Logic:**
- Level is recalculated after every points update
- If new level > previous level, trigger level-up celebration
- Level-up notification should show: "🎉 Level Up! You reached Level X - [Arena Name]"

#### 3. Visual Display

**Dashboard Components:**
1. **Points Display**: Show current total points with icon/badge
2. **Level Display**: Show current level number and arena name
3. **Level Image**: Display Clash Royale-themed arena image based on current level
4. **Progress to Next Level**: Show points progress bar (e.g., "15 / 20 points to Level 2")
5. **Level-Up Animation**: Celebration animation/modal when leveling up

**Image Specifications:**
- Size: 400x300px (or 16:9 aspect ratio)
- Format: PNG with transparency
- Style: Clash Royale arena aesthetic
- Storage: `/frontend/public/images/levels/level-1.png` through `level-6.png`

#### 4. Database Schema

**Users Table Updates:**
```sql
ALTER TABLE users ADD COLUMN total_points INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN gamification_level INTEGER DEFAULT 1 NOT NULL;
```

### Non-Functional Requirements

1. **Performance**: Points calculation should not add more than 50ms to exercise submission
2. **Data Integrity**: Points updates must be atomic (no race conditions)
3. **Scalability**: System should handle 1000+ concurrent users
4. **Backward Compatibility**: Existing users start at 0 points, Level 1
5. **Accessibility**: Level images should have alt text for screen readers

---

## Design Specifications

### Level Arena Themes

#### Level 1: Training Camp
- **Theme**: Beginner wooden training ground
- **Colors**: Brown, beige, green grass
- **Elements**: Wooden training dummies, simple arena
- **Feel**: Welcoming, approachable for beginners

#### Level 2: Goblin Stadium
- **Theme**: Green forest arena
- **Colors**: Green, forest tones
- **Elements**: Trees, goblin decorations
- **Feel**: Fun, adventurous

#### Level 3: Bone Pit
- **Theme**: Skeleton/dark cave arena
- **Colors**: Dark purple, bone white, shadows
- **Elements**: Skulls, bones, cave entrance
- **Feel**: Spooky but not scary, exciting

#### Level 4: Barbarian Bowl
- **Theme**: Warrior/red theme arena
- **Colors**: Red, orange, warrior banners
- **Elements**: Battle flags, warrior statues
- **Feel**: Strong, powerful

#### Level 5: P.E.K.K.A's Playhouse
- **Theme**: Robot/tech arena
- **Colors**: Blue, silver, tech lights
- **Elements**: Robotic decorations, tech panels
- **Feel**: Futuristic, advanced

#### Level 6+: Royal Arena
- **Theme**: Royal/gold arena
- **Colors**: Gold, purple, royal blue
- **Elements**: Crowns, royal banners, gem decorations
- **Feel**: Elite, prestigious

---

## User Flow

### Exercise Completion Flow
```
1. Student completes exercise
2. System calculates score (% correct)
3. System calculates points:
   - Count correct answers → +1 each
   - Count wrong answers → -2 each
   - If score ≥ 70% → +3 bonus
4. Update user's total_points (floor at 0)
5. Calculate new level
6. If level increased:
   - Show level-up celebration modal
   - Display new level and arena name
   - Show new arena image
7. Navigate to results page with points shown
```

### Dashboard View Flow
```
1. Student navigates to dashboard
2. System fetches user data including total_points, gamification_level
3. Display components:
   - Large level image at top
   - Level badge with number and arena name
   - Points display
   - Progress bar to next level
4. Student sees their current status at a glance
```

---

## Out of Scope

- **Leaderboards**: Not included in v1 (future CR)
- **Badges/Achievements**: Not included in v1 (existing achievements table can be used later)
- **Point Trading/Shop**: Not included in v1
- **Multiplayer/Duels**: Not included in v1
- **Custom Avatars**: Not included in v1
- **Different point values per difficulty**: All exercises use same point system in v1

---

## Edge Cases & Business Rules

1. **Negative Points Scenario**:
   - If points calculation results in negative, floor at 0
   - Example: User has 5 points, fails exercise badly (-6 points) → New total: 0 points

2. **Deleted User Progress**:
   - If progress is reset, points and level reset to 0 and 1

3. **First-Time Users**:
   - New users start at Level 1 with 0 points
   - Training Camp image shown by default

4. **Level Image Missing**:
   - If level > 6 and no image exists, use level-6.png as fallback

5. **Database Migration**:
   - Existing users get 0 points and Level 1 initially
   - Points are earned from new exercise completions only

---

## Acceptance Criteria

### AC-1: Points Calculation
- [ ] Correct answer adds +1 point
- [ ] Wrong answer subtracts 2 points
- [ ] Completing questionnaire (≥70%) adds +3 bonus points
- [ ] Points never go below 0
- [ ] Points are saved to database immediately

### AC-2: Level Calculation
- [ ] Level = floor(totalPoints / 20) + 1
- [ ] Level updates automatically when points change
- [ ] Level is displayed correctly on dashboard

### AC-3: Level Images
- [ ] 6 unique arena images exist (levels 1-6)
- [ ] Correct image displays based on user's level
- [ ] Images are Clash Royale themed
- [ ] Images load quickly (<500ms)

### AC-4: Dashboard Display
- [ ] Points displayed prominently
- [ ] Level number and arena name shown
- [ ] Level image displayed at top
- [ ] Progress bar shows points to next level

### AC-5: Level-Up Celebration
- [ ] Modal/animation appears when user levels up
- [ ] Shows new level number and arena name
- [ ] Animation is fun and celebratory (confetti/sparkles)

### AC-6: Database
- [ ] Migration script adds columns without errors
- [ ] Existing users have 0 points, Level 1
- [ ] Points update atomically

### AC-7: Backward Compatibility
- [ ] Existing functionality still works
- [ ] Dashboard loads for users without gamification data
- [ ] No breaking changes to APIs

---

## Technical Considerations

### Database
- Add indexes on `total_points` and `gamification_level` for fast queries
- Use transactions when updating points to prevent race conditions

### Backend
- Points calculation should be in a reusable service method
- Level calculation should be a pure function
- Consider caching level images metadata

### Frontend
- Level images should be lazy-loaded
- Use React context or state management for gamification data
- Level-up animation should not block navigation

### Testing
- Unit tests for points calculation logic
- Unit tests for level calculation
- Integration tests for exercise submission with points
- Manual testing for level-up celebration UX

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Students obsess over points instead of learning | High | Medium | Balance penalties, add educational messages |
| Negative points demotivate students | Medium | Low | Floor points at 0 |
| Level-up feels too slow (20 points) | Medium | Medium | Monitor user feedback, adjust threshold if needed |
| Images don't load / poor performance | Medium | Low | Optimize images, use CDN, have fallbacks |
| Point inflation over time | Low | High | Monitor average points, can adjust formulas later |

---

## Dependencies

- Database migration must run before backend deployment
- Level images must be generated/added before frontend deployment
- User model and Exercise service changes must be coordinated

---

## Timeline Estimate

- **Phase 1 (Database & Backend)**: 1 day
- **Phase 2 (API & Services)**: 1 day
- **Phase 3 (Frontend & Assets)**: 2 days
- **Phase 4 (Testing & Polish)**: 1 day
- **Total**: ~5 days

---

## Appendix

### References
- Clash Royale Arena Progression: [Research Clash Royale arenas for inspiration]
- Gamification Best Practices: [Consider educational gamification principles]

### Future Enhancements (Not in v1)
- Leaderboards (weekly/monthly)
- Achievements tied to points milestones
- Point shop for avatar customization
- Bonus multipliers for streaks
- Daily point challenges
- Social features (friend points comparison)
