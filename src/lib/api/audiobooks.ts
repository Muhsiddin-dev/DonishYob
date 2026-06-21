'use client';

import apiClient from './client';
import { AudioBook, CreateAudioBookRequest } from '@/types';

function normalizeStringField(data: any, keys: string[]): string {
    for (const key of keys) {
        const value = data?.[key];
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
        if (typeof value === 'number') {
            return String(value);
        }
        if (value && typeof value === 'object') {
            const nestedUrl = (value.url || value.Url || value.audioUrl || value.AudioUrl) as string | undefined;
            if (typeof nestedUrl === 'string' && nestedUrl.trim()) {
                return nestedUrl.trim();
            }
        }
    }
    return '';
}

function normalizeNumberField(data: any, keys: string[]): number | undefined {
    for (const key of keys) {
        const value = data?.[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsed = Number(value);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
    }
    return undefined;
}

function normalizeAudioBook(data: Record<string, unknown>): AudioBook {
    if (!data) {
        return {
            id: '',
            title: '',
            author: '',
            description: '',
            categoryId: '',
            durationSeconds: undefined,
            audioUrl: '',
            coverImageUrl: '',
        } as AudioBook;
    }

    const category =
        data.category && typeof data.category === 'object'
            ? (data.category as AudioBook['category'])
            : undefined;

    return {
        id: normalizeStringField(data, ['id', '_id', 'Id', 'uuid', 'UUID']),
        title: normalizeStringField(data, ['title', 'Title', 'name', 'Name']),
        author: normalizeStringField(data, ['author', 'Author']),
        description: normalizeStringField(data, ['description', 'Description']),
        categoryId: normalizeStringField(data, ['categoryId', 'CategoryId', 'category_id', 'Category_Id']),
        category,
        durationSeconds: normalizeNumberField(data, ['durationSeconds', 'DurationSeconds', 'duration', 'Duration']),
        audioUrl: normalizeStringField(data, ['audioUrl', 'AudioUrl', 'audio_url', 'Audio', 'audio', 'fileUrl', 'FileUrl']),
        coverImageUrl: normalizeStringField(data, ['coverImageUrl', 'CoverImageUrl', 'cover_image', 'CoverImage', 'coverImage', 'CoverImage', 'thumbnailUrl', 'ThumbnailUrl']),
        createdAt: normalizeStringField(data, ['createdAt', 'CreatedAt', 'created_at', 'Created_At']),
    };
}

export const audioBooksApi = {
    getAudioBooks: async (): Promise<AudioBook[]> => {
        const response = await apiClient.get('/api/audiobooks');
        let data: any = response.data;

        if (data?.data) {
            data = data.data;
        }

        if (data?.items && Array.isArray(data.items)) {
            return data.items.map((item: Record<string, unknown>) => normalizeAudioBook(item));
        }

        if (Array.isArray(data)) {
            return data.map((item: Record<string, unknown>) => normalizeAudioBook(item));
        }

        return [];
    },

    createAudioBook: async (request: CreateAudioBookRequest): Promise<AudioBook> => {
        const formData = new FormData();
        formData.append('Title', request.title);
        formData.append('Author', request.author);
        formData.append('Description', request.description ?? '');
        formData.append('CategoryId', request.categoryId);
        if (request.durationSeconds !== undefined && request.durationSeconds !== null) {
            formData.append('DurationSeconds', request.durationSeconds.toString());
        }
        formData.append('Audio', request.audio);
        if (request.coverImage) {
            formData.append('CoverImage', request.coverImage);
        }

        const response = await apiClient.post('/api/admin/audiobooks', formData);
        let data: any = response.data;

        if (data?.data) {
            data = data.data;
        }

        return normalizeAudioBook(data);
    },
};
