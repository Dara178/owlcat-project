import { apiClient } from './apiClient';
import { storage } from '../utils/storage';

export const authService = {
  async register({ name, email, password, password_confirmation }) {
    const res = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = res.data;
    if (token) {
      storage.setToken(token);
    }
    if (user) {
      storage.setUser(user);
    }
    return { user, token };
  },

  async login({ email, password }) {
    const res = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    const { user, token } = res.data;
    if (token) {
      storage.setToken(token);
    }
    if (user) {
      storage.setUser(user);
    }
    return { user, token };
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      console.warn('Error during remote logout:', e);
    } finally {
      storage.clearAuth();
    }
  },

  async getMe() {
    const res = await apiClient.get('/api/me');
    const user = res.data?.user || res.data;
    if (user) {
      storage.setUser(user);
    }
    return res.data;
  }
};
