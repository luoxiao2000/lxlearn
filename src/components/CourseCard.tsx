import React from 'react';
import Link from 'next/link';
import { Course, UserProgress } from '@/types';

interface CourseCardProps {
  course: Course;
  progress?: UserProgress;
}

const CourseCard = ({ course, progress }: CourseCardProps) => {
  const progressPercentage = progress ? Math.min(Math.round(progress.progress * 100), 100) : 0;
  const isCompleted = progress?.completed || false;

  return (
    <Link href={`/course/${course.courseId}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="h-40 bg-gray-200 flex items-center justify-center">
          <div className="text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{course.courseTitle}</h3>
          
          {progress && (
            <div className="mt-2">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-primary-600">
                      {isCompleted ? 'Completed' : `${progressPercentage}% Complete`}
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mt-1 overflow-hidden text-xs bg-gray-200 rounded">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className={`flex flex-col justify-center text-center text-white ${
                      isCompleted ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 