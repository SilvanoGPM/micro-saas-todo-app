import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const profileSchema = z.object({
  name: z.string(fieldIsRequiredValidation).min(1, 'O nome é obrigatório'),
  email: z.string(fieldIsRequiredValidation).email('E-mail inválido'),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
