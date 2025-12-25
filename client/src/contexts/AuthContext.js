import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally, fetch user info
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    // Decode token to get user info, but for simplicity, assume we set user later
  };

  const register = async (name, email, password, role) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, { name, email, password, role });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;