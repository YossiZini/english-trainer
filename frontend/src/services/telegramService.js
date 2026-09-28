import api from './api';

/** Student side of the Telegram link (the api interceptor unwraps `data`). */
const telegramService = {
  async getLink() {
    const response = await api.get('/telegram/link');
    return response.data;
  },
  async requestCode() {
    const response = await api.post('/telegram/link-code');
    return response.data;
  },
  async unlink() {
    const response = await api.delete('/telegram/link');
    return response.data;
  }
};

export default telegramService;
