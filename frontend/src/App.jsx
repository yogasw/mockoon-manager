// frontend/src/App.jsx
import React, { useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UploadConfig from './components/UploadConfig';
import NewInstance from './components/NewInstance';
import InstanceList from './components/InstanceList';
import ConfigList from './components/ConfigList';
import AuthError from './components/AuthError';
import InstanceListSkeleton from './components/skeletons/InstanceListSkeleton';
import { useInstanceStatus, useConfigurations, stateChangeEmitter } from './hooks/useDataFetching';
import Login from "./components/Login.jsx";
import {AuthProvider} from "./contexts/AuthContext.jsx";

const ConfigPane = () => {
  const { configs, loading, error, refetch } = useConfigurations();

  const handleConfigChange = async () => {
    await refetch(true);
    stateChangeEmitter.emit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Configuration Management</h2>
        <UploadConfig onUploadSuccess={handleConfigChange} />
      </div>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded text-white text-sm">
          {error}
        </div>
      )}
      <div>
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
          <ConfigList configs={configs} onConfigDelete={handleConfigChange} />
        )}
      </div>
    </div>
  );
};

const InstancePane = ({ configs }) => {
  const { instances, loading, error, refetch: refetchInstances } = useInstanceStatus();

  const handleInstanceChange = useCallback(() => {
      refetchInstances();
      stateChangeEmitter.emit();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Instance Management</h2>
        <NewInstance
          configs={configs}
          instances={instances}
          onStart={handleInstanceChange}
        />
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
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
              onStop={handleInstanceChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
function App() {
    return(
        <AuthProvider>
            <Home/>
        </AuthProvider>
    )
}
function Home() {
  const { configs, error: configError } = useConfigurations();
  const { error: instanceError } = useInstanceStatus(true);

  // Check for authentication errors
  const isAuthError = configError?.response?.status === 401 || instanceError?.response?.status === 401;

  if (isAuthError) {
    return <Login />;
  }

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
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <ConfigPane />
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <InstancePane configs={configs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
