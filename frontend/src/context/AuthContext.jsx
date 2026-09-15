import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shancode_token');
    if (token) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('shancode_token');
            localStorage.removeItem('shancode_refresh_token');
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('shancode_token');
          localStorage.removeItem('shancode_refresh_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrUsername, password) => {
    const res = await api.login(emailOrUsername, password);
    if (res.success && res.user) {
      localStorage.setItem('shancode_token', res.token || res.accessToken);
      if (res.refreshToken) {
        localStorage.setItem('shancode_refresh_token', res.refreshToken);
      }
      setUser(res.user);
      return res.user;
    } else {
      throw new Error(res.error || 'Authentication failed');
    }
  };

  const loginDemo = async (role = 'sushmita') => {
    setLoading(true);
    try {
      const username = role === 'admin' ? 'admin' : 'sushmita';
      const res = await api.login(username, 'shancode123');
      if (res.success && res.user) {
        localStorage.setItem('shancode_token', res.token || res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem('shancode_refresh_token', res.refreshToken);
        }
        setUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.warn('Demo login note:', e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, target_company) => {
    const res = await api.register(username, email, password, target_company);
    if (res.success && res.user) {
      localStorage.setItem('shancode_token', res.token || res.accessToken);
      if (res.refreshToken) {
        localStorage.setItem('shancode_refresh_token', res.refreshToken);
      }
      setUser(res.user);
      return res.user;
    } else {
      throw new Error(res.error || 'Registration failed');
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('shancode_refresh_token');
    try {
      if (refreshToken) await api.logout(refreshToken);
    } catch (e) {}
    localStorage.removeItem('shancode_token');
    localStorage.removeItem('shancode_refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) setUser(res.user);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginDemo, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
