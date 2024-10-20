import WebPush from 'web-push';

import { prisma } from '$libs/prisma';
import { env } from '$env';

export interface SendNotificationsParams {
  userId: string;
  title: string;
  body: string;
}

export interface PushNotificationParams {
  subscription: WebPush.PushSubscription;
  title: string;
  body: string;
}

WebPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  env.NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY,
  env.NOTIFICATIONS_PRIVATE_KEY,
);

export async function sendNotifications({
  userId,
  body,
  title,
}: SendNotificationsParams) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationsSubscription: true },
  });

  if (!user?.notificationsSubscription) {
    return;
  }

  const subscription = JSON.parse(user.notificationsSubscription);

  await Promise.all(
    subscription.map((sub: WebPush.PushSubscription) =>
      pushNotification({ subscription: sub, body, title }),
    ),
  );
}

export async function pushNotification({
  subscription,
  body,
  title,
}: PushNotificationParams) {
  await WebPush.sendNotification(
    subscription,
    JSON.stringify({
      title,
      body,
    }),
  );
}
