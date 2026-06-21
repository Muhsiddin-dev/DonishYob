'use client';

import { useCallback, useRef, useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';
import { Button } from './button';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 50 * 1024 * 1024,
  onFilesSelected,
  label,
  helperText,
  error,
  className,
  maxFiles,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFiles = useCallback(
    (fileList: FileList | null): File[] => {
      if (!fileList) return [];

      const validFiles: File[] = [];
      Array.from(fileList).forEach((file) => {
        if (file.size <= maxSize) {
          validFiles.push(file);
        }
      });

      return multiple ? validFiles : validFiles.slice(0, 1);
    },
    [maxSize, multiple]
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        const combinedFiles = multiple ? [...files, ...validFiles] : validFiles;
        const trimmedFiles = typeof maxFiles === 'number' ? combinedFiles.slice(0, maxFiles) : combinedFiles;
        setFiles(trimmedFiles);
        onFilesSelected(trimmedFiles);
      }
    },
    [files, maxFiles, multiple, onFilesSelected, validateFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        const combinedFiles = multiple ? [...files, ...validFiles] : validFiles;
        const trimmedFiles = typeof maxFiles === 'number' ? combinedFiles.slice(0, maxFiles) : combinedFiles;
        setFiles(trimmedFiles);
        onFilesSelected(trimmedFiles);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [files, maxFiles, multiple, onFilesSelected, validateFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [files, onFilesSelected]
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {files.length == 0 && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-primary-600">Нажмите для загрузки</span> или
              перетащите файл
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept ? `Форматы: ${accept}` : 'Любые файлы'} до {formatBytes(maxSize)}
            </p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              <DocumentIcon className="h-8 w-8 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
