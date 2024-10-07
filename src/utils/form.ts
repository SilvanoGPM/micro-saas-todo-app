import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

// Por enquanto não é utilizado porque basta usar o defaultValues.
export function useFormAsyncInitialData<F extends FieldValues>(
  initialForm: UseFormReturn<F>,
  fn: () => Promise<F>,
) {
  const [isLoading, setIsLoading] = useState(true);

  const form = useRef(initialForm).current;

  useEffect(() => {
    async function load() {
      try {
        const data = await fn();

        form.reset(data);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoading) {
      load();
    }
  }, [fn, form, isLoading]);

  const refetch = useCallback(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    refetch();
  }, [fn, refetch]);

  return { isLoading, refetch };
}
