import { Prisma, User } from '@prisma/client';

import { HTTP_KEYS } from '$config';
import { apiClient } from '$libs/api';
import { byFieldsContaining, getPrismaPagination, prisma } from '$libs/prisma';
import { UserRoleEnum } from '$libs/auth/roles';

export const dynamic = 'force-dynamic';

export const GET = apiClient.createGetRoute({
  id: HTTP_KEYS.user.list,

  authorization: {
    roles: [UserRoleEnum.ADMIN],
  },

  async handler({ searchParams, httpResponses }) {
    const where: Prisma.UserWhereInput = {
      OR: byFieldsContaining<User>(
        ['name', 'email', 'roles'],
        searchParams.search,
      ),
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        ...getPrismaPagination(searchParams.page, searchParams.size),
        orderBy: searchParams.sort,
        where,
      }),
      prisma.user.count({ where }),
    ]);

    return httpResponses.ok({
      data,
      total,
      page: searchParams.page,
      size: searchParams.size,
    });
  },
});
