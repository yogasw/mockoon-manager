// frontend/src/api/mockoonApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add basic auth header if credentials are provided
    ...(AUTH_USERNAME && AUTH_PASSWORD ? {
      'Authorization': `Basic ${btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`)}`
    } : {})
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
  const response = await api.get('/mock/status');
  return response.data;
};

export const getConfigs = async () => {
  const response = await api.get('/mock/configs');
  return response.data;
};

export const uploadConfig = async (formData) => {
  const response = await api.post('/mock/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadConfig = async (filename) => {
  return await api.get(`/mock/configs/${filename}/download`);
};

export const startMockServer = async (port, configFile) => {
  const response = await api.post('/mock/start', {
    port,
    configFile,
  });
  return response.data;
};

export const stopMockServer = async (port) => {
  const response = await api.post('/mock/stop', {
    port,
  });
  return response.data;
};

export const deleteConfig = async (filename) => {
  const response = await api.delete(`/mock/configs/${filename}`);
  return response.data;
};