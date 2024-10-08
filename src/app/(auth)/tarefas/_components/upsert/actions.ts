'use server';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';

import { upsertTodoSchema } from './schema';

export const upsertTodoAction = actionsClient.createAction({
  id: 'todo.upsert',
  schema: upsertTodoSchema,

  async handler({ data, context }) {
    if (data.id) {
      const todo = await prisma.todo.findUnique({
        where: {
          id: data.id,
          userId: context.user.id,
        },
      });

      if (!todo) {
        return { error: 'Tarefa não encontrada.' };
      }

      await prisma.todo.update({
        where: {
          id: todo.id,
        },
        data: {
          title: data.title,
          description: data.description,
          completedAt: data.completedAt,
        },
      });

      return;
    }

    await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        completedAt: data.completedAt,
        userId: context.user.id,
      },
    });
  },
});
