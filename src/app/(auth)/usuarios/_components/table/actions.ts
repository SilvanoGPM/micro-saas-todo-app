'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { ROLES_SEPARATOR, UserRoleEnum } from '$libs/auth/roles';
import { sendTemplateMail } from '$libs/mail';
import { sendNotifications } from '$libs/notifications/send-notification';
import { prisma } from '$libs/prisma';

import { sendMailSchema, sendNotificationSchema } from './schemas';

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

export const sendNotificationAction = actionsClient.createAction({
  id: 'user.send.notification',
  schema: sendNotificationSchema,

  authorization: {
    roles: [UserRoleEnum.ADMIN],
  },

  async handler({ data }) {
    await sendNotifications({
      userId: data.userId,
      title: data.title,
      body: data.body,
    });
  },
});

export const sendMailAction = actionsClient.createAction({
  id: 'user.send.mail',
  schema: sendMailSchema,

  authorization: {
    roles: [UserRoleEnum.ADMIN],
  },

  async handler({ data }) {
    await sendTemplateMail('contact', {
      to: data.userEmail,
      subject: data.title,
      data: {
        name: data.userName,
        title: data.title,
        message: data.message,
      },
    });
  },
});
