'use client';

import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['Admin', 'SuperAdmin']}>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
