'use client';

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onSearch, debounceMs = 300, placeholder = 'Поиск...', ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
          onSearch?.(localValue);
        }
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [localValue, value, onChange, onSearch, debounceMs]);

    const handleClear = () => {
      setLocalValue('');
      onChange('');
      onSearch?.('');
    };

    return (
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={ref}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'block w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            className
          )}
          {...props}
        />
        {/* {localValue && (
          <Button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        )} */}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
