'use client';

import { useCallback } from 'react';

import { handleError } from '$utils/handle-error';
import { getUserById } from '$http/users';

export function useUserIdFetcher(userId?: string | null) {
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
      handleError(error, 'Não foi possível carregar usuário');
    }
  }, [userId]);

  return fetcher;
}

export function useUserEmailFetcher(userId?: string | null) {
  const fetcher = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const user = await getUserById(userId);

      return {
        userEmail: user.email,
        title: '',
        message: '',
      };
    } catch (error) {
      handleError(error, 'Não foi possível carregar usuário');
    }
  }, [userId]);

  return fetcher;
}
