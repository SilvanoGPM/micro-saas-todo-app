import { useQuery } from '@tanstack/react-query';

import { httpClient } from '$libs/http-client';
import { handleError } from '$utils/handle-error';

import { GetParams, Page } from './types';

export interface User {
  name: string;
  email: string;
  image: string;
  uuid: string;
  createdAt: string;
}

export async function getUsers(params: GetParams) {
  const response = await httpClient.get<Page<User>>('/users', {
    params,
  });

  return response.data;
}

export function useGetUsers({
  enabled,
  ...params
}: GetParams & {
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: ['users', params],
    queryFn: async () => {
      try {
        const users = await getUsers(params);

        return { ...users };
      } catch (error) {
        handleError(error, 'Não foi possível carregar usuários');
      }
    },
  });
}
