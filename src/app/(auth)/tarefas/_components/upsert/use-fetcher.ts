'use client';

import { useCallback } from 'react';

import { getTodoById } from '$http/todos';
import { handleError } from '$utils/handle-error';

export function useTodoFetcher(todoId?: string | null) {
  const fetcher = useCallback(async () => {
    if (!todoId) {
      return;
    }

    try {
      const todo = await getTodoById(todoId);

      return {
        id: todo.id,
        title: todo.title,
        description: todo.description,

        completedAt: todo.__raw.completedAt
          ? new Date(todo.__raw.completedAt)
          : null,
      };
    } catch (error) {
      handleError(error, 'Não foi possível carregar a tarefa');
    }
  }, [todoId]);

  return fetcher;
}
