import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrossTestPage from './CrossTestPage';
import mistakesService from '../../services/mistakesService';
import exerciseService from '../../services/exerciseService';

const mockNavigate = jest.fn();
let mockParams = {};
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, useParams: () => mockParams }), { virtual: true });
jest.mock('../../services/mistakesService', () => ({ getSubjectExam: jest.fn(), answerSubjectExam: jest.fn(), getCrossTopicTest: jest.fn() }));
jest.mock('../../services/exerciseService', () => ({ checkAnswer: jest.fn() }));
jest.mock('./ReportQuestion', () => () => null);
jest.mock('./useScrollToQuestion', () => () => ({ current: null }));

const question = (id, options) => ({
  id, question_number: Number(id.slice(1)), type: 'multiple_choice', question_text_he: `שאלה ${id}`, options, lesson_title: 'שברים', subject: 'math'
});
const examOf = (...exercises) => ({ subject: 'math', waiting: 5, exercises });
// The page selects a question's first option just after showing it; check once it has.
const answerSelected = () => waitFor(() => expect(screen.getByText('בדוק תשובה')).toBeEnabled());
const check = async () => {
  await answerSelected();
  fireEvent.click(screen.getByText('בדוק תשובה'));
};
const next = () => fireEvent.click(screen.getByText('שאלה הבאה →'));
const enter = () => fireEvent.keyDown(window, { key: 'Enter' });
const lastState = () => mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1][1].state;

/** The mistakes exam on /mistakes-exam/:subject: each checked answer is graded (and fixed) by the API. */
describe('CrossTestPage: a subject\'s mistakes exam', () => {
  let waiting;

  beforeEach(() => {
    waiting = 5;
    mockNavigate.mockClear();
    mockParams = { subject: 'math' };
    window.confirm = jest.fn(() => true);
    // CRA resets mock implementations before each test; set them here.
    mistakesService.getSubjectExam.mockResolvedValue(examOf(question('q1', ['1', '2']), question('q2', ['3', '4']), question('q3', ['5', '6'])));
    // '1' and '3' are the right answers; a right answer fixes its mistake.
    mistakesService.answerSubjectExam.mockImplementation(async (subject, exerciseId, userAnswer) => {
      const right = ['1', '3'].includes(userAnswer);
      if (right) waiting -= 1;
      return { exerciseId, isCorrect: right, fixed: right, correctAnswer: exerciseId === 'q3' ? '6' : userAnswer, explanationHe: null, explanationPicture: null, waiting };
    });
    exerciseService.checkAnswer.mockResolvedValue({ isCorrect: true, correctAnswer: '1', explanationHe: null });
  });

  test('checking an answer grades it through the API, for the subject', async () => {
    render(<CrossTestPage />);
    await screen.findByText('שאלה q1');
    expect(mistakesService.getSubjectExam).toHaveBeenCalledWith('math');
    await check();
    await waitFor(() => expect(mistakesService.answerSubjectExam).toHaveBeenCalledWith('math', 'q1', '1'));
    expect(exerciseService.checkAnswer).not.toHaveBeenCalled();
  });

  test('a question never checked is not graded; the results are the checked answers', async () => {
    render(<CrossTestPage />);
    await screen.findByText('שאלה q1');
    await check(); // q1: right, fixed
    await screen.findByText('שאלה הבאה →');
    await waitFor(() => expect(screen.queryByText('בדוק תשובה')).toBeNull());
    next(); // q2: shown with its first option selected, never checked
    await screen.findByText('שאלה q2');
    next();
    await screen.findByText('שאלה q3');
    await check(); // q3: wrong
    await waitFor(() => expect(mistakesService.answerSubjectExam).toHaveBeenCalledTimes(2));
    fireEvent.click(await screen.findByText('סיים ושלח'));

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('יש 1 שאלות שלא נענו'));
    expect(mistakesService.answerSubjectExam.mock.calls.map(([, id]) => id)).toEqual(['q1', 'q3']);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate.mock.calls[0][0]).toBe('/cross-test/results');
    const state = lastState();
    expect(state).toMatchObject({ subject: 'math', correctAnswers: 1, totalQuestions: 3, fixed: 1, waiting: 4 });
    expect(state.results.map(r => [r.exercise.id, r.userAnswer, r.feedback.isCorrect])).toEqual([['q1', '1', true], ['q3', '5', false]]);
  });

  test('a double Enter on the last question submits once', async () => {
    mistakesService.getSubjectExam.mockResolvedValue(examOf(question('q1', ['1', '2'])));
    render(<CrossTestPage />);
    await screen.findByText('שאלה q1');
    await answerSelected();
    enter(); // checks the selected answer
    await screen.findByText('סיים ושלח');
    await waitFor(() => expect(screen.queryByText('בדוק תשובה')).toBeNull());
    enter();
    enter();
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(lastState()).toMatchObject({ correctAnswers: 1, totalQuestions: 1, fixed: 1, waiting: 4 });
  });

  test('a question that no longer waits is only checked, and fixes nothing', async () => {
    mistakesService.getSubjectExam.mockResolvedValue(examOf(question('q1', ['1', '2'])));
    mistakesService.answerSubjectExam.mockRejectedValue({ success: false, code: 'not_waiting' });
    render(<CrossTestPage />);
    await screen.findByText('שאלה q1');
    await check();
    await waitFor(() => expect(exerciseService.checkAnswer).toHaveBeenCalledWith('q1', '1'));
    fireEvent.click(await screen.findByText('סיים ושלח'));
    expect(lastState()).toMatchObject({ correctAnswers: 1, fixed: 0, waiting: 5 });
  });

  test('with nothing waiting, kind words instead of an exam', async () => {
    mistakesService.getSubjectExam.mockResolvedValue({ subject: 'math', waiting: 0, exercises: [] });
    render(<CrossTestPage />);
    expect(await screen.findByText(/אין טעויות לתקן/)).toBeInTheDocument();
    expect(screen.queryByText('בדוק תשובה')).toBeNull();
  });
});
