import { booksApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useBookRecommended = (options = {}) => {
    return useQuery({
        queryKey: ['books', 'recommended'],
        queryFn: () => booksApi.getBookRecommended(),
        enabled: false,
        ...options,
    });
};