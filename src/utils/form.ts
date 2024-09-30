import { useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

// Por enquanto não é utilizado porque basta usar o defaultValues.
export function useFormAsyncInitialData<F extends FieldValues>(
  initialForm: UseFormReturn<F>,
  initialFn: () => Promise<F>,
) {
  const [isLoading, setIsLoading] = useState(true);

  const form = useRef(initialForm).current;
  const fn = useRef(initialFn).current;

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

  return { isLoading };
}
