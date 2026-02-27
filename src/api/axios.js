import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/api/users/register', data), // updated endpoint
    login: (data) => api.post('/api/auth/login', data),
};

// Document APIs
export const documentAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/upload', formData, { // updated endpoint
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Dashboard API (Replaces transaction & analytics APIs)
export const dashboardAPI = {
    get: () => api.get('/api/dashboard'),
};

// Budget APIs
export const budgetAPI = {
    create: (data) => api.post('/api/budgets', data),
    getAll: () => api.get('/api/budgets'),
    delete: (id) => api.delete(`/api/budgets/${id}`),
};

// Transaction Override APIs
export const transactionAPI = {
    override: (id, data) => api.put(`/api/transactions/${id}/override`, data),
};

// Admin APIs
export const adminAPI = {
    getLogs: () => api.get('/api/admin/logs'),
};

export default api;
