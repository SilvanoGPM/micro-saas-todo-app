import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import {
  InputDatePicker,
  InputDatePickerProps,
} from '$components/ui/input-date-picker';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type InputDatePickerFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<InputDatePickerProps, 'form'>;

export function InputDatePickerForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: InputDatePickerFormProps<F>) {
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
            <InputDatePicker
              {...props}
              {...field}
              className={cn('font-bold', props.className)}
            />
          </FormControl>

          {hint && <FormDescription>{hint}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
