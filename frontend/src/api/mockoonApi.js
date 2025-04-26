// frontend/src/api/mockoonApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Barer ` + API_KEY
    }
});

// Add response interceptor for handling auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('Authentication failed');
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
