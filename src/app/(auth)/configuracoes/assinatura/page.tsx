import { Metadata } from 'next';

import { SubscribeButton } from '$components/subscribe-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { Progress } from '$components/ui/progress';
import { STRIPE_PRODUCTS } from '$config';
import { formatPrice } from '$utils/formatters';
import { auth } from '$libs/auth';
import { getUserProductDetails } from '$libs/stripe';

export const metadata: Metadata = {
  title: 'Assinatura',
};

export default async function SettingsBillingPage() {
  const session = await auth();
  const productDetails = await getUserProductDetails(session?.user.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilização do plano</CardTitle>
        <CardDescription>
          Você está utilizando o plano{' '}
          <span className="font-semibold">{productDetails.name}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="border-y pt-6">
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span>
            {productDetails.quota.tasks.current}/
            {productDetails.quota.tasks.max}
          </span>
          <span>{productDetails.quota.tasks.usage}%</span>
        </div>

        <Progress value={productDetails.quota.tasks.usage} />
      </CardContent>

      <CardFooter className="flex-col sm:flex-row text-center gap-2 justify-between items-center pt-6">
        <p className="text-sm">
          Para um limite maior, assine o plano{' '}
          <span className="font-semibold">{STRIPE_PRODUCTS.pro.name}</span>.
        </p>

        <SubscribeButton>
          Assinar por {formatPrice(STRIPE_PRODUCTS.pro.price)}/mês
        </SubscribeButton>
      </CardFooter>
    </Card>
  );
}
