import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { users } from '../utils/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff';

  // Mock login function (in a real app, this would make an API call)
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we'll just check if the email matches one of our mock users
    // In a real app, you would check credentials against a backend
    const user = users.find((u) => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    isStaff,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};