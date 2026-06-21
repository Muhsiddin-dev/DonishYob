import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://donishyob.com';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  let bookRoutes: any[] = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let books: any[] = [];
    if (data?.data?.items && Array.isArray(data.data.items)) {
      books = data.data.items;
    } else if (data?.items && Array.isArray(data.items)) {
      books = data.items;
    } else if (Array.isArray(data)) {
      books = data;
    }

    bookRoutes = books.map((book: any) => ({
      url: `${baseUrl}/books/${book.id}`,
      lastModified: new Date(book.updatedAt || book.createdAt),
      priority: 0.6,
    }));
  } catch (error) {
    console.warn('Failed to fetch books for sitemap:', error);
    // Return static routes only if API is unavailable
  }


  return [...staticRoutes, ...bookRoutes];
}