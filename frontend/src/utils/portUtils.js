// frontend/src/utils/portUtils.js
import axios from 'axios';

const MIN_PORT = 9001;
const MAX_PORT = 9999;

export const generateRandomPort = () => {
  return Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1)) + MIN_PORT;
};

export const checkPortAvailability = async (port) => {
  try {
    const response = await axios.get(`/api/mock/status`);
    const runningPorts = response.data.map(instance => instance.port);
    return !runningPorts.includes(port);
  } catch (error) {
    console.error('Error checking port availability:', error);
    return false;
  }
};

export const getAvailablePort = async () => {
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loop

  while (attempts < maxAttempts) {
    const port = generateRandomPort();
    const isAvailable = await checkPortAvailability(port);
    
    if (isAvailable) {
      return port;
    }
    
    attempts++;
  }
  
  throw new Error('No available ports found in range');
};
