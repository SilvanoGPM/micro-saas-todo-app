'use server';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';
import { changeToFreeSubscription } from '$libs/stripe/payments';

export const changeToFreeSubscriptionAction = actionsClient.createAction({
  id: 'subscription.cancel',
  schema: actionsClient.emptySchema(),
  revalidate: true,

  async handler({ context }) {
    await changeToFreeSubscription(context.user.email);
  },
});

export async function getItensToDisable(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeUpgradedAt: true,
    },
  });

  if (!user?.stripeUpgradedAt) {
    return { todos: 0 };
  }

  const todos = await prisma.todo.count({
    where: {
      userId,
      blockWhenCancelSubscription: true,
    },
  });

  return { todos };
}
