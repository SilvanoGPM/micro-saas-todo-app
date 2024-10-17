import { apiClient } from '$libs/api';
import { prisma } from '$libs/prisma';
import { HTTP_KEYS } from '$config';

export const dynamic = 'force-dynamic';

export const GET = apiClient.createGetRoute({
  id: HTTP_KEYS.todo.get,

  async handler({ pathParams, user, httpResponses }) {
    const todo = await prisma.todo.findUnique({
      where: {
        id: pathParams.id,
        userId: user.id,
      },

      include: {
        user: { select: { id: true } },
      },
    });

    if (!todo) {
      return httpResponses.notFound('Tarefa não encontrada.');
    }

    return httpResponses.ok(todo);
  },
});
