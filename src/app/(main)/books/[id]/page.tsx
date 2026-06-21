import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { booksApi } from '@/lib/api/books';
import { routes, config } from '@/config';
import BookDetailsClient from './BookDetailsClient';
import { BookOpenIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BookPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    const book = await booksApi.getBook(params.id);
    
    const title = `${book.title} - ${book.author} | ${config.siteName}`;
    const description = book.description 
      ? book.description.substring(0, 160) + (book.description.length > 160 ? '...' : '')
      : `Книга "${book.title}" автора ${book.author}. ${config.siteName}`;
    
    const imageUrl = book.images?.[0]?.imageUrl || '/default-book-cover.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${config.siteUrl}${routes.book(params.id)}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${book.title} - ${book.author}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      keywords: [
        book.title,
        book.author,
        book.category?.name,
        book.audience?.name,
        'книга',
        'скачать pdf',
        'электронная книга',
      ].filter(Boolean) as string[],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Книга не найдена',
      description: 'Запрошенная книга не найдена в нашей библиотеке',
    };
  }
}

// Fetch book data
async function getBook(id: string) {
  try {
    return await booksApi.getBook(id);
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}


export default async function BookPage({ params }: BookPageProps) {
  const book = await getBook(params.id);

  // Always render the client component, even if book is null
  // The client component will handle the "not found" state
  return <BookDetailsClient book={book} />;
}
