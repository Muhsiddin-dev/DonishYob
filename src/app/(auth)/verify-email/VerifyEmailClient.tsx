'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { verifyEmailSchema, VerifyEmailFormData } from '@/lib/validators';
import { useVerifyEmail, useResendVerificationCode, useLogin } from '@/hooks/useAuth';
import { routes } from '@/config';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';

export default function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const router = useRouter();
    const [resendError, setResendError] = useState<string | null>(null);
    const { success, error } = useToast()
    const [countdown, setCountdown] = useState(0);
    const [resendStatus, setResendStatus] = useState<{ message: string, isError: boolean } | null>(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('resetEmail') || '';
            setEmail(savedEmail);
        }
    }, []);

    const { mutate: resendCode, isPending: isResending } = useResendVerificationCode();
    const { mutate: autoLogin, isPending: isLoggingIn } = useLogin();
    const { mutate: verifyEmail, isPending: isVerifying, isSuccess } = useVerifyEmail();

    const isLoading = isVerifying || isLoggingIn;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: email,
            code: ''
        }
    });

    useEffect(() => {
        if (email) {
            setValue('email', email);
        }
    }, [email, setValue]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        const fullCode = newCode.join('');
        setValue('code', fullCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newCode = data.split('');
        const fullCode = [...newCode, ...Array(6 - newCode.length).fill('')].slice(0, 6);

        setCode(fullCode);
        setValue('code', data);

        const lastIndex = data.length < 6 ? data.length : 5;
        inputRefs.current[lastIndex]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    const onSubmit = (data: VerifyEmailFormData) => {
        verifyEmail(data, {
            onSuccess: () => {
                const isResetFlow = localStorage.getItem('resetEmail');
                const isRegistrationFlow = sessionStorage.getItem('temp_auth');

                if (isResetFlow && !isRegistrationFlow) {
                    localStorage.setItem('resetCode', data.code);
                    router.push('/reset-password');
                    return;
                }

                if (isRegistrationFlow) {
                    const { email, password } = JSON.parse(isRegistrationFlow);

                    autoLogin({ email, password }, {
                        onSuccess: () => {
                            sessionStorage.removeItem('temp_auth');
                            localStorage.removeItem('resetEmail');
                            router.push(routes.interests);
                        },
                        onError: () => {
                            router.push(routes.login);
                        }
                    });
                    return;
                }

                router.push(routes.login);
            }
        });
    };

    const handleResend = () => {
        if (countdown > 0) return;

        resendCode(email, {
            onSuccess: () => {
                setCountdown(60);
            },
            onError: (err: any) => {
                if (err?.response?.status === 409 || err?.response?.status === 429) {
                    setCountdown(60);
                }
            }
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Подтверждение Email
            </h2>
            <div className="text-center mb-8">
                <p className="text-gray-600">Введите код, отправленный на ваш email</p>
                <p className="font-semibold text-primary-600 italic">{email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-between gap-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onPaste={handlePaste}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`
                      w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all duration-500
                      ${isSuccess ? 'border-green-500 bg-green-50 text-green-600 scale-110 shadow-lg shadow-green-200'
                                    : 'border-gray-200 focus:border-primary-500'}
              `}
                        />
                    ))}
                </div>

                {errors.code && (
                    <p className="text-red-500 text-sm text-center mt-[-20px]">
                        {errors.code.message}
                    </p>
                )}

                <Button type="submit" className="w-full text-white dark:bg-primary-600 py-5" >
                    {isLoading ? 'Подтверждение...' : 'Подтвердить'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || countdown > 0}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isResending ? (
                        'Отправка...'
                    ) : countdown > 0 ? (
                        `Отправить повторно через ${countdown}с`
                    ) : (
                        'Отправить код повторно'
                    )}
                </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                <Link href={routes.register} className="font-medium text-primary-600 hover:text-primary-500">
                    Вернуться к регистрации
                </Link>
            </p>
        </div>
    );
}