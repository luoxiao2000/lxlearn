'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';
import { getAllCourses, getCategories, getRecentCourses } from '@/lib/courses';
import CourseCard from '@/components/CourseCard';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const categories = getCategories();

  const loadCourses = useCallback(() => {
    console.log('Loading courses...');
    // Get all courses
    const allCourses = getAllCourses();
    setCourses(allCourses);

    // Get recent courses if user is authenticated
    if (isAuthenticated && user) {
      const recent = getRecentCourses(user.progress);
      setRecentCourses(recent);
    }
    
    setIsLoading(false);
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Add event listener for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      console.log('Progress updated event received, reloading courses...');
      loadCourses();
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
    };
  }, [loadCourses]);

  // Filter courses by category
  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === 'all') return true;
    
    if (selectedCategory === 'math') {
      return course.courseTitle.toLowerCase().includes('数学');
    } else if (selectedCategory === 'english') {
      return course.courseTitle.toLowerCase().includes('英语');
    } else if (selectedCategory === 'chinese') {
      return course.courseTitle.toLowerCase().includes('语文');
    } else if (selectedCategory === 'physics') {
      return course.courseTitle.toLowerCase().includes('物理');
    } else if (selectedCategory === 'chemistry') {
      return course.courseTitle.toLowerCase().includes('化学');
    }
    
    return false;
  });

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Video Learning Platform</h1>
          <p className="mt-4 text-lg text-gray-600">Please log in to access the courses.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-6 px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {recentCourses.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCourses.map((course) => (
                <CourseCard 
                  key={course.courseId} 
                  course={course} 
                  progress={user?.progress.find(p => p.courseId === course.courseId)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600">You haven't started any courses yet. Browse the courses below to get started.</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Courses</h2>
          <div className="flex space-x-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.courseId} 
              course={course} 
              progress={user?.progress.find(p => p.courseId === course.courseId)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">No courses found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
} 