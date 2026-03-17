import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (firstname, lastname, username, email, password) => {
    const data = await authService.register(firstname, lastname, username, email, password);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="page-wrapper container"><div style={{textAlign: 'center', marginTop: '5rem'}}>Loading...</div></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
