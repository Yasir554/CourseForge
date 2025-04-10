import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      apiFetch('/auth/profile', { token })
        .then(data => setUser(data.user))
        .catch(() => setToken(null));
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
