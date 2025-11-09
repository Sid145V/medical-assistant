
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api, Credentials } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials, role: UserRole) => Promise<void>;
  signup: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: Credentials, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await api.login(credentials, role);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      switch(loggedInUser.role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.DOCTOR:
          navigate('/doctor/dashboard');
          break;
        case UserRole.SHOP:
          navigate('/shop/dashboard');
          break;
        case UserRole.PATIENT:
        default:
          navigate('/');
          break;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (userData: any, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await api.signup(userData, role);
      // Redirect to login page after successful signup
      navigate(`/login/${role}`);
    } catch (err) {
      setError((err as Error).message);
      throw err; // re-throw to be caught in the component
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  }, [navigate]);

  const contextValue = { user, login, signup, logout, loading, error };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
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