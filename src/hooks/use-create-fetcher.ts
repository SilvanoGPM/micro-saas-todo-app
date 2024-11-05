import { useCallback } from 'react';

import { cacheFn, CacheFnParams } from '$libs/react-query';

export function useCreateFetcher<R>(
  key: string,
  fn: CacheFnParams<R>['fn'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = [],
) {
  const fetcher = useCallback(() => {
    return cacheFn({
      key: [key, ...deps],
      fn,
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return fetcher;
}
