'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  UsersIcon,
  AcademicCapIcon,
  LanguageIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { BookFilters, BookDifficulty, Category, Audience } from '@/types';
import { config } from '@/config';
import { Button } from '../ui';

interface SmartBookSearchProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
  categories: Category[];
  audiences: Audience[];
  totalResults?: number;
  isLoading?: boolean;
}

const difficultyOptions: { value: BookDifficulty | ''; label: string; color: string }[] = [
  { value: '', label: 'Все уровни', color: 'bg-gray-100 text-gray-700' },
  { value: 'Beginner', label: 'Начинающий', color: 'bg-green-100 text-green-700' },
  { value: 'Intermediate', label: 'Средний', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Advanced', label: 'Продвинутый', color: 'bg-red-100 text-red-700' },
];

const languageOptions = [
  { value: '', label: 'Все языки' },
  { value: 'Русский', label: 'Русский' },
  { value: 'Тоҷикӣ', label: 'Тоҷикӣ' },
  { value: 'English', label: 'English' },
];

const sortOptions = [
  { value: 'createdAt-desc', label: 'Сначала новые', icon: '🆕' },
  { value: 'createdAt-asc', label: 'Сначала старые', icon: '📅' },
  { value: 'title-asc', label: 'По названию (А-Я)', icon: '🔤' },
  { value: 'title-desc', label: 'По названию (Я-А)', icon: '🔠' },
  { value: 'downloadCount-desc', label: 'По популярности', icon: '🔥' },
  { value: 'rating-desc', label: 'По рейтингу', icon: '⭐' },
];

export function SmartBookSearch({
  filters,
  onFiltersChange,
  categories,
  audiences,
  totalResults,
  isLoading = false,
}: SmartBookSearchProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== filters.search) {
        onFiltersChange({
          ...filters,
          search: normalizedSearch || undefined,
          page: 1
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const handleFilterChange = useCallback(
    (key: keyof BookFilters, value: string | undefined) => {
      onFiltersChange({
        ...filters,
        [key]: value || undefined,
        page: 1,
      });
      setActiveDropdown(null);
    },
    [filters, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [sortBy, sortOrder] = value.split('-');
      onFiltersChange({
        ...filters,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
        page: 1,
      });
      setActiveDropdown(null);
    },
    [filters, onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ page: 1, pageSize: filters.pageSize });
  }, [filters.pageSize, onFiltersChange]);

  const clearSearch = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ ...filters, search: undefined, page: 1 });
    searchInputRef.current?.focus();
  }, [filters, onFiltersChange]);

  const activeFiltersCount = [
    filters.search,
    filters.categoryId,
    filters.audienceId,
    filters.difficulty,
    filters.language,
  ].filter(Boolean).length;

  const currentSort = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;
  const currentSortLabel = sortOptions.find((s) => s.value === currentSort)?.label || 'Сортировка';

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '';
  const getAudienceName = (id: string) => audiences.find((a) => a.id === id)?.name || '';

  return (
    <div className="w-full space-y-4 z-40">
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className={cn(
              'w-6 h-6 transition-colors ',
              isLoading ? 'text-primary-800 animate-pulse' : 'text-gray-800'
            )} />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск по названию, автору, описанию..."
            className={cn(
              'w-full pl-14 pr-32 py-4 text-base sm:text-lg',
              'bg-white/80 dark:bg-gray-950/40 border border-gray-200/70 dark:border-gray-700/70 rounded-2xl',
              'placeholder:text-gray-400 text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/60 dark:focus:ring-primary-900/30',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md backdrop-blur-md'
            )}
          />

          <div className="absolute right-3 flex items-center gap-2">
            {searchValue && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all border',
                showAdvanced
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-gray-100/80 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 border-gray-200/70 dark:border-gray-700/70 hover:bg-gray-200/80 dark:hover:bg-gray-800/80'
              )}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary-500 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="animate-pulse">Поиск...</span>
            ) : (
              <>
                Найдено: <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> книг
              </>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Сбросить все
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel - Панели филтрҳои пешрафта */}
      {showAdvanced && (
        <div
          ref={dropdownRef}
          className="bg-white/90 dark:bg-gray-950/60 absolute left-0 right-0 mt-3 border z-50 border-gray-200/70 dark:border-gray-700/70 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md animate-fade-in-down"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Category Filter - Филтри категория */}
            <FilterDropdown
              label="Категория"
              icon={<BookOpenIcon className="w-5 h-5" />}
              value={filters.categoryId ? getCategoryName(filters.categoryId) : 'Все категории'}
              isActive={activeDropdown === 'category'}
              onToggle={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
              hasValue={!!filters.categoryId}
            >
              <div className="max-h-64 overflow-y-auto">
                <DropdownOption
                  label="Все категории"
                  isSelected={!filters.categoryId}
                  onClick={() => handleFilterChange('categoryId', undefined)}
                />
                {categories.map((category) => (
                  <DropdownOption
                    key={category.id}
                    label={category.name}
                    isSelected={filters.categoryId === category.id}
                    onClick={() => handleFilterChange('categoryId', category.id)}
                  />
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown
              label="Аудитория"
              icon={<UsersIcon className="w-5 h-5" />}
              value={filters.audienceId ? getAudienceName(filters.audienceId) : 'Все аудитории'}
              isActive={activeDropdown === 'audience'}
              onToggle={() => setActiveDropdown(activeDropdown === 'audience' ? null : 'audience')}
              hasValue={!!filters.audienceId}
            >
              <div className="max-h-64 overflow-y-auto">
                <DropdownOption
                  label="Все аудитории"
                  isSelected={!filters.audienceId}
                  onClick={() => handleFilterChange('audienceId', undefined)}
                />
                {audiences.map((audience) => (
                  <DropdownOption
                    key={audience.id}
                    label={audience.name}
                    isSelected={filters.audienceId === audience.id}
                    onClick={() => handleFilterChange('audienceId', audience.id)}
                  />
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown
              label="Уровень"
              icon={<AcademicCapIcon className="w-5 h-5" />}
              value={filters.difficulty ? config.difficultyLabels[filters.difficulty] : 'Все уровни'}
              isActive={activeDropdown === 'difficulty'}
              onToggle={() => setActiveDropdown(activeDropdown === 'difficulty' ? null : 'difficulty')}
              hasValue={!!filters.difficulty}
            >
              {difficultyOptions.map((option) => (
                <DropdownOption
                  key={option.value}
                  label={option.label}
                  isSelected={filters.difficulty === option.value || (!filters.difficulty && !option.value)}
                  onClick={() => handleFilterChange('difficulty', option.value || undefined)}
                  badge={option.value && (
                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', option.color)}>
                      {option.label}
                    </span>
                  )}
                />
              ))}
            </FilterDropdown>

            {/* Language Filter - Филтри забон */}
            <FilterDropdown
              label="Язык"
              icon={<LanguageIcon className="w-5 h-5" />}
              value={filters.language || 'Все языки'}
              isActive={activeDropdown === 'language'}
              onToggle={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
              hasValue={!!filters.language}
            >
              {languageOptions.map((option) => (
                <DropdownOption
                  key={option.value}
                  label={option.label}
                  isSelected={filters.language === option.value || (!filters.language && !option.value)}
                  onClick={() => handleFilterChange('language', option.value || undefined)}
                />
              ))}
            </FilterDropdown>

            {/* Sort - Тартибдиҳӣ */}
            <FilterDropdown
              label="Сортировка"
              icon={<ArrowsUpDownIcon className="w-5 h-5" />}
              value={currentSortLabel}
              isActive={activeDropdown === 'sort'}
              onToggle={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
              hasValue={false}
            >
              {sortOptions.map((option) => (
                <DropdownOption
                  key={option.value}
                  label={option.label}
                  isSelected={currentSort === option.value}
                  onClick={() => handleSortChange(option.value)}
                  prefix={<span className="mr-2">{option.icon}</span>}
                />
              ))}
            </FilterDropdown>
          </div>

          {/* Active Filters Tags - Тегҳои филтрҳои фаъол */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Активные фильтры:</span>

                {filters.search && (
                  <FilterTag
                    label={`Поиск: "${filters.search}"`}
                    onRemove={() => { setSearchValue(''); handleFilterChange('search', undefined); }}
                  />
                )}

                {filters.categoryId && (
                  <FilterTag
                    label={`Категория: ${getCategoryName(filters.categoryId)}`}
                    onRemove={() => handleFilterChange('categoryId', undefined)}
                  />
                )}

                {filters.audienceId && (
                  <FilterTag
                    label={`Аудитория: ${getAudienceName(filters.audienceId)}`}
                    onRemove={() => handleFilterChange('audienceId', undefined)}
                  />
                )}

                {filters.difficulty && (
                  <FilterTag
                    label={`Уровень: ${config.difficultyLabels[filters.difficulty]}`}
                    onRemove={() => handleFilterChange('difficulty', undefined)}
                    color={
                      filters.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : filters.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                    }
                  />
                )}

                {filters.language && (
                  <FilterTag
                    label={`Язык: ${filters.language}`}
                    onRemove={() => handleFilterChange('language', undefined)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Filter Dropdown Component
interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  isActive: boolean;
  onToggle: () => void;
  hasValue: boolean;
  children: React.ReactNode;
}

function FilterDropdown({
  label,
  icon,
  value,
  isActive,
  onToggle,
  hasValue,
  children,
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <Button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all backdrop-blur-md',
          isActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-4 ring-primary-100/70 dark:ring-primary-900/25'
            : hasValue
              ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/15'
              : 'border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('flex-shrink-0', hasValue ? 'text-primary-600' : 'text-gray-400')}>
            {icon}
          </span>
          <span className={cn(
            'truncate text-sm font-medium',
            hasValue ? 'text-primary-700' : 'text-gray-700'
          )}>
            {value}
          </span>
        </div>
        <ChevronDownIcon className={cn(
          'w-4 h-4 flex-shrink-0 transition-transform',
          isActive ? 'rotate-180 text-primary-500' : 'text-gray-400'
        )} />
      </Button>

      {isActive && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-gray-950/70 border border-gray-200/80 dark:border-gray-700/70 rounded-xl shadow-xl overflow-hidden backdrop-blur-md animate-fade-in-down">
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown Option Component
interface DropdownOptionProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  prefix?: React.ReactNode;
}

function DropdownOption({ label, isSelected, onClick, badge, prefix }: DropdownOptionProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors',
        isSelected
          ? 'bg-primary-50 dark:bg-primary-900/20'
          : 'hover:bg-primary-50 dark:hover:bg-primary-900/10'
      )}
    >
      <div className="flex items-center gap-2">
        {prefix && <span className="text-gray-500">{prefix}</span>}
        <span className={isSelected ? 'font-semibold text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'}>
          {label}
        </span>
      </div>
      {badge && <span>{badge}</span>}
      {isSelected && <span className="text-primary-600 dark:text-primary-300">✓</span>}
    </div>
  );
}

// Filter Tag Component
interface FilterTagProps {
  label: string;
  onRemove: () => void;
  color?: string;
}

function FilterTag({ label, onRemove, color = 'bg-primary-100 text-primary-700 border-primary-200' }: FilterTagProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border',
      color
    )}>
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </span>
  );
}