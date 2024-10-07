import { NextRequest } from 'next/server';

import { parseNumber } from '$utils/parsers';

import { defaultPagination, SORT_SEPARATOR } from '../react-table';

export const sortDirections = ['asc', 'desc'] as const;

export type SortDirections = typeof sortDirections[number];

export function getRequestSearchParams(
  req: NextRequest,
  {
    defaultPage = defaultPagination.page,
    defaultSize = defaultPagination.size,
  } = {},
) {
  const pageRaw = req.nextUrl.searchParams.get('page');
  const sizeRaw = req.nextUrl.searchParams.get('size');

  const parsedPage = parseNumber(pageRaw, defaultPage);
  const parsedSize = parseNumber(sizeRaw, defaultSize);

  const page = Math.max(defaultPagination.page, parsedPage);
  const size = Math.max(1, parsedSize);

  const sort = req.nextUrl.searchParams.get('sort') || defaultPagination.sort;
  const sortParsed = sort.split(SORT_SEPARATOR);

  const sortByKey =
    sortParsed[0] || defaultPagination.sort.split(SORT_SEPARATOR)[0];

  let sortDirection = (sortParsed[1]?.toLowerCase() ||
    sortDirections[0]) as SortDirections;

  if (!sortDirections.includes(sortDirection)) {
    sortDirection = sortDirections[0];
  }

  const search =
    req.nextUrl.searchParams.get('search')?.toLowerCase().trim() || undefined;

  return {
    page,
    size,
    search,
    sort: {
      [sortByKey]: sortDirection,
    },
  };
}
