// frontend/src/components/ConfigList.jsx
import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteConfig } from '../api/mockoonApi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, filename }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-4">Are you sure you want to delete {filename}?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfigList = ({ configs, onConfigDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = async (filename) => {
    try {
      await deleteConfig(filename);
      toast.success(`Deleted ${filename}`);
      onConfigDelete();
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete configuration');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Available Configurations</h2>
        <div className="space-y-4">
          {configs.map(config => (
            <div key={config.name} 
                 className="flex items-center justify-between p-4 bg-gray-50 rounded hover:bg-gray-100">
              <div className="flex-1">
                <div className="font-medium">{config.name}</div>
                <div className="text-sm text-gray-600">
                  Size: {config.size}
                </div>
                {config.inUse && (
                  <div className="flex items-center text-sm text-orange-600 mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Currently in use
                  </div>
                )}
              </div>
              <button
                onClick={() => setConfirmDelete(config.name)}
                disabled={config.inUse}
                className="p-2 text-red-500 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={config.inUse ? 'Cannot delete while in use' : 'Delete configuration'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {configs.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              No configurations available
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        filename={confirmDelete}
      />
    </div>
  );
};

export default ConfigList;