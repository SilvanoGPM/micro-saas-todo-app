import { Metadata } from 'next';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';

import { TodosTable } from './_components/table';

export const metadata: Metadata = {
  title: 'Tarefas',
};

export default function DashboardPage() {
  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>Tarefas</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <TodosTable />
      </DefaultPageSection>
    </DefaultPage>
  );
}
