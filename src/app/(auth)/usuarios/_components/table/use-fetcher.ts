'use client';

import { useCallback } from 'react';

import { useCreateFetcher } from '$hooks/use-create-fetcher';
import { getUserById } from '$http/users';
import { handleError } from '$utils/handle-error';

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
  return useCreateFetcher(
    'user-email',
    async () => {
      if (!userId) {
        return;
      }

      try {
        const user = await getUserById(userId);

        return {
          userEmail: user.email,
          userName: user.name,
          title: '',
          message: '',
        };
      } catch (error) {
        handleError(error, 'Não foi possível carregar usuário');
      }
    },
    [userId],
  );
}
