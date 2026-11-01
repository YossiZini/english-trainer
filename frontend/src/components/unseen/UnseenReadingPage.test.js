import { render, screen, fireEvent } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import UnseenReadingPage from './UnseenReadingPage';
import unseenService from '../../services/unseenService';

// The real router does not load under Jest (see App.test.js); the page uses
// only these two hooks. Implementations are set in beforeEach (CRA resets mocks).
jest.mock('react-router-dom', () => ({ useParams: jest.fn(), useNavigate: jest.fn() }));
jest.mock('../../services/unseenService', () => ({
  getParagraphById: jest.fn(), startSession: jest.fn(), submitAnswer: jest.fn(), completeSession: jest.fn()
}));

// A question as the API sends it: the explanation is in explanation_he.
const question = {
  id: 'q1',
  question_number: 1,
  question_text_en: 'What do tens of thousands of cranes do every winter?',
  question_text_he: 'מה עושים עשרות אלפי עגורים בכל חורף?',
  options: ['They fly on to Africa', 'They stay in the Hula Valley', 'They fly back north to Europe', 'They build nests in Israel'],
  correct_answer: 1,
  explanation_he: 'הטקסט אומר: "tens of thousands of cranes stay in the Hula Valley" - הם נשארים בעמק החולה כל החורף.'
};

beforeEach(() => {
  useParams.mockReturnValue({ paragraphId: 'p1' });
  useNavigate.mockReturnValue(jest.fn());
  unseenService.getParagraphById.mockResolvedValue({
    data: {
      paragraph: { id: 'p1', title_en: 'The Great Bird Migration', title_he: 'המסע הגדול של הציפורים', content: 'Every winter, tens of thousands of cranes stay in the Hula Valley.', hard_words: [] },
      questions: [question]
    }
  });
  unseenService.startSession.mockResolvedValue({ data: { session: { id: 's1' } } });
  unseenService.submitAnswer.mockResolvedValue({ success: true });
});

describe('UnseenReadingPage', () => {
  test.each([
    ['a wrong answer', 'They fly on to Africa'],
    ['a right answer', 'They stay in the Hula Valley']
  ])('after %s is checked, the question\'s Hebrew explanation is shown (d7)', async (_, option) => {
    render(<UnseenReadingPage />);
    fireEvent.click(await screen.findByText(option));
    fireEvent.click(screen.getByText('בדוק תשובה (Enter)'));

    expect(await screen.findByText(/הם נשארים בעמק החולה כל החורף/)).toBeInTheDocument();
    expect(unseenService.submitAnswer).toHaveBeenCalledWith('s1', 'q1', question.options.indexOf(option));
    // Not the fallback lines, which are only for a question without an explanation.
    expect(screen.queryByText(/התשובה הנכונה היא:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/כל הכבוד! התשובה נכונה\./)).not.toBeInTheDocument();
  });
});
