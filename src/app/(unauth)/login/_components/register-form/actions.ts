'use server';

import { randomUUID } from 'crypto';

import { hash } from 'bcryptjs';

import { env } from '$env';
import { sendMail } from '$libs/mail';
import { prisma } from '$libs/prisma';
import { getFirstString } from '$utils/strings';

import { registerSchema, RegisterSchema } from './schema';

export async function registerWithCredentials(data: RegisterSchema) {
  try {
    await registerSchema.parseAsync(data);
  } catch {
    return { error: 'Dados inválidos' };
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (userAlreadyExists) {
    return { error: 'E-mail já cadastrado' };
  }

  const hashedPassword = await hash(data.password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const verificationToken = await tx.verificationToken.create({
      data: {
        identifier: data.email,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        token: randomUUID(),
      },
    });

    await sendMail({
      to: data.email,
      subject: 'Bem-vindo ao nosso sistema',
      html: `Olá ${getFirstString(
        data.name,
      )}, Acesse o link para ativar sua conta <a href="${
        env.NEXT_PUBLIC_APP_URL
      }/verify?token=${verificationToken.token}">clicando aqui</a>`,
    });
  });
}
