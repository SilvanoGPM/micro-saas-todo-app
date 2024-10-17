'use server';

import { ROUTES } from '$libs/auth/routes';
import { prisma } from '$libs/prisma';
import { redirectWithFlashMessage } from '$utils/flash-messages';

export async function getUserDetails(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, stripePriceId: true },
  });

  if (!user?.email) {
    return redirectWithFlashMessage({
      message: 'Usuário não encontrado',
      path: ROUTES.private.users.path,
    });
  }

  return user;
}
