// frontend/src/app/dashboard/page.tsx

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.first_name || user.email}!
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-xl font-semibold">Your Details</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Role:</strong> {user.role}
            </li>
            <li>
              <strong>Account Status:</strong>
              {user.is_approved ? (
                <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                  Approved
                </span>
              ) : (
                <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                  Pending Approval
                </span>
              )}
            </li>
          </ul>
        </div>
        
        {user.role === 'STUDENT' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-blue-800">Student Menu</h3>
          </div>
        )}
        
        {user.role === 'ADMIN' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-800">Admin Menu</h3>
          </div>
        )}
      </div>
    </div>
  );
}