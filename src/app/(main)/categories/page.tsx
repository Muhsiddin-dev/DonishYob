'use client';

import Link from 'next/link';
import {
  BookOpenIcon,
  FolderIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { useCategories } from '@/hooks/useCategories';
import { routes } from '@/config';
import { Button, SearchInput } from '@/components/ui';
import { useState } from 'react';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen  bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 via-primary-600 to-blue-300 dark:from-blue-950 dark:via-primary-900 dark:to-blue-800 text-white py-12 pt-24 md:pt-28 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,black,transparent_68%)]" />

        <Container className="relative z-10">
          <div className="max-w-3xl animate-fade-in-up px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Поиск
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Категории
              <span className="bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                {' '}книг
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-white/75 max-w-2xl">
              Находите книги по интересующим вас научным темам
            </p>

            <div className='flex items-center w-full md:w-[90%] lg:w-[80%] justify-between bg-white dark:bg-gray-800  p-1.5 md:my-10 my-5 sm:my-8  rounded-xl sm:rounded-2xl border-2 border-transparent transition-all duration-200 focus-within:border-primary-500 shadow-md hover:shadow-lg'>
              <div className="flex-1 flex items-center px-2 sm:px-3">
                <SearchInput
                  type="search"
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  placeholder="Ҷустуҷӯи ..."
                  className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-sm sm:text-base outline-none bg-transparent dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
                />
              </div>
              <Button className="rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 h-10 sm:h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Поиск
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div className='dark:bg-gray-900 flex flex-col w-full gap-6'>
        <div className='py-8 sm:py-12 md:py-16 lg:py-20 max-w-[95%]  lg:max-w-7xl mx-auto'>

          <div className='flex flex-col gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16'>
            <div className='flex flex-col justify-center '>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Популярные категории
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Выберите интересующую область
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative h-24 sm:h-28   bg-gray-200 dark:bg-gray-800 md:h-36 rounded-xl md:rounded-2xl overflow-hidden animate-pulse shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  />
                ))
              ) : (Array.isArray(categories) ? categories : []).length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <BookOpenIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Категории не найдены
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Скоро появятся новые категории
                  </p>
                </div>
              ) : (
                (Array.isArray(categories) ? categories : []).map((category, index) => {
                  const gradients = [
                    'from-blue-500 to-primary-600',
                    'from-cyan-500 to-blue-600',
                    'from-primary-500 to-indigo-600',
                    'from-sky-500 to-blue-700',
                  ];
                  const gradient = gradients[index % gradients.length];
                  const hasImage = !!category?.imageUrl;

                  return (
                    <Link key={category.id} href={routes.categoriById(category.id)}>
                      <div className="group relative h-24 sm:h-28 md:h-36 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-300 group-hover:opacity-100`} />

                        {hasImage && (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-300 group-hover:opacity-70 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="relative h-full w-full p-3 sm:p-4 flex items-start">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                              {hasImage ? (
                                <img
                                  src={category.imageUrl}
                                  alt=""
                                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
                              )}
                            </div>
                            <div className='flex flex-col  items-start gap-1'>
                              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-2 drop-shadow-sm">
                                {category.name}
                              </h3>
                              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-200 line-clamp-2 drop-shadow-sm">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

            <div className='flex flex-col justify-center gap-4 sm:gap-6 md:gap-8'>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Все категории
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Полный список всех доступных категорий
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 sm:h-28 md:h-32 bg-gray-200 dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl animate-pulse"
                    />
                  ))
                ) : (Array.isArray(categories) ? categories : []).length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <BookOpenIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Категории не найдены
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Скоро появятся новые категории
                    </p>
                  </div>
                ) : (
                  (Array.isArray(categories) ? categories : []).map((category, index) => {
                    const gradients = [
                      'from-blue-500 to-primary-600',
                      'from-cyan-500 to-blue-600',
                      'from-primary-500 to-indigo-600',
                      'from-sky-500 to-blue-700',
                    ];
                    const gradient = gradients[index % gradients.length];
                    const hasImage = !!category?.imageUrl;

                    return (
                      <Link key={category.id} href={routes.category(category.id)}>
                        <div className="group relative h-24 sm:h-28 md:h-36 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-300 group-hover:opacity-100`} />

                          {hasImage && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-300 group-hover:opacity-70 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                          <div className="relative h-full w-full p-3 sm:p-4 flex items-start">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                                {hasImage ? (
                                  <img
                                    src={category.imageUrl}
                                    alt=""
                                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
                                )}
                              </div>
                              <div className='flex flex-col  items-start gap-1'>
                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-2 drop-shadow-sm">
                                  {category.name}
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base font-medium text-gray-200 line-clamp-2 drop-shadow-sm">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
      );
}
