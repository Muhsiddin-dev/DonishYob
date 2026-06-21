'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { useBooksByCategory } from '@/hooks/useBooks';
import { booksApi } from '@/lib/api/books';
import { routes, config } from '@/config';
import { formatBytes, formatDate } from '@/lib/utils';
import { Book } from '@/types';
import SwipperBookImg from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';

interface BookDetailsClientProps {
  book: Book | null;
}

export default function BookDetailsClient({ book }: BookDetailsClientProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getCategoryForApi = () => {
    if (!book) return '';
    if (book.categoryId) return book.categoryId;
    if (book.category?.id) return book.category.id;
    if (book.category?.name) return encodeURIComponent(book.category.name);
    if (typeof book.category === 'string') return encodeURIComponent(book.category);
    return '';
  };
  const { data: relatedBooks, isLoading: relatedLoading } = useBooksByCategory(
    getCategoryForApi()
  );

  if (!book) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center py-16">
            <BookOpenIcon className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Книга не найдена</h3>
            <p className="mt-2 text-gray-600">Запрошенная книга не найдена в нашей библиотеке</p>
            <Link href={routes.books}>
              <Button variant="outline" className="mt-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" /> Вернуться к каталогу
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleDownload = async () => {
    const bookId = book.id;
    setIsDownloading(true);
    try {
      const blob = await booksApi.downloadBook(bookId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = book.pdfFileName || `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(booksApi.getDownloadUrl(bookId), '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Книги', href: routes.books },
    { label: book.title },
  ];

  const filteredRelatedBooks = relatedBooks
    ?.filter((b) => b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="py-8 md:pt-28 dark:bg-gray-900">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover - Муқоваи китоб */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-primary-100 rounded-xl overflow-hidden sticky top-24 shadow-lg">
              {book.images?.[0] ? (
                <SwipperBookImg images={book?.images} title={book?.title} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-white/90 text-sm font-medium text-center line-clamp-2">{book.title}</p>
                </div>
              )}
            </div>
          </div>

          {/* Book Details - Маълумоти китоб */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-primary-600 mb-4">{book.author}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.difficulty === 'Beginner'
                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                : book.difficulty === 'Intermediate'
                  ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                }`}>
                {config.difficultyLabels[book.difficulty]}
              </span>
              {book.category && (
                <span className="px-3 py-1 dark:bg-primary-950 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                  {book.category.name}
                </span>
              )}
              {book.audience && (
                <span className="px-3 py-1 dark:bg-blue-950 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {book.audience.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </span>
                <span className='dark:text-white text-black'>{book.PageCount || '—'} стр.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64" />
                  </svg>
                </span>
                <span className='dark:text-white text-black'>{book.language}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-600 font-semibold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </span>
                <span className='dark:text-white text-black'>{book.downloadCount} скач.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </span>
                <span className='dark:text-white text-black'>{formatBytes(book.fileSize)}</span>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`mb-8 px-8 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-semibold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </span>
              {isDownloading ? 'Скачивание...' : 'Скачать PDF'}
            </Button>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 border-l-4 border-primary-600 pl-3">
                Описание
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 ">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-200">Добавлено:</span>
                  <span className="ml-2 text-gray-900 font-medium dark:text-gray-300">
                    {formatDate(book.createdAt)}
                  </span>
                </div>
                <div className="bg-gray-50  dark:bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500  dark:text-gray-200">Обновлено:</span>
                  <span className="ml-2 text-gray-900 font-medium  dark:text-gray-300">
                    {formatDate(book.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books - Китобҳои монанд */}
        {filteredRelatedBooks && filteredRelatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 inline-block border-b-4 border-primary-600 pb-2">
              Похожие книги
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))
                : filteredRelatedBooks.map((relatedBook) => {
                  const relatedGradients = [
                    'from-blue-100 to-primary-100',
                    'from-cyan-100 to-blue-100',
                    'from-primary-100 to-indigo-100',
                    'from-sky-100 to-primary-100'
                  ];
                  const gradient = relatedGradients[Math.floor(Math.random() * relatedGradients.length)];

                  return (
                    <Link key={relatedBook.id} href={routes.book(relatedBook.id)}>
                      <div className="group cursor-pointer">
                        <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1`}>
                          {relatedBook.images?.[0] ? (
                            <img
                              src={relatedBook.images[0].imageUrl}
                              alt={relatedBook.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <span className="text-4xl mb-2">📖</span>
                              <p className="text-primary-600 text-sm font-medium text-center px-2">
                                {relatedBook.title}
                              </p>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                          {relatedBook.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {relatedBook.author}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
