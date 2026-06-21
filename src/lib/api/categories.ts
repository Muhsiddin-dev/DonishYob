import apiClient from './client';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/api/categories');
      let data = response.data;

      console.log('Raw categories API response:', data);
      console.log('Response status:', response.status);
      console.log('Full response:', response);

      // Handle nested data
      if (data?.data) {
        data = data.data;
      }

      if (Array.isArray(data)) {
        console.log('Categories array:', data.length);
        return data;
      }
      if (data?.items && Array.isArray(data.items)) {
        console.log('Categories items:', data.items.length);
        return data.items;
      }

      console.log('No valid categories data');
      return [];
    } catch (error) {
      console.error('Categories API error:', error);
      return [];
    }
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/api/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/categories/${id}`);
  },
};
