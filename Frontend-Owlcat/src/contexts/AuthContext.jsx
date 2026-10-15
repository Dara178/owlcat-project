import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignored
    } finally {
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAuth() {
      const savedToken = storage.getToken();
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (isMounted && res && res.user) {
            setUser(res.user);
          }
        } catch (err) {
          if (err.status === 401 && isMounted) {
            storage.clearAuth();
            setUser(null);
            setToken(null);
          }
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadAuth();
    }, 0);

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('owlcat:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      window.removeEventListener('owlcat:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
