import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UploadConfig from './components/UploadConfig';
import NewInstance from './components/NewInstance';
import InstanceList from './components/InstanceList';
import { getMockStatus, getConfigs } from './api/mockoonApi';

function App() {
  const [instances, setInstances] = useState([]);
  const [configs, setConfigs] = useState([]);

  const fetchData = async () => {
    try {
      const [statusData, configsData] = await Promise.all([
        getMockStatus(),
        getConfigs()
      ]);
      setInstances(statusData);
      setConfigs(configsData);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <div className="space-y-6">
          <UploadConfig onUploadSuccess={fetchData} />
          <NewInstance configs={configs} onStart={fetchData} />
          <InstanceList instances={instances} onStop={fetchData} />
        </div>
      </main>
    </div>
  );
}

export default App;
