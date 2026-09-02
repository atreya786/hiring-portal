'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../mock-data';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY_AUTH_ROLE = 'sallet_demo_role_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('candidate');
  const [user, setUser] = useState<User | null>(DEMO_USERS.candidate);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY_AUTH_ROLE) as UserRole;
      if (savedRole && DEMO_USERS[savedRole]) {
        setRole(savedRole);
        setUser(DEMO_USERS[savedRole]);
      } else {
        setRole('candidate');
        setUser(DEMO_USERS.candidate);
      }
    } catch {
      setRole('candidate');
      setUser(DEMO_USERS.candidate);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const newUser = DEMO_USERS[newRole] || null;
    setUser(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_AUTH_ROLE, newRole);
      } catch (err) {
        console.error('Failed to save role', err);
      }
    }
  };

  const loginAs = (targetRole: UserRole) => {
    switchRole(targetRole);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: isMounted ? user : DEMO_USERS.candidate,
        role: isMounted ? role : 'candidate',
        isLoggedIn: isMounted ? !!user : true,
        switchRole,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
