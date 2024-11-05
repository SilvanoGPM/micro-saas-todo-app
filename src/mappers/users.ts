import { HttpUser, User } from '$http/users';
import { ROLES_SEPARATOR } from '$libs/auth/roles';
import { Mapper } from '$mappers';

export type UserOption = ReturnType<typeof userToOption>;

export function userToOption(user: User) {
  return {
    value: user.id,
    label: user.name,
    image: user.image,
  };
}

class UsersMapper extends Mapper<HttpUser, User> {
  protected process(data: HttpUser) {
    return {
      ...data,
      roles: data.roles.split(ROLES_SEPARATOR),
    };
  }
}

export const usersMapper = new UsersMapper();
