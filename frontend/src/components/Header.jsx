// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Settings, LogOut, GitBranch } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { syncToGit } from '../api/mockoonApi';
import toast from 'react-hot-toast';

const Header = () => {
  const { logout } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const result = await syncToGit();
      if (result.success) {
        toast.success('Successfully synced to Git repository', {
          position: 'bottom-center',
          duration: 5000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      } else {
        // Handle specific error cases
        if (result.error?.includes('Missing required environment variables')) {
          toast.error(
            <div>
              <p className="font-bold">Git configuration is incomplete</p>
              <p className="text-sm mt-1">{result.error}</p>
              <p className="text-sm mt-2">Please configure the following environment variables in the backend:</p>
              <ul className="text-sm mt-1 list-disc list-inside">
                {Object.entries(result.details || {}).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-mono">{key}</span>: {value}
                  </li>
                ))}
              </ul>
            </div>,
            { 
              position: 'bottom-center',
              duration: 10000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
                maxWidth: '500px'
              }
            }
          );
        } else {
          toast.error(result.message || 'Failed to sync to Git repository', {
            position: 'bottom-center',
            duration: 5000,
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          });
        }
      }
    } catch (error) {
      if (error.response?.data?.error?.includes('Missing required environment variables')) {
        toast.error(
          <div>
            <p className="font-bold">Git configuration is incomplete</p>
            <p className="text-sm mt-1">{error.response.data.error}</p>
            <p className="text-sm mt-2">Please configure the following environment variables in the backend:</p>
            <ul className="text-sm mt-1 list-disc list-inside">
              {Object.entries(error.response.data.details || {}).map(([key, value]) => (
                <li key={key}>
                  <span className="font-mono">{key}</span>: {value}
                </li>
              ))}
            </ul>
          </div>,
          { 
            position: 'bottom-center',
            duration: 10000,
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151',
              maxWidth: '500px'
            }
          }
        );
      } else {
        toast.error(error.response?.data?.message || 'Failed to sync to Git repository', {
          position: 'bottom-center',
          duration: 5000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-100" />
            <h1 className="text-xl text-gray-100 font-bold tracking-wide">
              Mockoon Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-800 rounded-md transition-colors ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSync}
              disabled={isSyncing}
            >
              <GitBranch className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync to Git'}</span>
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => {
                logout()
              }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
