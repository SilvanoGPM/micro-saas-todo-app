import Stripe from 'stripe';

import { env } from '$env';
import { stripe } from '$libs/stripe';
import {
  handleProccessCheckoutSuccess,
  handleProccesUpdatedSubscription,
} from '$libs/stripe/handlers';

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
      await handleProccesUpdatedSubscription(event.data);
      break;

    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      await handleProccessCheckoutSuccess(event.data);
      break;

    default:
      console.warn('Evento não tratado:', event.type);
  }

  return new Response('Webhook recebido com sucesso', { status: 200 });
}
