'use server';

import { actionsClient } from '$libs/actions';
import { generateCheckoutSession } from '$libs/stripe';

export const generateCheckoutSessionAction = actionsClient.createAction({
  id: 'session.checkout.create',
  schema: actionsClient.emptySchema(),

  async handler({ context }): Promise<{ url: string }> {
    const checkoutSession = await generateCheckoutSession(context.user.email);

    if (!checkoutSession?.url) {
      return actionsClient.error('Erro ao gerar sessão de checkout');
    }

    return { url: checkoutSession.url };
  },
});
