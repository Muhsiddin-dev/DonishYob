'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpenIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/hooks/useCategories';
import { useBooksByCategory } from '@/hooks/useBooks';
import { routes, config } from '@/config';
import { formatBytes } from '@/lib/utils';

export default function CategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: category, isLoading: categoryLoading } = useCategory(id);
  const { data: books, isLoading: booksLoading } = useBooksByCategory(id);

  const breadcrumbs = [
    { label: 'Категории', href: routes.categories },
    { label: category?.name || 'Загрузка...' },
  ];

  if (categoryLoading) {
    return (
      <div className="py-8">
        <Container>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </Container>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center py-16">
            <BookOpenIcon className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Категория не найдена
            </h3>
            <Link href={routes.categories}>
              <Button variant="outline" className="mt-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Вернуться к категориям
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
        </div>

        {booksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-3xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : books?.length === 0 ? (
          <div className="text-center py-16">
            <BookOpenIcon className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              В этой категории пока нет книг
            </h3>
            <Link href={routes.books}>
              <Button variant="outline" className="mt-4">
                Просмотреть все книги
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-500">
              Найдено <span className="font-semibold text-gray-900">{books?.length}</span> книг
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books?.map((book, index) => (
                <Link key={book.id} href={routes.book(book.id)}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                      {/* Background */}
                      <div className={`absolute inset-0 ${
                        !book.images?.[0]
                          ? `bg-gradient-to-br ${
                              ['from-purple-500 via-pink-500 to-rose-500',
                               'from-cyan-500 via-blue-500 to-indigo-500',
                               'from-emerald-500 via-teal-500 to-cyan-500',
                               'from-orange-500 via-red-500 to-pink-500',
                               'from-violet-500 via-purple-500 to-fuchsia-500',
                               'from-blue-500 via-indigo-500 to-violet-500'][index % 6]
                            }`
                          : ''
                      }`}>
                        {book.images?.[0] ? (
                          <img
                            src={book.images[0].imageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <BookOpenIcon className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-white/80 text-sm font-medium text-center line-clamp-2">{book.title}</p>
                          </div>
                        )}
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {/* Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          book.difficulty === 'Beginner'
                            ? 'bg-green-500/80 text-white'
                            : book.difficulty === 'Intermediate'
                            ? 'bg-yellow-500/80 text-white'
                            : 'bg-red-500/80 text-white'
                        }`}>
                          {config.difficultyLabels[book.difficulty]}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-3">{book.author}</p>
                        <div className="flex items-center justify-between text-white/60 text-sm">
                          <span>{formatBytes(book.fileSize)}</span>
                          <span>{book.downloadCount} скач.</span>
                        </div>
                      </div>

                      {/* Hover Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                          Подробнее
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
