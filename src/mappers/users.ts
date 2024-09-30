import { User } from '$http/users';

export function usersToOptions(users: User[]) {
  return users.map((user) => ({
    label: user.name,
    value: user.uuid,
    image: user.image,
  }));
}
