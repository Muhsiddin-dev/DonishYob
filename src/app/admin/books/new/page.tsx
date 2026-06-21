'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { bookSchema, BookFormData } from '@/lib/validators';
import { useCreateBook } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useAudiences } from '@/hooks/useAudiences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/FileUpload';
import { routes } from '@/config';
import { useToast } from '@/components/ui';

const difficultyOptions = [
  { value: 'Beginner', label: 'Начинающий' },
  { value: 'Intermediate', label: 'Средний' },
  { value: 'Advanced', label: 'Продвинутый' },
];

const languageOptions = [
  { value: 'Russian', label: 'Русский' },
  { value: 'Tajik', label: 'Тоҷикӣ' },
  { value: 'English', label: 'English' },
];

export default function NewBookPage() {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const { success: showSuccess, error: showError } = useToast();

  const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB per image
  const MAX_COVERS = 5;

  const { mutate: createBook, isPending } = useCreateBook();
  const { data: categories } = useCategories();
  const { data: audiences } = useAudiences();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      pageCount: undefined, // ё 0
    },
  });

  const categoryOptions = categories?.map((c) => ({ value: c.id, label: c.name })) || [];
  const audienceOptions = audiences?.map((a) => ({ value: a.id, label: a.name })) || [];

  const onSubmit = (data: BookFormData) => {
    if (!pdfFile) {
      showError("Лутфан файли PDF-ро интихоб кунед");
      return;
    }

    const bookData = {
      title: data.title,
      author: data.author,
      description: data.description,
      difficulty: data.difficulty,
      language: data.language,
      categoryId: data.categoryId,
      audienceId: data.audienceId,
      pageCount: data.pageCount,
      pdfFile: pdfFile,
      coverImages: coverImages,
    };

    createBook(bookData, {
      onSuccess: () => {
        showSuccess("Китоб бо муваффақият илова шуд!");
        router.push(routes.adminBooks);
      },
      onError: (err: any) => {
        console.error(err);
        showError(err?.message || "Хатогӣ ҳангоми илова кардани китоб");
      },
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Добавить книгу</h1>
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
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Категория"
                        options={categoryOptions}
                        placeholder="Выберите категорию"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.categoryId?.message}
                      />
                    )}
                  />
                  <Controller
                    name="audienceId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Аудитория"
                        options={audienceOptions}
                        placeholder="Выберите аудиторию"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.audienceId?.message}
                      />
                    )}
                  />
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Уровень сложности"
                        options={difficultyOptions}
                        placeholder="Выберите уровень"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.difficulty?.message}
                      />
                    )}
                  />
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Язык"
                        options={languageOptions}
                        placeholder="Выберите Язык"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.language?.message}
                      />
                    )}
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
                <CardTitle>Файли PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf"
                  maxSize={MAX_PDF_SIZE}
                  onFilesSelected={(files) => {
                    const file = files[0] || null;
                    setPdfFile(file);
                    if (!file) {
                      showError('Лутфан файли PDF-ро интихоб кунед');
                    }
                  }}
                  helperText="Максимум 50 MB"
                  error={!pdfFile ? "Файли PDF ҳатмист" : undefined}
                />
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Обложка(ҳо)</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept="image/*"
                  multiple
                  maxFiles={MAX_COVERS}
                  maxSize={MAX_COVER_SIZE}
                  onFilesSelected={(files) => setCoverImages(files)}
                  helperText="JPG, PNG, WebP • то 5 MB барои ҳар як"
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full text-white"
              disabled={isPending || !pdfFile}
            >
              {isPending ? "Дар ҳоли илова кардан..." : "Илова кардани китоб"}
            </Button>
          </div>
        </div>
      </form >
    </div >
  );
}
