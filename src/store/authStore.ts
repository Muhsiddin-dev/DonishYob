import { create } from 'zustand';
import { User, UserRole, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import { authApi } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/auth/tokens';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => void;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    const user = tokenStorage.getUser();

    if (accessToken && refreshToken && user) {
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response: AuthResponse = await authApi.login(data);

      console.log('Login response:', response);

      if (!response.accessToken) {
        console.error('No access token in response:', response);
        throw new Error('Invalid login response - no access token');
      }

      const user: User = {
        id: response.id || '',
        email: response.email || data.email,
        fullName: response.fullName || '',
        role: response.role || 'User',
        isActive: true,
        isEmailConfirmed: true,
        createdAt: new Date().toISOString(),
      };

      tokenStorage.setAccessToken(response.accessToken);
      if (response.refreshToken) {
        tokenStorage.setRefreshToken(response.refreshToken);
      }
      tokenStorage.setUser(user);

      console.log('Tokens saved, user:', user);

      set({
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true });
    try {
      await authApi.register(data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      tokenStorage.clearAll();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user: User) => {
    tokenStorage.setUser(user);
    set({ user });
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  clearAuth: () => {
    tokenStorage.clearAll();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hasRole: (roles: UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },

  isAdmin: () => {
    const { user } = get();
    if (!user) return false;
    return user.role === 'Admin' || user.role === 'SuperAdmin';
  },

  isSuperAdmin: () => {
    const { user } = get();
    if (!user) return false;
    return user.role === 'SuperAdmin';
  },
}));
