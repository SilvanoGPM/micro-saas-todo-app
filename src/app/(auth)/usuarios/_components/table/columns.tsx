'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { CheckCircle, EditIcon, EyeIcon, MoreHorizontal } from 'lucide-react';
import { Session } from 'next-auth';
import { memo, useTransition } from 'react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
import { Badge } from '$components/ui/badge';
import { Button } from '$components/ui/button';
import { Checkbox } from '$components/ui/checkbox';
import { DataTableColumnHeader } from '$components/ui/data-table/column-header';
import { copyToClipboard } from '$components/ui/data-table/copy-to-clipboard';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '$components/ui/dropdown-menu';
import { HTTP_KEYS } from '$config';
import { User } from '$http/users';
import { getPtBrRoles, ptBrRoles, UserRole } from '$libs/auth/roles';
import { cn } from '$utils/cn';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';
import { ROUTES } from '$libs/auth/routes';

import { changeRoleAction } from './actions';

export interface GetColumnsParams {
  user: Session['user'];
}

interface ActionsCellProps extends GetColumnsParams {
  row: Row<User>;
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
          aria-label="Selecionar users"
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
      accessorKey: 'id',
      header: 'Identificador',
      meta: {
        label: 'Identificador',
      },
    },

    {
      accessorKey: 'name',
      meta: {
        label: 'Nome',
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={row.original.image || ''}
                alt={row.original?.name || ''}
              />
              <AvatarFallback>{row.original?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>

            <span className="truncate">{row.original.name}</span>
          </div>
        );
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      accessorKey: 'email',
      meta: {
        label: 'E-mail',
      },
      cell: ({ row }) => {
        return <span className="truncate">{row.original.email}</span>;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },

    {
      accessorKey: 'roles',
      meta: {
        label: 'Permissões',
      },
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center flex-1 flex-wrap min-w-[220px] max-w-lg w-full gap-2">
            {row.original.roles.map((role) => (
              <Badge key={role}>
                {ptBrRoles[role as keyof typeof ptBrRoles]}
              </Badge>
            ))}
          </div>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-center justify-center"
          column={column}
        />
      ),
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
  ] as ColumnDef<User>[];

const MemoizedActionsCell = memo(ActionsCell);

function ActionsCell({ row, user }: ActionsCellProps) {
  const item = row.original;

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  function handleChangeRole(role: UserRole) {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      startTransition(async () => {
        try {
          await handleAction(changeRoleAction, { id: row.original.id, role });

          await queryClient.invalidateQueries({
            queryKey: [HTTP_KEYS.user.list],
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

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              disabled={row.original.id === user.id}
              className={cn({
                'opacity-50': row.original.id === user.id,
              })}
            >
              <EditIcon className="mr-2 size-3" />
              Alterar Permissões
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {getPtBrRoles().map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role.value}
                    disabled={isPending}
                    checked={row.original.roles.includes(role.value)}
                    onClick={handleChangeRole(role.value)}
                  >
                    <span>{role.label}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.private.userTodos.path.replace(
                '[id]',
                row.original.id,
              )}
            >
              <EyeIcon className="mr-2 size-3" />
              Ver Tarefas
            </Link>
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

          <DropdownMenuItem
            onClick={copyToClipboard({
              toCopy: item.email,
              rowId: item.id,
              label: 'E-mail',
            })}
          >
            E-mail
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={copyToClipboard({
              toCopy: item.name,
              rowId: item.id,
              label: 'Nome',
            })}
          >
            Nome
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
