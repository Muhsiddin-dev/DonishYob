import apiClient from './client';
import { Audience, CreateAudienceRequest, UpdateAudienceRequest } from '@/types';

export const audiencesApi = {
  getAudiences: async (): Promise<Audience[]> => {
    try {
      const response = await apiClient.get('/api/audiences');
      let data = response.data;

      console.log('Raw audiences API response:', data);
      console.log('Response status:', response.status);
      console.log('Full response:', response);

      // Handle nested data
      if (data?.data) {
        data = data.data;
      }

      if (Array.isArray(data)) {
        console.log('Audiences array:', data.length);
        return data;
      }
      if (data?.items && Array.isArray(data.items)) {
        console.log('Audiences items:', data.items.length);
        return data.items;
      }

      console.log('No valid audiences data');
      return [];
    } catch (error) {
      console.error('Audiences API error:', error);
      return [];
    }
  },

  getAudience: async (id: string): Promise<Audience> => {
    const response = await apiClient.get<Audience>(`/api/audiences/${id}`);
    return response.data;
  },

  createAudience: async (data: CreateAudienceRequest): Promise<Audience> => {
    const response = await apiClient.post<Audience>('/api/admin/audiences', data);
    return response.data;
  },

  updateAudience: async (id: string, data: UpdateAudienceRequest): Promise<Audience> => {
    const response = await apiClient.put<Audience>(`/api/admin/audiences/${id}`, data);
    return response.data;
  },

  deleteAudience: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/audiences/${id}`);
  },
};
