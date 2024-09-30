import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { Switch, SwitchProps } from '$components/ui/switch';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type SwitchFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<SwitchProps, 'form'>;

export function SwitchForm<F extends FieldValues>({
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  isLoading,
  ...props
}: SwitchFormProps<F>) {
  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn('w-full', wrapperClassName)}>
            <div
              className={cn(
                'w-full flex flex-row items-center justify-between rounded-lg border p-4',
              )}
            >
              <div className="space-y-0.5">
                <LabelForm icon={labelIcon} required={required}>
                  {label}
                </LabelForm>

                {hint && <FormDescription>{hint}</FormDescription>}

                <FormMessage />
              </div>

              <FormControl>
                <Switch
                  {...props}
                  {...field}
                  disabled={isLoading || props.disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
