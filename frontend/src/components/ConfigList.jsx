import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteConfig } from '../api/mockoonApi';

const ConfigList = ({ configs, onConfigDelete, onConfigSelect }) => {
  const handleDelete = async (filename) => {
    try {
      await deleteConfig(filename);
      toast.success(`Deleted ${filename}`);
      onConfigDelete();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete configuration');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Available Configurations</h2>
      <div className="space-y-4">
        {configs.map(config => (
          <div key={config.name} 
               className="flex items-center justify-between p-4 bg-gray-50 rounded hover:bg-gray-100">
            <div className="flex-1">
              <div className="font-medium">{config.name}</div>
              <div className="text-sm text-gray-600">
                Size: {config.size} • Modified: {new Date(config.modified).toLocaleString()}
              </div>
              {config.inUse && (
                <div className="flex items-center text-sm text-orange-600 mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Currently in use
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDelete(config.name)}
                disabled={config.inUse}
                className="p-2 text-red-500 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={config.inUse ? 'Cannot delete while in use' : 'Delete configuration'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {configs.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No configurations available
          </div>
        )}
      </div>
    </div>
  );
};
