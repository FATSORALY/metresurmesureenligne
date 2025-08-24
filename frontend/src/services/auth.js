import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const logout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Réinitialiser l'état utilisateur
    setUser(null);
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
    
    console.log('Utilisateur déconnecté avec succès');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};