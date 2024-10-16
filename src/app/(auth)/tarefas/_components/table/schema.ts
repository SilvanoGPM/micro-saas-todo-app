import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const deleteTodoSchema = z.object({
  id: z.string(fieldIsRequiredValidation),
});

export type DeleteTodo = z.infer<typeof deleteTodoSchema>;
