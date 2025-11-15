// frontend/src/components/layout/Navbar.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const buttonClass =
    'px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors';
  const ghostButtonClass =
    'px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-300 transition-colors';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-indigo-600"
            >
              Smart Meal System
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className={ghostButtonClass}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={buttonClass}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={ghostButtonClass}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={buttonClass}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}