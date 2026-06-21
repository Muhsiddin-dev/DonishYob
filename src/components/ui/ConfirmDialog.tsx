'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '.';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const variantMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  primary: "default",
  danger: "destructive",
  secondary: "secondary",
  outline: "outline",
};

const variants = {
  danger: {
    icon: 'bg-red-100',
    iconColor: 'text-red-600',
    button: 'danger' as const,
  },
  warning: {
    icon: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    button: 'primary' as const,
  },
  info: {
    icon: 'bg-blue-100',
    iconColor: 'text-blue-600',
    button: 'primary' as const,
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const { icon, iconColor, button } = variants[variant];
  const finalVariant = variantMap[button as string] || "default";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 p-2 rounded-full ${icon}`}>
                    <ExclamationTriangleIcon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">{message}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    {cancelText}
                  </Button>
                  <Button
                    variant={finalVariant} 
                    onClick={onConfirm}
                    isLoading={isLoading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
