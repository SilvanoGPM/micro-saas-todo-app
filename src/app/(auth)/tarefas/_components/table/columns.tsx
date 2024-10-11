'use client';

import { Portal } from '@radix-ui/react-tooltip';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  CheckCheckIcon,
  CheckCircle,
  EditIcon,
  Loader2Icon,
  MoreHorizontal,
  TrashIcon,
} from 'lucide-react';
import { memo, useTransition } from 'react';

import { Badge } from '$components/ui/badge';
import { Button } from '$components/ui/button';
import { Checkbox } from '$components/ui/checkbox';
import { DataTableColumnHeader } from '$components/ui/data-table/column-header';
import { copyToClipboard } from '$components/ui/data-table/copy-to-clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '$components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '$components/ui/tooltip';
import { Todo } from '$http/todos';
import { HTTP_KEYS } from '$config';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { deleteTodoAction, toggleCompletedAtTodoAction } from './actions';

interface GetColumnsParams {
  setSelectedTodoId: (id: string) => void;
}

interface ActionsCellProps extends GetColumnsParams {
  row: Row<Todo>;
}

export const getColumns = ({ setSelectedTodoId }: GetColumnsParams) =>
  [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'completedAt',
      meta: {
        label: 'Status',
      },
      cell: ({ row }) => {
        const { variant, text, message } = row.original.completedAt
          ? {
              variant: 'outline' as const,
              text: 'Concluído',
              message: `Tarefa completada em ${row.original.completedAt}`,
            }
          : {
              variant: 'secondary' as const,
              text: 'Pendente',
              message: 'Tarefa ainda não foi completada',
            };

        return (
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Badge variant={variant}>{text}</Badge>
            </TooltipTrigger>

            <Portal>
              <TooltipContent>{message}</TooltipContent>
            </Portal>
          </Tooltip>
        );
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      accessorKey: 'id',
      header: 'Identificador',
      meta: {
        label: 'Identificador',
      },
    },

    {
      accessorKey: 'title',
      meta: {
        label: 'Título',
      },
      cell: ({ row }) => {
        return <span className="truncate">{row.original.title}</span>;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Adicionado em',
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      accessorKey: 'updatedAt',
      meta: {
        label: 'Atualizado em',
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      id: 'actions',
      header: 'Ações',
      enableHiding: false,

      cell: ({ row }) => (
        <MemoizedActionsCell row={row} setSelectedTodoId={setSelectedTodoId} />
      ),
    },
  ] as ColumnDef<Todo>[];

const MemoizedActionsCell = memo(ActionsCell);

function ActionsCell({ row, setSelectedTodoId }: ActionsCellProps) {
  const item = row.original;

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  function handleExecuteAction(type: 'toggleCompletedAt' | 'delete') {
    return (event: React.MouseEvent) => {
      if (type === 'toggleCompletedAt') {
        event.stopPropagation();
        event.preventDefault();
      }

      startTransition(async () => {
        try {
          const data = { id: item.id };

          if (type === 'toggleCompletedAt') {
            await handleAction(toggleCompletedAtTodoAction, data);
          } else if (type === 'delete') {
            await handleAction(deleteTodoAction, data);
          }

          await queryClient.invalidateQueries({
            queryKey: [HTTP_KEYS.todo.list],
          });
        } catch (error) {
          handleError(error);
        }
      });
    };
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir ações</span>
            <MoreHorizontal className="h-4 w-4" data-js="copy-default" />

            <CheckCircle className="h-4 w-4 hidden" data-js="copy-success" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={handleExecuteAction('toggleCompletedAt')}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin mr-2 size-3" />
            ) : (
              <CheckCheckIcon className="mr-2 size-3" />
            )}

            {item.completedAt
              ? 'Marcar como pendente'
              : 'Marcar como concluído'}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setSelectedTodoId(item.id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin mr-2 size-3" />
            ) : (
              <EditIcon className="mr-2 size-3" />
            )}
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive"
            onClick={handleExecuteAction('delete')}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin mr-2 size-3" />
            ) : (
              <TrashIcon className="mr-2 size-3" />
            )}
            Remover
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Copiar</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={copyToClipboard({
              toCopy: item.id,
              rowId: item.id,
              label: 'Identificador',
            })}
          >
            Identificador
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
