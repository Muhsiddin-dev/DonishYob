'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, UsersFilters } from '@/lib/api/admin';
import { UserRole } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const adminKeys = {
  statistics: ['admin', 'statistics'] as const,
  users: ['admin', 'users'] as const,
  usersList: (filters: UsersFilters) => [...adminKeys.users, 'list', filters] as const,
};

export function useStatistics() {
  return useQuery({
    queryKey: adminKeys.statistics,
    queryFn: () => adminApi.getStatistics(),
  });
}

export function useUsers(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: adminKeys.usersList(filters),
    queryFn: () => adminApi.getUsers(filters),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
      success('Роль пользователя обновлена');
    },
    onError: () => {
      error('Ошибка при обновлении роли');
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (userId: string) => adminApi.toggleUserActive(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
      success('Статус пользователя обновлён');
    },
    onError: () => {
      error('Ошибка при обновлении статуса');
    },
  });
}
