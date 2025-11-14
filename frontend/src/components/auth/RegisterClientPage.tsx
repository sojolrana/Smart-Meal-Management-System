// frontend/src/components/auth/RegisterClientPage.tsx

'use client';

import { useState } from 'react';
import StudentRegisterForm from './StudentRegisterForm';
import StaffRegisterForm from './StaffRegisterForm';

type Role = 'student' | 'staff';

export default function RegisterClientPage() {
  const [role, setRole] = useState<Role>('student');

  const activeTabClasses = 'bg-indigo-600 text-white';
  const inactiveTabClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <div>
      <div className="flex justify-center rounded-md shadow-sm mb-8" role="group">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`px-6 py-3 text-sm font-medium rounded-l-md transition-colors ${
            role === 'student' ? activeTabClasses : inactiveTabClasses
          }`}
        >
          I am a Student
        </button>
        <button
          type="button"
          onClick={() => setRole('staff')}
          className={`px-6 py-3 text-sm font-medium rounded-r-md transition-colors ${
            role === 'staff' ? activeTabClasses : inactiveTabClasses
          }`}
        >
          I am Kitchen Staff
        </button>
      </div>

      <div>
        {role === 'student' ? (
          <StudentRegisterForm />
        ) : (
          <StaffRegisterForm />
        )}
      </div>
    </div>
  );
}