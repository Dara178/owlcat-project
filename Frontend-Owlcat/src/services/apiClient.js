import { storage } from '../utils/storage';
import { mockBackend } from './mockBackend';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let isBackendAvailable = null; // null: unknown, true: online, false: offline/mock
const listeners = new Set();

export function subscribeBackendStatus(callback) {
  listeners.add(callback);
  callback(isBackendAvailable);
  return () => listeners.delete(callback);
}

function notifyBackendStatus(status) {
  if (isBackendAvailable !== status) {
    isBackendAvailable = status;
    listeners.forEach(cb => cb(status));
  }
}

export class ApiError extends Error {
  constructor(message, status = 500, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const token = storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // If backend was already marked offline, try mock backend first
  if (isBackendAvailable === false && options.useMockFallback !== false) {
    return handleMockFallback(endpoint, options);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    notifyBackendStatus(true);

    if (res.status === 401) {
      storage.clearAuth();
      window.dispatchEvent(new CustomEvent('owlcat:unauthorized'));
      throw new ApiError('Sesión expirada o no autorizada.', 401);
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = json.message || `Error en la petición (${res.status})`;
      throw new ApiError(errorMessage, res.status, json.errors || {});
    }

    return json;
  } catch (err) {
    if (err.name === 'ApiError') {
      throw err;
    }

    // Network error, fetch failed or aborted -> fallback to mock backend
    console.warn(`[ApiClient] No se pudo conectar con el backend en ${API_URL}. Usando simulador local/demo.`, err.message);
    notifyBackendStatus(false);

    if (options.useMockFallback !== false) {
      return handleMockFallback(endpoint, options);
    }

    throw new ApiError('No se pudo conectar con el servidor backend.', 0);
  }
}

async function handleMockFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Simulate network latency for natural feel
  await new Promise(r => setTimeout(r, 200));

  if (endpoint.includes('/api/auth/register')) {
    return mockBackend.register(body);
  }
  if (endpoint.includes('/api/auth/login')) {
    return mockBackend.login(body);
  }
  if (endpoint.includes('/api/auth/logout')) {
    return { message: 'Sesión cerrada correctamente' };
  }
  if (endpoint.includes('/api/me') || endpoint.includes('/api/user')) {
    return mockBackend.getMe();
  }
  if (endpoint.includes('/interactions') && method === 'POST') {
    const owlcatId = endpoint.split('/')[3] || 1;
    return mockBackend.interact(owlcatId, body.type, body.message);
  }
  if (endpoint.includes('/journal')) {
    return mockBackend.getJournal();
  }
  if (endpoint.includes('/skills')) {
    return mockBackend.getSkills();
  }
  if (endpoint.includes('/evolution-stages')) {
    return mockBackend.getEvolutionStages();
  }
  if (endpoint.includes('/api/owlcats') && method === 'POST') {
    return mockBackend.adopt(body.name);
  }
  if (endpoint.includes('/api/owlcats/')) {
    return mockBackend.getOwlcat();
  }

  return { data: null };
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  getBackendUrl: () => API_URL,
  isBackendAvailable: () => isBackendAvailable
};
