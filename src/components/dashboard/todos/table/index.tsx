'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { ReactNode, useMemo } from 'react';

import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { HTTP_KEYS } from '$config';
import { useGetTodos } from '$http/todos';
import { STRIPE_PLANS } from '$libs/stripe/products';

import { getColumns } from './columns';

export interface TodosTableProps {
  user: Session['user'];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  actionButton?: ReactNode;

  todosDetails?: {
    userId?: string;
    userStripePriceId?: string | null;
  };
}

export function TodosTable({
  todosDetails,
  user,
  onEdit,
  onDelete,
  actionButton,
}: TodosTableProps) {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const queryClient = useQueryClient();

  const usersQuery = useGetTodos({
    userId: todosDetails?.userId,
    userStripePriceId: todosDetails?.userStripePriceId,
    search,
    size,
    page,
    sort,
  });

  async function handleRefresh() {
    await queryClient.invalidateQueries({ queryKey: [HTTP_KEYS.todo.list] });

    resetTableParams();
  }

  const disabledRows = useMemo(() => {
    return STRIPE_PLANS.free.isFree(todosDetails?.userStripePriceId || '')
      ? usersQuery?.data?.data
          .filter((todo) => todo.blockWhenCancelSubscription)
          .map((todo) => todo.id) || []
      : [];
  }, [usersQuery, todosDetails?.userStripePriceId]);

  const columns = useMemo(
    () =>
      getColumns({
        user,
        disabledRows,
        setTodoToEdit: onEdit,
        setTodoToDelete: onDelete,
      }),
    [user, disabledRows, onEdit, onDelete],
  );

  return (
    <>
      <DataTable
        tableName="Tarefas"
        disabledRows={disabledRows}
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
