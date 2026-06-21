'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { useAudioBooks, useCreateAudioBook } from '@/hooks/useAudioBooks';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/FileUpload';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui';
import { AudioBook } from '@/types';

const audioBookSchema = z.object({
    title: z.string().min(1, 'Введите название'),
    author: z.string().min(1, 'Введите автора'),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Выберите категорию'),
    durationSeconds: z
        .preprocess((value) => {
            if (typeof value === 'string') {
                return value === '' ? undefined : Number(value);
            }
            return value;
        }, z.number().int().positive('Введите длину в секундах').optional()),
});

type AudioBookFormData = z.infer<typeof audioBookSchema>;

function formatDuration(seconds?: number): string {
    if (!seconds || seconds < 0) return '—';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default function AdminAudiobooksPage() {
    const { data: audiobooks, isLoading: isLoadingAudiobooks } = useAudioBooks();
    const { data: categories, isLoading: isLoadingCategories } = useCategories();
    const { mutate: createAudioBook, isPending: isCreating } = useCreateAudioBook();
    const { success: showSuccess, error: showError } = useToast();

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [audioUploadKey, setAudioUploadKey] = useState(0);
    const [coverUploadKey, setCoverUploadKey] = useState(0);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<AudioBookFormData>({
        resolver: zodResolver(audioBookSchema),
        defaultValues: {
            title: '',
            author: '',
            description: '',
            categoryId: '',
            durationSeconds: undefined,
        },
    });

    const categoryOptions = categories?.map((category) => ({
        value: category.id,
        label: category.name,
    })) || [];

    const handleCreate = (data: AudioBookFormData) => {
        if (!audioFile) {
            showError('Выберите аудиофайл');
            return;
        }

        const request = {
            title: data.title,
            author: data.author,
            description: data.description || '',
            categoryId: data.categoryId,
            durationSeconds: data.durationSeconds,
            audio: audioFile,
            coverImage: coverFile ?? undefined,
        };

        createAudioBook(request, {
            onSuccess: () => {
                showSuccess('Аудиокнига успешно добавлена');
                reset();
                setAudioFile(null);
                setCoverFile(null);
                setAudioUploadKey((prev) => prev + 1);
                setCoverUploadKey((prev) => prev + 1);
            },
            onError: (err: any) => {
                showError(err?.message || 'Ошибка при сохранении аудиокниги');
            },
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Управление аудиокнигами</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Загружайте новые аудиокниги и просматривайте список существующих.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-1">
                    <Card variant="bordered">
                        <CardHeader>
                            <CardTitle>Новая аудиокнига</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
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
                                    rows={4}
                                    {...register('description')}
                                    error={errors.description?.message}
                                />
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Категория"
                                            options={categoryOptions}
                                            placeholder={isLoadingCategories ? 'Загрузка...' : 'Выберите категорию'}
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            error={errors.categoryId?.message}
                                        />
                                    )}
                                />
                                {/* <Input
                                    label="Длительность (в секундах)"
                                    type="number"
                                    min={1}
                                    {...register('durationSeconds', { valueAsNumber: true })}
                                    error={errors.durationSeconds?.message}
                                /> */}

                                <FileUpload
                                    key={audioUploadKey}
                                    accept="audio/*"
                                    onFilesSelected={(files) => setAudioFile(files[0] || null)}
                                    helperText="Загрузите аудиофайл MP3/OGG до 100 МБ"
                                />
                                <FileUpload
                                    key={coverUploadKey}
                                    accept="image/*"
                                    onFilesSelected={(files) => setCoverFile(files[0] || null)}
                                    helperText="Обложка книги (JPG, PNG) до 10 МБ"
                                />

                                <Button type="submit" className="w-full text-white" disabled={isCreating}>
                                    {isCreating ? 'Сохранение...' : 'Добавить аудиокнигу'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="xl:col-span-2">
                    <Card variant="bordered">
                        <CardHeader>
                            <CardTitle>Список аудиокниг</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Название
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Категория
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Длительность
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Аудио
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Обложка
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoadingAudiobooks ? (
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRowSkeleton key={index} columns={5} />
                                        ))
                                    ) : audiobooks && audiobooks.length > 0 ? (
                                        audiobooks.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                                    <div className="text-sm text-gray-500">{book.author}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{book.description || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                                                    {book.category?.name || book.categoryId || '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                                                    {formatDuration(book.durationSeconds)}
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    {book.audioUrl ? (
                                                        <audio controls className="w-full max-w-xs">
                                                            <source src={book.audioUrl} />
                                                            Ваш браузер не поддерживает аудио.
                                                        </audio>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    {book.coverImageUrl ? (
                                                        <img
                                                            src={book.coverImageUrl}
                                                            alt={book.title}
                                                            className="h-16 w-16 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-500">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-300" />
                                                <p className="mt-2 text-gray-500">Аудиокниги не найдены</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
