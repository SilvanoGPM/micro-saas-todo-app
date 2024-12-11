'use client';

import { CheckIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '$components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '$components/ui/card';
import { ROUTES } from '$libs/auth/routes';
import { STRIPE_PLANS } from '$libs/stripe/products';
import { cn } from '$utils/cn';
import { formatPrice } from '$utils/formatters';

const plans = [
  {
    id: STRIPE_PLANS.free.priceId,
    name: STRIPE_PLANS.free.name,
    price: STRIPE_PLANS.free.price,
    advantages: [
      `Até ${STRIPE_PLANS.free.quota.tasks} tarefas`,
      'E-mails diário',
      'Notificações diárias',
      'Suporte por e-mail',
    ],
  },
  {
    best: true,
    id: STRIPE_PLANS.pro.priceId,
    name: STRIPE_PLANS.pro.name,
    price: STRIPE_PLANS.pro.price,
    advantages: [
      `Até ${STRIPE_PLANS.pro.quota.tasks} tarefas`,
      'E-mail diário',
      'Notificações diárias',
      'Suporte por e-mail',
    ],
  },
  {
    id: STRIPE_PLANS.premium.priceId,
    name: STRIPE_PLANS.premium.name,
    price: STRIPE_PLANS.premium.price,
    advantages: [
      'Tarefas ilimitadas',
      'E-mail diário',
      'Notificações diárias',
      'Suporte por e-mail',
    ],
  },
];

export function LandingPagePricing() {
  return (
    <section className="w-full max-w-6xl mx-auto flex-1 px-4 flex flex-col items-center text-center">
      <div>
        <h3 className="uppercase text-[#9c40ff] text-lg tracking-widest font-semibold">
          Preços
        </h3>

        <p className="text-balance tracking-tight text-3xl md:text-4xl font-bold">
          Escolha o plano certo para você.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-8 w-full">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'overflow-hidden relative w-full max-w-[350px] bg-background',
              {
                'border-[#9c40ff]': plan.best,
              },
            )}
          >
            {plan.best && (
              <div className="absolute top-0 right-0">
                <div className="flex gap-1 bg-[#9c40ff] text-white text-xs font-semibold py-1 px-2 rounded-bl-md">
                  <HeartIcon className="size-4 fill-current" />
                  Mais escolhido
                </div>
              </div>
            )}

            <CardHeader className="text-center w-full">
              <h4 className="text-xl font-semibold text-balance uppercase opacity-50">
                {plan.name}
              </h4>

              <div>
                <div className="flex gap-1 items-center justify-center">
                  <span className="font-black text-3xl">
                    {formatPrice(plan.price)}
                  </span>{' '}
                  <span className="font-semibold text-lg opacity-75">
                    / mês
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Cobrado mensalmente
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="border-b pb-4">
                {plan.advantages.map((advantage) => (
                  <li key={advantage} className="flex items-center gap-1">
                    <CheckIcon className="text-[#9c40ff]" /> {advantage}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={ROUTES.private.billing.path}>Começar com esse</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
