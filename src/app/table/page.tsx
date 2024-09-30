'use client';

import { useQueryClient } from '@tanstack/react-query';
import { PlusCircleIcon } from 'lucide-react';

import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { useGetUsers } from '$http/users';
import { Button } from '$components/ui/button';

import { columns } from './columns';

export default function TablePage() {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const queryClient = useQueryClient();

  const usersQuery = useGetUsers({
    search,
    size,
    page,
    sort,
  });

  async function handleRefreshUsers() {
    await queryClient.invalidateQueries({ queryKey: ['users'] });

    resetTableParams();
  }

  return (
    <main className="p-8 flex flex-col items-center justify-center text-2xl font-bold">
      <DataTable
        onRefresh={handleRefreshUsers}
        columns={columns}
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        total={usersQuery.data?.total}
        data={usersQuery.data?.data}
        initialColumnVisibility={{
          createdAt: false,
          updatedAt: false,
          uuid: false,
        }}
        actionButton={
          <Button className="flex-1">
            <PlusCircleIcon className="size-4 mr-2" />
            Adicionar usuário
          </Button>
        }
      />
    </main>
  );
}
