'use client';

import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { getTodoById } from '$http/todos';
import { useFormAsyncInitialData } from '$utils/form';
import { handleError } from '$utils/handle-error';

export function useLoadForm(form: UseFormReturn, todoId?: string | null) {
  const fn = useCallback(async () => {
    if (todoId) {
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
    }

    return {
      title: '',
      description: '',
      completedAt: null,
    };
  }, [todoId]);

  return useFormAsyncInitialData(form, fn);
}
