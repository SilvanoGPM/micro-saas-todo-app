import { Table } from '@tanstack/react-table';
import { Settings2Icon } from 'lucide-react';

import { Button } from '$components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '$components/ui/dropdown-menu';

export interface ColumnsVisibilityProps<TData> {
  table: Table<TData>;
}

export function ColumnsVisibility<TData>({
  table,
}: ColumnsVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex-1 md:flex-none" variant="outline">
          <Settings2Icon className="size-4 mr-2" />
          Visualizar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[300px] overflow-auto">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const meta =
              (column.columnDef.meta as Record<string, string>) || {};

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {meta.label || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
