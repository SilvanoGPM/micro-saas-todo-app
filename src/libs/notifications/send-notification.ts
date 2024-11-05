import WebPush from 'web-push';

import { env } from '$env';
import { prisma } from '$libs/prisma';

export interface PushNotificationParams {
  subscription: WebPush.PushSubscription;
  title: string;
  body: string;
  url?: string;
}

export interface SendNotificationsParams
  extends Omit<PushNotificationParams, 'subscription'> {
  userId: string;
}

WebPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  env.NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY,
  env.NOTIFICATIONS_PRIVATE_KEY,
);

export async function pushNotification({
  subscription,
  body,
  title,
  url,
}: PushNotificationParams) {
  try {
    await WebPush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        url,
      }),
    );
  } catch {
    //
  }
}

export async function sendNotifications({
  userId,
  body,
  title,
  url,
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
      pushNotification({ subscription: sub, body, title, url }),
    ),
  );
}
