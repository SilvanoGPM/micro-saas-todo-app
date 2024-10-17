'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';
import { ROUTES } from '$libs/auth/routes';

export const saveChangesAction = actionsClient.createAction({
  id: 'todo.notes.editor.save-changes',
  schema: z.object({ id: z.string(), content: z.string() }),
  revalidate: ROUTES.private.home.path,

  async handler({ data, context }) {
    const todo = await prisma.todo.findUnique({
      where: { id: data.id, userId: context.user.id },
      select: { id: true },
    });

    if (!todo) {
      return actionsClient.error('Tarefa não encontrada');
    }

    await prisma.todo.update({
      where: { id: data.id },
      data: { notes: data.content },
    });
  },
});
