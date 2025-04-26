// frontend/src/components/Header.jsx
import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import {useAuth} from "../contexts/AuthContext.jsx";

const Header = () => {
  const { logout } = useAuth();
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
    </header>
  );
};

export default Header;
