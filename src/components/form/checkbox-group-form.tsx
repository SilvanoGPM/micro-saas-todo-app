import { CheckboxProps } from '@radix-ui/react-checkbox';
import { FieldValues } from 'react-hook-form';

import { Checkbox } from '$components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '$components/ui/form';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type CheckboxGroupFormProps<F extends FieldValues> = ItemFormProps<F> &
  Omit<CheckboxProps, 'form'> & {
    options: Array<{ readonly label: string; readonly value: string }>;
  };

export function CheckboxGroupForm<F extends FieldValues>({
  options,
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: CheckboxGroupFormProps<F>) {
  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={cn('w-full', wrapperClassName)}>
          <LabelForm icon={labelIcon} required={required}>
            {label}
          </LabelForm>

          {hint && <FormDescription>{hint}</FormDescription>}

          {options.map((option) => (
            <FormField
              key={option.value}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        disabled={props.isLoading || props.disabled}
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option.value,
                                ),
                              );
                        }}
                      />
                    </FormControl>

                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
