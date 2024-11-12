import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { startMockServer } from '../api/mockoonApi';

const NewInstance = ({ configs, onStart }) => {
  const [port, setPort] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [portError, setPortError] = useState('');

  const validatePort = (value) => {
    const portNum = parseInt(value);
    if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
      setPortError('Port must be between 1024 and 65535');
      return false;
    }
    setPortError('');
    return true;
  };

  const handlePortChange = (e) => {
    const value = e.target.value;
    setPort(value);
    validatePort(value);
  };

  const handleStart = async () => {
    if (!validatePort(port)) return;

    try {
      await startMockServer(parseInt(port), selectedConfig);
      toast.success(`Started mock server on port ${port}`);
      setPort('');
      setSelectedConfig('');
      onStart();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start mock server');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Start New Instance</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="number"
            value={port}
            onChange={handlePortChange}
            placeholder="Port number (1024-65535)"
            className={`px-3 py-2 border rounded w-full ${
              portError ? 'border-red-500' : ''
            }`}
            min="1024"
            max="65535"
          />
          {portError && (
            <p className="text-sm text-red-500 mt-1">{portError}</p>
          )}
        </div>
        <div className="flex-2">
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          >
            <option value="">Select config file</option>
            {configs
              .filter(config => !config.inUse)
              .map(config => (
                <option key={config.name} value={config.name}>
                  {config.name} ({config.size})
                </option>
              ))}
          </select>
        </div>
        <button
          onClick={handleStart}
          disabled={!port || !selectedConfig || !!portError}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Start
        </button>
      </div>
    </div>
  );
};

export default NewInstance;