import { env } from '$env';
import { getFlashMessage } from '$utils/flash-messages';

import { ROUTES } from '../auth/routes';
import { prisma } from '../prisma';

import { createStripeCustomerIfNotExists } from './customers';
import { STRIPE_PLANS } from './products';

import { stripe } from '.';

export const billingUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.private.billing.path}`;

export async function upgradePlan(userEmail: string, priceId: string) {
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
              price: priceId,
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
    throw new Error('Erro ao gerar sessão de checkout');
  }
}

export async function changeToFreeSubscription(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      stripeSubscriptionId: true,
    },
  });

  if (!user?.stripeSubscriptionId) {
    throw new Error('Usuário não encontrado');
  }

  const subscription = await stripe.subscriptionItems.list({
    subscription: user.stripeSubscriptionId,
    limit: 1,
  });

  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    items: [
      {
        id: subscription.data[0].id,
        price: STRIPE_PLANS.free.priceId,
        quantity: 1,
      },
    ],
  });

  await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      stripeSubscriptionStatus: 'active',
      stripePriceId: STRIPE_PLANS.free.priceId,
      stripeUpgradedAt: null,
    },
  });
}

export async function buyProduct({
  priceId,
  userEmail,
  poolingName,
  anchor,
}: {
  userEmail: string;
  priceId: string;
  poolingName?: string;
  anchor?: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const customer = await createStripeCustomerIfNotExists({
      email: userEmail,
      name: user.name || '',
    });

    const successFlashMessage = getFlashMessage(
      'success',
      'Aguarde enquanto processamos seu pagamento, você será notificado por e-mail em breve.',
    );

    const session = await stripe.checkout.sessions.create({
      locale: 'pt-BR',
      success_url: `${billingUrl}${
        anchor ? `#${anchor.replaceAll('#', '')}` : ''
      }?${successFlashMessage}${poolingName ? `&${poolingName}=true` : ''}`,
      cancel_url: billingUrl,
      customer: customer.id,
      mode: 'payment',

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
    });

    return {
      url: session.url,
    };
  } catch (error) {
    throw new Error('Erro ao tentar comprar produto');
  }
}
