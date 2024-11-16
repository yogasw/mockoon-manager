// frontend/src/components/ConfigViewer.jsx
import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Code, Zap } from 'lucide-react';

const EndpointCard = ({ route }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMethodColor = (method) => {
    const colors = {
      get: 'bg-green-600',
      post: 'bg-blue-600',
      put: 'bg-yellow-600',
      delete: 'bg-red-600',
      patch: 'bg-purple-600'
    };
    return colors[method.toLowerCase()] || 'bg-gray-600';
  };

  const formatResponse = (response) => {
    try {
      if (typeof response.body === 'string') {
        const parsed = JSON.parse(response.body);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(response.body, null, 2);
    } catch {
      return response.body;
    }
  };

  const formatRuleDescription = (rule) => {
    const operatorMap = {
      'equals': 'equals to',
      'notEquals': 'not equals to',
      'contains': 'contains',
      'notContains': 'does not contain',
      'startsWith': 'starts with',
      'endsWith': 'ends with'
    };

    switch (rule.target) {
      case 'body':
        return `Request body field "${rule.modifier}" ${operatorMap[rule.operator] || rule.operator} "${rule.value}"`;
      case 'header':
        return `Header "${rule.modifier}" ${operatorMap[rule.operator] || rule.operator} "${rule.value}"`;
      case 'query':
        return `Query parameter "${rule.modifier}" ${operatorMap[rule.operator] || rule.operator} "${rule.value}"`;
      default:
        return `${rule.target} ${rule.modifier} ${rule.operator} ${rule.value}`;
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg mb-4">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getMethodColor(route.method)}`}>
            {route.method}
          </span>
          <span className="font-mono text-white">/{route.endpoint}</span>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5" /> : 
          <ChevronRight className="w-5 h-5" />
        }
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          {route.documentation && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Documentation</h4>
              <p className="text-white">{route.documentation}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-400">Responses</h4>
            {route.responses.map((response, idx) => (
              <div key={response.uuid || idx} className="border border-gray-700 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    response.statusCode < 300 ? 'bg-green-600' : 
                    response.statusCode < 400 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {response.statusCode}
                  </span>
                  {response.label && <span className="text-gray-300">{response.label}</span>}
                  {response.default && (
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">Default Response</span>
                  )}
                </div>

                {response.headers?.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-900/50 rounded">
                    <h5 className="text-sm font-semibold text-gray-400 mb-2">Headers</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {response.headers.map((header, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-gray-400">{header.key}: </span>
                          <span className="text-white font-mono">{header.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {response.rules?.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-900/50 rounded">
                    <h5 className="text-sm font-semibold text-gray-400 mb-2">
                      Conditions ({response.rulesOperator === 'AND' ? 'All must match' : 'Any must match'})
                    </h5>
                    <div className="space-y-2">
                      {response.rules.map((rule, idx) => (
                        <div key={idx} className="text-sm text-white">
                          • {formatRuleDescription(rule)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {response.body && (
                  <div className="p-3 bg-gray-900/50 rounded">
                    <h5 className="text-sm font-semibold text-gray-400 mb-2">Response Body</h5>
                    <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                      <code className="text-sm text-white">{formatResponse(response)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigViewer = ({ config, onClose }) => {
  const [viewMode, setViewMode] = useState('pretty');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Configuration Details</h2>
            <div className="flex items-center gap-4">
              <div className="flex rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('pretty')}
                  className={`px-3 py-1 text-sm flex items-center gap-1 ${
                    viewMode === 'pretty' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Pretty
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-3 py-1 text-sm flex items-center gap-1 ${
                    viewMode === 'raw' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Raw
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'pretty' ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-white">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Name: </span>
                      <span className="text-white">{config.name}</span>
                    </div>
                  </div>
                </div>

                {/* Endpoints */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Endpoints ({config.routes?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {config.routes?.map((route) => (
                      <EndpointCard key={route.uuid} route={route} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                <code className="text-sm text-white">
                  {JSON.stringify(config, null, 2)}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigViewer;