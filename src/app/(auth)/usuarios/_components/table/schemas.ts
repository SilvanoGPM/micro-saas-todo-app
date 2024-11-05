import { z } from 'zod';

import { fieldIsRequiredValidation } from '$utils/zod';

export const sendNotificationSchema = z.object({
  userId: z.string(fieldIsRequiredValidation),
  title: z.string(fieldIsRequiredValidation),
  body: z.string(fieldIsRequiredValidation),
  url: z.string(fieldIsRequiredValidation).url({ message: 'URL inválida' }),
});

export const sendMailSchema = z.object({
  userEmail: z.string(fieldIsRequiredValidation),
  userName: z.string(fieldIsRequiredValidation),
  title: z.string(fieldIsRequiredValidation),
  message: z.string(fieldIsRequiredValidation),
});

export type SendNotificationSchema = z.infer<typeof sendNotificationSchema>;
export type SendMailSchema = z.infer<typeof sendMailSchema>;
