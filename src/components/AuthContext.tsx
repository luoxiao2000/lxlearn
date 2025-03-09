"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthState, UserData } from '@/types';
import { getAuthState, login as authLogin, logout as authLogout, saveProgress as authSaveProgress } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  saveProgress: (courseId: number, progress: number, completed?: boolean) => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
  saveProgress: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthState = getAuthState();
      setAuthState(storedAuthState);
      setIsInitialized(true);
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const loginSuccess = authLogin(username, password);
    if (loginSuccess) {
      setAuthState(getAuthState());
    }
    return loginSuccess;
  }, []);

  const logout = useCallback((): void => {
    authLogout();
    setAuthState({ isAuthenticated: false, user: null });
  }, []);

  const saveProgress = useCallback((courseId: number, progress: number, completed: boolean = false): void => {
    authSaveProgress(courseId, progress, completed);
    
    // Update the local state to reflect changes, but only if we're initialized
    if (isInitialized) {
      // Get fresh state to avoid stale data
      const freshState = getAuthState();
      setAuthState(freshState);
    }
  }, [isInitialized]);

  const contextValue: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout,
    saveProgress,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}; 