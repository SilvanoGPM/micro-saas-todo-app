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
import { Session } from 'next-auth';
import { memo, useTransition } from 'react';

import { Badge, BadgeProps } from '$components/ui/badge';
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
import { HTTP_KEYS } from '$config';
import { Todo } from '$http/todos';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { toggleCompletedAtTodoAction } from './actions';

interface GetColumnsParams {
  user: Session['user'];
  disabledRows: string[];
  setTodoToEdit?: (id: string) => void;
  setTodoToDelete?: (id: string) => void;
}

interface ActionsCellProps extends GetColumnsParams {
  row: Row<Todo>;
}

export const getColumns = (props: GetColumnsParams) =>
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
        let { variant, text, message } = row.original.completedAt
          ? {
              variant: 'outline',
              text: 'Concluído',
              message: `Tarefa completada em ${row.original.completedAt}`,
            }
          : {
              variant: 'secondary',
              text: 'Pendente',
              message: 'Tarefa ainda não foi completada',
            };

        if (props.disabledRows.includes(row.original.id)) {
          variant = 'destructive' as const;
          text = 'Bloqueada';
          message =
            'Tarefa bloqueada pois foi criada enquanto se tinha uma assinatura';
        }

        return (
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Badge variant={variant as BadgeProps['variant']}>{text}</Badge>
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

      cell: ({ row }) => <MemoizedActionsCell row={row} {...props} />,
    },
  ] as ColumnDef<Todo>[];

const MemoizedActionsCell = memo(ActionsCell);

function ActionsCell({
  row,
  user,
  disabledRows,
  setTodoToDelete,
  setTodoToEdit,
}: ActionsCellProps) {
  const item = row.original;

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  function handleToggleCompletedAt(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    startTransition(async () => {
      try {
        await handleAction(toggleCompletedAtTodoAction, {
          id: item.id,
        });

        await queryClient.invalidateQueries({
          queryKey: [HTTP_KEYS.todo.list],
        });
      } catch (error) {
        handleError(error);
      }
    });
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
          {!disabledRows.includes(row.original.id) && (
            <>
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={handleToggleCompletedAt}
                disabled={user.id !== row.original.user.id || isPending}
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
                onClick={() => setTodoToEdit?.(item.id)}
                disabled={!setTodoToEdit || isPending}
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
                onClick={() => setTodoToDelete?.(item.id)}
                disabled={!setTodoToDelete || isPending}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin mr-2 size-3" />
                ) : (
                  <TrashIcon className="mr-2 size-3" />
                )}
                Remover
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

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
