import { parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { flashMessageTypes } from '$utils/get-flash-message';

export function useFlashMessage() {
  const [queryParams, setQueryParams] = useQueryStates({
    [flashMessageTypes.warning]: parseAsString,
    [flashMessageTypes.error]: parseAsString,
    [flashMessageTypes.info]: parseAsString,
    [flashMessageTypes.success]: parseAsString,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      const resetedQueryParams = {} as typeof queryParams;

      for (const [m, k] of Object.entries(flashMessageTypes)) {
        const key = k as keyof typeof queryParams;

        if (queryParams[key]) {
          resetedQueryParams[key] = null;

          const method = m as 'warning' | 'error' | 'info' | 'success';

          toast[method](queryParams[key as keyof typeof queryParams] as string);
        }
      }

      setQueryParams(resetedQueryParams);

      setTimeout(() => {
        initialized.current = false;
      }, 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);
}
