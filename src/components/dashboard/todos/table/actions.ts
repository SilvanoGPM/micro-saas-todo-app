'use server';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';

import { toggleCompletedAtTodoSchema } from './schema';

export const toggleCompletedAtTodoAction = actionsClient.createAction({
  id: 'todo.toggleCompletedAt',
  schema: toggleCompletedAtTodoSchema,

  async handler({ data, context }) {
    const todo = await prisma.todo.findUnique({
      where: {
        id: data.id,
        userId: context.user.id,
      },
      select: { completedAt: true },
    });

    if (!todo) {
      return { error: 'Tarefa não encontrada' };
    }

    await prisma.todo.update({
      where: {
        id: data.id,
      },
      data: {
        completedAt: todo.completedAt ? null : new Date(),
      },
    });
  },
});
