import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export interface Course {
  courseId: number;
  courseTitle: string;
  videoUrl: string;
  category?: string;
}

export interface UserProgress {
  courseId: number;
  progress: number;
  lastWatched: string;
  completed: boolean;
}

export interface UserData {
  userId: string;
  username: string;
  progress: UserProgress[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
} 