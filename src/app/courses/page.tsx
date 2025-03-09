'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';
import { getAllCourses, getCategories } from '@/lib/courses';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const categories = getCategories();

  const loadCourses = useCallback(() => {
    // Get all courses
    const allCourses = getAllCourses();
    setCourses(allCourses);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadCourses();
  }, [isAuthenticated, router, loadCourses]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Filter courses by category and search term
  const filteredCourses = courses.filter((course) => {
    // Filter by category
    let categoryMatch = true;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'math') {
        categoryMatch = course.courseTitle.toLowerCase().includes('数学');
      } else if (selectedCategory === 'english') {
        categoryMatch = course.courseTitle.toLowerCase().includes('英语');
      } else if (selectedCategory === 'chinese') {
        categoryMatch = course.courseTitle.toLowerCase().includes('语文');
      } else if (selectedCategory === 'physics') {
        categoryMatch = course.courseTitle.toLowerCase().includes('物理');
      } else if (selectedCategory === 'chemistry') {
        categoryMatch = course.courseTitle.toLowerCase().includes('化学');
      }
    }
    
    // Filter by search term
    const searchMatch = searchTerm === '' || 
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h1>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">Search courses</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search courses"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">No courses found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.courseId} 
              course={course} 
              progress={user?.progress.find(p => p.courseId === course.courseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 