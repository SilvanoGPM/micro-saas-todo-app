'use server';

import { actionsClient } from '$libs/actions';
import { prisma } from '$libs/prisma';
import { getUserPlanDetails, STRIPE_PLANS } from '$libs/stripe/products';

import { upsertTodoSchema } from './schema';

export const upsertTodoAction = actionsClient.createAction({
  id: 'todo.upsert',
  schema: upsertTodoSchema,
  revalidate: true,

  async handler({ data, context }) {
    if (data.id) {
      const todo = await prisma.todo.findUnique({
        where: {
          id: data.id,
          userId: context.user.id,
        },
        select: {
          blockWhenCancelSubscription: true,
        },
      });

      if (!todo) {
        return { error: 'Tarefa não encontrada.' };
      }

      if (todo.blockWhenCancelSubscription) {
        const planDetails = await getUserPlanDetails(context.user.id);

        if (STRIPE_PLANS.free.isFree(planDetails.stripePriceId)) {
          return {
            status: 'warning',
            error:
              'Você não pode editar tarefas criadas enquanto você tinha uma assinatura.',
          };
        }
      }

      await prisma.todo.update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          description: data.description,
          completedAt: data.completedAt,
        },
      });

      return;
    }

    const planDetails = await getUserPlanDetails(context.user.id);

    if (planDetails.quota.tasks.current >= planDetails.quota.tasks.max) {
      return {
        status: 'warning',
        error:
          'Limite de tarefas atingido. Assine um plano superior para criar mais tarefas.',
      };
    }

    await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        completedAt: data.completedAt,
        userId: context.user.id,
        blockWhenCancelSubscription:
          planDetails.quota.tasks.current >= STRIPE_PLANS.free.quota.tasks,
      },
    });
  },
});
