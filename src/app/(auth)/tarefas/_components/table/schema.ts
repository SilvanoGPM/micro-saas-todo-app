import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const toggleCompletedAtTodoSchema = z.object({
  id: z.string(fieldIsRequiredValidation),
});

export const deleteTodoSchema = z.object({
  id: z.string(fieldIsRequiredValidation),
});

export type ToggleCompletedAtTodo = z.infer<typeof toggleCompletedAtTodoSchema>;
export type DeleteTodo = z.infer<typeof deleteTodoSchema>;
