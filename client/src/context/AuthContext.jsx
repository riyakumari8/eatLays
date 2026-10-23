import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => api.getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          api.setToken(null);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user profile with stored token:', err);
        api.setToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.login(email, password);
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        api.setToken(authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
      }
      throw new Error(response.message || 'Login failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const response = await api.register(name, email, password, confirmPassword);
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        api.setToken(authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
      }
      throw new Error(response.message || 'Registration failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      api.setToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user && token),
    isStudent: user?.role === 'STUDENT',
    isVendor: user?.role === 'VENDOR',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
