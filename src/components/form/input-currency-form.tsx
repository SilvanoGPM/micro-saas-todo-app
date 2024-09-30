'use client';

// https://gist.github.com/Sutil/5285f2e5a912dcf14fc23393dac97fed

import { useEffect, useReducer } from 'react';
import { FieldValues, PathValue } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { Input, InputProps } from '$components/ui/input';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type InputCurrencyFormProps<T extends FieldValues> = ItemFormProps<T> &
  Omit<InputProps, 'form'>;

// Brazilian currency config
const moneyFormatter = Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function InputCurrencyForm<T extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: InputCurrencyFormProps<T>) {
  const initialValue = form.getValues()[name]
    ? moneyFormatter.format(form.getValues()[name])
    : '';

  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const digits = next.replace(/\D/g, '');
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(
    realChangeFn: (value: number) => void,
    formattedValue: string,
  ) {
    const digits = formattedValue.replace(/\D/g, '');
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field.value = value as PathValue<T, any>;
        const _change = field.onChange;

        return (
          <FormItem className={cn('w-full', wrapperClassName)}>
            <LabelForm icon={labelIcon} required={required}>
              {label}
            </LabelForm>

            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                inputMode="decimal"
                {...props}
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
            </FormControl>

            {hint && <FormDescription>{hint}</FormDescription>}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
