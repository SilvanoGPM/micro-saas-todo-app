'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';
import { ROLES_SEPARATOR, UserRoleEnum } from '$libs/auth/roles';

export const changeRoleAction = actionsClient.createAction({
  id: 'user.change.role',
  schema: z.object({ id: z.string(), role: z.nativeEnum(UserRoleEnum) }),

  authorization: {
    roles: [UserRoleEnum.ADMIN],
  },

  async handler({ data, context }) {
    if (context.user.id === data.id) {
      return { error: 'Você não pode alterar suas próprias permissões' };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
      select: { roles: true },
    });

    if (!user) {
      return { error: 'Usuário não encontrado' };
    }

    const rolesArray = user.roles?.split(ROLES_SEPARATOR) || [];

    // Se o usuário já possui a role, remove-a.
    // Caso contrário, adiciona-a.
    const updatedRoles = rolesArray.includes(data.role)
      ? rolesArray.filter((role) => role !== data.role)
      : [...rolesArray, data.role];

    const roles = updatedRoles.join(ROLES_SEPARATOR);

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        roles,
      },
    });
  },
});
