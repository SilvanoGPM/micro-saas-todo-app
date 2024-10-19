import { LockOpenIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { BackButton } from '$components/dashboard/back';
import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';
import { Button } from '$components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';
import { getCurrentUser } from '$libs/auth/get-current-user';
import { ROUTES } from '$libs/auth/routes';

import { getTodoDetails } from './actions';

const NotesEditor = dynamic(
  () => import('./_components/editor').then((mod) => mod.NotesEditor),
  {
    ssr: false,
  },
);

export const metadata = {
  title: 'Notas',
};

export default async function TodoNotesPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const todo = await getTodoDetails(params.id);

  return (
    <DefaultPage>
      <DefaultPageHeader>
        <BackButton />
        <DefaultPageTitle>Anotações de {todo.title}</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        {user.stripeNotesPaid ? (
          <NotesEditor id={params.id} defaultContent={todo.notes || ''} />
        ) : (
          <Card>
            <CardHeader className="items-center justify-center gap-2">
              <div className="text-foreground border rounded-full p-4">
                <LockOpenIcon className="size-12 " />
              </div>
              <CardTitle>Desbloqueie as anotações</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              <p className="text-center text-muted-foreground">
                Nosso sistema de anotações simplifica sua organização diária,
                permitindo criar e acessar notas de forma rápida e prática, em
                qualquer dispositivo. Com uma interface intuitiva, você ganha
                mais foco e produtividade, seja no trabalho, estudos ou projetos
                pessoais.
              </p>

              <div>
                <Button asChild>
                  <Link href={ROUTES.private.billing.path}>
                    Deblosquear anotações
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DefaultPageSection>
    </DefaultPage>
  );
}
