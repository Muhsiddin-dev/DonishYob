'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CalendarDaysIcon, TagIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { SmartBookSearch } from '@/components/books/SmartBookSearch';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useAudiences } from '@/hooks/useAudiences';
import { Book, BookFilters } from '@/types';
import { routes, config } from '@/config';
import { formatBytes } from '@/lib/utils';
import SwipperBookImg from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

export default function BooksPage() {
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    pageSize: 12,
  });

  const { data, isLoading } = useBooks(filters);
  const { data: categories } = useCategories();
  const { data: audiences } = useAudiences();

  const handleFiltersChange = useCallback((newFilters: BookFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = useCallback(() => {
    setFilters({ page: 1, pageSize: 12 });
  }, []);

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.audienceId ||
    filters.difficulty ||
    filters.language;

  const categoriesList = Array.isArray(categories) ? categories : [];
  const audiencesList = Array.isArray(audiences) ? audiences : [];

  const selectedCategoryName =
    filters.categoryId ? categoriesList.find((c) => c.id === filters.categoryId)?.name : undefined;
  const selectedAudienceName =
    filters.audienceId ? audiencesList.find((a) => a.id === filters.audienceId)?.name : undefined;

  const getCategoryLabel = (book: Book) => {
    const cat: any = (book as any).category;
    if (!cat) return undefined;
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object' && typeof cat.name === 'string') return cat.name;
    return undefined;
  };

  const getPageCount = (book: Book) => {
    const pc = (book as any).PageCount ?? (book as any).pageCount;
    return typeof pc === 'number' && !Number.isNaN(pc) ? pc : undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-gradient-to-br from-blue-900 via-primary-600 to-blue-300 dark:from-blue-950 dark:via-primary-900 dark:to-blue-800 text-white py-12 md:pt-28 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,black,transparent_68%)]" />

        <Container className="relative z-10">
          <div className="max-w-3xl animate-fade-in-up px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Каталог • Поиск • Фильтры
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Каталог
              <span className="bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                {' '}книг
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-white/75 max-w-2xl">
              Найдите нужную книгу среди тысяч научных материалов — по названию, автору, категории и жанру.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 backdrop-blur-md">
                Быстрый поиск
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 backdrop-blur-md">
                Умные фильтры
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 backdrop-blur-md">
                Рейтинг и скачивания
              </span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-6 sm:py-10 px-4 sm:px-6 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-12 right-0 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute top-28 left-0 h-44 w-44 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-500/10" />
        </div>

        <div className=" px-4 sm:px-6 pb-4">
          <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/75 dark:bg-gray-900/50 backdrop-blur-md shadow-sm">
            <div className="p-4 sm:p-5">
              <SmartBookSearch
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categories={categoriesList}
                audiences={audiencesList}
                totalResults={data?.totalItems}
                isLoading={isLoading}
              />

              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      Поиск: <span className="ml-1 font-semibold">{filters.search}</span>
                    </span>
                  )}
                  {selectedCategoryName && (
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      Категория: <span className="ml-1 font-semibold">{selectedCategoryName}</span>
                    </span>
                  )}
                  {selectedAudienceName && (
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      Жанр: <span className="ml-1 font-semibold">{selectedAudienceName}</span>
                    </span>
                  )}
                  {filters.difficulty && (
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      Сложность:{' '}
                      <span className="ml-1 font-semibold">{config.difficultyLabels[filters.difficulty]}</span>
                    </span>
                  )}
                  {filters.language && (
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      Язык: <span className="ml-1 font-semibold">{filters.language}</span>
                    </span>
                  )}

                  <button
                    onClick={clearFilters}
                    className="ml-auto text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Сбросить
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="mt-6 sm:mt-8 mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Результаты
            </h2>
            {typeof data?.totalItems === 'number' && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {data.totalItems} книг
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-2xl md:rounded-3xl mb-3 sm:mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-primary-600 dark:text-primary-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Книги не найдены
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              Попробуйте изменить параметры поиска
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm sm:text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {data?.items?.map((book, index) => {
                const bookGradients = [
                  'from-blue-500 via-primary-500 to-indigo-600',
                  'from-cyan-500 via-blue-500 to-primary-600',
                  'from-primary-500 via-indigo-500 to-blue-600',
                  'from-sky-500 via-primary-600 to-indigo-700',
                  'from-blue-600 via-primary-500 to-cyan-600',
                  'from-indigo-500 via-blue-500 to-primary-600'
                ];
                const bookGradient = bookGradients[index % bookGradients.length];
                const hasImages = book.images && book.images.length > 0;
                const categoryLabel = getCategoryLabel(book);
                const pageCount = getPageCount(book);
                const createdAt = book.createdAt ? new Date(book.createdAt) : null;
                const createdLabel =
                  createdAt && !Number.isNaN(createdAt.getTime())
                    ? createdAt.toLocaleDateString()
                    : undefined;

                return (
                  <Link key={book.id} href={routes.book(book.id)}>
                    <div
                      className="group cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="rounded-2xl md:rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl m-2 aspect-[3/4] bg-gray-100 dark:bg-gray-800">
                          <div className={`absolute inset-0 ${!hasImages ? `bg-gradient-to-br ${bookGradient}` : ''}`} />
                          {hasImages ? (
                            <div className="absolute inset-0">
                              <SwipperBookImg images={book.images} title={book.title} />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                              </div>
                              <p className="text-white/90 text-sm font-semibold text-center line-clamp-2 px-2">
                                {book.title}
                              </p>
                            </div>
                          )}

                          <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold shadow-sm backdrop-blur-md ${book.difficulty === 'Beginner'
                                ? 'bg-green-500/85 text-white'
                                : book.difficulty === 'Intermediate'
                                  ? 'bg-yellow-500/85 text-white'
                                  : 'bg-red-500/85 text-white'
                                }`}>
                                {config.difficultyLabels[book.difficulty]}
                              </span>
                              {categoryLabel && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/85 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 px-2.5 py-1 text-[10px] sm:text-xs font-semibold shadow-sm backdrop-blur-md border border-white/40 dark:border-gray-700/50">
                                  <TagIcon className="h-3.5 w-3.5" />
                                  {categoryLabel}
                                </span>
                              )}
                            </div>
                            {book.language && (
                              <span className="inline-flex items-center rounded-full bg-white/85 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 px-2.5 py-1 text-[10px] sm:text-xs font-semibold shadow-sm backdrop-blur-md border border-white/40 dark:border-gray-700/50">
                                {book.language}
                              </span>
                            )}
                          </div>

                          {/* <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="w-full rounded-xl bg-white/90 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 text-center text-xs sm:text-sm font-semibold py-2 shadow-lg backdrop-blur-md">
                                Открыть
                              </div>
                            </div>
                          </div> */}
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-4 pt-1">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {book.author}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1.5">
                              <DocumentTextIcon className="w-4 h-4" />
                              {formatBytes(book.fileSize)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                              {book.downloadCount}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              {typeof pageCount === 'number' && (
                                <span className="inline-flex items-center gap-1.5">
                                  <DocumentTextIcon className="w-4 h-4" />
                                  {pageCount} стр.
                                </span>
                              )}
                              {createdLabel && (
                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDaysIcon className="w-4 h-4" />
                                  {createdLabel}
                                </span>
                              )}
                            </div>

                            <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-200">
                              <StarIcon className="h-4 w-4 text-yellow-500" />
                              {Number(book.rating ?? 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-10 sm:mt-12 animate-fade-in-up animation-delay-400">
                <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/40 backdrop-blur-md shadow-sm py-4">
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}