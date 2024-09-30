import { KeyRoundIcon } from 'lucide-react';
import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import {
  InputPassword,
  InputPasswordProps,
} from '$components/ui/input-password';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type InputPasswordFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<InputPasswordProps, 'form'>;

export function InputPasswordForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon = KeyRoundIcon,
  wrapperClassName,
  hint,
  ...props
}: InputPasswordFormProps<F>) {
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
            <InputPassword {...props} {...field} />
          </FormControl>

          {hint && <FormDescription>{hint}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
