'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '@/lib/api/books';
import { BookFilters, CreateBookRequest, UpdateBookRequest } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters: BookFilters) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  byCategory: (categoryId: string) => [...bookKeys.all, 'category', categoryId] as const,
};

export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: () => booksApi.getBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
  });
}

export function useBooksByCategory(categoryId: string) {
  return useQuery({
    queryKey: bookKeys.byCategory(categoryId),
    queryFn: () => booksApi.getBooksByCategory(categoryId),
    enabled: !!categoryId,
  });
}
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (bookData: CreateBookRequest) => booksApi.createBook(bookData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] }); 
    },
  });

  return mutation;
};

export function useUpdateBook() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      booksApi.updateBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(variables.id) });
      success('Книга успешно обновлена');
    },
    onError: () => {
      error('Ошибка при обновлении книги');
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => booksApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      success('Книга успешно удалена');
    },
    onError: () => {
      error('Ошибка при удалении книги');
    },
  });
}
