'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { useLogin } from '@/hooks/useAuth';
import { routes } from '@/config';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <>
    
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Вход в систему
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Пароль"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <Link
            href={routes.forgotPassword}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" className="w-full text-white dark:bg-primary-600 py-5" >
          {isPending ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Нет аккаунта?{' '}
        <Link
          href={routes.register}
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Зарегистрироваться
        </Link>
      </p>
    </>
  );
}
