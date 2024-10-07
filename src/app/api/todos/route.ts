import { Prisma } from '@prisma/client';

import { apiClient } from '$libs/api';
import { byFieldsContaining, getPrismaPagination, prisma } from '$libs/prisma';
import { HTTP_KEYS } from '$config';

export const GET = apiClient.createGetRoute({
  id: HTTP_KEYS.todo.list,

  async handler({ searchParams, user, httpResponses }) {
    const where: Prisma.TodoWhereInput = {
      OR: byFieldsContaining(['title', 'description'], searchParams.search),
      userId: user.id,
    };

    const [data, total] = await Promise.all([
      prisma.todo.findMany({
        ...getPrismaPagination(searchParams.page, searchParams.size),
        orderBy: searchParams.sort,
        where,
      }),
      prisma.todo.count({ where }),
    ]);

    return httpResponses.ok({
      data,
      total,
      page: searchParams.page,
      size: searchParams.size,
    });
  },
});
