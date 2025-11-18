"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeSampleUsers } from '../utils/sampleUsers';

type UserRole = 'user' | 'admin' | null;

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialisiere Sample User Accounts
    if (typeof window !== 'undefined') {
      initializeSampleUsers();
      
      // Lade gespeicherten User aus LocalStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Fehler beim Laden des Users:', error);
        }
      }
    }
  }, []);

  const login = (email: string, password: string, role: 'user' | 'admin'): boolean => {
    // Lade registrierte Benutzer aus LocalStorage
    const users = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      : [];

    // Suche nach Benutzer
    const foundUser = users.find(
      (u: { email: string; password: string; role: UserRole }) =>
        u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      setUser(loggedInUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

