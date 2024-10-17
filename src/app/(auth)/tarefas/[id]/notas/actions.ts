'use server';

import { getCurrentUser } from '$libs/auth/get-current-user';
import { ROUTES } from '$libs/auth/routes';
import { prisma } from '$libs/prisma';
import { redirectWithFlashMessage } from '$utils/flash-messages';

export async function getTodoDetails(id: string) {
  const user = await getCurrentUser();

  const todo = await prisma.todo.findUnique({
    where: { id, userId: user.id },
    select: {
      title: true,
      notes: true,
    },
  });

  if (!todo) {
    return redirectWithFlashMessage({
      path: ROUTES.private.home.path,
      message: 'Tarefa não encontrada',
      type: 'warning',
    });
  }

  return todo;
}
