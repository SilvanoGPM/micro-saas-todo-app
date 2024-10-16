'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useMemo } from 'react';

import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { HTTP_KEYS } from '$config';
import { useGetUsers } from '$http/users';

import { getColumns } from './columns';

export interface UsersTableProps {
  user: Session['user'];
}

export function UsersTable({ user }: UsersTableProps) {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const queryClient = useQueryClient();

  const usersQuery = useGetUsers({
    search,
    size,
    page,
    sort,
  });

  async function handleRefresh() {
    await queryClient.invalidateQueries({ queryKey: [HTTP_KEYS.user.list] });

    resetTableParams();
  }

  const columns = useMemo(() => getColumns({ user }), [user]);

  return (
    <>
      <DataTable
        title="Usuários"
        onRefresh={handleRefresh}
        columns={columns}
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        total={usersQuery.data?.total}
        data={usersQuery.data?.data}
        initialColumnVisibility={{
          id: false,
          createdAt: false,
          updatedAt: false,
        }}
      />
    </>
  );
}
