import { render, screen, fireEvent } from '@testing-library/react';
import ReportQuestion from './ReportQuestion';
import reportService from '../../services/reportService';

jest.mock('../../services/reportService', () => ({ reportQuestion: jest.fn() }));

describe('ReportQuestion', () => {
  beforeEach(() => reportService.reportQuestion.mockReset());

  test('one tap on a reason sends the report and thanks the student', async () => {
    reportService.reportQuestion.mockResolvedValue({ reportId: 'r1', duplicate: false });
    render(<ReportQuestion exerciseId="e1" />);
    fireEvent.click(screen.getByText('🚩 דיווח על טעות בשאלה'));
    fireEvent.click(screen.getByText('יש יותר מתשובה נכונה אחת'));
    expect(await screen.findByText('🚩 תודה! נבדוק את השאלה.')).toBeInTheDocument();
    expect(reportService.reportQuestion).toHaveBeenCalledWith('e1', 'two_answers', undefined);
  });

  test('"other" asks for an optional note first', async () => {
    reportService.reportQuestion.mockResolvedValue({ reportId: 'r2', duplicate: false });
    render(<ReportQuestion exerciseId="e2" />);
    fireEvent.click(screen.getByText('🚩 דיווח על טעות בשאלה'));
    fireEvent.click(screen.getByText('משהו אחר'));
    fireEvent.change(screen.getByPlaceholderText('כמה מילים (לא חובה)'), { target: { value: ' typo in option 3 ' } });
    fireEvent.click(screen.getByText('שליחה'));
    expect(await screen.findByText('🚩 תודה! נבדוק את השאלה.')).toBeInTheDocument();
    expect(reportService.reportQuestion).toHaveBeenCalledWith('e2', 'other', 'typo in option 3');
  });

  test('shows the daily-cap message and lets the student cancel', async () => {
    reportService.reportQuestion.mockRejectedValue({ code: 'report_cap', message: 'הגעת למכסת הדיווחים להיום.' });
    render(<ReportQuestion exerciseId="e3" />);
    fireEvent.click(screen.getByText('🚩 דיווח על טעות בשאלה'));
    fireEvent.click(screen.getByText('השאלה לא ברורה'));
    expect(await screen.findByRole('alert')).toHaveTextContent('הגעת למכסת הדיווחים להיום.');
    fireEvent.click(screen.getByText('ביטול'));
    expect(screen.getByText('🚩 דיווח על טעות בשאלה')).toBeInTheDocument();
  });
});
