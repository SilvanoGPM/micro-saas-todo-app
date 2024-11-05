import Stripe from 'stripe';

import { sendTemplateMail } from '$libs/mail';

import { prisma } from '../prisma';

import { STRIPE_PRODUCTS } from './products';

import { stripe } from '.';

export async function handleProccesUpdatedSubscription(event: {
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

export async function handleProccessCheckoutSuccess(event: {
  object: Stripe.Checkout.Session;
}) {
  const lineItems = await stripe.checkout.sessions.listLineItems(
    event.object.id,
  );

  const stripeCustomerId = event.object.customer as string;
  const stripeSubscriptionId = event.object.id;
  const stripePriceId = lineItems?.data?.[0]?.price?.id as string;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ stripeCustomerId }, { stripeSubscriptionId }],
    },
    select: { id: true, email: true, name: true },
  });

  if (!user?.email) {
    throw new Error('Usuário não encontrado');
  }

  switch (stripePriceId) {
    case STRIPE_PRODUCTS.notes.priceId: {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeNotesPaid: true,
        },
      });

      await sendTemplateMail('notes-unlocked', {
        to: user.email,
        subject: 'Suas anotações foram desbloqueadas!',

        data: {
          name: user.name || 'Amigo',
        },
      });

      break;
    }

    default: {
      break;
    }
  }
}
