// frontend/src/app/dashboard/layout.tsx

import DashboardShell from '@/components/dashboard/DashboardShell';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}