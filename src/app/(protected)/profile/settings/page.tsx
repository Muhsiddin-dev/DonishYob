'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { routes } from '@/config';

export default function SettingsPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="py-8">
      <Container size="md">
        <div className="mb-8">
          <Link
            href={routes.profile}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Назад к профилю
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        </div>

        <div className="space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Полное имя"
                value={user.fullName}
                disabled
                helperText="Свяжитесь с администратором для изменения имени"
              />
              <Input
                label="Email"
                value={user.email}
                disabled
                helperText="Email нельзя изменить"
              />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Для повышения безопасности рекомендуем периодически менять пароль.
              </p>
              <Link href={routes.changePassword}>
                <Button className='bg-red-600 text-white hover:bg-red-500'>Сменить пароль</Button>
              </Link>
            </CardContent>
          </Card>

          <Card variant="bordered" className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Опасная зона</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Удаление аккаунта приведёт к безвозвратной потере всех данных.
              </p>
              <Button  className='bg-red-600 text-white hover:bg-red-500' >
                Удалить аккаунт
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Функция временно недоступна
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
