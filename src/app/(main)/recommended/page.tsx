'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Download, BookOpen, ChevronRight, LogIn, UserPlus, Sparkles, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookRecommended } from '@/hooks/useRecommended';
import { tokenStorage } from '@/lib/auth/tokens';
import SwipperBookImg from '@/components/SwiperSlideComponent/SwipperBookImg/SwipperBookImg';

interface RecommendedBook {
    id: string;
    title: string;
    author: string;
    difficulty: string;
    language: string;
    category: string;
    previewImage: string | null;
    downloadCount: number;
    PageCount: number;
    createdAt: string;
    rating: number;
}

const BookCard = ({ book, variant = 'default' }: { book: any; variant?: 'default' | 'compact' | 'featured' }) => {
    const difficultyColors = {
        Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const difficultyLabels = {
        Beginner: 'Начинающий',
        Intermediate: 'Средний',
        Advanced: 'Продвинутый',
    };

    const previewImage = book.images && book.images.length > 0
        ? book.images[0].imageUrl
        : null;
    console.log('previewImage', previewImage);


    const category = book.category || (book.category?.name) || '';
    const downloadCount = book.downloadCount || 0;
    const pageCount = book.pageCount || 0;
    const rating = book.rating || 0;

    if (variant === 'featured') {
        return (
            <Link href={`/books/${book.id}`} className="block">
                <div className="group bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-blue-200 dark:border-blue-700">
                    <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 aspect-[3/4] md:aspect-square overflow-hidden">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt={book.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-white/10">
                                    <BookOpen className="w-16 h-16 text-white/80 mb-2" />
                                    <span className="text-sm text-white/60 text-center px-2">Нет обложки</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
                                    {difficultyLabels[book.difficulty as keyof typeof difficultyLabels] || book.difficulty}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 p-6 text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-lg text-white/90 mb-4 line-clamp-1">
                                {book.author}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                                    {category}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                                    {book.language === 'ru' ? 'Русский' : book.language === 'en' ? 'English' : book.language === 'tg' ? 'Тоҷикӣ' : book.language}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{rating?.toFixed(1) || '4.0'}</span>
                                    <span className="text-white/70">({pageCount} стр.)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Download className="w-5 h-5 text-white/70" />
                                    <span className="text-white/70">{downloadCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={`/books/${book.id}`}>
                <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-3 p-3">
                        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt={book.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-primary-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                                {book.author}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium">{rating?.toFixed(1) || '4.0'}</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                    {difficultyLabels[book.difficulty as keyof typeof difficultyLabels] || book.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/books/${book.id}`}>
            <div className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt={book.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary-400 mb-2" />
                            <span className="text-xs text-gray-400 text-center px-2">Нет обложки</span>
                        </div>
                    )}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <span className={cn(
                            'px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-semibold',
                            difficultyColors[book.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-700'
                        )}>
                            {difficultyLabels[book.difficulty as keyof typeof difficultyLabels] || book.difficulty}
                        </span>
                    </div>
                </div>
                <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                        {book.author}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                            {category}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                            {book.language === 'ru' ? 'Русский' : book.language === 'en' ? 'English' : book.language === 'tg' ? 'Тоҷикӣ' : book.language}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                                {rating?.toFixed(1) || '4.0'}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400 ml-1">
                                ({pageCount} стр.)
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                            <span className="text-[10px] sm:text-xs text-gray-500">{downloadCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Skeleton Card
const BookCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <Skeleton className="w-full aspect-[3/4] rounded-none" />
        <div className="p-3 sm:p-4 space-y-2">
            <Skeleton className="w-3/4 h-4 rounded-lg" />
            <Skeleton className="w-1/2 h-3 rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="w-16 h-4 rounded-md" />
                <Skeleton className="w-12 h-4 rounded-md" />
            </div>
            <div className="flex justify-between">
                <Skeleton className="w-16 h-3 rounded-lg" />
                <Skeleton className="w-12 h-3 rounded-lg" />
            </div>
        </div>
    </div>
);

// Empty State
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-12 h-12 text-primary-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Нет рекомендаций
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md">
            На данный момент нет рекомендованных книг. Попробуйте позже.
        </p>
    </div>
);

// Login Required State
const LoginRequiredState = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center">
        <div className="relative mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-blue-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">!</span>
            </div>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Войдите для доступа к рекомендациям
        </h3>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Персональные рекомендации книг, подобранные специально для вас на основе ваших интересов
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти в систему
                </Button>
            </Link>

            <Link href="/register">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Создать аккаунт
                </Button>
            </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl max-w-md">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                <strong className="block mb-2">Почему стоит войти?</strong>
                📚 Персональные рекомендации на основе ваших интересов<br />
                🎯 Сохранение истории чтения и избранного<br />
            </p>
        </div>
    </div>
);

export default function RecommendationsPage() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const authenticated = tokenStorage.isAuthenticated();
        setIsLoggedIn(authenticated);
    }, []);

    const { data: recommendedBooks, isLoading: loading, error } = useBookRecommended({
        enabled: !!isLoggedIn
    });

    const books = recommendedBooks || [];
    console.log('bookrecommendedBookss', books);

    const totalItems = books.length;

    useEffect(() => {
        if (error && (error as any)?.response?.status === 401) {
            tokenStorage.removeAccessToken();
            tokenStorage.removeRefreshToken();
            tokenStorage.removeUser();
            setIsLoggedIn(false);
        }
    }, [error]);

    if (isLoggedIn === null) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] pt-16 md:pt-20 pb-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">

                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Рекомендации
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                        Книги, подобранные специально для вас
                        {!loading && totalItems > 0 && (
                            <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                                ({totalItems} книг)
                            </span>
                        )}
                    </p>
                    <div className="w-16 h-1 bg-blue-600 rounded-full mt-3" />
                </div>

                {!isLoggedIn ? (
                    <LoginRequiredState />
                ) : loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {books.length > 0 && (
                            <div className="mb-8 sm:mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        Рекомендация недели
                                    </h2>
                                </div>
                                <BookCard book={books[1]} variant="featured" />
                            </div>
                        )}

                        {books.length > 1 && (
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Другие рекомендации
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {books.slice(1).map((book) => (
                                        <BookCard key={book.id} book={book} variant="default" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {books.length >= 10 && (
                            <div className="flex justify-center mt-8 sm:mt-10">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5">
                                    Смотреть все
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}