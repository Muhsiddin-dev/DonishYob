'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import { routes } from '@/config';
import {
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types';
import axios from 'axios';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      success('Вы успешно вошли в систему');
      if (typeof window !== 'undefined' && localStorage.getItem('needs_interests') === '1') {
        router.push(routes.interests);
      } else {
        router.push(routes.home);
      }
    },
    onError: (err: Error) => {
      error('Email ё Парол Хато аст!');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('resetEmail', variables.email);
        localStorage.setItem('needs_interests', '1');
      }

      sessionStorage.setItem('temp_auth', JSON.stringify({
        email: variables.email,
        password: variables.password
      }));

      success('Регистрация успешна! Проверьте email');

      router.push(routes.verifyEmail);
    },
    onError: (err: any) => {
      const backendError = err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Ошибка регистрации';

      toastError(backendError);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: () => {
      success('Email успешно подтверждён!');

    },
    onError: (err: Error | any) => {
      if (axios.isAxiosError(err)) {
        const backendError = err.response?.data?.error;

        if (backendError === "Verification code expired or not found.") {
          error("Вақти код гузаштааст. Лутфан кодро аз сар равон кунед!");
        } else {
          error(backendError || "Код нодуруст аст ё хатогии сервер рӯй дод");
        }
      } else {
        error("Хатогии техникӣ рӯй дод. Дубора кӯшиш кунед.");
      }
    }
  })
}


export function useResendVerificationCode() {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (email: string) => authApi.resendVerificationCode(email),
    onSuccess: () => {
      success('Код подтверждения отправлен повторно');
    },
    onError: (err: any) => {
      const backendError = err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Ошибка отправки кода';

      error(backendError);
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      success('Инструкции по сбросу пароля отправлены на email');
      router.push(routes.verifyEmail);
    },
    onError: (err: any) => {
      const backendMessage = err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Ошибка отправки запроса';

      if (backendMessage.includes('limit reached')) {
        error('Лимит сброса пароля на сегодня исчерпан. Попробуйте завтра.');
      } else if (backendMessage.includes('wait')) {
        error('Пожалуйста, подождите немного перед повторным запросом');
      } else {
        error(backendMessage);
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      success('Пароль успешно изменён!');
      router.push(routes.login);
    },
    onError: (err: any) => {
      const serverError = err?.response?.data?.error || err?.response?.data?.message || "";

      console.log('Матни хатогӣ аз сервер:', serverError);

      if (serverError === "Verification code expired or not found") {
        error("Мӯҳлати код гузаштааст. Лутфан кодро аз нав гиред.");
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
      }
      // 3. Иловагӣ: Тафтиши хатогии 409
      else if (err?.response?.status === 409) {
        error("Хатогӣ 409: Ин код аллакай истифода шудааст ё ботил аст.");
      }
      else {
        error(serverError || 'Ошибка сброса пароля');
      }
    },
  });
}

export function useChangePassword() {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      success('Пароль успешно изменён!');
    },
    onError: (err: Error) => {
      error(err.message || 'Ошибка смены пароля');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { success } = useToast();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      success('Вы вышли из системы');
      router.push(routes.home);
    },
  });
}
