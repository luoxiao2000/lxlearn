import { Course, UserProgress } from '@/types';
import coursesData from '../../courses.json';

export const getAllCourses = (): Course[] => {
  return coursesData as Course[];
};

export const getCourseById = (courseId: number): Course | undefined => {
  return getAllCourses().find((course) => course.courseId === courseId);
};

export const getCoursesByCategory = (category: string): Course[] => {
  const courses = getAllCourses();
  
  // If there are no categories yet in the JSON, we'll create some based on subject names in the title
  return courses.filter((course) => {
    if (category === 'math') {
      return course.courseTitle.toLowerCase().includes('数学');
    } else if (category === 'english') {
      return course.courseTitle.toLowerCase().includes('英语');
    } else if (category === 'chinese') {
      return course.courseTitle.toLowerCase().includes('语文');
    } else if (category === 'physics') {
      return course.courseTitle.toLowerCase().includes('物理');
    } else if (category === 'chemistry') {
      return course.courseTitle.toLowerCase().includes('化学');
    } else {
      return true; // Return all courses for 'all' category
    }
  });
};

// Get a list of all available categories
export const getCategories = (): string[] => {
  return ['all', 'math', 'english', 'chinese', 'physics', 'chemistry'];
};

// Get the recently accessed courses based on user progress
export const getRecentCourses = (progress: UserProgress[]): Course[] => {
  const allCourses = getAllCourses();
  const sortedProgress = [...progress].sort((a, b) => {
    return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
  });
  
  // Get the 4 most recently watched courses
  const recentCourseIds = sortedProgress.slice(0, 4).map(p => p.courseId);
  
  // Find the courses with those IDs
  return allCourses.filter(course => recentCourseIds.includes(course.courseId));
}; 