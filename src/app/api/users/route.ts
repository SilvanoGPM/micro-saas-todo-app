import { faker } from '@faker-js/faker';

import { wait } from '$utils/wait';
import { User } from '$http/users';
import { GetParams, Page } from '$http/types';
import { parseNumber } from '$utils/parsers';
import { defaultPagination } from '$libs/react-table';

import type { NextRequest } from 'next/server';

faker.seed(1234);

const generateFakeUsers = (length = 100): User[] => {
  const users: User[] = [];

  for (let i = 0; i < length; i++) {
    const name = faker.person.firstName();

    const user: User = {
      uuid: faker.string.uuid(),
      name,
      email: faker.internet.email({ firstName: name }),
      image: faker.image.avatar(),
      createdAt: faker.date.recent().toISOString(),
    };

    users.push(user);
  }

  return users;
};

const fakeUsers = generateFakeUsers();

async function getUsers({
  size = 10,
  page = 1,
  search,
  sort,
}: GetParams): Promise<Page<User>> {
  await wait(2000);

  const start = (page - 1) * size;
  const end = Math.min(start + size, fakeUsers.length);

  const filteredUsers = fakeUsers.filter((user) => {
    if (!search) {
      return true;
    }

    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  const pagedUsers = filteredUsers.slice(start, end).sort((a, b) => {
    if (!sort) {
      return 0;
    }

    const [field, order] = sort.split(':') as [keyof User, 'asc' | 'desc'];

    if (order === 'desc') {
      return b[field].localeCompare(a[field]);
    }

    return a[field].localeCompare(b[field]);
  });

  return {
    data: pagedUsers,
    total: filteredUsers.length,
    page,
    size,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const data = await getUsers({
    search: searchParams.get('search') || '',
    size: parseNumber(searchParams.get('size'), defaultPagination.size),
    page: parseNumber(searchParams.get('page'), defaultPagination.page),
    sort: searchParams.get('sort') || 'name:asc',
  });

  return Response.json(data);
}
