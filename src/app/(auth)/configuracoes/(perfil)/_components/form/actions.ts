'use server';

import { actionsClient } from '$libs/actions';
import { unstable_update } from '$libs/auth';
import { prisma } from '$libs/prisma';

import { profileSchema } from './schema';

export const updateProfileAction = actionsClient.createAction({
  id: 'profile.update',
  schema: profileSchema,

  async handler({ data, context }) {
    await prisma.user.update({
      where: { id: context.user.id },
      data: {
        name: data.name,
      },
    });

    await unstable_update({ user: { ...context.user, name: data.name } });
  },
});
