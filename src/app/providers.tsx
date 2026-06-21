'use client';

import { useEffect, ReactNode } from 'react';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';

function AuthInitializer({ children }: { children: ReactNode }) {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthInitializer>{children}</AuthInitializer>
      </ToastProvider>
    </QueryProvider>
  );
}
