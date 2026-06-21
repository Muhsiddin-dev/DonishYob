'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { categorySchema, CategoryFormData } from '@/lib/validators';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { Category } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableRowSkeleton } from '@/components/ui/skeleton';

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    reset({ name: category.name, description: category.description || '' });

    if (category.imageUrl) {
      setPreview(category.imageUrl);
    } else {
      setPreview(null);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Description', data.description || '');

    if (data.image instanceof File) {
      formData.append('Image', data.image);
    }

    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, data: formData as any },
        {
          onSuccess: () => {
            closeModal();
            setPreview(null);
          },
        }
      );
    } else {
      createCategory(formData as any, {
        onSuccess: () => {
          closeModal();
          setPreview(null);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue('image', file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление категориями</h1>
        <Button className='text-white py-5' onClick={openCreateModal}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Добавить категорию
        </Button>
      </div>

      <Card variant="bordered">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={3} />
                ))
              ) : categories?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <FolderIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Категории не найдены</p>
                  </td>
                </tr>
              ) : (
                categories?.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.description || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(category)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(category.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Название"
            {...register('name')}
            error={errors.name?.message}
          />
          <Textarea
            label="Описание"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Изображение</label>

            {preview && (
              <div className="relative w-full h-40 mb-2 overflow-hidden rounded-xl border">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setValue('image', null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-slate-500">Загрузить изображение</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.image && <p className="text-xs text-red-500">{errors.image.message as string}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Отмена
            </Button>
            <Button
              type="submit"
              className='text-white'
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating)
                ? 'Дар ҳоли иҷро...'
                : (editingCategory ? 'Сохранить' : 'Создать')
              }
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Удалить категорию?"
        message="Это действие нельзя отменить. Все книги в этой категории останутся без категории."
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </div>
  );
}
