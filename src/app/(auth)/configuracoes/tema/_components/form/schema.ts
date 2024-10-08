import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const themeSchema = z.object({
  theme: z.string(fieldIsRequiredValidation).min(1, 'Tema é obrigatório'),
});

export type ThemeSchema = z.infer<typeof themeSchema>;
