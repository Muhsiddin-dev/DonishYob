import apiClient from './client';
import { UserInterestsRequest } from '@/types';

export const usersApi = {
    createUserInterests: async (data: UserInterestsRequest): Promise<void> => {
        const formData = new FormData();

        data.audienceIds.forEach((id) => {
            formData.append('AudienceIds', id);
        });

        data.categoryIds.forEach((id) => {
            formData.append('CategoryIds', id);
        });

        await apiClient.post('/api/users/interests', formData);
    },
};
