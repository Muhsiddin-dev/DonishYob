'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { routes } from '@/config';
import { LoadingScreen } from '@/components/ui/Spinner';

export interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  requireAuth = true,
  redirectTo = routes.login,
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, hasRole } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
      router.push(routes.home);
      return;
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, requireAuth, redirectTo, router, hasRole]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (requireAuth && !isAuthenticated) {
    return <LoadingScreen />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
