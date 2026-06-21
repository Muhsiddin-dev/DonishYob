import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import SwipperBookImg from '../SwipperBookImg/SwipperBookImg';
import { Download, Star } from 'lucide-react';
import { Book } from '@/types';

export default function SwipperBookCards({ books, desktopViews }: { books: Book[]; desktopViews: number }) {
    if (!books || books.length === 0) return null;

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={5}
            pagination={{ clickable: true }}
            breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1280: { slidesPerView: desktopViews || 5, spaceBetween: 30 },
            }}
            modules={[Pagination]}
            className="mySwiper py-10"
        >
            {books.map((book: Book) => (
                <SwiperSlide key={book.id}>
                    <Link href={`/books/${book.id}`}>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer md:h-full">
                            <div className="relative w-full md:aspect-[3/4] aspect-[2/2.5] sm:aspect-[3/3] rounded-lg sm:rounded-xl overflow-hidden mb-3">
                                <SwipperBookImg images={book.images} title={book.title} />
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 mb-1">
                                {book.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                                {book.author}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">{book.rating}</span>
                                </div>

                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5  dark:text-gray-400 text-black" />
                                    <span className="text-[10px] sm:text-xs text-gray-500">{book.downloadCount}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}