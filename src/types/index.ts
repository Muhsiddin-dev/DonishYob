// User types
export type UserRole = 'User' | 'Admin' | 'SuperAdmin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserInterestsRequest {
  audienceIds: string[];
  categoryIds: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Book types
export type BookDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface BookImage {
  id: string;
  bookId: string;
  imageUrl: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: BookDifficulty;
  language: string;
  categoryId: string;
  category?: Category;
  audienceId: string;
  audience?: Audience;
  pdfFileName: string;
  pdfUrl: string;
  fileSize: number;
  PageCount?: number;
  downloadCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  images: BookImage[];
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  difficulty: BookDifficulty;
  language: string;
  categoryId: string;
  audienceId: string;
  pdfFile: File;
  coverImages?: File[];
  PageCount?: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  description?: string;
  difficulty?: BookDifficulty;
  language?: string;
  categoryId?: string;
  audienceId?: string;
  pdfFile?: File;
  coverImages?: File[];
  PageCount?: number;
}

export interface BookFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  audienceId?: string;
  difficulty?: BookDifficulty;
  language?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AudioBook {
  id: string;
  title: string;
  author: string;
  description?: string;
  categoryId?: string;
  category?: Category;
  durationSeconds?: number;
  audioUrl?: string;
  coverImageUrl?: string;
  createdAt?: string;
}

export interface CreateAudioBookRequest {
  title: string;
  author: string;
  description?: string;
  categoryId: string;
  durationSeconds?: number;
  audio: File;
  coverImage?: File;
}

// Category types
export interface Category {
  id: string;
  imageUrl: string;
  name: string;
  description?: string;
  books?: Book[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

// Audience types
export interface Audience {
  id: string;
  name: string;
  books?: Book[];
}

export interface CreateAudienceRequest {
  name: string;
}

export interface UpdateAudienceRequest {
  name?: string;
}

// About Us types
export interface AboutUs {
  id: string;
  title: string;
  content: string;
  mission: string;
  vision: string;
  contactEmail: string;
  updatedAt: string;
  updatedById?: string;
}

export interface UpdateAboutUsRequest {
  title?: string;
  content?: string;
  mission?: string;
  vision?: string;
  contactEmail?: string;
}

// Statistics types
export interface Statistics {
  totalBooks: number;
  totalUsers: number;
  totalDownloads: number;
  activeUsers: number;
  topBooks?: TopBook[];
  categoryStats?: CategoryStat[];
}

export interface TopBook {
  id: string;
  title: string;
  author: string;
  downloadCount: number;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  bookCount: number;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}


export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  language: string;
  category: string;
  previewImage: string | null;
  downloadCount: number;
  pageCount: number;
  createdAt: string;
  rating: number;
}

export interface RecommendedApiResponse {
  items: RecommendedBook[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface RecommendedFilters {
  page?: number;
  pageSize?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image?: any; 
}