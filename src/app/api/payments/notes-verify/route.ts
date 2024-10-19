import { apiClient } from '$libs/api';
import { prisma } from '$libs/prisma';

export const dynamic = 'force-dynamic';

export const GET = apiClient.createGetRoute({
  id: 'payments.notes-verify',

  async handler({ searchParams, user, httpResponses }) {
    if (searchParams.get('email') !== user.email) {
      return httpResponses.ok({ success: true });
    }

    const recentUser = await prisma.user.findFirst({
      where: {
        email: searchParams.get('email'),
      },
      select: {
        stripeNotesPaid: true,
      },
    });

    return httpResponses.ok({ success: recentUser?.stripeNotesPaid });
  },
});
