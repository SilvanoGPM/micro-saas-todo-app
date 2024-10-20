import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { z } from 'zod';

import { uploadFileAction } from '$libs/actions/upload';
import { UploadFileData } from '$libs/s3';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';
import { objectToFormData } from '$utils/object-to-form-data';

export interface UseActionFormProps<
  TFieldValues extends FieldValues = FieldValues,
  R extends { data: unknown; error: unknown } = {
    data: unknown;
    error: unknown;
  },
> extends UseFormProps<TFieldValues> {
  schema: z.ZodSchema<TFieldValues>;
  action: (data: TFieldValues) => Promise<R | void>;

  files?: {
    bucket?: string;
    acl?: string;
    cacheControl?: string;
    removeUrlQueryParams?: boolean;

    fields: Array<{
      key: keyof TFieldValues;
      mapKeyTo?: string;
      fileMap?: (file: File) => File;
    }>;
  };

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
  TFieldValues extends FieldValues = FieldValues,
  R extends { data: unknown; error: unknown } = {
    data: unknown;
    error: unknown;
  },
>({
  action,
  schema,
  files = { fields: [] },
  defaultErrorMessage,
  onSubmitSuccessful,
  onSubmitError,
  queriesToInvalidate = [],
  disableDefaultErrorHandling = false,
  fetcher,
  ...props
}: UseActionFormProps<TFieldValues, R>) {
  const queryClient = useQueryClient();

  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<TFieldValues>({
    ...props,
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit(async (data) => {
    try {
      for (const {
        key,
        mapKeyTo = key,
        fileMap = (file: File) => file,
      } of files.fields) {
        if (data[key]) {
          if (!Array.isArray(data[key])) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data[key] = [data[key]] as any;
          }

          const uploadedFilesUrl = await Promise.all(
            (data[key] as File[])
              .filter(Boolean)
              .map(fileMap)
              .map(async (file) =>
                uploadFileAction(
                  objectToFormData<UploadFileData>({
                    file,
                    key: file.name,
                    bucket: files.bucket,
                    acl: files.acl,
                    cacheControl: files.cacheControl,
                    removeUrlQueryParams: files.removeUrlQueryParams ?? true,
                  }),
                ),
              ),
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data[mapKeyTo] = uploadedFilesUrl as any;

          if (mapKeyTo !== key) {
            delete data[key];
          }
        }
      }

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

  return {
    ...form,
    isFetching,
    submit,
  } as UseFormReturn<TFieldValues> & {
    submit: () => void;
    isFetching: boolean;
  };
}
