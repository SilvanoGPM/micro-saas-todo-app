import * as React from 'react';
import ReactInputMask, { Props } from 'react-input-mask';

import { cn } from '$utils/cn';

export interface InputMaskProps extends Props {
  isLoading?: boolean;
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ className, type, isLoading = false, ...props }, ref) => {
    return (
      <ReactInputMask
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        inputRef={ref}
        {...props}
        disabled={isLoading || props.disabled}
        placeholder={isLoading ? 'Carregando...' : props.placeholder}
      />
    );
  },
);
InputMask.displayName = 'InputMask';

export { InputMask };
