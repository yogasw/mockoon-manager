import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getMockStatus = async () => {
  const response = await axios.get(`${API_URL}/mock/status`);
  return response.data;
};

export const getConfigs = async () => {
  const response = await axios.get(`${API_URL}/mock/configs`);
  return response.data;
};

export const uploadConfig = async (formData) => {
  const response = await axios.post(`${API_URL}/mock/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const startMockServer = async (port, configFile) => {
  const response = await axios.post(`${API_URL}/mock/start`, {
    port,
    configFile,
  });
  return response.data;
};

export const stopMockServer = async (port) => {
  const response = await axios.post(`${API_URL}/mock/stop`, {
    port,
  });
  return response.data;
};

export const deleteConfig = async (filename) => {
  const response = await axios.delete(`${API_URL}/mock/configs/${filename}`);
  return response.data;
};
