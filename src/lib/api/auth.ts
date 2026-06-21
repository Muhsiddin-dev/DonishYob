import apiClient from './client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  User,
} from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    let resData = response.data;

    console.log('Raw login API response:', resData);

    // Handle nested data object
    if (resData.data && typeof resData.data === 'object') {
      resData = resData.data;
    }

    // Normalize response - handle both camelCase and snake_case
    return {
      accessToken: resData.accessToken || resData.access_token || resData.token || '',
      refreshToken: resData.refreshToken || resData.refresh_token || '',
      expiresIn: resData.expiresIn || resData.expires_in || 3600,
      id: resData.id || resData.userId || resData.user_id || '',
      email: resData.email || '',
      fullName: resData.fullName || resData.full_name || resData.name || '',
      role: resData.role || 'User',
    };
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/auth/register', data);
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    await apiClient.post('/api/auth/verify-email', data);
  },

  resendVerificationCode: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/resend-verification-code', { email });
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/api/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/api/auth/reset-password', data);
  },

  refresh: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/refresh', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/me');
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/api/account/change-password', data);
  },
};
