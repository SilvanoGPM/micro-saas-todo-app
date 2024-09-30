import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';

import { defaultPagination } from '$libs/react-table';

export interface TableQueryParamsKeys {
  searchKey?: string;
  pageKey?: string;
  sizeKey?: string;
  sortKey?: string;

  fromKey?: string;
  toKey?: string;
  intervalNameKey?: string;

  defaultValues?: typeof defaultPagination;
}

export function useTableQueryParams({
  searchKey = 'search',
  pageKey = 'page',
  sizeKey = 'size',
  sortKey = 'sort',
  fromKey = 'from',
  toKey = 'to',
  intervalNameKey = 'intervalName',
  defaultValues = defaultPagination,
}: TableQueryParamsKeys = {}) {
  const [search, setSearch] = useQueryState(
    searchKey,
    parseAsString.withDefault(''),
  );

  const [page, setPage] = useQueryState(
    pageKey,
    parseAsInteger.withDefault(defaultValues.page),
  );

  const [size, setSize] = useQueryState(
    sizeKey,
    parseAsInteger.withDefault(defaultValues.size),
  );

  const [sort, setSort] = useQueryState(
    sortKey,
    parseAsString.withDefault(defaultValues.sort),
  );

  const [from, setFrom] = useQueryState(fromKey, parseAsString);

  const [to, setTo] = useQueryState(toKey, parseAsString);

  const [intervalName, setIntervalName] = useQueryState(
    intervalNameKey,
    parseAsString,
  );

  const resetTableQueryParams = useCallback(() => {
    setSort(defaultValues.sort);
    setSearch('');
    setSize(defaultValues.size);
    setPage(defaultValues.page);
    setFrom(null);
    setTo(null);
    setIntervalName(null);
  }, [
    setSort,
    setSearch,
    setSize,
    setPage,
    setFrom,
    setTo,
    setIntervalName,
    defaultValues,
  ]);

  return {
    search,
    page,
    size,
    sort,
    from,
    to,
    intervalName,
    setSearch,
    setPage,
    setSize,
    setSort,
    setFrom,
    setTo,
    setIntervalName,
    resetTableParams: resetTableQueryParams,
  };
}
