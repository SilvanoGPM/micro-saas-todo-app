import { Metadata } from 'next';

import { SubscribeButton } from '$components/dashboard/subscribe-button';
import { OpaqueBadge } from '$components/opaque-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { getCurrentUser } from '$libs/auth/get-current-user';
import { getUserPlanDetails, STRIPE_PLANS } from '$libs/stripe/products';
import { formatPrice } from '$utils/formatters';

import { CancelSubscription } from './_components/cancel-subscription';
import { Notes } from './_components/notes';
import { QuotaUsed } from './_components/quota-used';
import { ptBrStripeSubscriptionStatus } from './ptbr-status';

export const metadata: Metadata = {
  title: 'Assinatura',
};

export default async function SettingsBillingPage() {
  const user = await getCurrentUser();
  const planDetails = await getUserPlanDetails(user.id);

  const ptBrStatus =
    ptBrStripeSubscriptionStatus[
      planDetails.stripeSubscriptionStatus as keyof typeof ptBrStripeSubscriptionStatus
    ];

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Utilização do plano</CardTitle>
          <CardDescription>
            Você está utilizando o plano{' '}
            <span className="font-semibold">{planDetails.name}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="border-y pt-6">
          <QuotaUsed
            name="Tarefas"
            current={planDetails.quota.tasks.current}
            max={planDetails.quota.tasks.max}
            usage={planDetails.quota.tasks.usage}
          />
        </CardContent>

        {planDetails.next && (
          <CardFooter className="flex-col sm:flex-row text-center gap-2 justify-between items-center pt-6">
            <p className="text-sm">
              Para um limite maior, assine o plano{' '}
              <span className="font-semibold">{planDetails.next.name}</span>.
            </p>

            <SubscribeButton priceId={planDetails.next.priceId}>
              Assinar por {formatPrice(planDetails.next.price)}/mês
            </SubscribeButton>
          </CardFooter>
        )}
      </Card>

      <Notes user={user} />

      {!STRIPE_PLANS.free.isFree(planDetails.stripePriceId) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Status da assinatura</CardTitle>
            </CardHeader>

            <CardContent className="border-y pt-6">
              <div className="flex gap-2 items-center">
                <span>Seu status:</span>
                <OpaqueBadge className="w-fit px-4" color={ptBrStatus.color}>
                  {ptBrStatus.label}
                </OpaqueBadge>
              </div>
            </CardContent>
          </Card>

          <CancelSubscription user={user} />
        </>
      )}
    </div>
  );
}
