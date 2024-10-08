import { PropsWithChildren } from 'react';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';

import { SettingsSidebar } from './_components/settings-sidebar';

export default async function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>Configurações</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection className="flex flex-col gap-8 md:flex-row">
        <SettingsSidebar />

        <div className="flex-1 flex flex-col">{children}</div>
      </DefaultPageSection>
    </DefaultPage>
  );
}
