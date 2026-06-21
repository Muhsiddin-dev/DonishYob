import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Некорректный email'),
    fullName: z
      .string()
      .min(1, 'Имя обязательно')
      .min(2, 'Имя должно содержать минимум 2 символа'),
    password: z
      .string()
      .min(1, 'Пароль обязателен')
      .min(8, 'Пароль должен содержать минимум 8 символов') 
      .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква') 
      .regex(/[0-9]/, 'Должна быть хотя бы одна цифра')
      .regex(/[^a-zA-Z0-9]/, 'Должен быть хотя бы один спецсимвол (@, $, ! и т.д.)'),
    confirmPassword: z
      .string()
      .min(1, 'Подтверждение пароля обязательно'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  code: z
    .string()
    .min(1, 'Код обязателен')
    .length(6, 'Код должен содержать 6 цифр'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Некорректный email'),
    code: z
      .string()
      .min(1, 'Код обязателен')
      .length(6, 'Код должен содержать 6 цифр'),
    newPassword: z
      .string()
      .min(1, 'Пароль обязателен')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z
      .string()
      .min(1, 'Подтверждение пароля обязательно'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Текущий пароль обязателен'),
    newPassword: z
      .string()
      .min(1, 'Новый пароль обязателен')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z
      .string()
      .min(1, 'Подтверждение пароля обязательно'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
