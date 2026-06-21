import apiClient from './client';
import { Statistics, User, UserRole, PaginatedResponse } from '@/types';

export interface UsersFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export const adminApi = {
  getStatistics: async (): Promise<Statistics> => {
    const response = await apiClient.get('/api/admin/statistics');
    let data = response.data;

    console.log('Raw statistics API response:', data);

    // Handle nested data
    if (data?.data) {
      data = data.data;
    }

    return data as Statistics;
  },

  getUsers: async (filters?: UsersFilters): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    }

    const response = await apiClient.get(`/api/admin/users?${params}`);
    let data = response.data;

    console.log('Raw users API response:', data);

    // Handle nested data
    if (data?.data) {
      data = data.data;
      console.log('Unwrapped users data:', data);
    }

    // Normalize response to PaginatedResponse structure
    if (data?.items && Array.isArray(data.items)) {
      console.log('Users items:', data.items.length);
      return data as PaginatedResponse<User>;
    }
    if (Array.isArray(data)) {
      console.log('Users array:', data.length);
      return {
        items: data,
        page: 1,
        pageSize: data.length,
        totalItems: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    console.log('No valid users data');
    return {
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<void> => {
    await apiClient.put(`/api/admin/users/${userId}/role`, { role });
  },

  toggleUserActive: async (userId: string): Promise<void> => {
    await apiClient.put(`/api/admin/users/${userId}/toggle-active`);
  },
};
