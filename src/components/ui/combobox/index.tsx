'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ChevronsUpDownIcon, XCircleIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '$components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '$components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '$components/ui/popover';
import { useMediaQuery } from '$hooks/use-media-query';
import { GetParams, Page } from '$http/types';
import { cn } from '$utils/cn';

import { ComboboxList } from './list';

/** Uma opção do combobox */
export interface ComboboxOption {
  label: string;
  value: string;
}

/** Possíveis tipos de ações que podem ter sido realizadas quando um item é selecionado */
export type OnSelectAction = 'SELECT' | 'CREATE' | 'REMOVE';

/** Propriedades do combobox */
export interface ComboboxProps<T extends ComboboxOption = ComboboxOption> {
  /** Opções do combobox */
  options: T[];

  /** Opções que vão inicialmente estar selecionadas */
  initialOptions?: T[];

  /** Elemento que será exibido no combobox quando não houver nenhuma opção selecionada */
  placeholder?: React.ReactNode;

  /** Texto que será exibido na listagem quando nenhum texto for digitado na pesquisa */
  searchMessage?: string;

  /** Texto que será exibido na listagem quando nenhum elemento for encontrado na pesquisa */
  emptyMessage?: string;

  /** Define se o botão do combobox fica em modo de carregamento */
  isLoading?: boolean;

  /** Define se o botão do combobox fica desabilitado */
  isDisabled?: boolean;

  /** Define se o combobox permite selecionar várias opções */
  multiple?: boolean;

  /** Define se o combobox permite criar novas opções */
  creatable?: boolean;

  /** Define se o combobox deve fechar quando um item for selecionado */
  closeOnSelect?: boolean;

  /** Elemento que será renderizado à esquerda do combobox */
  leftElement?: React.ReactNode;

  /** Elemento que será renderizado à direita do combobox */
  rightElement?: React.ReactNode;

  /** Estilização para o botão de acionamento do combobox */
  className?: string;

  /** Estilização para o popover do combobox (apenas desktop) */
  popoverClassName?: string;

  /** Estilização para um item na listagem do combobox */
  listItemClassName?: string;

  /** Estilização para um item na listagem do combobox */
  listItemClassNameActive?: string;

  /**
   * Função que renderiza a opção na listagem do combobox
   *
   * @param option - Opção a ser renderizada
   * @param isActive - Define se a opção está ativa ou inativa
   */
  renderOption?: (option: T, isActive?: boolean) => React.ReactNode;

  /**
   * Função que renderiza a opção no botão do combobox
   *
   * Somente funciona caso a propriedade `multiple` seja `true`.
   *
   * @param option - Opção a ser renderizada
   */
  renderActiveOption?: (option: T) => React.ReactNode;

  /**
   * Função que é chamada quando uma opção é selecionada.
   *
   * @param options - Opções selecionadas
   * @param type - Tipo de ação realizada
   */
  onSelect?: (options: T[], action?: OnSelectAction) => void;

  /**
   * A propriedade `creatable` deve ser `true`. Função que é chamada quando uma opção é criada, caso não seja passada, a opção apenas será selecionada.
   *
   * @param value - Valor digitado no campo de busca
   */
  onCreate?: (option: T & { __isNew: true }) => void;

  /**
   * Parâmetros para o modo assincrono do combobox.
   *
   * @param infinite - Define se o combobox deve carregar mais opções ao rolar até o final da listagem
   * @param fn - Função que é chamada para buscar as opções
   * @param size - Quantidade de opções a serem carregadas por vez
   */
  asyncParams?:
    | {
        infinite: true;
        fn: (params: GetParams) => Promise<Page<T>>;
        size?: number;
      }
    | {
        infinite?: false;
        fn: (params: GetParams) => Promise<T[]>;
        size?: number;
      };
}

export function Combobox<T extends ComboboxOption>({
  multiple,
  renderOption = (option) => <>{option.label}</>,
  onSelect,
  initialOptions = [],
  renderActiveOption,
  ...props
}: ComboboxProps<T>) {
  const {
    placeholder = 'Escolha uma opção',
    popoverClassName,
    closeOnSelect,
    leftElement,
    rightElement = <ChevronsUpDownIcon className="size-4 shrink-0" />,
    className,
  } = props;

  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [selectedOptions, setSelectedOptions] = React.useState<T[]>(
    initialOptions.slice(0, multiple ? initialOptions.length : 1),
  );

  React.useEffect(() => {
    if (initialOptions.length > 0) {
      setSelectedOptions(
        initialOptions.slice(0, multiple ? initialOptions.length : 1),
      );
    }
  }, [initialOptions, multiple]);

  const handleSelect = React.useCallback(
    (option: T, action: OnSelectAction = 'SELECT') => {
      let newOptions = [...selectedOptions];

      if (newOptions.find((selected) => selected.value === option.value)) {
        newOptions = newOptions.filter(
          (selected) => selected.value !== option.value,
        );
      } else if (!multiple) {
        newOptions = [option];
      } else {
        newOptions = [...newOptions, option];
      }

      // Para simplificar a seleção sempre vai ser um array, mesmo se não for multiple.
      onSelect?.(newOptions, action);
      setSelectedOptions(newOptions);
      setOpen(!closeOnSelect);
    },
    [multiple, closeOnSelect, onSelect, selectedOptions],
  );

  if (!renderActiveOption) {
    renderActiveOption = multiple
      ? (option) => (
          <span className="bg-primary/10 rounded-full p-2 flex gap-2 items-center justify-between">
            {option.label}{' '}
            <XCircleIcon
              className="size-4 shrink-0"
              data-testid={'remove-active-option-' + option.value}
              onClick={() => {
                handleSelect(option, 'REMOVE');
              }}
            />
          </span>
        )
      : renderOption;
  }

  const Trigger = React.useMemo(() => {
    const content = selectedOptions.length ? (
      <div className="flex-1 flex gap-4 flex-wrap">
        {selectedOptions.map((option) => (
          <React.Fragment key={option.value}>
            {renderActiveOption(option)}
          </React.Fragment>
        ))}
      </div>
    ) : (
      placeholder
    );

    return (
      <Button
        type="button"
        disabled={props.isDisabled}
        isLoading={props.isLoading}
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'justify-between items-center gap-2 flex-wrap h-auto',
          className,
        )}
      >
        {leftElement}
        {content}
        {rightElement}
      </Button>
    );
  }, [
    open,
    leftElement,
    rightElement,
    className,
    renderActiveOption,
    selectedOptions,
    placeholder,
    props.isLoading,
    props.isDisabled,
  ]);

  const RenderedList = React.useMemo(
    () => (
      <ComboboxList
        {...props}
        onSelect={handleSelect}
        multiple={multiple}
        renderOption={renderOption}
        setOpen={setOpen}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    ),
    [handleSelect, multiple, props, renderOption, selectedOptions],
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          onClick={(e) => {
            if (
              e.target instanceof Element &&
              e.target.closest('[data-testid^="remove-active-option-"]')
            ) {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();

              return;
            }
          }}
        >
          {Trigger}
        </PopoverTrigger>
        <PopoverContent className={cn('w-full', popoverClassName)}>
          {RenderedList}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <VisuallyHidden.Root>
        <DrawerTitle datatest-id="drawer-title">{placeholder}</DrawerTitle>
        <DrawerDescription>{placeholder}</DrawerDescription>
      </VisuallyHidden.Root>

      {Trigger}
      <DrawerContent data-testid="combobox-drawer-content">
        {RenderedList}
      </DrawerContent>
    </Drawer>
  );
}
