// frontend/src/components/InstanceList.jsx
import React, { useState } from 'react';
import { Power, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stopMockServer } from '../api/mockoonApi';

const BaseUrl = ({ port }) => {
  const baseUrl = `${window.location.protocol}//${window.location.host}/${port}/`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(baseUrl)
      .then(() => toast.success('Base URL copied to clipboard'))
      .catch(() => toast.error('Failed to copy URL'));
  };

  return (
    <div className="flex items-center gap-2 text-sm text-blue-400">
      <span className="truncate font-mono">{baseUrl}</span>
      <button
        onClick={copyToClipboard}
        className="p-1 hover:bg-blue-900/50 rounded transition-colors"
        title="Copy base URL"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
};

const TruncatedText = ({ text, maxLength = 40 }) => {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="truncate" title={shouldTruncate ? text : undefined}>
      {displayText}
    </div>
  );
};

const InstanceItem = ({ instance, onStop }) => {
  const [isStopping, setIsStopping] = useState(false);

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await stopMockServer(instance.port);
      toast.success(`Stopped mock server on port ${instance.port}`);
      onStop();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to stop mock server');
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <div className="bg-gray-700 rounded p-4">
      <div className="flex justify-between items-start gap-4 mb-2">
        <button
          onClick={handleStop}
          disabled={isStopping}
          className="flex-shrink-0 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Power className="w-4 h-4" />
          {isStopping ? 'Stopping...' : 'Stop'}
        </button>
      </div>
      <div className="space-y-2">
        <div className="font-medium text-white">Port: {instance.port}</div>
        <div className="text-sm text-gray-300">
          Config: <TruncatedText text={instance.configFile} />
        </div>
        <div className="text-sm text-gray-300">
          Uptime: {instance.uptimeFormatted}
        </div>
        <div className="font-medium text-white">Base URL:</div>
        <BaseUrl port={instance.port} />
      </div>
    </div>
  );
};

const InstanceList = ({ instances, onStop }) => {
  if (instances.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No running instances
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {instances.map(instance => (
        <InstanceItem
          key={instance.port}
          instance={instance}
          onStop={onStop}
        />
      ))}
    </div>
  );
};

export default InstanceList;
