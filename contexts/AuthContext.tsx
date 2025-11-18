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
    // Initialisiere Sample User Accounts und lade User
    if (typeof window !== 'undefined') {
      // Stelle sicher, dass Sample Users initialisiert sind
      initializeSampleUsers();
      
      // Lade gespeicherten User aus LocalStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Verifiziere, dass der User noch in registeredUsers existiert
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const userStillExists = registeredUsers.some((u: { id: string }) => u.id === parsedUser.id);
          
          if (userStillExists) {
            setUser(parsedUser);
            console.log('User aus LocalStorage geladen:', parsedUser);
          } else {
            // User existiert nicht mehr, entferne aus currentUser
            localStorage.removeItem('currentUser');
            console.log('Gespeicherter User existiert nicht mehr in registeredUsers');
          }
        } catch (error) {
          console.error('Fehler beim Laden des Users:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, []);

  const login = (email: string, password: string, role: 'user' | 'admin'): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Stelle sicher, dass Sample Users initialisiert sind
    initializeSampleUsers();
    
    // Lade registrierte Benutzer aus LocalStorage
    const usersStr = localStorage.getItem('registeredUsers');
    if (!usersStr) {
      console.error('Keine registrierten User gefunden im LocalStorage');
      return false;
    }
    
    let users;
    try {
      users = JSON.parse(usersStr);
    } catch (error) {
      console.error('Fehler beim Parsen der registrierten User:', error);
      return false;
    }

    if (!Array.isArray(users)) {
      console.error('registeredUsers ist kein Array:', users);
      return false;
    }

    console.log('Suche nach User:', { email, role, totalUsers: users.length });

    // Suche nach Benutzer
    const foundUser = users.find(
      (u: { email: string; password: string; role: UserRole }) => {
        const emailMatch = u.email.toLowerCase() === email.toLowerCase();
        const passwordMatch = u.password === password;
        const roleMatch = u.role === role;
        return emailMatch && passwordMatch && roleMatch;
      }
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      console.log('Login erfolgreich:', loggedInUser);
      return true;
    }
    
    console.log('User nicht gefunden. Verfügbare User:', users.map((u: { email: string; role: string }) => ({ email: u.email, role: u.role })));
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

