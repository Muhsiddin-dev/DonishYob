import apiClient from './client';
import { Book, BookFilters, PaginatedResponse, CreateBookRequest, UpdateBookRequest } from '@/types';
import { config } from '@/config';

// Helper function to get full image URL
function getFullImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Add base URL for relative paths
  const baseUrl = config.apiUrl.replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
}

// Helper function to normalize book images
function normalizeImages(images: unknown): Book['images'] {
  if (!images) return [];

  // Some .NET backends serialize collections as { $values: [...] }
  const maybeValues = (images as any)?.$values;
  const list: unknown[] = Array.isArray(images)
    ? images
    : Array.isArray(maybeValues)
      ? maybeValues
      : [];

  if (list.length === 0) return [];

  return list
    .map((img) => {
      // Support array of urls: ["https://.../a.jpg", ...]
      if (typeof img === 'string') {
        const url = img;
        return {
          id: '',
          bookId: '',
          imageUrl: getFullImageUrl(url),
          createdAt: '',
        };
      }

      if (!img || typeof img !== 'object') return null;
      const obj = img as Record<string, unknown>;

      return {
        id: (obj.id || obj._id || obj.Id || '') as string,
        bookId: (obj.bookId || obj.BookId || obj.book_id || '') as string,
        imageUrl: getFullImageUrl(
          (obj.imageUrl ||
            obj.ImageUrl ||
            obj.image_url ||
            obj.url ||
            obj.Url ||
            obj.src ||
            obj.Src ||
            '') as string
        ),
        createdAt: (obj.createdAt || obj.CreatedAt || obj.created_at || '') as string,
      };
    })
    .filter((x): x is Book['images'][number] => !!x && !!x.imageUrl);
}

// Helper function to normalize book data from various API response formats
function normalizeBook(data: Record<string, unknown>): Book {
  if (!data) {
    console.error('normalizeBook received null/undefined data');
    return {} as Book;
  }

  // Handle ID field variations
  const id = (data.id || data._id || data.Id || data.bookId || data.BookId || data.uuid || '') as string;

  // Handle category object or just ID
  const categoryId = (data.categoryId || data.CategoryId || data.category_id ||
    (typeof data.category === 'object' && data.category ? (data.category as Record<string, unknown>).id : data.category) || '') as string;

  // Handle audience object or just ID
  const audienceId = (data.audienceId || data.AudienceId || data.audience_id ||
    (typeof data.audience === 'object' && data.audience ? (data.audience as Record<string, unknown>).id : data.audience) || '') as string;

  // Get raw images array - check ALL possible field names
  const rawImages = data.images || data.Images || data.bookImages || data.BookImages ||
    data.coverImages || data.CoverImages || data.cover_images || [];

  console.log('=== IMAGE DEBUG for book:', data.title || data.Title, '===');
  console.log('All data keys:', Object.keys(data));
  console.log('Raw images value:', rawImages);
  console.log('Type of rawImages:', typeof rawImages);

  // Normalize images array
  let images = normalizeImages(rawImages);

  // If no images array but has coverImage or coverUrl, create an image entry
  if (images.length === 0) {
    const coverUrl = (
      data.previewImage ||
      data.coverImage || data.CoverImage || data.cover_image ||
      data.coverUrl || data.CoverUrl || data.cover_url ||
      data.imageUrl || data.ImageUrl || data.image_url ||
      data.thumbnailUrl || data.ThumbnailUrl || data.thumbnail_url ||
      data.thumbnail || data.Thumbnail ||
      data.image || data.Image ||
      data.cover || data.Cover
    ) as string | undefined;

    if (coverUrl) {
      console.log('Found single cover image:', coverUrl);
      images = [{
        id: '',
        bookId: id,
        imageUrl: getFullImageUrl(coverUrl),
        createdAt: '',
      }];
    }
  }

  // Check if rawImages is actually a string (single URL) instead of array
  if (images.length === 0 && typeof rawImages === 'string' && rawImages) {
    console.log('Images field is a string:', rawImages);
    images = [{
      id: '',
      bookId: id,
      imageUrl: getFullImageUrl(rawImages),
      createdAt: '',
    }];
  }

  console.log('Final images for', data.title || data.Title, ':', images.length > 0 ? images[0]?.imageUrl : 'NO IMAGES');

  return {
    id,
    title: (data.title || data.Title || '') as string,
    author: (data.author || data.Author || '') as string,
    description: (data.description || data.Description || '') as string,
    difficulty: (data.difficulty || data.Difficulty || 'Beginner') as Book['difficulty'],
    language: (data.language || data.Language || '') as string,
    categoryId,
    category: data.category as Book['category'],
    audienceId,
    audience: data.audience as Book['audience'],
    pdfFileName: (data.pdfFileName || data.PdfFileName || data.pdf_file_name || data.fileName || '') as string,
    pdfUrl: (data.pdfUrl || data.PdfUrl || data.pdf_url || '') as string,
    fileSize: (data.fileSize || data.FileSize || data.file_size || 0) as number,
    PageCount: (data.pageCount || data.PageCount || data.page_count) as number | undefined,
    downloadCount: (data.downloadCount || data.DownloadCount || data.download_count || 0) as number,
    rating: (data.rating || data.Rating || 0) as number,
    createdAt: (data.createdAt || data.CreatedAt || data.created_at || '') as string,
    updatedAt: (data.updatedAt || data.UpdatedAt || data.updated_at || '') as string,
    createdById: (data.createdById || data.CreatedById || data.created_by_id || '') as string,
    images,
  };
}

export const booksApi = {
  getBooks: async (filters?: BookFilters): Promise<PaginatedResponse<Book>> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.audienceId) params.append('audienceId', filters.audienceId);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.language) params.append('language', filters.language);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get(`/api/books?${params}`);
    let data = response.data;

    console.log('=== RAW BOOKS API RESPONSE ===');
    console.log('Full response:', JSON.stringify(data, null, 2).substring(0, 2000));
    console.log('Response type:', typeof data);
    console.log('Is array:', Array.isArray(data));

    // Handle nested data object (e.g., { data: [...] } or { data: { items: [...] } })
    if (data?.data) {
      data = data.data;
      console.log('Unwrapped data:', data);
    }

    // Normalize response to PaginatedResponse structure
    if (data?.items && Array.isArray(data.items)) {
      console.log('Found items array:', data.items.length, 'books');
      console.log('First book raw data:', data.items[0]);
      console.log('First book images field:', data.items[0]?.images || data.items[0]?.Images || data.items[0]?.bookImages);
      const normalizedItems = data.items.map((item: Record<string, unknown>) => normalizeBook(item));
      console.log('First normalized book:', normalizedItems[0]);
      console.log('First normalized book images:', normalizedItems[0]?.images);
      return {
        ...data,
        items: normalizedItems,
      } as PaginatedResponse<Book>;
    }
    if (Array.isArray(data)) {
      console.log('Data is array:', data.length, 'books');
      console.log('First book raw data:', data[0]);
      console.log('First book images field:', data[0]?.images || data[0]?.Images || data[0]?.bookImages);
      const normalizedItems = data.map((item: Record<string, unknown>) => normalizeBook(item));
      console.log('First normalized book:', normalizedItems[0]);
      console.log('First normalized book images:', normalizedItems[0]?.images);
      return {
        items: normalizedItems,
        page: 1,
        pageSize: data.length,
        totalItems: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    console.log('No valid data structure found, returning empty');
    // Return empty response
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

  getBook: async (id: string): Promise<Book> => {
    const response = await apiClient.get(`/api/books/${id}`);
    let data = response.data;

    console.log('Raw single book API response:', data);
    console.log('Response data type:', typeof data);
    console.log('Response data keys:', data ? Object.keys(data) : 'null');

    // Handle nested data structures
    if (data?.data) {
      data = data.data;
      console.log('Unwrapped from data.data:', data);
    }

    // Handle if book is wrapped in another object
    if (data?.book) {
      data = data.book;
      console.log('Unwrapped from data.book:', data);
    }

    // Normalize the book data
    const normalizedBook = normalizeBook(data);
    console.log('Normalized book:', normalizedBook);
    console.log('Normalized book ID:', normalizedBook.id);

    return normalizedBook;
  },

  getBookRecommended: async (): Promise<Book[]> => {
    const response = await apiClient.get(`/api/books/recommended`);
    let data = response.data;


    // Handle nested data structures
    if (data?.data) {
      data = data.data;
      console.log('Unwrapped from data.data:', data);
    }

    // Handle if books are wrapped in items
    if (data?.items) {
      data = data.items;
      console.log('Unwrapped from data.items:', data);
    }

    let books: Record<string, unknown>[] = [];
    if (Array.isArray(data)) {
      books = data;
      console.log('Books array found:', books);
    } else if (data && typeof data === 'object') {
      books = [data];
      console.log('Single book wrapped in object:', books);
    }

    // Normalize all books
    const normalizedBooks = books.map(book => normalizeBook(book));
    console.log('Normalized recommended books:', normalizedBooks);

    return normalizedBooks;
  },

  getBooksByCategory: async (categoryId: string): Promise<Book[]> => {
    try {
      const response = await apiClient.get(`/api/books/category/${categoryId}`);
      let data = response.data;

      console.log('Raw books by category API response:', data);
      console.log('Category ID:', categoryId);
      console.log('Response status:', response.status);

      if (data?.data) {
        data = data.data;
      }

      let books: Record<string, unknown>[] = [];
      if (Array.isArray(data)) {
        books = data;
      } else if (data?.items && Array.isArray(data.items)) {
        books = data.items;
      }

      console.log('Books by category - first book raw:', books[0]);
      console.log('Books by category - first book images:', books[0]?.images || books[0]?.Images);

      // Normalize each book
      const normalized = books.map((item) => normalizeBook(item));
      console.log('Books by category - first normalized:', normalized[0]);
      console.log('Books by category - first normalized images:', normalized[0]?.images);

      return normalized;
    } catch (error) {
      console.error('Books by category API error:', error);
      return [];
    }
  },

  downloadBook: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/books/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getDownloadUrl: (id: string): string => {
    const baseUrl = config.apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
    return `${baseUrl}/api/books/${id}/download`;
  },

  createBook: async (data: CreateBookRequest): Promise<Book> => {
    const formData = new FormData();

    formData.append('Title', data.title);
    formData.append('Author', data.author);
    formData.append('Description', data.description ?? '');
    formData.append('Difficulty', data.difficulty);
    formData.append('Language', data.language);
    formData.append('CategoryId', data.categoryId);
    formData.append('AudienceId', data.audienceId);

    if (data.PageCount !== undefined && data.PageCount !== null) {
      formData.append('PageCount', data.PageCount.toString());
    }

    if (data.pdfFile) {
      formData.append('PdfFile', data.pdfFile);
    }

    if (data.coverImages?.length) {
      data.coverImages.forEach((image) => {
        formData.append('CoverImages', image);
      });
    }

    const response = await apiClient.post<Book>('/api/books', formData);
    return response.data;
  },

  updateBook: async (id: string, data: UpdateBookRequest): Promise<Book> => {
    const formData = new FormData();

    if (data.title) formData.append('Title', data.title);
    if (data.author) formData.append('Author', data.author);
    if (data.description !== undefined) formData.append('Description', data.description ?? '');
    if (data.difficulty) formData.append('Difficulty', data.difficulty);
    if (data.language) formData.append('Language', data.language);
    if (data.categoryId) formData.append('CategoryId', data.categoryId);
    if (data.audienceId) formData.append('AudienceId', data.audienceId);
    if (data.PageCount !== undefined && data.PageCount !== null) formData.append('PageCount', data.PageCount.toString());
    if (data.pdfFile) formData.append('PdfFile', data.pdfFile);

    if (data.coverImages?.length) {
      data.coverImages.forEach((image) => {
        formData.append('CoverImages', image);
      });
    }

    // Let Axios set multipart boundary automatically.
    const response = await apiClient.put<Book>(`/api/books/${id}`, formData);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/books/${id}`);
  },
};
