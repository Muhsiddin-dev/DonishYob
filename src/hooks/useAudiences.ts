'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { audiencesApi } from '@/lib/api/audiences';
import { CreateAudienceRequest, UpdateAudienceRequest } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const audienceKeys = {
  all: ['audiences'] as const,
  lists: () => [...audienceKeys.all, 'list'] as const,
  detail: (id: string) => [...audienceKeys.all, 'detail', id] as const,
};

export function useAudiences() {
  return useQuery({
    queryKey: audienceKeys.lists(),
    queryFn: () => audiencesApi.getAudiences(),
  });
}

export function useAudience(id: string) {
  return useQuery({
    queryKey: audienceKeys.detail(id),
    queryFn: () => audiencesApi.getAudience(id),
    enabled: !!id,
  });
}

export function useCreateAudience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateAudienceRequest) => audiencesApi.createAudience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audienceKeys.lists() });
      success('Аудитория успешно создана');
    },
    onError: () => {
      error('Ошибка при создании аудитории');
    },
  });
}

export function useUpdateAudience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAudienceRequest }) =>
      audiencesApi.updateAudience(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: audienceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: audienceKeys.detail(variables.id) });
      success('Аудитория успешно обновлена');
    },
    onError: () => {
      error('Ошибка при обновлении аудитории');
    },
  });
}

export function useDeleteAudience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => audiencesApi.deleteAudience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audienceKeys.lists() });
      success('Аудитория успешно удалена');
    },
    onError: () => {
      error('Ошибка при удалении аудитории');
    },
  });
}
