import { PropsWithChildren } from 'react';

import { auth } from '$libs/auth';

import { MainSidebar } from './_components/main-sidebar';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth();

  const user = {
    name: session?.user?.name || 'Usuário',
    email: session?.user?.email || 'user@mail.com',
    avatar: session?.user?.image || '',
  };

  return (
    <div className="h-dvh w-full flex flex-col lg:flex-row">
      <MainSidebar user={user} />
      {children}
    </div>
  );
}
