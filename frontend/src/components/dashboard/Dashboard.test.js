import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import progressService from '../../services/progressService';
import achievementService from '../../services/achievementService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }), { virtual: true });
jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { name: 'dana' } }) }));
jest.mock('../../services/progressService', () => ({ getDashboard: jest.fn() }));
jest.mock('../../services/achievementService', () => ({ getRecentlyUnlocked: jest.fn() }));
jest.mock('../challenges/DailyChallenge', () => () => null);

const completion = (done, total) => ({ completed_lessons: done, total_lessons: total, percentage: Math.round((done / total) * 100) });

const data = {
  stats: { average_score: 80, total_attempts: 3, total_time_spent: 600 },
  completion: completion(3, 130),
  recentActivity: [
    { id: 'r1', lesson_id: 'M1', title_he: 'מה זה שבר', score: 90, attempt_number: 1, correct_answers: 9, total_questions: 10, subject: 'math' },
    { id: 'r2', lesson_id: 'E1', title_he: 'אותיות', score: 70, attempt_number: 1, correct_answers: 7, total_questions: 10, subject: 'english' }
  ],
  mistakeStats: { uncorrected_count: 0, total_mistakes: 1 },
  gamification: null,
  dailyStats: { currentStreak: 2, pointsToday: 5 },
  subjects: {
    english: { nextLesson: { id: 'E2', title_he: 'מילות שאלה' }, completion: completion(2, 106), lastActivity: { lesson_id: 'E1', title_he: 'אותיות', difficulty: 'hard', score: 70 } },
    math: { nextLesson: { id: 'M2', title_he: 'שברים שקולים' }, completion: completion(1, 24), lastActivity: { lesson_id: 'M1', title_he: 'מה זה שבר', difficulty: 'easy', score: 90 } }
  }
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // CRA resets mock implementations before each test; set them here.
    progressService.getDashboard.mockResolvedValue(data);
    achievementService.getRecentlyUnlocked.mockResolvedValue({ data: [] });
  });

  test('shows one continue card per subject, each going to its own next step', async () => {
    render(<Dashboard />);
    const english = await screen.findByText('המשך אנגלית');
    const math = screen.getByText('המשך מתמטיקה');
    // English finished hard on its last lesson: the next English lesson.
    fireEvent.click(english.closest('button'));
    expect(mockNavigate).toHaveBeenLastCalledWith('/learn/E2');
    // Math last practised easy: medium on the same lesson.
    fireEvent.click(math.closest('button'));
    expect(mockNavigate).toHaveBeenLastCalledWith('/exercise/M1?difficulty=medium');
  });

  test('neutral greeting, a progress bar per subject, subject badges, no English-only buttons', async () => {
    render(<Dashboard />);
    await screen.findByText('המשך אנגלית');
    expect(screen.queryByText(/ללמוד אנגלית/)).toBeNull();
    expect(screen.getByText('2 הושלמו')).toBeInTheDocument();
    expect(screen.getByText('1 הושלמו')).toBeInTheDocument();
    expect(document.querySelectorAll('.subject-badge.subject-math')).toHaveLength(1);
    expect(document.querySelectorAll('.subject-badge.subject-english')).toHaveLength(1);
    expect(screen.queryByText('לימוד מילים')).toBeNull();
    expect(screen.queryByText('לימוד פסקאות')).toBeNull();
  });
});
