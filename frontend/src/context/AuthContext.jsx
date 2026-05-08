import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfileApi, loginApi, registerApi, updatePasswordApi, updateProfileApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await getProfileApi();
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  const login = async (payload) => {
    const response = await loginApi(payload);
    const nextToken = response.data.data.token;
    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    setUser(response.data.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await registerApi(payload);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const response = await updateProfileApi(payload);
    setUser(response.data.data);
    return response.data;
  };

  const updatePassword = async (payload) => {
    const response = await updatePasswordApi(payload);
    return response.data;
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, updateProfile, updatePassword, refreshProfile: loadProfile }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
