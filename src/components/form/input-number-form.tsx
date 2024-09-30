import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { InputNumber, InputNumberProps } from '$components/ui/input-number';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type InputNumberFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<InputNumberProps, 'form' | 'value' | 'onChange'>;

export function InputNumberForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: InputNumberFormProps<F>) {
  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', wrapperClassName)}>
          <LabelForm icon={labelIcon} required={required}>
            {label}
          </LabelForm>

          <FormControl>
            <InputNumber {...props} {...field} />
          </FormControl>

          {hint && <FormDescription>{hint}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
