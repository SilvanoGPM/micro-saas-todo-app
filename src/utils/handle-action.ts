/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActionError } from '$libs/errors/action-error';

type WithoutError<T extends object> = Exclude<T, { error: string }>;

export async function handleAction<T extends object>(
  fn: (...args: any[]) => Promise<T | void>,
  ...args: Parameters<typeof fn>
): Promise<WithoutError<T>> {
  try {
    const response = await (args.length > 0 ? fn(...args) : fn());

    if (!response) {
      return {} as WithoutError<T>;
    }

    if ('error' in response && (response as any)?.error) {
      const status = (response as any)?.status || 'error';

      throw new ActionError((response as any).error, status);
    }

    const { error: _, ...rest } = response as T & { error?: string };

    return rest as WithoutError<T>;
  } catch (error) {
    if (error instanceof ActionError) {
      throw error;
    }

    throw new ActionError(error as any, 'error');
  }
}
