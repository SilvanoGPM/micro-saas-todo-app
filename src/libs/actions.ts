/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '$libs/auth';
import { errorToJson } from '$utils/handle-error';

import { hasAllRoles, hasSomeRoles, isAdmin, UserRole } from './auth/roles';

export interface Action<S = any, R = any> {
  id: string;
  schema: z.ZodSchema;
  fn: (
    data: z.infer<z.ZodSchema<S>>,
  ) => Promise<{ data: R | null; error: unknown | null }>;
}

export interface HandlerParams<S, C extends object> {
  data: S;
  context: C;
}

export interface CreateActionAuthorization {
  mode?: 'some' | 'all';
  roles: UserRole[];
  bypassWhenIsAdmin?: boolean;
}

export interface CreateActionParams<
  S,
  R,
  C extends object,
  P extends boolean = true,
> {
  id: string;
  schema: z.ZodSchema<S>;
  revalidate?: true | string;
  handler: (
    params: P extends true
      ? HandlerParams<S, C>
      : Omit<HandlerParams<S, C>, 'context'>,
  ) => Promise<R>;
  withContext?: P;

  authorization?: CreateActionAuthorization;
}

export interface ActionClientOptions {
  afterActionExecute?: (params: {
    action: { id: string; data: unknown };
    user?: Session['user'];
    error: unknown | null;
  }) => void;
}

class ActionsClient {
  private actions: Action[] = [];
  private afterActionExecute: ActionClientOptions['afterActionExecute'];

  constructor({ afterActionExecute }: ActionClientOptions = {}) {
    this.afterActionExecute = afterActionExecute;
  }

  getAction<S, R>(id: string) {
    const action = this.actions.find((action) => action.id === id);

    if (!action) {
      throw new Error(`Nenhuma action com id ${id} encontrada!`);
    }

    return action as Action<S, R>;
  }

  createAction<S, R, P extends boolean = true>(
    actionParams: P extends true
      ? CreateActionParams<S, R, Awaited<ReturnType<typeof this.getContext>>, P>
      : Omit<
          CreateActionParams<
            S,
            R,
            Awaited<ReturnType<typeof this.getContext>>,
            P
          >,
          'authorization'
        >,
  ) {
    const {
      id,
      schema,
      handler,
      revalidate,
      withContext = true as P,
    } = actionParams;

    let user: Session['user'] | undefined;

    const actionAlreadyExists = this.actions.some((action) => action.id === id);

    if (actionAlreadyExists) {
      throw new Error(`Action com id ${id} já existe!`);
    }

    const fn = async (data: z.infer<typeof schema>) => {
      let ocurredError: unknown | null = null;

      try {
        await schema.parseAsync(data);

        let result: R;

        if (withContext) {
          const { authorization } = actionParams as CreateActionParams<
            S,
            R,
            Awaited<ReturnType<typeof this.getContext>>,
            P
          >;

          const context = await this.getContext(authorization);

          user = context.user;

          result = await handler({ data, context } as any);
        } else {
          result = await handler(data as any);
        }

        if (result && typeof result === 'object' && 'error' in result) {
          return {
            data: null,
            error: result.error,
            status: (result as any)?.status || 'error',
          };
        }

        if (revalidate) {
          revalidatePath(revalidate === true ? '/' : revalidate);
        }

        return { data: result, error: null };
      } catch (error) {
        ocurredError = error;

        if (error instanceof z.ZodError) {
          return {
            data: null,
            error: error.flatten(),
          };
        }

        if (error instanceof Error) {
          return {
            data: null,
            error: errorToJson(error),
          };
        }

        return {
          data: null,
          error: 'Aconteceu um erro inesperado',
        };
      } finally {
        this.afterActionExecute?.({
          action: { id, data },
          error: ocurredError,
          user,
        });
      }
    };

    this.actions.push({
      id,
      schema,
      fn,
    });

    return fn;
  }

  error(message: string) {
    return { error: message } as any;
  }

  emptySchema() {
    return z
      .object({})
      .optional()
      .or(z.undefined().optional())
      .or(z.null().optional())
      .or(z.void().optional());
  }

  private async getContext(
    authorization: CreateActionAuthorization = { roles: [] },
  ) {
    const session = await auth();

    if (!session || !session.user || !session.user.id || !session.user.email) {
      throw new Error('Usuário não autenticado');
    }

    const user = session.user;

    authorization.mode = authorization.mode ?? 'some';

    authorization.bypassWhenIsAdmin = authorization.bypassWhenIsAdmin ?? true;

    const hasRoles = authorization.mode === 'some' ? hasSomeRoles : hasAllRoles;

    const allowUser =
      authorization.roles.length === 0 ||
      hasRoles(user, ...authorization.roles) ||
      (authorization.bypassWhenIsAdmin && isAdmin(user));

    if (!allowUser) {
      throw new Error('Acesso proibido');
    }

    return {
      user,
      authorization,
    };
  }
}

export const actionsClient = new ActionsClient({
  afterActionExecute: async ({ action, error, user }) => {
    if (error) {
      Sentry.captureException(error, {
        user: { id: user?.id, email: user?.email, username: user?.name || '' },
      });

      console.error(`Erro ao executar action ${action.id}\n`, error);
    }
  },
});
