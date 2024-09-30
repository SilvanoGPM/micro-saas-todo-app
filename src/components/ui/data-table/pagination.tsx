'use client';

import { Table } from '@tanstack/react-table';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  Loader,
} from 'lucide-react';
import { ChangeEvent, useCallback } from 'react';

import { Button } from '$components/ui/button';
import { Input } from '$components/ui/input';
import { Label } from '$components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '$components/ui/popover';
import { Separator } from '$components/ui/separator';
import { useDebounce } from '$hooks/use-debounce';
import { parseNumber } from '$utils/parsers';
import { defaultPagination } from '$libs/react-table';

import {
  TableQueryParamsKeys,
  useTableQueryParams,
} from './use-table-query-params';

export interface PaginationProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
  total: number;
  pageCount: number;
  tableQueryParamsKeys?: TableQueryParamsKeys;
}

export function Pagination<TData>({
  total,
  isLoading,
  table,
  pageCount,
  tableQueryParamsKeys,
}: PaginationProps<TData>) {
  const { page, setPage, size, setSize } =
    useTableQueryParams(tableQueryParamsKeys);

  const { debounce: pageDebounce } = useDebounce(500);
  const { debounce: sizeDebounce } = useDebounce(500);

  const changePage = useCallback(
    (direction: 1 | -1) => {
      return () => {
        table.setRowSelection({});

        setPage((page) => page + direction);
      };
    },
    [setPage, table],
  );

  const handleChangeSize = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const $input = event.target;
      const newSize = parseNumber($input.value.trim(), defaultPagination.size);

      sizeDebounce(() => {
        const size = Math.max(Math.min(total, newSize), 1);

        table.setRowSelection({});
        setPage(defaultPagination.page);
        setSize(size);
        $input.value = String(size);
      });
    },
    [total, sizeDebounce, table, setSize, setPage],
  );

  const handleGoToPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const $input = event.target;
      const newPage = parseNumber($input.value.trim(), defaultPagination.page);

      pageDebounce(() => {
        const page = Math.max(
          Math.min(pageCount, newPage),
          defaultPagination.page,
        );

        table.setRowSelection({});
        setPage(page);
        $input.value = String(page);
      });
    },
    [pageCount, pageDebounce, table, setPage],
  );

  return (
    <div className="flex flex-col-reverse mt-4 md:mt-0 md:flex-col items-center md:justify-center md:items-end gap-2 max-w-sm">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex justify-between w-full"
          >
            <span className="text-center flex-1">Mostrando</span>
            <Separator orientation="vertical" className="mx-2" />
            <span className="text-center flex-1">
              {(page - 1) * size + 1} - {Math.min(page * size, total)}{' '}
              <span className="text-muted-foreground">de</span> {total}.
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="page">Página</Label>
                <Input
                  id="page"
                  type="number"
                  min="1"
                  max={pageCount}
                  defaultValue={page}
                  onChange={handleGoToPage}
                  className="col-span-2 h-8"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="size">Linhas</Label>
                <Input
                  id="size"
                  type="number"
                  min="1"
                  max={total}
                  onChange={handleChangeSize}
                  defaultValue={size}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={changePage(-1)}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          {isLoading ? (
            <Loader className="size-4 mr-2 animate-spin" />
          ) : (
            <ArrowLeftCircleIcon className="size-4 mr-2" />
          )}
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={changePage(1)}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Próximo
          {isLoading ? (
            <Loader className="size-4 ml-2 animate-spin" />
          ) : (
            <ArrowRightCircleIcon className="size-4 ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
}
