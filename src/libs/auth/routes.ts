import { UserRoleEnum } from './roles';

export const ROUTES = {
  public: ['/'],

  auth: {
    login: '/login',
    verify: '/verify',
    reset: '/reset',
  },

  private: {
    home: {
      path: '/tarefas',
      roles: [UserRoleEnum.USER],
    },

    users: {
      path: '/usuarios',
      roles: [UserRoleEnum.ADMIN],
    },

    userTodos: {
      path: '/usuarios/[id]/tarefas',
      roles: [UserRoleEnum.ADMIN],
    },

    settings: {
      path: '/configuracoes',
      roles: [UserRoleEnum.USER],
    },

    theme: {
      path: '/configuracoes/tema',
      roles: [UserRoleEnum.USER],
    },

    billing: {
      path: '/configuracoes/assinatura',
      roles: [UserRoleEnum.USER],
    },
  },
};

const privateRoutes = Object.values(ROUTES.private);

export function getPrivatePathRoles(path: string): UserRoleEnum[] {
  const route = privateRoutes.find((route) => route.path === path);

  if (!route) {
    const pathParts = path.split('/').filter(Boolean);

    // Caso não seja uma rota dinâmica, provavelmente não vai precisar de permissão.
    if (pathParts.length <= 1) {
      return [];
    }

    const route = privateRoutes.find((route) => {
      const routeParts = route.path.split('/').filter(Boolean);

      const isSameLength = routeParts.length === pathParts.length;
      const isSameStart = routeParts[0] === pathParts[0];

      if (isSameLength && isSameStart) {
        const isOdd = pathParts.length % 2 !== 0;

        // Se for uma rota com partes impares, a última parte deve ser igual.
        if (isOdd) {
          return (
            routeParts[routeParts.length - 1] ===
            pathParts[pathParts.length - 1]
          );
        }

        return true;
      }

      return false;
    });

    return route?.roles || [];
  }

  return route?.roles || [];
}
