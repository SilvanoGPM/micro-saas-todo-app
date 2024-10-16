import { UserRoleEnum } from './roles';

export const ROUTES = {
  public: ['/'],

  auth: {
    login: '/login',
    verify: '/verify',
    reset: '/reset',
  },

  private: {
    admin: {
      path: '/admin',
      roles: [UserRoleEnum.ADMIN],
    },

    home: {
      path: '/tarefas',
      roles: [UserRoleEnum.USER],
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

export function getPrivatePathRoles(path: string): UserRoleEnum[] {
  const route = Object.values(ROUTES.private).find(
    (route) => route.path === path,
  );

  return route?.roles || [];
}
