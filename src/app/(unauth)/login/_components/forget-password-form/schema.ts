import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const forgotPasswordSchema = z.object({
  email: z.string(fieldIsRequiredValidation).email('Email inválido'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
