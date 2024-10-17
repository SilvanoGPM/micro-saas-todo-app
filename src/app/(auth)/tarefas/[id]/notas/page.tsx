import dynamic from 'next/dynamic';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';
import { BackButton } from '$components/dashboard/back';

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
  const todo = await getTodoDetails(params.id);

  return (
    <DefaultPage>
      <DefaultPageHeader>
        <BackButton />
        <DefaultPageTitle>Anotações de {todo.title}</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <NotesEditor id={params.id} defaultContent={todo.notes || ''} />
      </DefaultPageSection>
    </DefaultPage>
  );
}
