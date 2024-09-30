import { ComponentType, ReactNode } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export interface ItemFormProps<F extends FieldValues> {
  /** Instância do formulário, usada com react-hook-form. */
  form: UseFormReturn<F>;

  /** Nome do campo */
  name: Path<F>;

  /** Texto do rótulo */
  label?: ReactNode;

  /** Dica mostrada abaixo do input */
  hint?: string;

  /** Ícone do rótulo */
  labelIcon?: ComponentType<{ className?: string }>;

  /** Indica se o campo é obrigatório */
  required?: boolean;

  /** Indica se o campo está em modo de carregamento */
  isLoading?: boolean;

  /** Estilização do wrapper do item */
  wrapperClassName?: string;
}
