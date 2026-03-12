import { useQuery } from "@tanstack/react-query";
import { stockAPI } from "../services/api";

export const useStocks = () => {
    return useQuery({
        queryKey: ['stocks'],
        queryFn: async () => {
            const res = await stockAPI.getAll();
            return Array.isArray(res.data.stocks) ? res.data.stocks : [];
        },
        staleTime: 5 * 60 * 1000,  // 5 minutes for stocks list
    });
};

export const useStockSearch = (query) => {
    return useQuery({
        queryKey: ['stocks', 'search', query],
        queryFn: async () => {
            const res = await stockAPI.search(query);
            return res.data.stocks || [];
        },
        enabled: !!query && query.trim().length >= 2,             // Only fetch if query has 2+ chars
        staleTime: 2 * 60 * 1000,                               // 2 minutes for search results
    });
};