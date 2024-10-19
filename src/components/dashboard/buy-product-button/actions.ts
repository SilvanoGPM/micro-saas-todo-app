'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { buyProduct } from '$libs/stripe/payments';

export const buyProductAction = actionsClient.createAction({
  id: 'checkout.buy.product',
  schema: z.object({
    priceId: z.string(),
    poolingName: z.string().optional(),
    anchor: z.string().optional(),
  }),

  async handler({ context, data }): Promise<{ url: string }> {
    const checkoutSession = await buyProduct({
      priceId: data.priceId,
      userEmail: context.user.email,
      poolingName: data.poolingName,
      anchor: data.anchor,
    });

    if (!checkoutSession?.url) {
      return actionsClient.error('Erro ao gerar sessão de checkout');
    }

    return { url: checkoutSession.url };
  },
});
