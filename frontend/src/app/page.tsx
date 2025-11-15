// frontend/src/app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Welcome to the
        <br />
        <span className="text-indigo-600">Smart Meal Management System</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
        The modern, cashless, and efficient way to manage your university hall
        meals. Toggle meals, view menus, and manage payments all in one
        place.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/register"
          className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 text-lg font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-300"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}