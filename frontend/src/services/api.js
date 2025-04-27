import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// User Management Services
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Metrics Services
export const metricsService = {
  getSystemMetrics: async () => {
    const response = await api.get('/metrics/system');
    return response.data;
  },

  getMetricHistory: async (type, hours = 24) => {
    const response = await api.get('/metrics/history', {
      params: { type, hours }
    });
    return response.data;
  },
};

// Alert Management Services
export const alertService = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },

  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  updateAlert: async (alertId, alertData) => {
    const response = await api.put(`/alerts/${alertId}`, alertData);
    return response.data;
  },

  deleteAlert: async (alertId) => {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  },

  toggleAlert: async (alertId) => {
    const response = await api.put(`/alerts/${alertId}/toggle`);
    return response.data;
  },
};

// System Settings Services
export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
};

// Health Check Service
export const healthService = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  getDetailedHealth: async () => {
    const response = await api.get('/health/detailed');
    return response.data;
  },

  getComponentHealth: async (component) => {
    const response = await api.get(`/health/components/${component}`);
    return response.data;
  },
};

// System Logs Services
export const logsService = {
  getLogs: async (params = {}) => {
    const response = await api.get('/logs', { params });
    return response.data;
  },
};

// Backup Management Services
export const backupService = {
  getBackups: async () => {
    const response = await api.get('/backups');
    return response.data;
  },

  createBackup: async (backupData) => {
    const response = await api.post('/backups', backupData);
    return response.data;
  },

  downloadBackup: async (backupId) => {
    const response = await api.get(`/backups/${backupId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  getSettings: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/notifications', settingsData);
    return response.data;
  },

  testNotification: async (type) => {
    const response = await api.post('/notifications/test', { type });
    return response.data;
  },
};

export default api; 