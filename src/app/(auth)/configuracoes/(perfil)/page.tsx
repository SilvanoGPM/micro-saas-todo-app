import { Metadata } from 'next';

import { getCurrentUser } from '$libs/auth/get-current-user';

import { ProfileForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Perfil',
};

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();

  return (
    <>
      <ProfileForm user={user} />
    </>
  );
}
