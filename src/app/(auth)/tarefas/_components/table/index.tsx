'use client';

import { useState } from 'react';
import { Session } from 'next-auth';

import { TodosTable } from '$components/dashboard/todos/table';
import { DeleteModal } from '$components/delete-modal';
import { HTTP_KEYS } from '$config';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { UpsertTodoSheet } from '../upsert';

import { deleteTodoAction } from './actions';

export interface MainTodosTableProps {
  user: Session['user'];
}

export function MainTodosTable({ user }: MainTodosTableProps) {
  const [todoToEdit, setTodoToEdit] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await handleAction(deleteTodoAction, { id });
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <TodosTable
        user={user}
        onEdit={setTodoToEdit}
        onDelete={setTodoToDelete}
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
