'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Course, UserProgress } from '@/types';
import { getCourseById } from '@/lib/courses';
import VideoPlayer from '@/components/VideoPlayer';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const courseId = parseInt(params.id, 10);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load course data
  const loadCourseData = useCallback(() => {
    // Get course data
    const courseData = getCourseById(courseId);
    if (courseData) {
      setCourse(courseData);
    }

    // Get user progress for this course
    if (user) {
      const userProgress = user.progress.find(p => p.courseId === courseId);
      if (userProgress) {
        setProgress(userProgress);
      }
    }
    
    setIsLoading(false);
  }, [courseId, user]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadCourseData();
  }, [isAuthenticated, router, loadCourseData]);

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

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.courseTitle}</h1>
        {progress && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">
              {progress.completed ? 'Completed' : `${Math.round(progress.progress * 100)}% complete`}
            </span>
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${progress.completed ? 'bg-green-500' : 'bg-primary-500'}`} 
                style={{ width: `${Math.round(progress.progress * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <VideoPlayer 
          courseId={course.courseId} 
          videoUrl={course.videoUrl} 
          initialProgress={progress?.progress || 0}
          autoplay={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About this course</h2>
        <p className="text-gray-600">
          {course.courseTitle} is part of our comprehensive learning series. 
          This course provides valuable knowledge and skills to help you succeed.
        </p>
        
        {course.category && (
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {course.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 