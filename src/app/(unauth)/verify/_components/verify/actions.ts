'use server';

import { prisma } from '$libs/prisma';
import { redirectToLogin } from '$utils/redirect-to-login';

export async function verifyToken(token?: string) {
  if (!token) {
    return redirectToLogin('warning', 'Código inválido');
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    select: { identifier: true, expires: true },
  });

  if (!verificationToken) {
    return redirectToLogin('warning', 'Código inválido');
  }

  if (verificationToken.expires < new Date()) {
    return redirectToLogin('warning', 'Código expirado');
  }

  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    });

    await tx.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });
  });

  return redirectToLogin('success', 'Verificação realizada com sucesso');
}
