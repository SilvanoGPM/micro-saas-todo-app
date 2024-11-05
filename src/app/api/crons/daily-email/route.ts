import { NextRequest } from 'next/server';

import { env } from '$env';
import { httpResponses } from '$libs/api/http-responses';
import { logger } from '$libs/logger';
import { sendTemplateMail } from '$libs/mail';
import { prisma } from '$libs/prisma';

export async function POST(req: NextRequest) {
  logger.info('[Daily Email]: Iniciado');

  const cronKey = await req.text();

  if (cronKey !== env.CRON_KEY) {
    logger.info('[Daily Email]: Chave inválida');

    return httpResponses.unauthorized();
  }

  try {
    logger.info('[Daily Email]: Procurando usuários com tarefas');

    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        _count: {
          select: {
            Todo: {
              where: { completedAt: null },
            },
          },
        },
      },
    });

    logger.info('[Daily Email]: Enviando emails');

    await Promise.allSettled(
      users
        .filter((user) => user._count.Todo > 0 && user.email)
        .map((user) =>
          sendTemplateMail('daily-notification', {
            to: user.email!,
            subject: 'Notificação diária',

            data: {
              name: user.name || 'Amigo',
              todos_count: user._count.Todo,
            },
          }),
        ),
    );

    logger.info('[Daily Email]: Finalizado com sucesso');

    return httpResponses.ok({ success: true });
  } catch {
    logger.info('[Daily Email]: Erro ao enviar emails');

    return httpResponses.badRequest();
  }
}
