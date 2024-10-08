import { Metadata } from 'next';

import { auth } from '$libs/auth';

import { ProfileForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Perfil',
};

export default async function SettingsProfilePage() {
  const session = await auth();

  return (
    <>
      <ProfileForm user={session?.user} />
    </>
  );
}
