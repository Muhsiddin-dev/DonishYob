'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { audioBooksApi } from '@/lib/api/audiobooks';
import { CreateAudioBookRequest } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const audioBookKeys = {
    all: ['audiobooks'] as const,
    lists: () => [...audioBookKeys.all, 'list'] as const,
};

export function useAudioBooks() {
    return useQuery({
        queryKey: audioBookKeys.lists(),
        queryFn: () => audioBooksApi.getAudioBooks(),
    });
}

export function useCreateAudioBook() {
    const queryClient = useQueryClient();
    const { success, error } = useToast();

    return useMutation({
        mutationFn: (data: CreateAudioBookRequest) => audioBooksApi.createAudioBook(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: audioBookKeys.lists() });
            success('Аудиокнига успешно добавлена');
        },
        onError: () => {
            error('Ошибка при добавлении аудиокниги');
        },
    });
}
