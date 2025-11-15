'use client';

import { useAuth } from '@/context/AuthContext';
import React from 'react';

// --- Placeholder Components (We can build these out later) ---

function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
      <p className="mt-2 text-lg text-gray-600">Welcome back, Admin!</p>
      {/* TODO: Add stat cards for "Users to Approve", "Total Meals", etc. */}
    </div>
  );
}

function StudentOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Student Overview</h1>
      <p className="mt-2 text-lg text-gray-600">Welcome back!</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900">Your Meal Status</h2>
          <p className="mt-4 text-5xl font-bold text-green-600">ON</p>
          <button className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Turn Meal OFF
          </button>
        </div>
        
        {/* Wallet Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900">Your Wallet</h2>
          <p className="mt-4 text-5xl font-bold text-gray-800">$12.50</p>
           <button className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Recharge Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Kitchen Staff Overview</h1>
      <p className="mt-2 text-lg text-gray-600">Here's the plan for today.</p>
      {/* TODO: Add stat cards for "Lunch Count", "Dinner Count", etc. */}
    </div>
  );
}

// --- Main Dashboard Page ---
export default function DashboardPage() {
  const { user } = useAuth();

  // Render the correct overview based on the user's role
  switch (user?.role) {
    case 'ADMIN':
      return <AdminOverview />;
    case 'STUDENT':
      return <StudentOverview />;
    case 'STAFF':
      return <StaffOverview />;
    default:
      // Fallback in case user is null or role is unknown
      return <div className="text-gray-900">Loading...</div>;
  }
}