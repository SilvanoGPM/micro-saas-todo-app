import Stripe from 'stripe';

import { env } from '$env';
import { handleProccessWebhookUpdatedSubscription, stripe } from '$libs/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('⚠️ Erro ao verificar webhook do stripe:', err.message);

    return new Response(err.message, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleProccessWebhookUpdatedSubscription(event.data);
      break;

    default:
      console.warn('Evento não tratado:', event.type);
  }

  return new Response('Webhook recebido com sucesso', { status: 200 });
}
