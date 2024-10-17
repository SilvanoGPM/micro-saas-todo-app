'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { DownloadIcon, RotateCwIcon, SearchIcon } from 'lucide-react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '$components/ui/button';
import { Input } from '$components/ui/input';
import { Skeleton } from '$components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '$components/ui/table';
import { useDebounce } from '$hooks/use-debounce';
import {
  defaultPagination,
  exportTableToCSV,
  getCommonPinningStyles,
  SORT_SEPARATOR,
} from '$libs/react-table';
import { cn } from '$utils/cn';

import { BodySkeleton } from './body-skeleton';
import { ColumnsVisibility } from './columns-visibility';
import { Pagination } from './pagination';
import {
  TableQueryParamsKeys,
  useTableQueryParams,
} from './use-table-query-params';

export interface DataTableProps<TData extends object, TValue> {
  tableName: string;
  isLoading?: boolean;
  isFetching?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data?: TData[] | null;
  total?: number;
  disabledRows?: string[];
  rowsSelectedActions?: Array<(params: { data: TData[] }) => ReactNode>;
  actionButton?: ReactNode;
  initialColumnVisibility?: VisibilityState;
  onRefresh?: () => void;
  showSelectedRegisters?: boolean;
  tableQueryParamsKeys?: TableQueryParamsKeys;
}

export function DataTable<TData extends object, TValue>({
  tableName,
  columns,
  isLoading = false,
  isFetching = false,
  showSelectedRegisters = true,
  data = [],
  disabledRows = [],
  total = 0,
  actionButton,
  rowsSelectedActions = [],
  initialColumnVisibility = {},
  tableQueryParamsKeys,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const { page, size, search, sort, setSearch, setPage, setSort } =
    useTableQueryParams(tableQueryParamsKeys);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  );

  const { debounce, timeoutId } = useDebounce(500);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOrderBy = useCallback(
    ([{ id, desc }]: SortingState) => {
      setSort(`${id}:${desc ? 'desc' : 'asc'}`);
      setRowSelection({});
    },
    [setSort],
  );

  const sorting = useMemo(() => {
    const [id, direction] = sort.split(SORT_SEPARATOR);

    const desc = direction === 'desc';

    return [{ id, desc }];
  }, [sort]);

  const pageCount = useMemo(
    () => Math.ceil(total / defaultPagination.size),
    [total],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSortingChange: (sorting: any) => handleOrderBy(sorting()),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    rowCount: total,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
      columnPinning: { right: ['actions'] },
    },
  });

  const handleSearch = useCallback(
    (search: string) => {
      setRowSelection({});
      setSearch(search);
      setPage(defaultPagination.page);
    },
    [setSearch, setPage],
  );

  // Limpa o valor do input quando o valor de search é vazio.
  useEffect(() => {
    if (!search && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [search]);

  return (
    <div className="flex-1 w-full">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-start gap-4 md:gap-2 py-4">
        <div className="flex-1 w-full flex gap-2 lg:w-auto">
          <div className="relative w-full">
            <Button
              size="icon"
              type="button"
              variant="ghost"
              className="absolute left-0 top-[50%] translate-y-[-50%]"
              onClick={() => inputRef?.current?.focus()}
            >
              <SearchIcon className="size-4" />
              <span className="sr-only">Pesquisar</span>
            </Button>

            <Input
              ref={inputRef}
              placeholder="Pesquisar"
              type="search"
              onChange={(event) => {
                debounce(() => handleSearch(event.target.value.trim()));
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  clearTimeout(timeoutId.current!);
                  handleSearch(event.currentTarget.value.trim());
                }
              }}
              className="max-w-full lg:max-w-sm pl-12"
            />
          </div>
        </div>

        <div className="flex-1 flex justify-end flex-wrap gap-2 w-full lg:w-[fit-content]">
          <Button
            size="icon"
            variant="outline"
            onClick={onRefresh}
            className="flex-shrink-0 h-9"
            disabled={isFetching}
          >
            <RotateCwIcon
              className={`size-4 animate-spin ${isFetching ? '' : 'paused'}`}
            />
          </Button>

          <ColumnsVisibility table={table} />

          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportTableToCSV(table, {
                  filename: tableName || 'Dados',
                  onlySelected: true,
                  excludeColumns: ['select', 'actions'],
                })
              }
            >
              <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
              Exportar{' '}
              {table.getSelectedRowModel().rows.length > 0
                ? `(${table.getSelectedRowModel().rows.length})`
                : ''}
            </Button>
          )}

          {rowsSelectedActions.map((Action, idx) => (
            <div
              key={idx}
              className={`transition-transform ${
                Object.keys(rowSelection).length > 0
                  ? 'transform scale-100'
                  : 'transform scale-0'
              }`}
            >
              <Action
                data={table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original)}
              />
            </div>
          ))}

          {actionButton}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {!isLoading ? (
                        <>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </>
                      ) : (
                        <Skeleton className="w-[100px] h-[20px] mx-auto" />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading ? (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const id = ('id' in row.original &&
                      row.original.id) as string;

                    const isDisabled = disabledRows.includes(id);

                    return (
                      <TableRow
                        key={row.id}
                        data-id={id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn({
                          'opacity-50': isDisabled,
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap"
                            style={{
                              ...getCommonPinningStyles({
                                column: cell.column,
                              }),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 md:text-center"
                    >
                      Sem resultados.
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <BodySkeleton
                columns={columns}
                initialColumnVisibility={initialColumnVisibility}
              />
            )}
          </TableBody>
        </Table>
      </div>

      <div
        className={`flex flex-col md:flex-row items-center ${
          showSelectedRegisters ? 'justify-between' : 'justify-end'
        } mt-8`}
      >
        {showSelectedRegisters && (
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linhas(s) selecionadas.
          </div>
        )}

        <Pagination
          table={table}
          total={total}
          pageCount={pageCount}
          isLoading={isLoading || isFetching}
          tableQueryParamsKeys={tableQueryParamsKeys}
        />
      </div>
    </div>
  );
}
