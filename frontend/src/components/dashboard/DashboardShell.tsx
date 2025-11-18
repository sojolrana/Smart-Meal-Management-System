// frontend/src/components/dashboard/DashboardShell.tsx

'use client';

import Link from 'next/link';
import { useAuth, User } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );
}

function PendingApprovalPage({
  user,
  handleLogout,
}: {
  user: User;
  handleLogout: () => Promise<void>;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogoutClick = async () => {
    setIsLoggingOut(true);
    await handleLogout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Account Pending Approval
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your account has been registered successfully. An administrator will
          review and approve your account soon.
        </p>
        
        <div className="mt-6 border-t pt-6 text-left space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Full Name:</span>
            <span className="text-gray-800">{user.first_name} {user.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Role:</span>
            <span className="text-gray-800">{user.role}</span>
          </div>
        </div>

        <button
          onClick={onLogoutClick}
          disabled={isLoggingOut}
          className="mt-8 w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoggingOut ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!user.is_approved) {
    return (
      <PendingApprovalPage user={user} handleLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* --- Sidebar --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <span className="text-sm text-gray-400">{user.role}</span>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink href="/dashboard">Overview</NavLink>
          
          {user.role === 'ADMIN' && (
            <>
              <NavLink href="/dashboard/users">Manage Users</NavLink>
              <NavLink href="/dashboard/menu">Manage Menu</NavLink>
            </>
          )}
          {user.role === 'STUDENT' && (
            <>
              <NavLink href="/dashboard/menu">View Menu</NavLink>
              <NavLink href="/dashboard/wallet">My Wallet</NavLink>
            </>
          )}
          {user.role === 'STAFF' && (
            <>
              <NavLink href="/dashboard/menu">Set Today's Menu</NavLink>
              <NavLink href="/dashboard/counts">Meal Counts</NavLink>
            </>
          )}

          <NavLink href="/dashboard/profile">My Profile</NavLink>
        </nav>
        
        <div className="px-2 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}