import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { watchlistAPI, stockAPI } from "../services/api";

export const useWatchlist = () => {
    return useQuery({
        queryKey: ['watchlist'],
        queryFn: async () => {
            const res = await watchlistAPI.getAll();
            const watchlistItems = Array.isArray(res.data.data) ? res.data.data : [];

            // Fetch live data for each item
            const itemsWithLive = await Promise.all(
                watchlistItems.map(async (item) => {
                    try {
                        const liveRes = await stockAPI.getOne(item.stockId.symbol || item.stockId);
                        return { ...item, stock: liveRes.data };
                    } catch {
                        return item;
                    }
                })
            );
            return itemsWithLive;
        },
    });
};

export const useAddToWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stockId) => watchlistAPI.add(stockId),
        onSuccess: () => {
            queryClient.invalidateQueries(['watchlist']);
            queryClient.invalidateQueries(['stocks']);
        },
    });
};

export const useRemoveFromWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => watchlistAPI.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['watchlist']);
            queryClient.invalidateQueries(['stocks']);
        },
    });
};