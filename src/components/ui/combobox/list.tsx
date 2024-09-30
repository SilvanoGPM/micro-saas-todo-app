'use client';

import { ArrowDownIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '$components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '$components/ui/command';
import { useDebounce } from '$hooks/use-debounce';
import { Page } from '$http/types';
import { cn } from '$utils/cn';

import { ComboboxOption, ComboboxProps, OnSelectAction } from '.';

export interface ComboboxListProps<T extends ComboboxOption = ComboboxOption>
  extends Omit<ComboboxProps<T>, 'onSelect'> {
  onSelect: (option: T, action?: OnSelectAction) => void;
  selectedOptions: T[];
  setOpen: (open: boolean) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<T[]>>;
}

export const ComboboxList = React.memo(
  ComboboxListInner,
) as typeof ComboboxListInner;

function ComboboxListInner<T extends ComboboxOption>({
  options: uncontrolledOptions,
  creatable,
  onSelect,
  onCreate,
  searchMessage,
  emptyMessage,
  renderOption,
  selectedOptions,
  asyncParams,
  listItemClassName,
  listItemClassNameActive = '!bg-primary/10',
}: ComboboxListProps<T>) {
  const { asyncFn, size, infinite } = React.useMemo(
    () => ({
      asyncFn: asyncParams?.fn,
      size: asyncParams?.size || 10,
      infinite: asyncParams?.infinite,
    }),
    [asyncParams],
  );

  const [options, setOptions] = React.useState<T[]>(uncontrolledOptions);
  const [search, setSearch] = React.useState('');

  // Modo assincrôno e/ou infinito.
  const page = React.useRef(1);
  const [isLoading, setIsLoading] = React.useState(Boolean(asyncFn));
  const [isFetching, setIsFetching] = React.useState(Boolean(asyncFn));
  const [isReachedEnd, setIsReachedEnd] = React.useState(false);
  const [fetchMoreClicked, setFetchMoreClicked] = React.useState(false);

  const [infiniteScrollRef, setInfiniteScrollRef] =
    React.useState<HTMLDivElement | null>(null);

  const { debounce } = useDebounce(500);

  const handleSearch = React.useCallback(
    (search: string) => {
      setSearch(search);

      if (asyncFn) {
        debounce(() => {
          setOptions([]);
          setIsLoading(true);
        });
      }
    },
    [asyncFn, debounce],
  );

  const handleCreate = React.useCallback(() => {
    const newOption = {
      label: search,
      value: `${search}-${options.length + 1}`,
      __isNew: true,
    } as T & {
      __isNew: true;
    };

    if (onCreate) {
      onCreate(newOption);
    } else {
      setOptions((prevOptions) => [...prevOptions, newOption]);
      onSelect(newOption, 'CREATE');
    }

    setSearch('');
  }, [onCreate, onSelect, options, search]);

  // Filtro para o modo síncrono.
  const handleFilter = React.useCallback(
    (value: string, search: string) => {
      const option = options.find((option) => option.value === value);

      if (option) {
        if (
          option.label?.trim().toLowerCase()?.includes(search.toLowerCase()) ||
          option.value?.trim().toLowerCase().includes(search.toLowerCase())
        ) {
          return 1;
        }

        return 0;
      }

      return 1;
    },
    [options],
  );

  React.useEffect(() => {
    if (uncontrolledOptions.length > 0) {
      setOptions(uncontrolledOptions);
    }
  }, [uncontrolledOptions]);

  // Carregamento inicial no modo assincrôno e quando há uma nova busca.
  React.useEffect(() => {
    if (asyncFn && isLoading) {
      asyncFn({ search, size, page: 1 })
        .then((response) => {
          if (infinite) {
            const newResponse = response as Page<T>;
            setOptions(newResponse.data);

            if (newResponse.page * newResponse.size >= newResponse.total) {
              setIsReachedEnd(true);
            }
          } else if (Array.isArray(response)) {
            setOptions(response as T[]);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsFetching(false);
        });
    }
  }, [asyncFn, isLoading, search, size, infinite]);

  // Carregamento infinito.
  React.useEffect(() => {
    let observer: IntersectionObserver;

    if (infinite && asyncFn && infiniteScrollRef && !isReachedEnd) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.intersectionRatio > 0.1) {
            setFetchMoreClicked(false);
            setIsFetching(true);

            page.current++;

            asyncFn({ search, size, page: page.current })
              .then((response) => {
                if (infinite) {
                  const newResponse = response as Page<T>;
                  setOptions((options) => [...options, ...newResponse.data]);

                  if (
                    newResponse.page * newResponse.size >=
                    newResponse.total
                  ) {
                    setIsReachedEnd(true);
                  }
                }
              })
              .finally(() => {
                setIsFetching(false);
              });
          }
        },
        {
          root: infiniteScrollRef.parentElement,
          rootMargin: '500px',
        },
      );

      observer.observe(infiniteScrollRef);
    }

    return () => {
      observer?.disconnect();
    };
  }, [
    asyncFn,
    infiniteScrollRef,
    isReachedEnd,
    search,
    size,
    infinite,
    fetchMoreClicked,
  ]);

  return (
    <Command filter={handleFilter} shouldFilter={!asyncFn}>
      <CommandInput
        placeholder={searchMessage}
        value={search}
        onValueChange={handleSearch}
      />

      <CommandList>
        {!isLoading && (
          <CommandEmpty>
            {emptyMessage || 'Nenhum resultado encontrado.'}
          </CommandEmpty>
        )}

        <CommandGroup>
          <div className="h-auto max-h-[200px] overflow-y-auto">
            {options.map((option) => {
              const isActive = !!selectedOptions.find(
                (selected) => selected.value === option.value,
              );

              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'cursor-pointer flex items-center justify-between',
                    listItemClassName,
                    {
                      [listItemClassNameActive]: isActive,
                    },
                  )}
                  onSelect={() => onSelect?.(option)}
                >
                  {renderOption!(option, isActive)}

                  {isActive && <XCircleIcon className="size-4 shrink-0" />}
                </CommandItem>
              );
            })}

            {(isLoading || isFetching) && (
              <div className="w-full flex items-center justify-center my-8">
                <Loader2Icon className="animate-spin" />
              </div>
            )}

            {infinite && asyncFn && !isLoading && !isFetching && !isReachedEnd && (
              <div
                className="w-full h-[100px] flex items-center justify-center text-center text-muted-foreground px-4"
                ref={setInfiniteScrollRef}
              >
                <Button
                  className="w-full"
                  onClick={() => setFetchMoreClicked(true)}
                >
                  Carregar mais <ArrowDownIcon className="size-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </CommandGroup>

        {creatable && search && (
          <Button onClick={handleCreate} className="w-full">
            Criar &quot;{search}&quot;
          </Button>
        )}
      </CommandList>
    </Command>
  );
}
