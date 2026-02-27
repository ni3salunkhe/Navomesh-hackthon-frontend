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
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
};

// Document APIs
export const documentAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getAll: () => api.get('/api/documents'),
};

// Transaction APIs
export const transactionAPI = {
    getAll: () => api.get('/api/transactions'),
    getMonthly: (month) => api.get(`/api/transactions/monthly?month=${month}`),
    getByCategory: () => api.get('/api/transactions/category'),
};

// Analytics APIs
export const analyticsAPI = {
    getSummary: () => api.get('/api/analytics/summary'),
    getRisk: () => api.get('/api/analytics/risk'),
    getRecurring: () => api.get('/api/analytics/recurring'),
    getMonthlyTrend: () => api.get('/api/analytics/monthly'),
    getCategories: () => api.get('/api/analytics/categories'),
};

export default api;
