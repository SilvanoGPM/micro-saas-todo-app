import { PropsWithChildren } from 'react';

import { getCurrentUser } from '$libs/auth/get-current-user';
import { NotificationsModal } from '$components/dashboard/notifications-modal';

import { MainSidebar } from './_components/main-sidebar';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="h-dvh w-full flex flex-col lg:flex-row">
        <MainSidebar user={user} />
        {children}
      </div>

      <NotificationsModal />
    </>
  );
}
