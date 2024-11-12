import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { startMockServer } from '../api/mockoonApi';

export const NewInstance = ({ configs, onStart }) => {
  const [port, setPort] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');

  const handleStart = async () => {
    try {
      await startMockServer(parseInt(port), selectedConfig);
      toast.success(`Started mock server on port ${port}`);
      setPort('');
      setSelectedConfig('');
      onStart();
    } catch (error) {
      toast.error(error.message || 'Failed to start mock server');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Start New Instance</h2>
      <div className="flex gap-4">
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Port number"
          className="px-3 py-2 border rounded w-32"
          min="1024"
          max="65535"
        />
        <select
          value={selectedConfig}
          onChange={(e) => setSelectedConfig(e.target.value)}
          className="px-3 py-2 border rounded flex-1"
        >
          <option value="">Select config file</option>
          {configs.map(config => (
            <option key={config.name} value={config.name}>
              {config.name} ({config.size})
            </option>
          ))}
        </select>
        <button
          onClick={handleStart}
          disabled={!port || !selectedConfig}
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
