import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { format } from '$libs/date-fns';
import { cn } from '$utils/cn';

import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { FormControl } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface InputDatePickerProps {
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onChange?: (date?: Date) => void;
  value?: Date;

  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

export function InputDatePicker({
  isLoading,
  disabled,
  className,
  onChange,
  value,
  calendarProps,
}: InputDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);

  const handleSelect = useCallback(
    (date?: Date) => {
      setDate(date);
      onChange?.(date);
    },
    [onChange],
  );

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            disabled={isLoading || disabled}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            {date ? (
              format(date, 'PPP')
            ) : (
              <span>{isLoading ? 'Carregando...' : 'Escolha uma data'}</span>
            )}

            <CalendarIcon className="ml-auto h-4 w-4" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          fromYear={1900}
          toYear={2100}
          removeLabel
          captionLayout="dropdown-buttons"
          initialFocus
          {...calendarProps}
          mode="single"
          selected={date}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
