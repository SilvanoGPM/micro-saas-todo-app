'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { DeleteModal } from '$components/delete-modal';
import { DataTable } from '$components/ui/data-table';
import { useTableQueryParams } from '$components/ui/data-table/use-table-query-params';
import { HTTP_KEYS } from '$config';
import { useGetTodos } from '$http/todos';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { UpsertTodoSheet } from '../upsert';

import { deleteTodoAction } from './actions';
import { getColumns } from './columns';

export function TodosTable() {
  const { search, page, size, sort, resetTableParams } = useTableQueryParams();

  const [todoToEdit, setTodoToEdit] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

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

  async function handleDelete(id: string) {
    try {
      await handleAction(deleteTodoAction, { id });
    } catch (error) {
      handleError(error);
    }
  }

  const columns = useMemo(
    () => getColumns({ setTodoToEdit, setTodoToDelete }),
    [setTodoToEdit],
  );

  return (
    <>
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
            todoId={todoToEdit}
            clearTodoId={() => setTodoToEdit(null)}
          />
        }
      />

      <DeleteModal
        context="tarefa"
        description="Tem certeza que deseja deletar esta tarefa?"
        successMessage="Tarefa deletada com sucesso"
        id={todoToDelete}
        setId={setTodoToDelete}
        queriesToInvalidate={[HTTP_KEYS.todo.list]}
        fn={handleDelete}
      />
    </>
  );
}
