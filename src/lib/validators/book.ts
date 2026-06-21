import { z } from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_PDF_TYPES = ['application/pdf'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обяBookFormDataательно')
    .max(500, 'Название не должно превышать 500 символов'),
  author: z
    .string()
    .min(1, 'Автор обязателен')
    .max(255, 'Имя автора не должно превышать 255 символов'),
  description: z
    .string()
    .min(1, 'Описание обязательно')
    .min(10, 'Описание должно содержать минимум 10 символов'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: 'Выберите уровень сложности' }),
  }),
  language: z
    .string()
    .min(1, 'Язык обязателен')
    .max(10, 'Код языка не должен превышать 10 символов'),
  categoryId: z
    .string()
    .min(1, 'Категория обязательна'),
  audienceId: z
    .string()
    .min(1, 'Аудитория обязательна'),
  pageCount: z
    .number()
    .int()
    .positive('Количество страниц должно быть положительным')
    .optional(),
});

export const bookFileSchema = z.object({
  pdfFile: z
    .custom<File>()
    .refine((file) => file instanceof File, 'PDF файл обязателен')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Файл не должен превышать 50MB')
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      'Допускаются только PDF файлы'
    ),
  coverImages: z
    .custom<File[]>()
    .refine(
      (files) => !files || files.every((file) => file.size <= 5 * 1024 * 1024),
      'Изображение не должно превышать 5MB'
    )
    .refine(
      (files) => !files || files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Допускаются только JPG, PNG или WebP изображения'
    )
    .optional(),
});

export const createBookSchema = bookSchema.merge(bookFileSchema);

export const updateBookSchema = bookSchema.partial().merge(
  z.object({
    pdfFile: z
      .custom<File>()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'Файл не должен превышать 50MB')
      .refine(
        (file) => !file || ACCEPTED_PDF_TYPES.includes(file.type),
        'Допускаются только PDF файлы'
      )
      .optional(),
    coverImages: z
      .custom<File[]>()
      .refine(
        (files) => !files || files.every((file) => file.size <= 5 * 1024 * 1024),
        'Изображение не должно превышать 5MB'
      )
      .refine(
        (files) => !files || files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        'Допускаются только JPG, PNG или WebP изображения'
      )
      .optional(),
  })
);

export type BookFormData = z.infer<typeof bookSchema>;
export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
