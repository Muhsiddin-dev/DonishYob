'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { routes, config } from '@/config';
import { formatBytes } from '@/lib/utils';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Button, Input } from '@/components/ui'
import Image from 'next/image'
import { SearchInput } from '@/components/ui/SearchInput';
import img from '@img/image.png'
import FigmaSellComp from '@/components/layout/FigmaSellComp';
import SwiperSlideComponent from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';
import SwipperBookImg from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';
import { useAuthStore } from '@/store/authStore';
import SwipperBookCards from '@/components/SwiperSlideComponent/SwipperBook/SwipperBookCards';

const features = [
  {
    icon: BookOpenIcon,
    title: 'Широкий выбор',
    description: 'Тысячи научных книг по различным направлениям',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: AcademicCapIcon,
    title: 'Для всех уровней',
    description: 'Материалы от начинающих до продвинутых',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: ArrowDownTrayIcon,
    title: 'Бесплатное скачивание',
    description: 'Скачивайте книги в формате PDF бесплатно',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Умный поиск',
    description: 'Находите нужные материалы за секунды',
    color: 'from-orange-500 to-red-500',
  },
];



export default function HomePage() {
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: booksData, isLoading: booksLoading } = useBooks({ pageSize: 8 });
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')


  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <section className='md:min-h-screen  bg-gradient-to-br from-blue-900 via-primary-600 to-blue-300 dark:from-blue-950 dark:via-primary-900 dark:to-blue-800 w-full flex flex-col justify-center pt-14 md:pt-0'>
          <div className='flex max-w-[95%] lg:max-w-7xl m-auto flex-col-reverse sm:flex-col-reverse md:flex-row items-center gap-6 md:gap-8 lg:gap-12 justify-between w-full md:h-[80vh] py-8 md:py-0 px-4 sm:px-6 md:px-0'>

            <aside className='flex flex-col md:items-start items-center gap-4 sm:gap-5 max-w-3xl m-auto w-full text-center md:text-left'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white dark:text-white'>
                Открывайте мир знаний
              </h1>

              <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-blue-100 dark:text-blue-200'>
                Ищите научные книги, статьи и учебные материалы в нашей цифровой библиотеке.
              </h3>

              <div className='flex items-center w-full md:w-[90%] lg:w-[80%] justify-between bg-white dark:bg-gray-800  p-1.5 rounded-xl sm:rounded-2xl border-2 border-transparent transition-all duration-200 focus-within:border-primary-500 shadow-md hover:shadow-lg'>
                <div className="flex-1 flex items-center px-2 sm:px-3">
                  <SearchInput
                    type="search"
                    value={searchQuery}
                    onChange={(val) => setSearchQuery(val)}
                    placeholder="Ҷустуҷӯи китобҳо ..."
                    className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-sm sm:text-base outline-none bg-transparent dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
                  />
                </div>
                <Button className="rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 h-10 sm:h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Поиск
                </Button>
              </div>

              <h1 className='text-sm sm:text-base text-blue-100 dark:text-blue-300 font-medium md:ml-2'>
                Browse <span className='font-black text-white dark:text-white'>10,000+</span> научных книг
              </h1>
            </aside>

            <aside className='flex flex-col gap-6 max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl w-full'>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                <Image
                  className='w-full h-full object-cover rounded-xl sm:rounded-2xl md:rounded-3xl hover:scale-105 transition-transform duration-500'
                  src={img}
                  alt="Library illustration"
                  priority
                />
              </div>
            </aside>
          </div>
        </section>

        <section className='dark:bg-gray-800 w-full py-8 sm:py-10 md:py-14'>
          <div className='max-w-[95%] lg:max-w-7xl m-auto flex flex-col justify-center gap-6 sm:gap-8 md:gap-10 '>
            <div className='flex flex-col  sm:flex-row justify-between items-center gap-3 sm:gap-0 w-full'>
              <div className='text-center sm:text-left'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                  Популярные категории
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Выберите интересующую область
                </p>
              </div>
              <Link href={routes.categories}>
                <Button className='group bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-5 md:px-6 h-9 sm:h-10 md:h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'>
                  Все категории
                  <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {categoriesLoading ? (
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
                  <h3 className="text-lg font-semibold  dark:text-white mb-1">
                    Категории не найдены
                  </h3>
                  <p className="text-sm text-gray-400">
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
                      <div className="group relative h-28 sm:h-28 md:h-32 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Background */}
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

                        <div className="relative h-full w-full p-3 sm:p-4 flex items-end">
                          <div className="flex items-center gap-2 sm:gap-3">
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
                            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-2 drop-shadow-sm">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <FigmaSellComp />


        {/* CTA Section */}
        {!isAuthenticated && !user && (
          <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000" />
            </div>

            <Container className="relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm mb-6 animate-fade-in-up">
                  <StarIcon className="w-4 h-4" />
                  <span>Присоединяйтесь бесплатно</span>
                </div>

                <h2 className="text-4xl md:text-5xl dark:text-white font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-200">
                  Начните учиться
                  <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent"> сегодня</span>
                </h2>

                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                  Зарегистрируйтесь и получите доступ ко всем функциям платформы.
                  Отслеживайте историю скачиваний и создавайте свою библиотеку.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                  <Link href={routes.register}>
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-primary-600 hover:from-blue-700 hover:to-primary-700 text-white px-10 py-4 text-lg shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105"
                    >
                      Создать аккаунт
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={routes.about}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-300 dark:text-white  px-10 py-4 text-lg hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:scale-105"
                    >
                      Узнать больше
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
