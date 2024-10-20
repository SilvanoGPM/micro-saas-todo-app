import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  body: z.string(),
});

export type SendNotification = z.infer<typeof sendNotificationSchema>;
