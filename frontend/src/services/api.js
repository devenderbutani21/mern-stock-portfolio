import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => { 
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (name, email, password) => 
        api.post('/auth/register', { name, email, password }),
    login: (email, password) => 
        api.post('/auth/login', { email, password }),
};

export const stockAPI = {
    getAll: () => api.get('/stocks'),
    getOne: (symbol) => api.get(`/stocks/${symbol}`),
    getHistory: (symbol) => api.post(`/stocks/${symbol}/history`),
};

export const watchlistAPI = {
    getAll: () => api.get('/watchlist'),
    getOne: (stockId) => api.post('/watchlist', { stockId }),
    remove: (id) => api.delete(`/watchlist/${id}`), 
};

export default api;