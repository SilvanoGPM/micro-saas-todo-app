'use server';

import { prisma } from '$libs/prisma';
import { createStripeCustomerIfNotExists } from '$libs/stripe';
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

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
    select: { name: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    });

    await tx.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });
  });

  await createStripeCustomerIfNotExists({
    email: verificationToken.identifier,
    name: user?.name || undefined,
  });

  return redirectToLogin('success', 'Verificação realizada com sucesso');
}
