import { render, screen, fireEvent, act } from '@testing-library/react';
import LessonAnimation from './LessonAnimation';

const scenes = [
  { name: 'א', steps: [{ caption: 'צעד 1: 1/2', draw: () => <rect data-testid="s1" /> }, { caption: 'צעד 2', draw: () => <rect data-testid="s2" /> }] },
  { name: 'ב', steps: [{ caption: 'צעד 3', draw: () => <rect data-testid="s3" /> }] },
];

describe('LessonAnimation', () => {
  beforeEach(() => jest.useFakeTimers());

  test('starts paused on a narrow screen and playing on a wide one', () => {
    const mm = (wide) => jest.fn((q) => ({ matches: q.includes('min-width') ? wide : false, addListener: () => {}, removeListener: () => {} }));
    const original = window.matchMedia;
    try {
      window.matchMedia = mm(false);
      const { unmount } = render(<LessonAnimation scenes={scenes} />);
      expect(screen.getByLabelText('הפעל')).toBeInTheDocument();
      unmount();
      window.matchMedia = mm(true);
      render(<LessonAnimation scenes={scenes} />);
      expect(screen.getByLabelText('השהה')).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
  afterEach(() => jest.useRealTimers());

  test('renders the first step with a stacked fraction in the caption and scene tabs', () => {
    render(<LessonAnimation scenes={scenes} autoplay={false} />);
    expect(screen.getByTestId('s1')).toBeInTheDocument();
    expect(screen.getByText('צעד 1:')).toBeInTheDocument();
    expect(document.querySelector('.la-caption .math-frac')).not.toBeNull();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByText('שלב 1 מתוך 2')).toBeInTheDocument();
  });

  test('forward and back move through steps and scenes; the last step disables forward', () => {
    render(<LessonAnimation scenes={scenes} autoplay={false} />);
    const next = screen.getByLabelText('צעד קדימה');
    const prev = screen.getByLabelText('צעד אחורה');
    expect(prev).toBeDisabled();
    fireEvent.click(next);
    expect(screen.getByTestId('s2')).toBeInTheDocument();
    fireEvent.click(next);
    expect(screen.getByTestId('s3')).toBeInTheDocument();
    expect(next).toBeDisabled();
    fireEvent.click(prev);
    expect(screen.getByTestId('s2')).toBeInTheDocument();
  });

  test('auto-advance steps every stepMs and stops after the last step', () => {
    render(<LessonAnimation scenes={scenes} stepMs={1000} autoplay />);
    expect(screen.getByLabelText('השהה')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId('s2')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId('s3')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId('s3')).toBeInTheDocument();
    expect(screen.getByLabelText('הפעל')).toBeInTheDocument();
  });

  test('play from the end restarts; keyboard: left = forward, right = back, space toggles', () => {
    render(<LessonAnimation scenes={scenes} autoplay={false} />);
    const root = screen.getByLabelText('הסבר מונפש');
    fireEvent.click(screen.getAllByRole('tab')[1]);
    expect(screen.getByTestId('s3')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('הפעל'));
    expect(screen.getByTestId('s1')).toBeInTheDocument();
    fireEvent.keyDown(root, { key: ' ' });
    expect(screen.getByLabelText('הפעל')).toBeInTheDocument();
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(screen.getByTestId('s2')).toBeInTheDocument();
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(screen.getByTestId('s1')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByLabelText('צעד קדימה'), { key: ' ' });
    expect(screen.getByLabelText('הפעל')).toBeInTheDocument(); // space on a button does not toggle play
  });
});
