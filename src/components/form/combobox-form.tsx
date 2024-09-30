import { FieldValues } from 'react-hook-form';

import {
  Combobox,
  ComboboxOption,
  ComboboxProps,
  OnSelectAction,
} from '$components/ui/combobox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type ComboboxFormProps<
  F extends FieldValues,
  T extends ComboboxOption = ComboboxOption,
> = ComboboxProps<T> & ItemFormProps<F>;

export function ComboboxForm<
  F extends FieldValues,
  T extends ComboboxOption = ComboboxOption,
>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: ComboboxFormProps<F, T>) {
  return (
    <FormField
      disabled={props.isDisabled}
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        function handleSelect(options: T[], action?: OnSelectAction) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (props.multiple ? options : options[0]) as any;

          form.setValue(field.name, value);
          props?.onSelect?.(options, action);
        }

        return (
          <FormItem className={cn('w-full', wrapperClassName)}>
            <LabelForm icon={labelIcon} required={required}>
              {label}
            </LabelForm>

            <FormControl>
              <Combobox<T>
                {...props}
                initialOptions={props.multiple ? field.value : [field.value]}
                className={cn('w-full', props.className, {
                  'border-destructive !text-destructive': fieldState.error,
                })}
                onSelect={handleSelect}
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
