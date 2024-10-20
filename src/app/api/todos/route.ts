import { Prisma } from '@prisma/client';

import { HTTP_KEYS } from '$config';
import { apiClient } from '$libs/api';
import { isAdmin } from '$libs/auth/roles';
import { byFieldsContaining, getPrismaPagination, prisma } from '$libs/prisma';
import { STRIPE_PLANS } from '$libs/stripe/products';
import { logger } from '$libs/logger';

export const dynamic = 'force-dynamic';

export const GET = apiClient.createGetRoute({
  id: HTTP_KEYS.todo.list,

  async handler({ searchParams, user, httpResponses }) {
    logger.info('[GET /todos]: Iniciado');

    const userId = isAdmin(user)
      ? searchParams.get('userId') || user.id
      : user.id;

    const where: Prisma.TodoWhereInput = {
      OR: byFieldsContaining(['title', 'description'], searchParams.search),
      userId,
    };

    const orderBy = STRIPE_PLANS.free.isFree(
      searchParams.get('userStripePriceId') || '',
    )
      ? [{ blockWhenCancelSubscription: 'asc' as const }, searchParams.sort]
      : [searchParams.sort];

    const [data, total] = await Promise.all([
      prisma.todo.findMany({
        ...getPrismaPagination(searchParams.page, searchParams.size),
        orderBy,
        where,

        include: {
          user: { select: { id: true } },
        },
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
