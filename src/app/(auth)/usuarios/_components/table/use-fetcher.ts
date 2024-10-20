'use client';

import { useCallback } from 'react';

import { handleError } from '$utils/handle-error';

export function useUserNotificationFetcher(userId?: string | null) {
  const fetcher = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      return {
        userId,
        title: '',
        body: '',
      };
    } catch (error) {
      handleError(error, 'Não foi possível usuário');
    }
  }, [userId]);

  return fetcher;
}
