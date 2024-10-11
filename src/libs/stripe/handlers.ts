import Stripe from 'stripe';

import { prisma } from '../prisma';

export async function handleProccessWebhookUpdatedSubscription(event: {
  object: Stripe.Subscription;
}) {
  const stripeCustomerId = event.object.customer as string;
  const stripeSubscriptionId = event.object.id;
  const stripeSubscriptionStatus = event.object.status;
  const stripePriceId = event.object.items.data[0].price.id;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ stripeCustomerId }, { stripeSubscriptionId }],
    },
    select: { id: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus,
      stripePriceId,
      stripeUpgradedAt: new Date(),
    },
  });
}
