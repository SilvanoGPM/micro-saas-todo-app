import { useQuery } from '@tanstack/react-query';

import { HTTP_KEYS } from '$config';
import { applyMapper } from '$http';
import { httpClient } from '$libs/http-client';
import { usersMapper } from '$mappers/users';
import { handleError } from '$utils/handle-error';

import { BaseEntity, GetParams, MappedEntity, Page } from './types';

export interface HttpUser extends BaseEntity {
  name: string;
  email: string;
  roles: string;
  image?: string | null;
}

export type User = MappedEntity<
  HttpUser,
  {
    roles: string[];
  }
>;

export const USERS_PATH = '/users';

export async function getUsers(params: GetParams) {
  const response = await httpClient.get<Page<HttpUser>>(USERS_PATH, {
    params,
  });

  return applyMapper(usersMapper, response.data);
}

export async function getUserById(id: string) {
  const response = await httpClient.get<HttpUser>(`${USERS_PATH}/${id}`);

  return applyMapper(usersMapper, response.data);
}

export function useGetUserById({
  enabled,
  id,
}: {
  id: string;
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: [HTTP_KEYS.user.get, id],
    queryFn: async () => {
      try {
        return await getUserById(id);
      } catch (error) {
        handleError(error, 'Não foi possível carregar usuário');
      }
    },
  });
}

export function useGetUsers({
  enabled,
  ...params
}: GetParams & {
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: [HTTP_KEYS.user.list, params],
    queryFn: async () => {
      try {
        return await getUsers(params);
      } catch (error) {
        handleError(error, 'Não foi possível carregar as usuários');
      }
    },
  });
}
