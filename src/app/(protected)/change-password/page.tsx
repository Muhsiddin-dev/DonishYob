'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validators';
import { useChangePassword } from '@/hooks/useAuth';
import { Container } from '@/components/layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { routes } from '@/config';

export default function ChangePasswordPage() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="py-8">
      <Container size="sm">
        <div className="mb-8">
          <Link
            href={routes.profile}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Назад к профилю
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Смена пароля</h1>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Введите новый пароль</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Текущий пароль"
                type="password"
                autoComplete="current-password"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />

              <Input
                label="Новый пароль"
                type="password"
                autoComplete="new-password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />

              <Input
                label="Подтверждение нового пароля"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <div className="pt-4">
                <Button type="submit" className='text-white'>
                  {isPending ? 'Смена пароля...' : 'Сменить пароль'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
