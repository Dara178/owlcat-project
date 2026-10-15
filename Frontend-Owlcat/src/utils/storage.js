const TOKEN_KEY = 'owlcat_auth_token';
const USER_KEY = 'owlcat_auth_user';
const MOCK_DATA_KEY = 'owlcat_mock_state_v1';

export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Error saving auth token:', e);
    }
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Error saving user data:', e);
    }
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Error clearing auth:', e);
    }
  },

  getMockData: () => {
    try {
      const raw = localStorage.getItem(MOCK_DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setMockData: (data) => {
    try {
      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving mock state:', e);
    }
  },

  clearMockData: () => {
    try {
      localStorage.removeItem(MOCK_DATA_KEY);
    } catch (e) {
      console.error('Error clearing mock state:', e);
    }
  }
};
