// frontend/src/components/Header.jsx
import React from 'react';
import { Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Mockoon Manager
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;