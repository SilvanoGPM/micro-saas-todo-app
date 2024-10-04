import { Metadata } from 'next';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';

export const metadata: Metadata = {
  title: 'Configurações',
};

export default function SettingsPage() {
  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>Configurações</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <p>Conteúdo da página de configurações</p>
      </DefaultPageSection>
    </DefaultPage>
  );
}
