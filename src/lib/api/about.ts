import apiClient from './client';
import { AboutUs, UpdateAboutUsRequest } from '@/types';

export const aboutApi = {
  getAboutUs: async (): Promise<AboutUs> => {
    const response = await apiClient.get<AboutUs>('/api/about-us');
    return response.data;
  },

  updateAboutUs: async (data: UpdateAboutUsRequest): Promise<AboutUs> => {
    const response = await apiClient.put<AboutUs>('/api/about-us', data);
    return response.data;
  },
};
