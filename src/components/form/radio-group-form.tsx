import { RadioGroupProps } from '@radix-ui/react-radio-group';
import { FieldValues, Path, PathValue } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '$components/ui/form';
import { RadioGroup, RadioGroupItem } from '$components/ui/radio-group';
import { cn } from '$utils/cn';

import { ItemFormProps } from './types';
import { LabelForm } from './label-form';

export type RadioGroupFormProps<
  F extends FieldValues,
  T extends Path<F>,
> = ItemFormProps<F> &
  Omit<RadioGroupProps, 'form'> & {
    // options agora depende da chave que estamos utilizando do schema
    options: Array<{ label: string; value: PathValue<F, T> }>;
  };

export function RadioGroupForm<F extends FieldValues, T extends Path<F>>({
  options,
  form,
  name,
  label,
  required,
  labelIcon,
  wrapperClassName,
  hint,
  ...props
}: RadioGroupFormProps<F, T>) {
  return (
    <FormField
      disabled={props.disabled || props.isLoading}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', wrapperClassName)}>
          <LabelForm icon={labelIcon} required={required} className="mb-4">
            {label}
          </LabelForm>

          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              disabled={props.isLoading || props.disabled}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem
                      value={option.value}
                      disabled={props.isLoading || props.disabled}
                    />
                  </FormControl>

                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          {hint && <FormDescription>{hint}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
