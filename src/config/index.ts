export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.donishyob.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'DonishYob ',

  // Token settings
  accessTokenKey: 'sciencehub_access_token',
  refreshTokenKey: 'sciencehub_refresh_token',
  userKey: 'sciencehub_user',

  // Pagination defaults
  defaultPageSize: 12,

  // Difficulty labels
  difficultyLabels: {
    Beginner: 'Начинающий',
    Intermediate: 'Средний',
    Advanced: 'Продвинутый',
  } as const,

  // Role labels
  roleLabels: {
    User: 'Пользователь',
    Admin: 'Администратор',
    // SuperAdmin: 'Супер-админ',
  } as const,
} as const;

export const routes = {
  // Public routes
  home: '/',
  books: '/books',
  recommended: '/recommended',
  book: (id: string) => `/books/${id}`,
  categories: '/categories',
  categoriById: (id: string) =>  `/categories/${id}`,
  category: (id: string) => `/books`,
  about: '/about',
  FigmaMainPage: '/FigmaMainPage',

  // Auth routes
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Protected routes
  profile: '/profile',
  profileSettings: '/profile/settings',
  changePassword: '/change-password',
  interests: '/interests',

  // Admin routes
  admin: '/admin',
  adminBooks: '/admin/books',
  adminNewBook: '/admin/books/new',
  adminEditBook: (id: string) => `/admin/books/${id}/edit`,
  adminAvtor: '/admin/avtor',
  adminCategories: '/admin/categories',
  adminAudiobooks: '/admin/audiobooks',
  adminAudiences: '/admin/audiences',
  adminUsers: '/admin/users',
  adminAbout: '/admin/about',
} as const;
