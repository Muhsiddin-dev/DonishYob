'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
    XMarkIcon,
    TagIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    BeakerIcon,
    CodeBracketIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAudiences } from '@/hooks/useAudiences';
import { useCategories } from '@/hooks/useCategories';
import { useUserInterests } from '@/hooks/useUserInterests';
import { interestsSchema, InterestsFormData } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';


export default function InterestsPage() {
    const { data: audiences, isLoading: isAudiencesLoading } = useAudiences();
    const { data: categories, isLoading: isCategoriesLoading } = useCategories();
    const { success, error } = useToast();
    const createUserInterests = useUserInterests();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<InterestsFormData>({
        resolver: zodResolver(interestsSchema),
        defaultValues: {
            audienceIds: [],
            categoryIds: [],
        },
    });

    const selectedAudiences = watch('audienceIds') || [];
    const selectedCategories = watch('categoryIds') || [];

    const isMutationLoading = createUserInterests.status === 'pending';
    const isSubmitDisabled = selectedAudiences.length === 0 || selectedCategories.length === 0 || isMutationLoading;

    const toggleAudience = (id: string) => {
        const current = watch('audienceIds') || [];
        // Single-select: select one, or deselect if clicking the same
        if (current[0] === id) {
            setValue('audienceIds', [], { shouldValidate: true });
        } else {
            setValue('audienceIds', [id], { shouldValidate: true });
        }
    };

    const toggleCategory = (id: string) => {
        const current = watch('categoryIds') || [];
        if (current.includes(id)) {
            setValue('categoryIds', current.filter((item) => item !== id), { shouldValidate: true });
        } else {
            setValue('categoryIds', [...current, id], { shouldValidate: true });
        }
    };

    const onSubmit = (data: InterestsFormData) => {
        createUserInterests.mutate(data);
    };

    const getAudienceIcon = (name: string) => {
        const n = (name || '').toLowerCase();
        if (n.includes('it') || n.includes('программ') || n.includes('код')) return CodeBracketIcon;
        if (n.includes('наук') || n.includes('science') || n.includes('хим') || n.includes('био')) return BeakerIcon;
        if (n.includes('универ') || n.includes('студ') || n.includes('учеб') || n.includes('акад')) return AcademicCapIcon;
        if (n.includes('бизнес') || n.includes('маркет') || n.includes('эконом') || n.includes('менедж')) return BriefcaseIcon;
        if (n.includes('популяр') || n.includes('интерес') || n.includes('нов')) return SparklesIcon;
        return TagIcon;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-10 md:py-28">
            <div className="mx-auto w-full max-w-3xl">
                <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                    <div className="absolute right-4 top-4">
                        <button
                            type="button"
                            onClick={() => error('Анкетаро пур кардан ҳатмист!')}
                            className="inline-flex h-10 w-10  items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                            aria-label="Закрыть"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-8 py-10 sm:px-12 sm:py-12">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Анкета студента</p>
                            <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                                Укажите ваши интересы
                            </h1>
                            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                                Выберите категории и жанры, чтобы мы могли давать лучшие рекомендации.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8">
                            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Категории, которые вам нравятся</h2>
                                        <p className="text-sm text-slate-500">Выберите хотя бы одну категорию.</p>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700">
                                        Выбрано {selectedCategories.length} из {categories?.length ?? 0}
                                    </div>
                                </div>

                                <div
                                    className="mt-6 max-h-[420px] overflow-y-auto pr-1"
                                    style={{ scrollbarGutter: 'stable' }}
                                >
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {isCategoriesLoading ? (
                                        <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
                                            Загрузка категорий...
                                        </div>
                                    ) : categories && categories.length > 0 ? (
                                        categories.map((category) => {
                                            const selected = selectedCategories.includes(category.id);
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(category.id)}
                                                    className={`rounded-3xl border p-4 text-left transition-all duration-150 ${selected
                                                        ? 'border-primary-500 bg-primary-500/10 text-slate-900 shadow-sm'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                                                            {category.imageUrl ? (
                                                                <img
                                                                    src={category.imageUrl}
                                                                    alt={category.name}
                                                                    // fill
                                                                    sizes="40px"
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold leading-5 line-clamp-2">{category.name}</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
                                            Категории не найдены. Попробуйте позже.
                                        </div>
                                    )}
                                    </div>
                                </div>

                                {errors.categoryIds && (
                                    <p className="mt-4 text-sm text-red-600">{errors.categoryIds.message}</p>
                                )}
                            </section>

                            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Жанры, которые вам нравятся</h2>
                                        <p className="text-sm text-slate-500">Выберите один жанр.</p>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700">
                                        Выбрано {selectedAudiences.length} из 1
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {isAudiencesLoading ? (
                                        <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
                                            Загрузка жанров...
                                        </div>
                                    ) : audiences && audiences.length > 0 ? (
                                        audiences.map((audience) => {
                                            const selected = selectedAudiences.includes(audience.id);
                                            const Icon = getAudienceIcon(audience.name);
                                            return (
                                                <button
                                                    key={audience.id}
                                                    type="button"
                                                    onClick={() => toggleAudience(audience.id)}
                                                    className={`rounded-3xl border p-4 text-left transition-all duration-150 ${selected
                                                        ? 'border-primary-500 bg-primary-500/10 text-slate-900 shadow-sm'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${selected
                                                                ? 'bg-primary-500 text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold leading-5 line-clamp-2">{audience.name}</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
                                            Жанры не найдены. Попробуйте позже.
                                        </div>
                                    )}
                                </div>

                                {errors.audienceIds && (
                                    <p className="mt-4 text-sm text-red-600">{errors.audienceIds.message}</p>
                                )}
                            </section>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="lg"
                                    className="w-full py-5 sm:w-auto text-white"
                                    isLoading={isMutationLoading}
                                    disabled={isSubmitDisabled}
                                >
                                    Продолжить
                                </Button>
                            </div>

                            <p className="text-sm text-slate-500">
                                Заполнение анкеты обязательно — это поможет подобрать лучшие книги именно для вас.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
