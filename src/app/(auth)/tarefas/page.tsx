import { Metadata } from 'next';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';

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
        <p>Conteúdo das tarefas</p>
      </DefaultPageSection>
    </DefaultPage>
  );
}
