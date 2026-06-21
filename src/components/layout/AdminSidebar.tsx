'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  BookOpenIcon,
  FolderIcon,
  SpeakerWaveIcon,
  UsersIcon,
  UserGroupIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { routes, config } from '@/config';
import { cn } from '@/lib/utils';
import { Button } from '../ui';
import Image from 'next/image';
import { FolderPlus } from 'lucide-react';

const navigation = [
  { name: 'Статистика', href: routes.admin, icon: ChartBarIcon, adminOnly: false },
  { name: 'Автор', href: routes.adminAvtor, icon: FolderPlus, adminOnly: false },
  { name: 'Категории', href: routes.adminCategories, icon: RectangleStackIcon, adminOnly: true },
  { name: 'Книги', href: routes.adminBooks, icon: BookOpenIcon, adminOnly: false },
  { name: 'Аудиокниги', href: routes.adminAudiobooks, icon: SpeakerWaveIcon, adminOnly: false },
  { name: 'Аудитории', href: routes.adminAudiences, icon: UserGroupIcon, adminOnly: true },
  { name: 'Пользователи', href: routes.adminUsers, icon: UsersIcon, adminOnly: true },
  { name: 'О нас', href: routes.adminAbout, icon: InformationCircleIcon, adminOnly: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSuperAdmin } = useAuthStore();

  const filteredNav = navigation.filter(
    (item) => !item.adminOnly || isSuperAdmin()
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6 border-b border-gray-200">
        <div className="flex items-center">
            <Image
              src="/donishyob.png"
              alt="DonishYob Logo"
              width={35}
              height={35}
              className="object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
              priority
            />
        </div>
        <div>
          <div className="font-bold text-gray-900">{config.siteName}</div>
          <div className="text-xs text-gray-500">Админ-панель</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive =
            item.href === routes.admin
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-gray-200">
        <Link
          href={routes.home}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Вернуться на сайт
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>
    </>
  );
}
