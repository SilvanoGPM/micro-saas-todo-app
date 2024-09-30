import { ColumnDef, VisibilityState } from '@tanstack/react-table';

import { Skeleton } from '$components/ui/skeleton';
import { TableCell, TableRow } from '$components/ui/table';
import { defaultPagination } from '$libs/react-table';

export interface BodySkeletonParams<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialColumnVisibility: VisibilityState;
}

export function BodySkeleton<TData, TValue>({
  columns,
  initialColumnVisibility,
}: BodySkeletonParams<TData, TValue>) {
  return (
    <>
      {Array(defaultPagination.size)
        .fill(0)
        .map((_, idx) => ({
          id: idx + 1,
          cells: Array(
            columns.length - Object.keys(initialColumnVisibility).length - 1,
          )
            .fill(0)
            .map((_, idx) => idx),
        }))
        .map((row) => (
          <TableRow key={row.id}>
            {row.cells.map((cell) => (
              <TableCell key={cell}>
                <Skeleton className="w-full h-[20px]" />
              </TableCell>
            ))}

            <TableCell>
              <Skeleton className="w-[40px] h-[20px] mx-auto" />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
