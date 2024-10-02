'use server';

import { randomUUID } from 'crypto';

import { env } from '$env';
import { sendMail } from '$libs/nodemailer';
import { prisma } from '$libs/prisma';
import { getFirstString } from '$utils/strings';

import { forgotPasswordSchema, ForgotPasswordSchema } from './schema';

export async function forgotPasswordWithCredentials(
  data: ForgotPasswordSchema,
) {
  try {
    await forgotPasswordSchema.parseAsync(data);
  } catch {
    return { error: 'Dados inválidos' };
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, name: true },
  });

  if (!user) {
    return { error: 'E-mail não encontrado' };
  }

  const userName = user.name ? getFirstString(user.name) : 'usuário';

  try {
    await prisma.$transaction(async (tx) => {
      const verificationRequest = await tx.verificationRequest.create({
        data: {
          identifier: data.email,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
          token: randomUUID(),
        },
      });

      await sendMail({
        to: data.email,
        subject: 'Recupere sua senha',
        html: `Olá ${userName}, acesse o link para recuperar sua senha <a href="${env.NEXT_PUBLIC_APP_URL}/reset?token=${verificationRequest.token}">clicando aqui</a>`,
      });
    });
  } catch (error) {
    return { error: 'Não foi enviar e-mail, por favor tente novamente.' };
  }
}
