import { CheckboxProps } from '@radix-ui/react-checkbox';
import { FieldValues } from 'react-hook-form';

import { Checkbox } from '$components/ui/checkbox';
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

export type CheckboxFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<CheckboxProps, 'form'>;

export function CheckboxForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: CheckboxFormProps<F>) {
  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4',
            wrapperClassName,
          )}
        >
          <FormControl>
            <Checkbox
              {...props}
              {...field}
              disabled={props.isLoading || props.disabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>

          <div className="space-y-1 leading-none">
            <LabelForm icon={labelIcon} required={required}>
              {label}
            </LabelForm>

            {hint && <FormDescription>{hint}</FormDescription>}

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
