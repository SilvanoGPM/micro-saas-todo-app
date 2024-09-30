'use client';

import { CheckCircle, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

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
import { Checkbox } from '$components/ui/checkbox';
import { Button } from '$components/ui/button';

import type { User } from '$http/users';

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'uuid',
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
      return <span>{row.original.name}</span>;
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
  },

  {
    accessorKey: 'email',
    meta: {
      label: 'E-mail',
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
    id: 'actions',
    header: 'Ações',
    enableHiding: false,

    cell: ({ row }) => {
      const user = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir ações</span>
                <MoreHorizontal className="h-4 w-4" data-js="copy-default" />

                <CheckCircle
                  className="h-4 w-4 hidden"
                  data-js="copy-success"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Copiar</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={copyToClipboard({
                  toCopy: user.uuid,
                  label: 'Identificador',
                  rowId: user.uuid,
                })}
              >
                Identificador
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={copyToClipboard({
                  toCopy: user.email,
                  label: 'E-mail',
                  rowId: user.uuid,
                })}
              >
                E-mail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
] as ColumnDef<User>[];
