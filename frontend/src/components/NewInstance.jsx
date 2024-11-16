// frontend/src/components/NewInstance.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { startMockServer } from '../api/mockoonApi';
import { getAvailablePort } from '../utils/portUtils';

const NewInstance = ({ configs, instances, onStart }) => {
  const [selectedConfig, setSelectedConfig] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Get list of configs currently in use
  const configsInUse = useMemo(() => {
    return new Set(instances.map(instance => instance.configFile));
  }, [instances]);

  // Filter available configs
  const availableConfigs = useMemo(() => {
    return configs.filter(config => !configsInUse.has(config.name));
  }, [configs, configsInUse]);

  // Reset selection when available configs change
  useEffect(() => {
    const configExists = availableConfigs.some(config => config.name === selectedConfig);
    if (!configExists) {
      setSelectedConfig('');
    }
  }, [availableConfigs, selectedConfig]);

  const handleStart = async () => {
    if (!selectedConfig) return;
    
    try {
      setIsStarting(true);
      const port = await getAvailablePort();
      await startMockServer(port, selectedConfig);
      toast.success(`Started mock server on port ${port}`);
      setSelectedConfig('');
      onStart();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start mock server');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Start New Instance</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select config file</option>
            {availableConfigs.map(config => (
              <option key={config.name} value={config.name}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStart}
          disabled={!selectedConfig || isStarting}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Play className="w-4 h-4" />
          {isStarting ? 'Starting...' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default NewInstance;