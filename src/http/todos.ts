import { useQuery } from '@tanstack/react-query';

import { applyMapper } from '$http';
import { httpClient } from '$libs/http-client';
import { HTTP_KEYS } from '$config';
import { todosMapper } from '$mappers/todos';
import { handleError } from '$utils/handle-error';

import { BaseEntity, GetParams, MappedEntity, Page } from './types';

export interface HttpTodo extends BaseEntity {
  id: string;
  title: string;
  blockWhenCancelSubscription: boolean;
  description: string | null;
  completedAt: string | null;
  user: { id: string };
}

export type Todo = MappedEntity<HttpTodo>;

export interface GetTodosParams extends GetParams {
  userId?: string;
  userStripePriceId?: string | null;
}

export const TODOS_PATH = '/todos';

export async function getTodos(params: GetParams) {
  const response = await httpClient.get<Page<HttpTodo>>(TODOS_PATH, {
    params,
  });

  return applyMapper(todosMapper, response.data);
}

export async function getTodoById(id: string) {
  const response = await httpClient.get<HttpTodo>(`${TODOS_PATH}/${id}`);

  return applyMapper(todosMapper, response.data);
}

export function useGetTodoById({
  enabled,
  id,
}: {
  id: string;
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: [HTTP_KEYS.todo.get, id],
    queryFn: async () => {
      try {
        return await getTodoById(id);
      } catch (error) {
        handleError(error, 'Não foi possível carregar tarefa');
      }
    },
  });
}

export function useGetTodos({
  enabled,
  ...params
}: GetTodosParams & {
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: [HTTP_KEYS.todo.list, params],
    queryFn: async () => {
      try {
        return await getTodos(params);
      } catch (error) {
        handleError(error, 'Não foi possível carregar as tarefas');
      }
    },
  });
}
