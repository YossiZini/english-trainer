import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TelegramLinkPage from './TelegramLinkPage';
import telegramService from '../../services/telegramService';

jest.mock('../../services/telegramService', () => ({
  getLink: jest.fn(), requestCode: jest.fn(), unlink: jest.fn()
}));

describe('TelegramLinkPage', () => {
  test('shows the state, issues a code and unlinks', async () => {
    telegramService.getLink.mockResolvedValueOnce({ linked: false }).mockResolvedValue({ linked: true });
    telegramService.requestCode.mockResolvedValue({ code: '123456', expiresAt: 'x' });
    telegramService.unlink.mockResolvedValue({ removed: true });

    render(<TelegramLinkPage />);
    expect(await screen.findByText('הטלגרם עדיין לא מחובר')).toBeInTheDocument();

    fireEvent.click(screen.getByText('קבלו קוד חיבור'));
    expect(await screen.findByText('123456')).toBeInTheDocument();
    expect(telegramService.requestCode).toHaveBeenCalledTimes(1);
  });

  test('a linked account offers to unlink', async () => {
    telegramService.getLink.mockResolvedValueOnce({ linked: true }).mockResolvedValue({ linked: false });
    telegramService.unlink.mockResolvedValue({ removed: true });
    render(<TelegramLinkPage />);
    fireEvent.click(await screen.findByText('נתקו את הטלגרם'));
    await waitFor(() => expect(telegramService.unlink).toHaveBeenCalled());
    expect(await screen.findByText('הטלגרם עדיין לא מחובר')).toBeInTheDocument();
  });

  test('lists the bot commands, a lesson command for every subject', async () => {
    telegramService.getLink.mockResolvedValue({ linked: false });
    render(<TelegramLinkPage />);
    await screen.findByText('הטלגרם עדיין לא מחובר');
    ['/words', '/english', '/math', '/arabic', '/end', '/help'].forEach((command) =>
      expect(screen.getByText(command)).toBeInTheDocument());
  });
});
