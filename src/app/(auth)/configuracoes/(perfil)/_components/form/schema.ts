import { z } from 'zod';

import { createFileSchema, fieldIsRequiredValidation } from '$utils/zod';

export const avatarOptions = {
  maxSize: 4 * 1024 * 1024, // 4MB
  maxFileCount: 1,
};

export const profileSchema = z.object({
  avatar: z
    .array(createFileSchema(avatarOptions.maxSize))
    .max(avatarOptions.maxFileCount, `Somente uma imagem é permitida`)
    .optional(),

  name: z.string(fieldIsRequiredValidation).min(1, 'O nome é obrigatório'),
  email: z.string(fieldIsRequiredValidation).email('E-mail inválido'),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
