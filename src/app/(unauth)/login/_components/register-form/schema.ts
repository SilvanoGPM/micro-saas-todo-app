import { z } from 'zod';

import { confirmPassword, fieldIsRequiredValidation } from '$utils/zod';

export const registerSchema = z
  .object({
    name: z.string(fieldIsRequiredValidation).min(2, 'Nome inválido'),

    email: z.string(fieldIsRequiredValidation).email('Email inválido'),

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

export type RegisterSchema = z.infer<typeof registerSchema>;
