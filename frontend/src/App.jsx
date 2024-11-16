// frontend/src/App.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UploadConfig from './components/UploadConfig';
import NewInstance from './components/NewInstance';
import InstanceList from './components/InstanceList';
import ConfigList from './components/ConfigList';
import AuthError from './components/AuthError';
import InstanceListSkeleton from './components/skeletons/InstanceListSkeleton';
import { useInstanceStatus, useConfigurations } from './hooks/useDataFetching';

const RunningInstances = () => {
  const { instances, loading, error, refetch } = useInstanceStatus();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg transition-opacity duration-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Running Instances
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-white text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <InstanceListSkeleton />
        ) : (
          <InstanceList 
            instances={instances} 
            onStop={() => refetch(true)}
          />
        )}
      </div>
    </div>
  );
};

const Configurations = () => {
  const { configs, loading, error, refetch } = useConfigurations();

  return (
    <>
      <UploadConfig onUploadSuccess={() => refetch(true)} />
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-white text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <ConfigList configs={configs} onConfigDelete={() => refetch(true)} />
      )}
      <NewInstance configs={configs} onStart={() => refetch(true)} />
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Configurations />
          <RunningInstances />
        </div>
      </main>
    </div>
  );
}

export default App;