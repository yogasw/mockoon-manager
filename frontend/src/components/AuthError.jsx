// frontend/src/components/AuthError.jsx
import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AuthError = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
        <div className="flex flex-col items-center text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-4">
            You don't have permission to access this application. Please check your credentials or contact your administrator.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;