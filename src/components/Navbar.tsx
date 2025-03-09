"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-primary-600">
                Video Learning
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex">
                <Link href="/" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/courses" className="inline-flex items-center px-1 pt-1 ml-8 text-gray-700 hover:text-primary-600">
                  Courses
                </Link>
                <Link href="/history" className="inline-flex items-center px-1 pt-1 ml-8 text-gray-700 hover:text-primary-600">
                  History
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 