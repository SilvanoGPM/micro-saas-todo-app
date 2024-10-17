import { prisma } from '../prisma';

export const STRIPE_PLANS = {
  premium: {
    priceId: 'price_1Q8CvIJ9ikhb1lLTs7Gs1zqP',
    name: 'Premium',
    price: 15,

    quota: {
      tasks: Infinity,
    },

    isPremium(priceId: string) {
      return this.priceId === priceId;
    },

    next: () => {
      return null;
    },
  },

  pro: {
    priceId: 'price_1Q0YWJJ9ikhb1lLTLFdNysn3',
    name: 'Pro',
    price: 5,

    quota: {
      tasks: 100,
    },

    isPro(priceId: string) {
      return this.priceId === priceId;
    },

    next: () => {
      return STRIPE_PLANS.premium;
    },
  },

  free: {
    priceId: 'price_1Q7lbwJ9ikhb1lLTKRUTRaH2',
    name: 'Gratuito',
    price: 0,

    quota: {
      tasks: 5,
    },

    isFree(priceId: string) {
      return this.priceId === priceId;
    },

    next: () => {
      return STRIPE_PLANS.pro;
    },
  },
};

const plans = Object.values(STRIPE_PLANS);

export function getPlanByPriceId(stripePriceId: string) {
  const plan = plans.find((plan) => plan.priceId === stripePriceId);

  if (plan) {
    return plan;
  }

  return STRIPE_PLANS.free;
}

export async function getUserPlanDetails(userId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripePriceId: true,
      stripeSubscriptionStatus: true,
    },
  });

  if (!user?.stripePriceId) {
    throw new Error('Usuário não encontrado');
  }

  const tasksCount = await prisma.todo.count({
    where: { userId },
  });

  const plan = getPlanByPriceId(user.stripePriceId);

  return {
    stripePriceId: user.stripePriceId,
    stripeSubscriptionStatus: user.stripeSubscriptionStatus,

    name: plan.name,
    price: plan.price,
    next: plan.next(),

    quota: {
      tasks: {
        max: plan.quota.tasks,
        current: tasksCount,
        usage: tasksCount / plan.quota.tasks,
      },
    },
  };
}
