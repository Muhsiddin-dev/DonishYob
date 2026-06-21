'use client';

import {
  AcademicCapIcon,
  EnvelopeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { useAboutUs } from '@/hooks/useAbout';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Skeleton } from '@/components/ui';

const stats = [
  { icon: BookOpenIcon, numericValue: 10000, suffix: '+', label: 'Китобҳо' },
  { icon: UserGroupIcon, numericValue: 50000, suffix: '+', label: 'Истифодабарандагон' },
  { icon: ArrowDownTrayIcon, numericValue: 100000, suffix: '+', label: 'Боргириҳо' },
  { icon: DocumentTextIcon, numericValue: 500, suffix: '+', label: 'Муаллифон' },
];

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

export default function AboutPage() {
  const { data: about, isLoading } = useAboutUs();

  if (isLoading) {
    return (
      <div className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 dark:bg-gray-900 md:pt-24 px-3 sm:px-4">
      <Container className="max-w-7xl mx-auto">
        {/* Сарлавҳа */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 relative inline-block">
          {about?.title || 'О нас'}
          <span className="absolute -bottom-2 left-0 w-12 sm:w-16 h-1 bg-primary-600 rounded-full"></span>
        </h1>

        {/* Матни асосӣ */}
        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-10 md:mb-12">
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {about?.content ||
              'Информация о нашей научной библиотеке будет добавлена позже.'}
          </p>
        </div>

        {/* Stats Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-white dark:bg-gray-800/50  rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl z-20">
          <Container className="px-3 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30 text-primary-600 dark:text-primary-400 mb-2 sm:mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />
                  </div>
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    <NumberTicker
                      value={stat.numericValue}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
                    />
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Почему выбирают нас? */}
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl sm:rounded-3xl mt-8 sm:mt-10 md:mt-12">
          <Container className="px-3 sm:px-4">
            <div className="text-center mb-8 sm:mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Почему выбирают нас?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Мы создали платформу, которая делает обучение доступным и увлекательным
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
              {features.map((feature, index) => {
                const blueGradients = [
                  'from-blue-500 to-primary-600',
                  'from-cyan-500 to-blue-600',
                  'from-primary-500 to-indigo-600',
                  'from-sky-500 to-primary-700'
                ];
                const gradient = blueGradients[index % blueGradients.length];

                return (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </div>

                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>

                    <div className={`absolute -bottom-10 -right-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`} />
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Карточкаҳои миссия ва дидгоҳ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 my-8 sm:my-10 md:mb-12">
          {/* Миссия */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <RocketLaunchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Наша миссия
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              {about?.mission ||
                'Сделать научные знания доступными для каждого.'}
            </p>
          </div>

          {/* Дидгоҳ */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Наше видение
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              {about?.vision ||
                'Стать ведущей платформой для научного образования.'}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <EnvelopeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Связаться с нами
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                По всем вопросам обращайтесь на почту:{' '}
                <a
                  href={`mailto:${about?.contactEmail || 'info@donishyob.com'}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors border-b border-primary-200 dark:border-primary-800 hover:border-primary-600 dark:hover:border-primary-400"
                >
                  {about?.contactEmail || 'info@donishyob.com'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
