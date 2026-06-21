import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/lib/auth/tokens';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: 'https://api.donishyob.com',
});

function normalizeAuthResponse(data: any): { accessToken: string; refreshToken: string } {
  // Handle nested wrappers like { data: { ... } }
  const d = data?.data && typeof data.data === 'object' ? data.data : data;
  const accessToken = d?.accessToken || d?.access_token || d?.token || '';
  const refreshToken = d?.refreshToken || d?.refresh_token || '';
  return { accessToken, refreshToken };
}

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    // If sending multipart/form-data, let the browser set the correct boundary.
    // Otherwise axios default headers (like application/json) can break model binding on the backend.
    if (typeof FormData !== 'undefined' && requestConfig.data instanceof FormData) {
      if (requestConfig.headers) {
        delete (requestConfig.headers as any)['Content-Type'];
        delete (requestConfig.headers as any)['content-type'];
      }
    } else {
      // Ensure JSON content-type for non-FormData requests unless already set.
      if (requestConfig.headers && !(requestConfig.headers as any)['Content-Type'] && !(requestConfig.headers as any)['content-type']) {
        (requestConfig.headers as any)['Content-Type'] = 'application/json';
      }
    }

    // Only add token on client side and if config exists
    if (typeof window !== 'undefined' && requestConfig && requestConfig.headers) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Check if error.config exists
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if originalRequest exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRequest =
      originalRequest.url?.includes('/api/auth/login') ||
      originalRequest.url?.includes('/api/auth/refresh') ||
      originalRequest.url?.includes('/api/auth/register') ||
      originalRequest.url?.includes('/api/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined' && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // Check if this is a recommended books request on the recommended page
        const isRecommendedRequest = originalRequest.url?.includes('/api/books/recommended');
        const isOnRecommendedPage = typeof window !== 'undefined' && window.location.pathname === '/recommended';

        if (!(isRecommendedRequest && isOnRecommendedPage)) {
          tokenStorage.clearAll();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          'https://api.donishyob.com/api/auth/refresh',
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = normalizeAuthResponse(response.data);
        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh response');
        }

        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        // Check if this is a recommended books request on the recommended page
        const isRecommendedRequest = originalRequest.url?.includes('/api/books/recommended');
        const isOnRecommendedPage = typeof window !== 'undefined' && window.location.pathname === '/recommended';

        const status = (refreshError as any)?.response?.status;
        const shouldLogout = status === 400 || status === 401 || status === 403;

        // Only force logout on definite auth failure; don't kick user on transient network/5xx.
        if (shouldLogout && !(isRecommendedRequest && isOnRecommendedPage)) {
          tokenStorage.clearAll();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
