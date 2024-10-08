import { Metadata } from 'next';

import { Button } from '$components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { Progress } from '$components/ui/progress';

export const metadata: Metadata = {
  title: 'Assinatura',
};

export default function SettingsBillingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilização do plano</CardTitle>
        <CardDescription>
          Você está utilizando o plano{' '}
          <span className="font-semibold">Gratuito</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="border-y pt-6">
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span>1/5</span>
          <span>20%</span>
        </div>

        <Progress value={20} />
      </CardContent>

      <CardFooter className="flex-col sm:flex-row text-center gap-2 justify-between items-center pt-6">
        <p className="text-sm">
          Para um limite maior, assine o plano{' '}
          <span className="font-semibold">Pro</span>.
        </p>

        <Button>Atualizar para o Pro</Button>
      </CardFooter>
    </Card>
  );
}
