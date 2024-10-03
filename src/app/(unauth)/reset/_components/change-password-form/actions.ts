'use server';

import { hash } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '$libs/prisma';
import { redirectToLogin } from '$utils/redirect-to-login';

const schema = z.object({
  token: z.string(),
  newPassword: z.string(),
});

export async function changePassword(data: z.infer<typeof schema>) {
  const { token, newPassword } = await schema.parseAsync(data);

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    select: { identifier: true },
  });

  if (!verificationToken) {
    return redirectToLogin('warning', 'Código inválido');
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    });

    await tx.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date(), password: hashedPassword },
    });
  });

  return redirectToLogin('success', 'Senha alterada com sucesso');
}
