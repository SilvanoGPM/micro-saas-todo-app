import { Metadata } from 'next';

import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';
import { getCurrentUser } from '$libs/auth/get-current-user';

import { UsersTable } from './_components/table';

export const metadata: Metadata = {
  title: 'Usuários',
};

export default async function UsersPage() {
  const user = await getCurrentUser();

  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>Usuários</DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <UsersTable user={user} />
      </DefaultPageSection>
    </DefaultPage>
  );
}
