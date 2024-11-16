// frontend/src/components/InstanceList.jsx
import React, { useState } from 'react';
import { Square, Heart, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stopMockServer } from '../api/mockoonApi';
import { syncEmitter } from '../hooks/useDataFetching';

const HealthLink = ({ port }) => {
  const healthUrl = `/${port}/healthz`;
  
  return (
    <a
      href={healthUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors font-medium group"
    >
      <Heart className="w-4 h-4" />
      Health Check
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};

const InstanceList = ({ instances, onStop }) => {
  const [stoppingPorts, setStoppingPorts] = useState(new Set());

  const handleStop = async (port) => {
    setStoppingPorts(prev => new Set(prev).add(port));
    try {
      await stopMockServer(port);
      toast.success(`Stopped mock server on port ${port}`);
      // Trigger sync to update other components
      syncEmitter.emit();
      onStop();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to stop mock server');
    } finally {
      setStoppingPorts(prev => {
        const newSet = new Set(prev);
        newSet.delete(port);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      {instances.map(instance => (
        <div 
          key={instance.port} 
          className={`
            flex items-center justify-between p-4 bg-gray-700 rounded 
            hover:bg-gray-600 transition-all duration-200
            ${instance._fadeIn ? 'animate-fadeIn' : ''}
          `}
        >
          <div>
            <HealthLink port={instance.port} />
            <div className="font-medium text-white mt-2">Port: {instance.port}</div>
            <div className="text-sm text-gray-300">Config: {instance.configFile}</div>
            <div className="text-sm text-gray-300">
              Uptime: {instance.uptimeFormatted}
            </div>
          </div>
          <button
            onClick={() => handleStop(instance.port)}
            disabled={stoppingPorts.has(instance.port)}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4" />
            {stoppingPorts.has(instance.port) ? 'Stopping...' : 'Stop'}
          </button>
        </div>
      ))}
      {instances.length === 0 && (
        <div className="text-gray-400 text-center py-8">
          No running instances
        </div>
      )}
    </div>
  );
};

export default InstanceList;