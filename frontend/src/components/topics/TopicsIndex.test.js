import { render, screen } from '@testing-library/react';
import TopicsIndex from './TopicsIndex';
import lessonService from '../../services/lessonService';
import mistakesService from '../../services/mistakesService';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>
}), { virtual: true });
jest.mock('../../services/lessonService', () => ({ getAllLessons: jest.fn() }));
jest.mock('../../services/mistakesService', () => ({ getWaiting: jest.fn() }));

const topic = (number, lessons) => ({ topicNumber: number, lessons });
const lesson = (id, sub, status) => ({ id, subtopicNumber: sub, titleHe: id, titleEn: id, progress: { status, difficultyScores: {} } });

describe('TopicsIndex subject actions', () => {
  beforeEach(() => mistakesService.getWaiting.mockResolvedValue({ english: 0, math: 0, arabic: 0 }));

  test('English page offers vocabulary and reading passages', async () => {
    lessonService.getAllLessons.mockResolvedValue([topic(1, [lesson('E1', '1.1', 'not_started')])]);
    render(<TopicsIndex subject="english" />);
    expect((await screen.findByText('לימוד מילים')).closest('a').getAttribute('href')).toBe('/vocabulary');
    expect(screen.getByText('פסקאות באנגלית').closest('a').getAttribute('href')).toBe('/unseen');
    expect(screen.queryByText('תיקון טעויות')).toBeNull();
  });

  test('Math page offers its next lesson and mistakes review', async () => {
    lessonService.getAllLessons.mockResolvedValue([topic(101, [lesson('M1', '101.1', 'completed'), lesson('M2', '101.2', 'in_progress')])]);
    render(<TopicsIndex subject="math" />);
    expect((await screen.findByText('השיעור הבא')).closest('a').getAttribute('href')).toBe('/learn/M2');
    expect(screen.getByText('תיקון טעויות').closest('a').getAttribute('href')).toBe('/mistakes');
    expect(screen.queryByText('לימוד מילים')).toBeNull();
  });

  test("every subject offers its mistakes exam, with how many mistakes wait", async () => {
    mistakesService.getWaiting.mockResolvedValue({ english: 0, math: 0, arabic: 7 });
    lessonService.getAllLessons.mockResolvedValue([topic(201, [lesson('A1', '201.1', 'in_progress')])]);
    render(<TopicsIndex subject="arabic" />);
    const exam = (await screen.findByText('מבחן טעויות')).closest('a');
    expect(exam.getAttribute('href')).toBe('/mistakes-exam/arabic');
    expect(exam.querySelector('.subject-action-count').textContent).toBe('7');
  });

  test('with nothing waiting (or no count) the button shows no number', async () => {
    mistakesService.getWaiting.mockRejectedValue(new Error('offline'));
    lessonService.getAllLessons.mockResolvedValue([topic(1, [lesson('E1', '1.1', 'not_started')])]);
    render(<TopicsIndex subject="english" />);
    const exam = (await screen.findByText('מבחן טעויות')).closest('a');
    expect(exam.getAttribute('href')).toBe('/mistakes-exam/english');
    expect(exam.querySelector('.subject-action-count')).toBeNull();
  });
});
