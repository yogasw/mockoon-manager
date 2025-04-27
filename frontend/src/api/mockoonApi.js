// frontend/src/api/mockoonApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to add auth header
api.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            const { username, password } = JSON.parse(auth);
            config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('Authentication failed');
            localStorage.removeItem('auth');
        }
        return Promise.reject(error);
    }
);

export const getMockStatus = async () => {
    const response = await api.get('/api/mock/status');
    return response.data.data;
};

export const getConfigs = async () => {
    const response = await api.get('/api/mock/configs');
    return response.data.data;
};

export const uploadConfig = async (formData) => {
    const response = await api.post('/api/mock/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const downloadConfig = async (filename) => {
    return await api.get(`/api/mock/configs/${filename}/download`);
};

export const startMockServer = async (port, configFile) => {
    const response = await api.post('/api/mock/start', {
        port,
        configFile,
    });
    return response.data;
};

export const stopMockServer = async (port) => {
    const response = await api.post('/api/mock/stop', {
        port,
    });
    return response.data;
};

export const deleteConfig = async (filename) => {
    const response = await api.delete(`/api/mock/configs/${filename}`);
    return response.data;
};

export const syncToGit = async () => {
    const response = await api.post('/api/mock/sync');
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/api/auth', credentials);
    if (response.data.success) {
        localStorage.setItem('auth', JSON.stringify({
            username: credentials.username,
            password: credentials.password
        }));
    }
    return response.data.success;
};
