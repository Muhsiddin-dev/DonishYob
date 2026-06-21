'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, Headphones, Clock, Download, Eye, BookOpen, ArrowRight,
  Play, Pause, Volume2, VolumeX, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/hooks';
import { Book, AudioBook } from '@/types';
import SwipperBookImg from '../SwiperSlideComponent/SwipperBookImg/SwipperBookImg';
import { useAudioBooks } from '@/hooks/useAudioBooks';
import SwipperBookCards from '../SwiperSlideComponent/SwipperBook/SwipperBookCards';

interface Article {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
}

// Skeleton Components
export const BookCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 w-full shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-4">
    <div className="w-full md:aspect-[3/4] aspect-[2/2] rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0"></div>

    <div className="flex flex-col gap-2 w-full">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-1/3 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
    </div>

  </div>
);
export const AudioCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 w-full shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className="w-24 h-28 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700 shrink-0"></div>

    <div className="flex flex-col gap-2 w-full">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-1/3 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-2 w-1/2 rounded-md"></div>
    </div>

  </div>
);

const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold  text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

const AudiobookCard = ({ audio }: { audio: AudioBook }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex gap-3 sm:gap-4">

      {/* Cover Image Section */}
      <div className="relative w-20 sm:w-24 md:w-28 flex-shrink-0 aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
        {audio?.coverImageUrl ? (
          <img
            src={audio.coverImageUrl}
            alt={audio.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400 mb-1" />
            <span className="text-[8px] sm:text-[10px] text-gray-400 text-center px-1">Аудиокнига</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
            )}
          </div>
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 mb-0.5">
          {audio.title}
        </h3>

        {/* Author */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 line-clamp-1">
          {audio.author}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
            <Headphones className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {audio.durationSeconds ? formatTime(audio.durationSeconds) : '00:00'}
          </span>
        </div>

        {/* Audio Player */}
        <div className="space-y-1.5 sm:space-y-2">
          <audio
            ref={audioRef}
            src={audio.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Progress Bar */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 sm:[&::-webkit-slider-thumb]:w-3 sm:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
              style={{
                background: `linear-gradient(to right, #2563eb ${progressPercent}%, #e5e7eb ${progressPercent}%)`
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={togglePlay}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                ) : (
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <span className="text-[9px] sm:text-[10px] text-gray-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button className="text-gray-400 hover:text-primary-600 transition-colors">
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function HomePage() {
  const [loading, setLoading] = useState({
    trending: true,
    articles: true,
    audiobooks: true,
    recent: true,
  });

  const [data, setData] = useState({
    trending: [] as Book[],
    articles: [] as Article[],
    audiobooks: [] as AudioBook[],
    recent: [] as Book[],
  });

  const { data: booksData, isLoading: booksLoading } = useBooks({ pageSize: 8 });
  const { data: audiobooksData, isLoading: isLoadingAudiobooks } = useAudioBooks();

  useEffect(() => {
    const fetchData = async () => {

      const articlesPromise = new Promise<Article[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: '1', title: 'Последние достижения в исследовании космоса', author: 'Анна Макарова', timeAgo: '28 минут назад' },
            { id: '2', title: 'Что такое машинное обучение?', author: 'Кейт Абраханов', timeAgo: '5 минут назад' },
            { id: '3', title: 'Гид по написанию научной статьи', author: 'Алекс Петровский', timeAgo: '1 час назад' },
          ]);
          setLoading(prev => ({ ...prev, articles: false }));
        }, 1200);
      });

      const [trending] = await Promise.all([
        articlesPromise,
      ]);

      setData(prevData => ({ ...prevData }));
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-primary-600 to-blue-300 dark:from-blue-950 dark:via-primary-900 dark:to-blue-800">
      <div className="max-w-[89%] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 m-auto  sm:px-6 xl:px-8 py-6 sm:py-8">

        {/* Trending Books - 2/3 width */}
        <section className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">В тренде</h2>
            <Link href="/books">
              <Button variant="ghost" className="text-white/80 hover:text-white gap-1 text-sm">
                Все <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : (Array.isArray(booksData?.items) ? booksData?.items : []).length === 0 ? (
            <EmptyState title="Нет книг в тренде" description="Скоро появятся новые книги" icon={BookOpen} />
          ) : (
            <div className="w-full">
              <SwipperBookCards desktopViews={3} books={booksData?.items || []} />
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Аудиокниги</h2>
            <Link href="/audiobooks">
              <Button variant="ghost" className="text-white/80 hover:text-white gap-1 text-sm">
                Все <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoadingAudiobooks ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <AudioCardSkeleton key={i} />
              ))}
            </div>
          ) : (Array.isArray(audiobooksData) ? audiobooksData : []).length === 0 ? (
            <EmptyState title="Нет аудиокниг" description="Скоро появятся новые аудиокниги" icon={Headphones} />
          ) : (
            <div className="space-y-3">
              {audiobooksData?.map((audio) => (
                <AudiobookCard key={audio.id} audio={audio} />
              ))}
            </div>
          )}
        </section>

        <section className="md:col-span-3 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Недавние книги</h2>
            <Link href="/books">
              <Button variant="ghost" className="text-white/80 hover:text-white gap-1 text-sm">
                Все <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : (Array.isArray(booksData?.items) ? booksData?.items : []).length === 0 ? (
            <EmptyState title="Нет недавних книг" description="Скоро появятся новые книги" icon={BookOpen} />
          ) : (
            <div className="w-full py-5">
              <SwipperBookCards desktopViews={5} books={booksData?.items || []} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}