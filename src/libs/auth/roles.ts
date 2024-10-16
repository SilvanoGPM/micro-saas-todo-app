import type { Session } from 'next-auth';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserRole = `${UserRoleEnum}`;

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
