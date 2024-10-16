'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { ReactNode, useMemo } from 'react';

import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { HTTP_KEYS } from '$config';
import { useGetTodos } from '$http/todos';

import { getColumns } from './columns';

export interface TodosTableProps {
  user: Session['user'];
  userId?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  actionButton?: ReactNode;
}

export function TodosTable({
  userId,
  user,
  onEdit,
  onDelete,
  actionButton,
}: TodosTableProps) {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const queryClient = useQueryClient();

  const usersQuery = useGetTodos({
    userId,
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
    () =>
      getColumns({ user, setTodoToEdit: onEdit, setTodoToDelete: onDelete }),
    [user, onEdit, onDelete],
  );

  return (
    <>
      <DataTable
        tableName="Tarefas"
        onRefresh={handleRefresh}
        columns={columns}
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        total={usersQuery.data?.total}
        data={usersQuery.data?.data}
        initialColumnVisibility={{
          updatedAt: false,
        }}
        actionButton={actionButton}
      />
    </>
  );
}
