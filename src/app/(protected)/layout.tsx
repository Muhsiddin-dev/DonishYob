'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col  ">
        <Header />
        <main className="flex-1 py-24">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
