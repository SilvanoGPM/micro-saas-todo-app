import { Session } from 'next-auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { pluralize } from '$utils/formatters';

import { getItensToDisable } from './actions';
import { CancelSubscriptionModal } from './modal';

export interface CancelSubscriptionProps {
  user: NonNullable<Session['user']>;
}

export async function CancelSubscription({ user }: CancelSubscriptionProps) {
  const { todos } = await getItensToDisable(user.id);

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Cancelar assinatura</CardTitle>
        <CardDescription>
          Todos os itens que excederem seus limites e foram criados após
          realizar a assinatura, ficarão inacessíveis. Realize um backup antes
          de cancelar o plano.
        </CardDescription>
      </CardHeader>

      <CardContent className="border-y border-b-destructive pt-6">
        <div className="w-32 p-4 border rounded flex items-center justify-center text-sm">
          {pluralize(todos, 'tarefa')}
        </div>
      </CardContent>

      <CardFooter className="justify-end pt-6 bg-destructive/20">
        <CancelSubscriptionModal />
      </CardFooter>
    </Card>
  );
}
