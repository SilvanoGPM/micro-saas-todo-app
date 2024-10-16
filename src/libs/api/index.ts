import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { hasAllRoles, hasSomeRoles, isAdmin, UserRole } from '$libs/auth/roles';

import { auth } from '../auth';

import { getRequestSearchParams } from './get-request-search-params';
import { httpResponses } from './http-responses';

export interface HandlerParams {
  request: NextRequest;
  user: Required<NonNullable<Session['user']>>;
  searchParams: ReturnType<typeof getRequestSearchParams>;
  pathParams: { [key: string]: string };
  httpResponses: typeof httpResponses;

  authorization: {
    mode?: 'some' | 'all';
    roles: UserRole[];
    bypassWhenIsAdmin?: boolean;
  };
}

export interface CreateGetRouteParams<P extends boolean = true> {
  id: string;
  handler: (
    params: P extends true
      ? HandlerParams
      : Omit<HandlerParams, 'user' | 'authorization'>,
  ) => Promise<NextResponse>;
  withAuth?: P;

  authorization?: HandlerParams['authorization'];

  errorMessage?: string;
}

export interface ApiRoute {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ApiClientOptions {
  afterRouteExecute?: (params: {
    route: {
      id: string;
      method: ApiRoute['method'];
      path: string;
      data: unknown;
    };

    user?: Session['user'];
    error: unknown | null;
  }) => void;
}

class ApiClient {
  private routes: ApiRoute[] = [];

  private afterRouteExecute: ApiClientOptions['afterRouteExecute'];

  constructor({ afterRouteExecute }: ApiClientOptions = {}) {
    this.afterRouteExecute = afterRouteExecute;
  }

  createGetRoute<P extends boolean = true>(
    routeParams: P extends true
      ? CreateGetRouteParams<P>
      : Omit<CreateGetRouteParams<P>, 'authorization'>,
  ) {
    const {
      id,
      handler,
      errorMessage = 'Não foi possível encontrar registros.',
      withAuth = true as P,
    } = routeParams;

    const routeAlreadyExists = this.routes.some(
      (route) => route.id === id && route.method === 'GET',
    );

    if (routeAlreadyExists) {
      throw new Error(`Rota com id ${id} e método GET já existe!`);
    }

    const fn = async (
      request: NextRequest,
      { params }: { params: HandlerParams['pathParams'] },
    ) => {
      let user: Session['user'] | undefined;
      let ocurredError: unknown | null = null;
      let data: unknown | null = null;
      let authorization: HandlerParams['authorization'] | undefined;

      if (withAuth) {
        try {
          const session = await auth();

          if (!session) {
            return;
          }

          user = session.user;

          authorization = (routeParams as CreateGetRouteParams<true>)
            .authorization || {
            roles: [],
          };

          authorization.mode = authorization.mode ?? 'some';

          authorization.bypassWhenIsAdmin =
            authorization.bypassWhenIsAdmin ?? true;

          const hasRoles =
            authorization.mode === 'some' ? hasSomeRoles : hasAllRoles;

          const allowUser =
            authorization.roles.length === 0 ||
            hasRoles(user, ...authorization.roles) ||
            (authorization.bypassWhenIsAdmin && isAdmin(user));

          if (!allowUser) {
            return httpResponses.forbidden();
          }
        } catch (error) {
          ocurredError = error;

          return httpResponses.unauthorized();
        } finally {
          this.afterRouteExecute?.({
            route: { id, method: 'GET', path: request.url, data },
            user,
            error: ocurredError,
          });
        }
      }

      try {
        const searchParams = getRequestSearchParams(request);

        const handlerData = {
          request,
          searchParams,
          pathParams: params,
          user,
          authorization,

          httpResponses,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        data = handlerData;

        return await handler(handlerData);
      } catch (error) {
        ocurredError = error;

        return httpResponses.badRequest(errorMessage);
      } finally {
        this.afterRouteExecute?.({
          route: { id, method: 'GET', path: request.url, data },
          user,
          error: ocurredError,
        });
      }
    };

    this.routes.push({ id, method: 'GET' });

    return fn;
  }
}

export const apiClient = new ApiClient({
  afterRouteExecute: async ({ route, error, user }) => {
    if (error) {
      Sentry.captureException(error, {
        user: { id: user?.id, email: user?.email, username: user?.name || '' },
      });

      console.error(
        `Erro ao executar rota com id ${route.id} e método ${route.method} no caminho ${route.path}\n`,
        error,
      );
    }
  },
});
