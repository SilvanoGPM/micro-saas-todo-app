import { NextRequest } from 'next/server';

import { env } from '$env';
import { httpResponses } from '$libs/api/http-responses';
import { sendNotifications } from '$libs/notifications/send-notification';
import { prisma } from '$libs/prisma';
import { pluralize } from '$utils/formatters';
import { logger } from '$libs/logger';

export async function POST(req: NextRequest) {
  logger.info('[Daily Notification]: Iniciado');

  const cronKey = await req.text();

  if (cronKey !== env.CRON_KEY) {
    logger.error('[Daily Notification]: Chave inválida');

    return httpResponses.unauthorized();
  }

  try {
    logger.info('[Daily Notification]: Procurando usuários com tarefas');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        _count: {
          select: {
            Todo: {
              where: { completedAt: null },
            },
          },
        },
      },
    });

    logger.info('[Daily Notification]: Enviando notificações');

    await Promise.allSettled(
      users
        .filter((user) => user._count.Todo > 0)
        .map((user) =>
          sendNotifications({
            userId: user.id,
            title: 'Notificação diária',

            body: `Você tem ${pluralize(
              user._count.Todo,
              'tarefa',
            )} para concluir.`,
          }),
        ),
    );

    logger.info('[Daily Notification]: Finalizado com sucesso');

    return httpResponses.ok({ success: true });
  } catch {
    logger.error('[Daily Notification]: Erro ao enviar notificações');

    return httpResponses.badRequest();
  }
}
