'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { audienceSchema, AudienceFormData } from '@/lib/validators';
import {
  useAudiences,
  useCreateAudience,
  useUpdateAudience,
  useDeleteAudience,
} from '@/hooks/useAudiences';
import { Audience } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableRowSkeleton } from '@/components/ui/skeleton';

export default function AdminAudiencesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: audiences, isLoading } = useAudiences();
  const { mutate: createAudience, isPending: isCreating } = useCreateAudience();
  const { mutate: updateAudience, isPending: isUpdating } = useUpdateAudience();
  const { mutate: deleteAudience, isPending: isDeleting } = useDeleteAudience();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
  });

  const openCreateModal = () => {
    setEditingAudience(null);
    reset({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (audience: Audience) => {
    setEditingAudience(audience);
    reset({ name: audience.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAudience(null);
    reset();
  };

  const onSubmit = (data: AudienceFormData) => {
    if (editingAudience) {
      updateAudience(
        { id: editingAudience.id, data },
        { onSuccess: closeModal }
      );
    } else {
      createAudience(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAudience(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление аудиториями</h1>
        <Button onClick={openCreateModal}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Добавить аудиторию
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={2} />
                ))
              ) : audiences?.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-16 text-center">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Аудитории не найдены</p>
                  </td>
                </tr>
              ) : (
                audiences?.map((audience) => (
                  <tr key={audience.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {audience.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(audience)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(audience.id)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAudience ? 'Редактировать аудиторию' : 'Новая аудитория'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Название"
            {...register('name')}
            error={errors.name?.message}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Отмена
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? 'Загрузка...' : (editingAudience ? 'Сохранить' : 'Создать')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Удалить аудиторию?"
        message="Это действие нельзя отменить. Все книги с этой аудиторией останутся без неё."
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </div>
  );
}
