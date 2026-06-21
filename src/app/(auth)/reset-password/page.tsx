'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validators';
import { useResetPassword } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui';
import { useEffect } from 'react';

type ResetPasswordFormValues = Pick<ResetPasswordFormData, 'newPassword' | 'confirmPassword'>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { success, error } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail') || '';
    const savedCode = localStorage.getItem('resetCode') || '';

    setValue('email', savedEmail);
    setValue('code', savedCode);
  }, [setValue]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    const email = localStorage.getItem('resetEmail');
    const code = localStorage.getItem('resetCode');

    console.log('alo - Форма фиристода шуд!');

    if (!email || !code) {
      error('Маълумот ёфт нашуд. Аз нав кӯшиш кунед');
      return router.push('/forgot-password');
    }

    resetPassword(
      {
        email,
        code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      },
    );
  };

  return (
    <div className="space-y-5 max-w-md mx-auto py-5">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Ивази пароли нав</h2>
        <p className="text-sm text-gray-500">Пароли нави худро ворид кунед</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Пароли нав"
          type="password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        <Input
          label="Тасдиқи парол"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-6 text-white bg-primary-600 hover:bg-primary-700"
        >
          {isPending ? 'Иваз шуда истодааст...' : 'Сабт кардани парол'}
        </Button>
      </form>
    </div>
  );
}