/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod';
import { Session } from 'next-auth';

import { auth } from '$libs/auth';
import { errorToJson } from '$utils/handle-error';
import { Replace } from '$utils/replace';

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

export interface CreateActionParams<
  S,
  R,
  C extends object,
  P extends boolean = true,
> {
  id: string;
  schema: z.ZodSchema<S>;
  handler: (params: P extends true ? HandlerParams<S, C> : S) => Promise<R>;
  withContext?: P;
}

export interface ActionClientOptions {
  afterActionExecute?: (params: {
    action: { id: string; data: unknown };
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

  createAction<S, R, P extends boolean = true>({
    id,
    schema,
    handler,
    withContext = true as P,
  }: CreateActionParams<S, R, Awaited<ReturnType<typeof this.getContext>>, P>) {
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
          const context = await this.getContext();

          result = await handler({ data, context } as any);
        } else {
          result = await handler(data as any);
        }

        if (result && typeof result === 'object' && 'error' in result) {
          return { data: null, error: result.error };
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

  private async getContext() {
    const session = await auth();

    if (!session || !session.user || !session.user.id || !session.user.email) {
      throw new Error('Usuário não autenticado');
    }

    return {
      user: session.user as Replace<
        Session['user'],
        { id: string; email: string }
      >,
    };
  }
}

export const actionsClient = new ActionsClient({
  afterActionExecute: async ({ action, error }) => {
    if (error) {
      console.error(`Erro ao executar action ${action.id}`, error);
    }
  },
});
