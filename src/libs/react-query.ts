import {
  keepPreviousData,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchIntervalInBackground: false,
      placeholderData: keepPreviousData,
      retry: 2,
    },

    mutations: {
      retry: 2,
    },
  },
});

export interface UseCacheFnParams<R> {
  key: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => Promise<R>;
}

export function useCacheFn<R>({ key, fn }: UseCacheFnParams<R>) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const cachedFn = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (...args: any[]) => {
      try {
        setIsLoading(true);

        return queryClient.fetchQuery({
          queryKey: [key, ...args],
          queryFn: () => fn(...args),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fn, key, queryClient],
  );

  return { fn: cachedFn, isLoading };
}
