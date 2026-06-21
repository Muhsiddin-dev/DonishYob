'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about';
import { UpdateAboutUsRequest } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const aboutKeys = {
  all: ['about'] as const,
};

export function useAboutUs() {
  return useQuery({
    queryKey: aboutKeys.all,
    queryFn: () => aboutApi.getAboutUs(),
  });
}

export function useUpdateAboutUs() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: UpdateAboutUsRequest) => aboutApi.updateAboutUs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutKeys.all });
      success('Информация обновлена');
    },
    onError: () => {
      error('Ошибка при обновлении информации');
    },
  });
}
