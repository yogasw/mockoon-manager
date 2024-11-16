// frontend/src/components/NewInstance.jsx
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { startMockServer } from '../api/mockoonApi';
import { getAvailablePort } from '../utils/portUtils';
import { instancesStore } from '../stores/instancesStore';

const NewInstance = ({ configs, onStart }) => {
  const [selectedConfig, setSelectedConfig] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (!selectedConfig) return;
    
    try {
      setIsStarting(true);
      const port = await getAvailablePort();

      // Optimistically add the instance
      instancesStore.addOptimisticInstance({
        port,
        configFile: selectedConfig,
        startTime: new Date(),
        uptimeFormatted: '0s',
        _fadeIn: true,
        _optimistic: true
      });

      // Actually start the server
      await startMockServer(port, selectedConfig);
      
      toast.success(`Started mock server on port ${port}`);
      setSelectedConfig('');
      onStart();
    } catch (error) {
      // If there's an error, remove the optimistic instance
      instancesStore.removeOptimisticInstance();
      toast.error(error.response?.data?.error || 'Failed to start mock server');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Start New Instance</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded w-full text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          disabled={!selectedConfig || isStarting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          {isStarting ? 'Starting...' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default NewInstance;