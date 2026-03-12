import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,           // Data stays fresh for 5 minutes
            gcTime: 10 * 60 * 1000,             // Cache garbage collected after 10 minutes
            refetchOnWindowFocus: false,        // Don't fetch when window regains focus
            retry: 1                            // Retry failed requests once
        },
        mutations: {
            retry: 1                            // Retry failed mutations once
        },
    },
});

export const QueryClientProvider = ({ children }) => {
    return (
        <TanStackQueryClientProvider client={queryClient}>
            { children }
        </TanStackQueryClientProvider>
    );
};

export { queryClient };