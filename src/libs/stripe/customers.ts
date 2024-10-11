import { prisma } from '../prisma';

import { STRIPE_PLANS } from './products';

import { stripe } from '.';

export async function createStripeCustomerIfNotExists({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  const customerExists = await getStripeCustomerByEmail(email);

  if (customerExists) {
    return customerExists;
  }

  const customer = await stripe.customers.create({
    email,
    name,
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: STRIPE_PLANS.free.priceId, quantity: 1 }],
  });

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: STRIPE_PLANS.free.priceId,
      stripeSubscriptionStatus: subscription.status,
    },
  });

  return customer;
}

export async function getStripeCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });

  return customers.data[0];
}
