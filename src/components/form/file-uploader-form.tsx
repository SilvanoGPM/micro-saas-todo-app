import { FieldValues } from 'react-hook-form';

import { FileUploader, FileUploaderProps } from '$components/ui/file-uploader';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '$components/ui/form';
import { cn } from '$utils/cn';

import { LabelForm } from './label-form';
import { ItemFormProps } from './types';

export type FileUploaderFormProps<F extends FieldValues> = ItemFormProps<F> &
  FileUploaderProps;

export function FileUploaderForm<F extends FieldValues>({
  form,
  name,
  label,
  labelIcon,
  required,
  isLoading,
  hint,
  wrapperClassName,
  ...props
}: FileUploaderFormProps<F>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className={cn('space-y-6', wrapperClassName)}>
          <FormItem className="w-full">
            <LabelForm icon={labelIcon} required={required}>
              {label}
            </LabelForm>

            <FormControl>
              <FileUploader
                isInvalid={Boolean(form.formState.errors[name])}
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
                {...props}
              />
            </FormControl>

            {hint && <FormDescription>{hint}</FormDescription>}

            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
}
