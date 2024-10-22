import { HTTP_KEYS } from '$config';
import { apiClient } from '$libs/api';
import { UserRoleEnum } from '$libs/auth/roles';
import { prisma } from '$libs/prisma';

export const dynamic = 'force-dynamic';

export const GET = apiClient.createGetRoute({
  id: HTTP_KEYS.user.get,

  authorization: {
    roles: [UserRoleEnum.ADMIN],
  },

  async handler({ pathParams, httpResponses }) {
    const user = await prisma.user.findUnique({
      where: {
        id: pathParams.id,
      },
    });

    if (!user) {
      return httpResponses.notFound('Usuário não encontrado.');
    }

    return httpResponses.ok(user);
  },
});
