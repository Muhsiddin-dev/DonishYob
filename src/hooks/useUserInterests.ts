'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { usersApi } from '@/lib/api/users';
import { UserInterestsRequest } from '@/types';
import { routes } from '@/config';

export function useUserInterests() {
    const router = useRouter();
    const { success, error } = useToast();

    return useMutation({
        mutationFn: (data: UserInterestsRequest | FormData) =>
            usersApi.createUserInterests(data as any),

        onSuccess: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('needs_interests');
            }
            success('Анкета сохранена.');
            router.push(routes.home);
        },
        onError: (err: any) => {
            const backendError =
                err?.response?.data?.errors?.AudienceIds?.[0] ||
                err?.response?.data?.errors?.CategoryIds?.[0] ||
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                'Ошибка отправки анкеты';

            const message =
                typeof backendError === 'string' && backendError.toLowerCase().includes('profile already exists')
                    ? 'Шумо аллакай ин анкетаро пур кардаед.'
                    : backendError;

            error(message);
        },
    });
}
