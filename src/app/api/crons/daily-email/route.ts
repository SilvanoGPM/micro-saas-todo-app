import { NextRequest } from 'next/server';

import { env } from '$env';
import { httpResponses } from '$libs/api/http-responses';
import { ROUTES } from '$libs/auth/routes';
import { sendMail } from '$libs/mail';
import { prisma } from '$libs/prisma';
import { pluralize } from '$utils/formatters';
import { logger } from '$libs/logger';

export async function POST(req: NextRequest) {
  logger.info('[Daily Email Cron]: Iniciado');

  const cronKey = await req.text();

  if (cronKey !== env.CRON_KEY) {
    logger.info('[Daily Email Cron]: Chave inválida');

    return httpResponses.unauthorized();
  }

  try {
    logger.info('[Daily Email Cron]: Procurando usuários com tarefas');

    const users = await prisma.user.findMany({
      select: {
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

    logger.info('[Daily Email Cron]: Enviando emails');

    await Promise.allSettled(
      users
        .filter((user) => user._count.Todo > 0 && user.email)
        .map((user) =>
          sendMail({
            to: user.email!,
            subject: 'Notificação diária',

            html: `<p>Você tem ${pluralize(
              user._count.Todo,
              'tarefa',
            )} para concluir. <br></br> Clique <a href="${
              process.env.NEXT_PUBLIC_APP_URL
            }${ROUTES.private.home.path}">aqui</a> para ver suas tarefas.</p>`,
          }),
        ),
    );

    logger.info('[Daily Email Cron]: Finalizado com sucesso');

    return httpResponses.ok({ success: true });
  } catch {
    logger.info('[Daily Email Cron]: Erro ao enviar emails');

    return httpResponses.badRequest();
  }
}
