'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { useGetTodos } from '$http/todos';
import { HTTP_KEYS } from '$config';

import { UpsertTodoSheet } from '../upsert';

import { getColumns } from './columns';

export function TodosTable() {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const usersQuery = useGetTodos({
    search,
    size,
    page,
    sort,
  });

  async function handleRefresh() {
    await queryClient.invalidateQueries({ queryKey: [HTTP_KEYS.todo.list] });

    resetTableParams();
  }

  const columns = useMemo(
    () => getColumns({ setSelectedTodoId }),
    [setSelectedTodoId],
  );

  return (
    <DataTable
      onRefresh={handleRefresh}
      columns={columns}
      isLoading={usersQuery.isLoading}
      isFetching={usersQuery.isFetching}
      total={usersQuery.data?.total}
      data={usersQuery.data?.data}
      initialColumnVisibility={{
        updatedAt: false,
      }}
      actionButton={
        <UpsertTodoSheet
          todoId={selectedTodoId}
          clearTodoId={() => setSelectedTodoId(null)}
        />
      }
    />
  );
}
