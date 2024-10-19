'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { upgradePlan } from '$libs/stripe/payments';

export const upgradePlanAction = actionsClient.createAction({
  id: 'checkout.upgrade.plan',
  schema: z.object({ priceId: z.string() }),

  async handler({ context, data }): Promise<{ url: string }> {
    const checkoutSession = await upgradePlan(context.user.email, data.priceId);

    if (!checkoutSession?.url) {
      return actionsClient.error('Erro ao gerar sessão de checkout');
    }

    return { url: checkoutSession.url };
  },
});
