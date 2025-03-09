export interface Course {
  courseId: number;
  courseTitle: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  duration?: number;
  instructor?: string;
}

export interface UserProgress {
  courseId: number;
  progress: number;
  completed: boolean;
  lastUpdated: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // In a real app, this would be hashed
  firstName?: string;
  lastName?: string;
  progress: UserProgress[];
  role: 'user' | 'admin';
  createdAt: string;
} 