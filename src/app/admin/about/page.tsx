'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aboutUsSchema, AboutUsFormData } from '@/lib/validators';
import { useAboutUs, useUpdateAboutUs } from '@/hooks/useAbout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/Spinner';

export default function AdminAboutPage() {
  const { data: about, isLoading } = useAboutUs();
  const { mutate: updateAboutUs, isPending } = useUpdateAboutUs();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AboutUsFormData>({
    resolver: zodResolver(aboutUsSchema),
  });

  useEffect(() => {
    if (about) {
      reset({
        title: about.title,
        content: about.content,
        mission: about.mission,
        vision: about.vision,
        contactEmail: about.contactEmail,
      });
    }
  }, [about, reset]);

  const onSubmit = (data: AboutUsFormData) => {
    updateAboutUs(data);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Редактирование страницы «О нас»</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Заголовок"
                {...register('title')}
                error={errors.title?.message}
              />
              <Textarea
                label="Содержимое"
                rows={8}
                {...register('content')}
                error={errors.content?.message}
              />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Миссия и видение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Миссия"
                rows={4}
                {...register('mission')}
                error={errors.mission?.message}
              />
              <Textarea
                label="Видение"
                rows={4}
                {...register('vision')}
                error={errors.vision?.message}
              />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Email для связи"
                type="email"
                {...register('contactEmail')}
                error={errors.contactEmail?.message}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
