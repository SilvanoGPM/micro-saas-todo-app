import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

import { auth } from '.';

export async function getCurrentUser(): Promise<Session['user']> {
  const session = await auth();

  if (!session?.user) {
    return notFound();
  }

  return session.user;
}
