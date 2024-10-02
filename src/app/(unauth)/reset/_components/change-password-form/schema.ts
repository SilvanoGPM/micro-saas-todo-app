import { z } from 'zod';

import { confirmPassword, fieldIsRequiredValidation } from '$utils/zod';

export const changePasswordSchema = z
  .object({
    password: z
      .string(fieldIsRequiredValidation)
      .min(1, { message: 'Senha é obrigatória' }),

    confirmPassword: z
      .string(fieldIsRequiredValidation)
      .min(1, { message: 'Confirme sua senha' }),
  })
  .superRefine(
    confirmPassword({
      passwordPath: 'password',
      confirmPath: 'confirmPassword',
    }),
  );

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
