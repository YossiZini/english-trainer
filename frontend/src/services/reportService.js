import api from './api';

/** A student reports a question they think is wrong (the api interceptor unwraps `data`). */
const reportService = {
  async reportQuestion(exerciseId, reason, note) {
    const response = await api.post('/reports', { exerciseId, reason, note: note || undefined });
    return response.data;
  }
};

export default reportService;
