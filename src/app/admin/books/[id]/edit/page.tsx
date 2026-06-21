'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { bookSchema, BookFormData } from '@/lib/validators';
import { useBook, useUpdateBook } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useAudiences } from '@/hooks/useAudiences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/FileUpload';
import { LoadingScreen } from '@/components/ui/Spinner';
import { routes } from '@/config';
import SwipperBookImg from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';

const difficultyOptions = [
  { value: 'Beginner', label: 'Начинающий' },
  { value: 'Intermediate', label: 'Средний' },
  { value: 'Advanced', label: 'Продвинутый' },
];

export default function EditBookPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImages, setCoverImages] = useState<File[]>([]);

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { mutate: updateBook, isPending } = useUpdateBook();
  const { data: categories } = useCategories();
  const { data: audiences } = useAudiences();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        description: book.description,
        difficulty: book.difficulty,
        language: book.language,
        categoryId: book.categoryId,
        audienceId: book.audienceId,
        pageCount: book.PageCount || undefined,
      });
    }
  }, [book, reset]);

  const categoryOptions = categories?.map((c) => ({ value: c.id, label: c.name })) || [];
  const audienceOptions = audiences?.map((a) => ({ value: a.id, label: a.name })) || [];

  const onSubmit = (data: BookFormData) => {
    updateBook(
      {
        id,
        data: {
          ...data,
          pdfFile: pdfFile || undefined,
          coverImages: coverImages.length > 0 ? coverImages : undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(routes.adminBooks);
        },
      }
    );
  };

  if (bookLoading) {
    return <LoadingScreen />;
  }

  if (!book) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Книга не найдена</p>
        <Link href={routes.adminBooks}>
          <Button variant="outline" className="mt-4">
            Вернуться к списку
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={routes.adminBooks}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Назад к списку
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Редактировать книгу</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Название"
                  {...register('title')}
                  error={errors.title?.message}
                />
                <Input
                  label="Автор"
                  {...register('author')}
                  error={errors.author?.message}
                />
                <Textarea
                  label="Описание"
                  rows={6}
                  {...register('description')}
                  error={errors.description?.message}
                />
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Характеристики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Категория"
                    options={categoryOptions}
                    {...register('categoryId')}
                    error={errors.categoryId?.message}
                  />
                  <Select
                    label="Аудитория"
                    options={audienceOptions}
                    {...register('audienceId')}
                    error={errors.audienceId?.message}
                  />
                  <Select
                    label="Уровень сложности"
                    options={difficultyOptions}
                    {...register('difficulty')}
                    error={errors.difficulty?.message}
                  />
                  <Input
                    label="Язык"
                    {...register('language')}
                    error={errors.language?.message}
                  />
                  <Input
                    label="Количество страниц"
                    type="number"
                    {...register('pageCount', { valueAsNumber: true })}
                    error={errors.pageCount?.message}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>PDF файл</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Текущий файл: {book.pdfFileName}
                </p>
                <FileUpload
                  accept=".pdf"
                  onFilesSelected={(files) => setPdfFile(files[0] || null)}
                  helperText="Оставьте пустым, чтобы сохранить текущий файл"
                />
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Обложка</CardTitle>
              </CardHeader>
              <CardContent>
                {/* {book.images && book.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Текущая обложка:</p>
                    <img
                      src={book.images[0].imageUrl}
                      alt="Cover"
                      className="w-full max-w-[200px] rounded-lg"
                    />
                  </div>
                )} */}
                {book.images && book.images.length > 0 && (
                  <div className='pb-10 shadow-md overflow-hidden'>
                    <SwipperBookImg images={book.images} title={book.title} />
                  </div>
                )}
                <FileUpload
                  accept="image/*"
                  multiple
                  maxFiles={5}
                  onFilesSelected={setCoverImages}
                  helperText="Загрузите новые изображения для замены"
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              {isPending ? 'Сохранить...' : 'Сохранить изменения'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
