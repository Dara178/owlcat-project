import { apiClient } from './apiClient';

export const owlcatService = {
  async adopt(name) {
    const res = await apiClient.post('/api/owlcats', { name });
    return res.data;
  },

  async getOwlcat(id) {
    const res = await apiClient.get(`/api/owlcats/${id}`);
    return res.data;
  },

  async interact(owlcatId, type, message = '') {
    const body = { type };
    if (message && message.trim()) {
      body.message = message.trim();
    }
    const res = await apiClient.post(`/api/owlcats/${owlcatId}/interactions`, body);
    return res.data;
  },

  async getJournal(owlcatId, page = 1) {
    const res = await apiClient.get(`/api/owlcats/${owlcatId}/journal?page=${page}`);
    return {
      entries: res.data || [],
      meta: res.meta || { current_page: 1, last_page: 1, total: (res.data || []).length }
    };
  },

  async getSkills(owlcatId) {
    const res = await apiClient.get(`/api/owlcats/${owlcatId}/skills`);
    return res.data || { unlocked: [], locked: [] };
  },

  async getEvolutionStages() {
    const res = await apiClient.get('/api/evolution-stages');
    return res.data || [];
  }
};
