import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  body: z.string(),
});

export const sendMailSchema = z.object({
  userEmail: z.string(),
  userName: z.string(),
  title: z.string(),
  message: z.string(),
});

export type SendNotificationSchema = z.infer<typeof sendNotificationSchema>;
export type SendMailSchema = z.infer<typeof sendMailSchema>;
