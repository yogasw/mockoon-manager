import React from 'react';
import { Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stopMockServer } from '../api/mockoonApi';

export const InstanceList = ({ instances, onStop }) => {
  const handleStop = async (port) => {
    try {
      await stopMockServer(port);
      toast.success(`Stopped mock server on port ${port}`);
      onStop();
    } catch (error) {
      toast.error(error.message || 'Failed to stop mock server');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Running Instances</h2>
        <div className="space-y-4">
          {instances.map(instance => (
            <div key={instance.port} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="font-medium">Port: {instance.port}</div>
                <div className="text-sm text-gray-600">Config: {instance.configFile}</div>
                <div className="text-sm text-gray-600">
                  Uptime: {instance.uptimeFormatted}
                </div>
              </div>
              <button
                onClick={() => handleStop(instance.port)}
                className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </div>
          ))}
          {instances.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              No running instances
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstanceList;
