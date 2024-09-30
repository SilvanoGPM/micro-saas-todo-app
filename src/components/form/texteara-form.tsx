import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { Textarea, TextareaProps } from '$components/ui/textarea';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type TextareaFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<TextareaProps, 'form'>;

export function TextareaForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: TextareaFormProps<F>) {
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
            <Textarea {...props} {...field} />
          </FormControl>

          {hint && <FormDescription>{hint}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
