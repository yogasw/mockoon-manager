// frontend/src/components/ConfigList.jsx
import React, { useState } from 'react';
import { Trash2, AlertCircle, Download, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteConfig, downloadConfig } from '../api/mockoonApi';

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, filename }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-white">Confirm Delete</h3>
        <p className="mb-4 text-gray-300">Are you sure you want to delete {filename}?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfigViewer = React.lazy(() => import('./ConfigViewer'));

const ConfigList = ({ configs, onConfigDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [downloading, setDownloading] = useState(new Set());
  const [viewingConfig, setViewingConfig] = useState(null);

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

  const handleDownload = async (filename) => {
    setDownloading(prev => new Set(prev).add(filename));
    try {
      const response = await downloadConfig(filename);
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      toast.error('Failed to download configuration');
    } finally {
      setDownloading(prev => {
        const next = new Set(prev);
        next.delete(filename);
        return next;
      });
    }
  };

  const handleView = async (filename) => {
    try {
      const response = await downloadConfig(filename);
      setViewingConfig({
        ...response.data,
        name: filename
      });
    } catch (error) {
      toast.error('Failed to load configuration');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Available Configurations</h2>
        <div className="space-y-4">
          {configs.map(config => (
            <div key={config.name} 
                 className="flex items-center justify-between p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{config.name}</div>
                <div className="text-sm text-gray-300">
                  Size: {config.size}
                </div>
                {config.inUse && (
                  <div className="flex items-center text-sm text-yellow-500 mt-1">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    Currently in use
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleView(config.name)}
                  className="p-2 text-white hover:bg-blue-900/50 rounded transition-colors"
                  title="View configuration"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(config.name)}
                  disabled={downloading.has(config.name)}
                  className="p-2 text-blue-400 hover:bg-blue-900/50 rounded transition-colors disabled:opacity-50"
                  title="Download configuration"
                >
                  <Download className={`w-4 h-4 ${downloading.has(config.name) ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={() => setConfirmDelete(config.name)}
                  disabled={config.inUse}
                  className="p-2 text-red-400 hover:bg-red-900/50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={config.inUse ? 'Cannot delete while in use' : 'Delete configuration'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {configs.length === 0 && (
            <div className="text-gray-400 text-center py-8">
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

      {viewingConfig && (
        <React.Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        }>
          <ConfigViewer 
            config={viewingConfig} 
            onClose={() => setViewingConfig(null)} 
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default ConfigList;