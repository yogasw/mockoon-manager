import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UploadConfig from './components/UploadConfig';
import NewInstance from './components/NewInstance';
import InstanceList from './components/InstanceList';
import ConfigList from './components/ConfigList';
import { getMockStatus, getConfigs } from './api/mockoonApi';

function App() {
  const [instances, setInstances] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusData, configsData] = await Promise.all([
        getMockStatus(),
        getConfigs()
      ]);
      setInstances(statusData);
      setConfigs(configsData);
      setError(null);
    } catch (error) {
      setError('Failed to fetch data. Please check your connection.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <UploadConfig onUploadSuccess={fetchData} />
          {/* Add ConfigList component */}
          <ConfigList configs={configs} onConfigDelete={fetchData} />
          <NewInstance configs={configs} onStart={fetchData} />
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Running Instances</h2>
              <InstanceList instances={instances} onStop={fetchData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;