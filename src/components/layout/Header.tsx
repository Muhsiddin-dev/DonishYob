'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';
import { config } from '@/config';
import { useAuthStore } from '@/store/authStore';

// Sheet Component (Drawer)
const MobileSheet = ({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Image
                src="/donishyob.png"
                alt="Donishyob Logo"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {config.siteName}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Sheet Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Header Component
export function Header() {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();

  if (pathname === '/interests') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Книги', href: '/books' },
    { name: 'Рекомендации', href: '/recommended' },
    { name: 'Категории', href: '/categories' },
    { name: 'О нас', href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md max-w-[95%] sm:max-w-2xl  md:max-w-7xl w-full m-auto shadow-lg rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-700/50">
        <nav className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">

            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-1 md:gap-1.5 group">
                <Image
                  src="/donishyob.png"
                  alt="DonishYob Logo"
                  width={35}
                  height={35}
                  className="object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                  priority
                />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-150">
                  {config.siteName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-4 lg:gap-6 xl:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-xs lg:text-sm font-medium transition-colors duration-150',
                    pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3">
              <AnimatedThemeToggler />
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 lg:gap-2 rounded-full p-0.5   hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label="Менюи корбар"
                  >
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 border-2 border-white dark:border-gray-700 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-primary-600 text-white text-xs sm:text-sm font-semibold">
                        {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                      {user.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <span className="sm:hidden text-xs font-medium text-gray-700 dark:text-gray-300">
                      {user.fullName?.split(' ')[0]?.slice(0, 1) || 'U'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-gray-700 z-20">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-4 w-4" />
                          Профиль
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                          Настройки
                        </Link>
                        {isAdmin() && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Cog6ToothIcon className="h-4 w-4" />
                            Админ-панель
                          </Link>
                        )}
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          Выйти
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary-600 size-50 hover:bg-primary-700 text-white border-none shadow-sm text-xs lg:text-sm px-3 py-2.5 lg:px-4">
                      Регистрация
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileSheetOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sheet (Drawer from right) */}
      <MobileSheet isOpen={mobileSheetOpen} onClose={() => setMobileSheetOpen(false)}>
        <div className="p-4 space-y-6">
          {/* Theme Toggler in Mobile */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Тема</span>
            <AnimatedThemeToggler />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-800" />

          {/* Navigation Links */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-150',
                  pathname === item.href
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => setMobileSheetOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-800" />

          {/* User Section in Mobile */}
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 border-2 border-white dark:border-gray-700 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-primary-600 text-white text-xs sm:text-sm font-semibold">
                    {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.fullName || 'user@example.com'}
                  </p>
                </div>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                onClick={() => setMobileSheetOpen(false)}
              >
                <UserCircleIcon className="h-5 w-5" />
                Профиль
              </Link>
              <Link
                href="/profile/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                onClick={() => setMobileSheetOpen(false)}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Настройки
              </Link>
              {isAdmin() && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                  onClick={() => setMobileSheetOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  Админ-панель
                </Link>
              )}
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileSheetOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Выйти
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="block px-3 py-3 rounded-lg text-base font-semibold text-center text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150"
                onClick={() => setMobileSheetOpen(false)}
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="block px-3 py-3 rounded-lg text-base font-semibold text-center text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors duration-150"
                onClick={() => setMobileSheetOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </MobileSheet>
    </>
  );
}