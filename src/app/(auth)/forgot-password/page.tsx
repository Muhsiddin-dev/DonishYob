'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validators';
import { useForgotPassword } from '@/hooks/useAuth';
import { routes } from '@/config';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
    localStorage.setItem('resetEmail', data.email);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Восстановление пароля
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Введите email, и мы отправим код для сброса пароля
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Button type="submit" className="w-full text-white dark:bg-primary-600 py-5" disabled={isPending}>
          {isPending ? "Loading..." : "Отправить код"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Вспомнили пароль?{' '}
        <Link
          href={routes.login}
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Войти
        </Link>
      </p>
    </>
  );
}
