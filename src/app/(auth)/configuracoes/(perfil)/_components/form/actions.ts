'use server';

import { z } from 'zod';

import { actionsClient } from '$libs/actions';
import { unstable_update } from '$libs/auth';
import { prisma } from '$libs/prisma';

import { profileSchema } from './schema';

const updateProfileSchema = profileSchema.omit({ avatar: true }).extend({
  image: z.array(z.string()).optional(),
});

export const updateProfileAction = actionsClient.createAction({
  id: 'profile.update',
  schema: updateProfileSchema,

  async handler({ data, context }) {
    const image = data.image?.[0];

    await prisma.user.update({
      where: { id: context.user.id },
      data: {
        name: data.name,
        image,
      },
    });

    await unstable_update({
      user: { ...context.user, name: data.name, image },
    });
  },
});
