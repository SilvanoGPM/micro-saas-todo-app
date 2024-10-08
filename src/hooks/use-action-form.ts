import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';

import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

export interface UseActionFormProps<
  R extends { data: unknown; error: unknown },
  TFieldValues extends FieldValues = FieldValues,
> extends UseFormProps<TFieldValues> {
  schema: z.ZodSchema<TFieldValues>;
  action: (data: TFieldValues) => Promise<R | void>;

  queriesToInvalidate?: Array<string | string[]>;

  defaultErrorMessage?: string;

  disableDefaultErrorHandling?: boolean;

  fetcher?: () => Promise<TFieldValues | undefined | null>;

  onSubmitSuccessful?: (
    data: TFieldValues,
    result: Exclude<R['data'], { error: string }> | null,
  ) => void;

  onSubmitError?: (error: unknown, data: TFieldValues) => void;
}

export function useActionForm<
  R extends { data: unknown; error: unknown },
  TFieldValues extends FieldValues = FieldValues,
>({
  action,
  schema,
  defaultErrorMessage,
  onSubmitSuccessful,
  onSubmitError,
  queriesToInvalidate = [],
  disableDefaultErrorHandling = false,
  fetcher,
  ...props
}: UseActionFormProps<R, TFieldValues>) {
  const queryClient = useQueryClient();

  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    ...props,
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit(async (data) => {
    try {
      const result = await handleAction(action, data);

      for (const queryKey of queriesToInvalidate) {
        await queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
      }

      const isValidResult =
        result?.data &&
        typeof result.data === 'object' &&
        !('error' in result.data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmitSuccessful?.(data, isValidResult ? (result.data as any) : null);
    } catch (error) {
      if (!disableDefaultErrorHandling) {
        handleError(error, defaultErrorMessage);
      }

      onSubmitError?.(error, data);
    }
  });

  useEffect(() => {
    if (fetcher) {
      setIsFetching(true);

      fetcher?.()
        .then((data) => {
          if (data) {
            form.reset(data);
          } else {
            form.reset(form.formState.defaultValues as TFieldValues);
          }
        })
        .finally(() => setIsFetching(false));
    }
  }, [fetcher, form]);

  console.log(form.formState);

  return {
    ...form,
    isFetching,
    submit,
  } as UseFormReturn<TFieldValues> & {
    submit: () => void;
    isFetching: boolean;
  };
}
