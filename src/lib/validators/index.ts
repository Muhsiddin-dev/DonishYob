import { z } from 'zod';

export * from './auth';
export * from './book';

// Category validation
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов'),
  description: z
    .string()
    .max(500, 'Описание не должно превышать 500 символов')
    .optional()
    .or(z.literal('')),
  image: z.any().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Audience validation
export const audienceSchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов'),
});

export type AudienceFormData = z.infer<typeof audienceSchema>;

export const interestsSchema = z.object({
  // Only one genre (audience) must be selected
  audienceIds: z.array(z.string()).length(1, 'Выберите один жанр'),
  categoryIds: z.array(z.string()).min(1, 'Выберите хотя бы одну категорию'),
});

export type InterestsFormData = z.infer<typeof interestsSchema>;

// About Us validation
export const aboutUsSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(200, 'Заголовок не должен превышать 200 символов'),
  content: z
    .string()
    .min(1, 'Содержимое обязательно'),
  mission: z
    .string()
    .min(1, 'Миссия обязательна'),
  vision: z
    .string()
    .min(1, 'Видение обязательно'),
  contactEmail: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
});

export type AboutUsFormData = z.infer<typeof aboutUsSchema>;
