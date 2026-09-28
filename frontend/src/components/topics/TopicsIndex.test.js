import { render, screen } from '@testing-library/react';
import TopicsIndex from './TopicsIndex';
import lessonService from '../../services/lessonService';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>
}), { virtual: true });
jest.mock('../../services/lessonService', () => ({ getAllLessons: jest.fn() }));

const topic = (number, lessons) => ({ topicNumber: number, lessons });
const lesson = (id, sub, status) => ({ id, subtopicNumber: sub, titleHe: id, titleEn: id, progress: { status, difficultyScores: {} } });

describe('TopicsIndex subject actions', () => {
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
});
