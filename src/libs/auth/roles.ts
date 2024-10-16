import type { Session } from 'next-auth';

export const ROLES_SEPARATOR = ',';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserRole = `${UserRoleEnum}`;

export const ptBrRoles: Record<UserRole, string> = {
  [UserRoleEnum.ADMIN]: 'Administrador',
  [UserRoleEnum.USER]: 'Usuário',
};

export function getPtBrRoles() {
  return Object.entries(ptBrRoles).map(([key, value]) => ({
    value: key as UserRole,
    label: value,
  }));
}

export function hasSomeRoles(user?: Session['user'], ...roles: UserRole[]) {
  if (!user) return false;

  return roles.some((role) => user.roles?.includes(role));
}

export function hasAllRoles(user?: Session['user'], ...roles: UserRole[]) {
  if (!user) return false;

  return roles.every((role) => user.roles?.includes(role));
}

export function isAdmin(user?: Session['user']) {
  return hasSomeRoles(user, UserRoleEnum.ADMIN);
}
