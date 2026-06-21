'use client';

import { useState } from 'react';
import { UsersIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useUsers, useUpdateUserRole, useToggleUserActive } from '@/hooks/useAdmin';
import { UsersFilters } from '@/lib/api/admin';
import { UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { config } from '@/config';
import { formatDate } from '@/lib/utils';

const roleOptions = [
  { value: '', label: 'Все роли' },
  { value: 'User', label: 'Пользователь' },
  { value: 'Admin', label: 'Администратор' },
  // { value: 'SuperAdmin', label: 'Супер-админ' },
];

const roleSelectOptions = [
  { value: 'User', label: 'Пользователь' },
  { value: 'Admin', label: 'Администратор' },
  // { value: 'SuperAdmin', label: 'Супер-админ' },
];

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<UsersFilters>({ page: 1, pageSize: 10 });
  const [toggleUserId, setToggleUserId] = useState<string | null>(null);
  const [toggleUserName, setToggleUserName] = useState<string>('');
  const [toggleUserActive, setToggleUserActive] = useState<boolean>(false);

  const { data, isLoading } = useUsers(filters);
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: toggleActive, isPending: isToggling } = useToggleUserActive();

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters((prev) => ({
      ...prev,
      role: role ? (role as UserRole) : undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateRole({ userId, role });
  };

  const openToggleDialog = (userId: string, userName: string, isActive: boolean) => {
    setToggleUserId(userId);
    setToggleUserName(userName);
    setToggleUserActive(isActive);
  };

  const handleToggle = () => {
    if (toggleUserId) {
      toggleActive(toggleUserId, {
        onSuccess: () => setToggleUserId(null),
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
      </div>

      <Card variant="bordered">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={filters.search || ''}
                onChange={handleSearch}
                placeholder="Поиск по имени или email..."
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={roleOptions}
                value={filters.role || ''}
                onChange={(e) => handleRoleFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email подтверждён
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Регистрация
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))
              ) : !data?.items || data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Пользователи не найдены</p>
                  </td>
                </tr>
              ) : (
                data.items.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 border-2 border-white dark:border-gray-700 shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-primary-600 text-white text-xs sm:text-sm font-semibold">
                            {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        options={roleSelectOptions}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        disabled={isUpdatingRole}
                        className="w-40"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isEmailConfirmed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant={user.isActive ? 'destructive' : 'secondary'}
                        size="sm"
                        onClick={() =>
                          openToggleDialog(user.id, user.fullName, user.isActive)
                        }
                      >
                        {user.isActive ? 'Заблокировать' : 'Разблокировать'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!toggleUserId}
        onClose={() => setToggleUserId(null)}
        onConfirm={handleToggle}
        title={toggleUserActive ? 'Заблокировать пользователя?' : 'Разблокировать пользователя?'}
        message={
          toggleUserActive
            ? `Пользователь "${toggleUserName}" не сможет войти в систему.`
            : `Пользователь "${toggleUserName}" сможет снова войти в систему.`
        }
        confirmText={toggleUserActive ? 'Заблокировать' : 'Разблокировать'}
        variant={toggleUserActive ? 'danger' : 'info'}
        isLoading={isToggling}
      />
    </div>
  );
}
