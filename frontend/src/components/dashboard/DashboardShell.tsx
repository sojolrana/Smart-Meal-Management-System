'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

// --- Helper: Navigation Link Component ---
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  // TODO: Add 'active' state styling later based on usePathname()
  return (
    <Link
      href={href}
      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );
}

// --- The Main Dashboard Shell ---
export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // If we're loading auth or the user isn't logged in, redirect
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

  return (
    <div className="min-h-screen flex">
      {/* --- Sidebar --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <span className="text-sm text-gray-400">{user.role}</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink href="/dashboard">Overview</NavLink>
          
          {/* Role-Specific Links */}
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
        
        {/* Logout Button */}
        <div className="px-2 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 bg-gray-100">
        {/* We add a 'p-8' (padding) to give content breathing room */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}