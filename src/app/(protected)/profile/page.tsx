'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { routes, config } from '@/config';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuthStore();
  console.log(user);
  

  if (!user) return null;

  return (
    <div className="  px-3 sm:px-4 h-screen dark:bg-gray-900">
      <Container size="md" className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Профиль
        </h1>

        <div className="space-y-4 sm:space-y-6">
          <Card variant="bordered" className="rounded-xl sm:rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-primary-600 text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                    {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {user.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge
                      variant={
                        user.role === 'SuperAdmin'
                          ? 'danger'
                          : user.role === 'Admin'
                            ? 'warning'
                            : 'primary'
                      }
                      className="px-2 py-0.5 text-xs sm:text-sm"
                    >
                      {config.roleLabels[user.role as keyof typeof config.roleLabels]}
                    </Badge>
                    {user.isEmailConfirmed && (
                      <Badge variant="success" className="px-2 py-0.5 text-xs sm:text-sm">
                        Email подтверждён
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered" className="rounded-xl sm:rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Информация
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Дата регистрации</p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Последний вход</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                        {formatDate(user.lastLoginAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href={routes.profileSettings} className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-lg dark:text-white  sm:rounded-xl py-2 sm:py-2.5 text-sm sm:text-base border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Cog6ToothIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Настройки
              </Button>
            </Link>
            <Link href={routes.changePassword} className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-lg sm:rounded-xl dark:text-white  py-2 sm:py-2.5 text-sm sm:text-base border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <KeyIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Сменить пароль
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
