import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => { 
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: ( email, password) => 
        api.post('/auth/register', { email, password }),
    login: (email, password) => 
        api.post('/auth/login', { email, password }),
};

export const stockAPI = {
    getAll: () => api.get('/stocks'),
    getOne: (symbol) => api.get(`/stocks/${symbol}`),
    getHistory: (symbol) => api.get(`/stocks/${symbol}/history`),
    search: (query) => api.get(`/stocks/search?query=${query}`),
};

export const watchlistAPI = {
    getAll: () => api.get('/watchlist'),
    add: (stockId) => api.post('/watchlist', { stockId }),
    remove: (id) => api.delete(`/watchlist/${id}`), 
};

export default api;