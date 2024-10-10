import Stripe from 'stripe';

import { STRIPE_PRODUCTS } from '$config';
import { env } from '$env';
import { handleError } from '$utils/handle-error';

import { ROUTES } from './auth/routes';
import { prisma } from './prisma';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
});

export async function generateCheckoutSession(userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        name: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!user.stripeSubscriptionId) {
      throw new Error('Usuário não possui plano ativo');
    }

    const subscription = await stripe.subscriptionItems.list({
      subscription: user.stripeSubscriptionId,
      limit: 1,
    });

    const customer = await createStripeCustomerIfNotExists({
      email: userEmail,
      name: user.name || '',
    });

    const billingUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.private.billing.path}`;

    const session = await stripe.billingPortal.sessions.create({
      locale: 'pt-BR',
      return_url: billingUrl,
      customer: customer.id,

      flow_data: {
        type: 'subscription_update_confirm',

        subscription_update_confirm: {
          subscription: user.stripeSubscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: STRIPE_PRODUCTS.pro.id,
              quantity: 1,
            },
          ],
        },

        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: `${billingUrl}?success=true`,
          },
        },
      },
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.log(error);

    handleError('Erro ao gerar sessão de checkout');
  }
}

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

  console.log(user);

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
    },
  });
}

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
    items: [{ price: STRIPE_PRODUCTS.free.id, quantity: 1 }],
  });

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: STRIPE_PRODUCTS.free.id,
      stripeSubscriptionStatus: subscription.status,
    },
  });

  return customer;
}

export async function getStripeCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });

  return customers.data[0];
}

const products = Object.values(STRIPE_PRODUCTS);

export function getProductByPriceId(stripePriceId: string) {
  const product = products.find((product) => product.id === stripePriceId);

  if (product) {
    return product;
  }

  return STRIPE_PRODUCTS.free;
}

export function isProSubscription(stripePriceId: string) {
  return stripePriceId === STRIPE_PRODUCTS.pro.id;
}

export function isFreeSubscription(stripePriceId: string) {
  return stripePriceId === STRIPE_PRODUCTS.free.id;
}

export async function getUserProductDetails(userId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripePriceId: true,
    },
  });

  if (!user?.stripePriceId) {
    throw new Error('Usuário não encontrado');
  }

  const tasksCount = await prisma.todo.count({
    where: { userId },
  });

  const product = getProductByPriceId(user.stripePriceId);

  return {
    stripePriceId: user.stripePriceId,

    name: product.name,
    price: product.price,

    quota: {
      tasks: {
        max: product.quota.tasks,
        current: tasksCount,
        usage: (tasksCount / product.quota.tasks) * 100,
      },
    },
  };
}
