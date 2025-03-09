import { User } from '@/types';

// Get user from local storage
export const getUser = (userId: number): User | null => {
  if (typeof window === 'undefined') return null;
  
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return null;
  
  try {
    const users = JSON.parse(usersJson) as User[];
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return null;
  }
};

// Update user progress for a specific course
export const updateUserProgress = (
  userId: number, 
  courseId: number, 
  progress: number, 
  completed: boolean
): User | null => {
  if (typeof window === 'undefined') return null;
  
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return null;
  
  try {
    const users = JSON.parse(usersJson) as User[];
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return null;
    
    const user = users[userIndex];
    
    // Find existing progress for this course or create a new one
    const progressIndex = user.progress.findIndex(p => p.courseId === courseId);
    
    if (progressIndex !== -1) {
      // Update existing progress
      user.progress[progressIndex] = {
        ...user.progress[progressIndex],
        progress,
        completed,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add new progress entry
      user.progress.push({
        courseId,
        progress,
        completed,
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Update user in the array
    users[userIndex] = user;
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    return user;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
};

// Get all users (for admin purposes)
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return [];
  
  try {
    return JSON.parse(usersJson) as User[];
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return [];
  }
}; 