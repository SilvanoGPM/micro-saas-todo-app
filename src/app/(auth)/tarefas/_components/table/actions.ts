'use server';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';

import { deleteTodoSchema } from './schema';

export const deleteTodoAction = actionsClient.createAction({
  id: 'todo.delete',
  schema: deleteTodoSchema,

  async handler({ data, context }) {
    await prisma.todo.delete({
      where: {
        id: data.id,
        userId: context.user.id,
      },
    });
  },
});
