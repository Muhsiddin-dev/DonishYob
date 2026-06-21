import { config } from '@/config';
import { User } from '@/types';

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.accessTokenKey);
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(config.accessTokenKey, token);
  },

  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.accessTokenKey);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.refreshTokenKey);
  },

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(config.refreshTokenKey, token);
  },

  removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.refreshTokenKey);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(config.userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(config.userKey, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.userKey);
  },

  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token; 
  },
};
