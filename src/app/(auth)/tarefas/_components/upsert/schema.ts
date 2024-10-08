import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const upsertTodoSchema = z.object({
  id: z.string().optional().nullable(),

  title: z.string(fieldIsRequiredValidation).min(2, 'O título é obrigatório'),

  description: z.string(fieldIsRequiredValidation).optional().nullable(),

  completedAt: z.coerce.date(fieldIsRequiredValidation).optional().nullable(),
});

export type UpsertTodoSchema = z.infer<typeof upsertTodoSchema>;

export const defaultUpsertTodoValues: UpsertTodoSchema = {
  id: null,
  title: '',
  description: '',
  completedAt: null,
};
