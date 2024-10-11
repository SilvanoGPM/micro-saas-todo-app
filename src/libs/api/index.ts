import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '../auth';

import { getRequestSearchParams } from './get-request-search-params';
import { httpResponses } from './http-responses';

export interface HandlerParams {
  request: NextRequest;
  user: Required<NonNullable<Session['user']>>;
  searchParams: ReturnType<typeof getRequestSearchParams>;
  pathParams: { [key: string]: string };
  httpResponses: typeof httpResponses;
}

export interface CreateGetRouteParams<P extends boolean = true> {
  id: string;
  handler: (
    params: P extends true ? HandlerParams : Omit<HandlerParams, 'user'>,
  ) => Promise<NextResponse>;
  withAuth?: P;
  errorMessage?: string;
}

export interface ApiRoute {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ApiClientOptions {
  afterRouteExecute?: (params: {
    route: { id: string; method: ApiRoute['method']; data: unknown };
    error: unknown | null;
  }) => void;
}

class ApiClient {
  private routes: ApiRoute[] = [];

  private afterRouteExecute: ApiClientOptions['afterRouteExecute'];

  constructor({ afterRouteExecute }: ApiClientOptions = {}) {
    this.afterRouteExecute = afterRouteExecute;
  }

  createGetRoute<P extends boolean = true>({
    id,
    handler,
    errorMessage = 'Não foi possível encontrar registros.',
    withAuth = true as P,
  }: CreateGetRouteParams<P>) {
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

      if (withAuth) {
        try {
          const session = await auth();

          if (!session) {
            return;
          }

          user = session.user;
        } catch (error) {
          ocurredError = error;

          return httpResponses.unauthorized();
        } finally {
          this.afterRouteExecute?.({
            route: { id, method: 'GET', data: user },
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
          route: { id, method: 'GET', data: { user, data, path: request.url } },
          error: ocurredError,
        });
      }
    };

    this.routes.push({ id, method: 'GET' });

    return fn;
  }
}

export const apiClient = new ApiClient({
  afterRouteExecute: async ({ route, error }) => {
    if (error) {
      console.error(
        `Erro ao executar rota ${route.id} com o método ${route.method}\n`,
        error,
      );
    }
  },
});
