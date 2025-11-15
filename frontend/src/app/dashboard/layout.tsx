import DashboardShell from '@/components/dashboard/DashboardShell';
import React from 'react';

// This is a simple wrapper layout.
// The DashboardShell contains all the logic.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}