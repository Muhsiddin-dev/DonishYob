'use client';

import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { routes, config } from '@/config';

const footerLinks = {
  resources: [
    { name: 'Главная', href: routes.home },
    { name: 'Все книги', href: routes.books },
    { name: 'Рекомендации', href: routes.recommended },
    { name: 'Категории', href: routes.categories },
  ],
  company: [
    { name: 'О нас', href: routes.about },
  ],
  legal: [
    { name: 'Политика конфиденциальности', href: '#' },
    { name: 'Условия использования', href: '#' },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide global chrome on анкета page
  if (pathname === '/interests') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-primary-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand - Бренд */}
          <div className="col-span-1 md:col-span-2">

            <Link href={routes.home} className="flex items-center gap-2 group">
              <img src="/donishyob.png" alt="logo" className="h-9 w-9" />
              <span className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                {config.siteName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-md leading-relaxed">
              Научная библиотека с широким выбором учебных материалов для студентов,
              преподавателей и исследователей.
            </p>

            {/* Социальные сети - метавонед илова кунед */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Telegram
              </a>
              <a target='_blank' href="https://instagram.com/_nazarov._011" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Facebook
              </a>
            </div>
          </div>

          {/* Links - Ресурсы */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Ресурсы
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Компания */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Компания
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            &copy; {currentYear} {config.siteName}. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
