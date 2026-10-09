import { render, screen } from '@testing-library/react';
import Assessment from './Assessment';

describe('Assessment', () => {
  test('shows words, never a score', () => {
    const { container } = render(<Assessment correct={3} total={10} />);
    expect(screen.getByText('התחלה טובה!')).toBeInTheDocument();
    expect(container.querySelector('.assessment-starting')).not.toBeNull();
    expect(container.textContent).not.toMatch(/%|ציון/);
  });

  test('all answers right gets the top words; an extra line shows under them', () => {
    const { container } = render(<Assessment correct={8} total={8}>כל השאלות</Assessment>);
    expect(screen.getByText('מושלם!')).toBeInTheDocument();
    expect(container.querySelector('.assessment-detail').textContent).toBe('כל השאלות');
  });
});
