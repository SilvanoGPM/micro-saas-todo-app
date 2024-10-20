import { NextRequest } from 'next/server';

import { httpResponses } from '$libs/api/http-responses';
import { getCurrentUser } from '$libs/auth/get-current-user';
import { pushNotification } from '$libs/notifications/send-notification';
import { prisma } from '$libs/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return httpResponses.unauthorized();
  }

  const userFound = await prisma.user.findUnique({
    where: { id: user.id },
    select: { notificationsSubscription: true },
  });

  if (!userFound) {
    return httpResponses.notFound();
  }

  const userSubscription = userFound.notificationsSubscription
    ? JSON.parse(userFound.notificationsSubscription)
    : null;

  const body = await req.json();
  const newSubscription = body.subscription;

  const notificationsSubscription = getUpdatedSubscription(
    userSubscription,
    newSubscription,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { notificationsSubscription },
  });

  await pushNotification({
    subscription: newSubscription,
    title: 'Notificações ativas',
    body: 'Você ativou as notificações para este dispositivo.',
  });

  return httpResponses.ok({ success: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUpdatedSubscription(userSubscription: any, newSubscription: any) {
  const MAX_DEVICES = 4;

  const updatedSubscription = userSubscription
    ? [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...userSubscription.slice(-(MAX_DEVICES - 1)).filter((sub: any) => {
          const { keys } = newSubscription;

          return (
            sub.keys?.auth !== keys?.auth && sub.keys?.p256dh !== keys?.p256dh
          );
        }),

        newSubscription,
      ]
    : [newSubscription];

  return JSON.stringify(updatedSubscription);
}
