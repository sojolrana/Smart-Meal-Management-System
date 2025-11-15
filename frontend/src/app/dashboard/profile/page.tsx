// frontend/src/app/dashboard/profile/page.tsx

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="text-gray-900">Loading profile...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      <p className="mt-2 text-lg text-gray-600">
        This is your personal information.
      </p>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
        
        <ul className="mt-4 space-y-3 text-gray-800">
          <li className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span>{user.email}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-600">Full Name:</span>
            <span>{user.first_name} {user.last_name}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-600">Role:</span>
            <span>{user.role}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Account Status:</span>
            {user.is_approved ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Approved
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Pending Approval
              </span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}