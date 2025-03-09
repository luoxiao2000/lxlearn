import { AuthState, UserData } from '@/types';

// Hardcoded credentials (as per requirements)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get auth state from localStorage
export const getAuthState = (): AuthState => {
  if (!isBrowser) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const authState = localStorage.getItem('authState');
    if (authState) {
      return JSON.parse(authState);
    }
  } catch (error) {
    console.error('Error getting auth state from localStorage:', error);
  }

  return { isAuthenticated: false, user: null };
};

// Set auth state in localStorage
export const setAuthState = (authState: AuthState): void => {
  if (!isBrowser) {
    return;
  }

  try {
    localStorage.setItem('authState', JSON.stringify(authState));
  } catch (error) {
    console.error('Error setting auth state in localStorage:', error);
  }
};

// Login function
export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const userData: UserData = {
      userId: '1',
      username: ADMIN_USERNAME,
      progress: [],
    };
    
    const authState: AuthState = {
      isAuthenticated: true,
      user: userData,
    };
    
    setAuthState(authState);
    return true;
  }
  
  return false;
};

// Logout function
export const logout = (): void => {
  setAuthState({ isAuthenticated: false, user: null });
};

// Function to save user progress to localStorage
export const saveProgress = (courseId: number, progress: number, completed: boolean = false): void => {
  if (!isBrowser) {
    return;
  }
  
  const authState = getAuthState();
  
  if (!authState.isAuthenticated || !authState.user) {
    return;
  }
  
  const user = { ...authState.user };
  const existingProgressIndex = user.progress.findIndex(p => p.courseId === courseId);
  
  if (existingProgressIndex !== -1) {
    // Update existing progress
    user.progress[existingProgressIndex] = {
      ...user.progress[existingProgressIndex],
      progress,
      lastWatched: new Date().toISOString(),
      completed: completed || user.progress[existingProgressIndex].completed,
    };
  } else {
    // Add new progress entry
    user.progress.push({
      courseId,
      progress,
      lastWatched: new Date().toISOString(),
      completed,
    });
  }
  
  setAuthState({ ...authState, user });
}; 