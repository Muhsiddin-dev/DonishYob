'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { useBooks, useDeleteBook } from '@/hooks/useBooks';
import { useAuthStore } from '@/store/authStore';
import { BookFilters } from '@/types';
import { routes, config } from '@/config';
import { formatBytes, formatDate } from '@/lib/utils';

export default function AdminBooksPage() {
  const [filters, setFilters] = useState<BookFilters>({ page: 1, pageSize: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isSuperAdmin } = useAuthStore();

  const { data, isLoading } = useBooks(filters);
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteBook(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление книгами</h1>
        <Link href={routes.adminNewBook}>
          <Button className='text-white'>
            <PlusIcon className="h-5 w-5 mr-2" />
            Добавить книгу
          </Button>
        </Link>
      </div>

      <Card variant="bordered">
        <div className="p-4 border-b border-gray-200">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearch}
            placeholder="Поиск по названию или автору..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Книга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Уровень
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Размер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Скачиваний
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))
              ) : !data?.items || data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Книги не найдены</p>
                  </td>
                </tr>
              ) : (
                data.items.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-8 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                          {book.images?.[0] ? (
                            <img
                              src={book.images[0].imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <BookOpenIcon className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {book.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          book.difficulty === 'Beginner'
                            ? 'success'
                            : book.difficulty === 'Intermediate'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {config.difficultyLabels[book.difficulty]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBytes(book.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(book.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={routes.adminEditBook(book.id)}>
                          <Button variant="ghost" size="sm">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        {isSuperAdmin() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(book.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Удалить книгу?"
        message="Это действие нельзя отменить. Книга будет удалена безвозвратно."
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </div>
  );
}
