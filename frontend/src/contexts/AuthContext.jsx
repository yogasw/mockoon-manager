import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api/mockoonApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for stored credentials on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { username, password } = JSON.parse(storedAuth);
      setUser({ username });
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const success = await apiLogin(credentials);
      if (success) {
        setUser({ username: credentials.username });
        setIsAuthenticated(true);
      }
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
