import { keepPreviousData, QueryClient } from '@tanstack/react-query';
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

export interface CacheFnParams<R> {
  key: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => Promise<R>;
}

export function cacheFn<R>({ key, fn }: CacheFnParams<R>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedFn = async (...args: any[]) => {
    return queryClient.fetchQuery({
      queryKey: [key, ...args],
      queryFn: () => fn(...args),
    });
  };

  return cachedFn;
}

export function useCacheFn<R>({ key, fn }: CacheFnParams<R>) {
  const [isLoading, setIsLoading] = useState(false);

  const cachedFn = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (...args: any[]) => {
      try {
        setIsLoading(true);

        return await cacheFn({ key, fn })(...args);
      } finally {
        setIsLoading(false);
      }
    },
    [key, fn],
  );

  return { fn: cachedFn, isLoading };
}
