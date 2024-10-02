import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const loginSchema = z.object({
  email: z.string(fieldIsRequiredValidation).email('E-mail inválido'),

  password: z
    .string(fieldIsRequiredValidation)
    .min(1, { message: 'Senha é obrigatória' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
