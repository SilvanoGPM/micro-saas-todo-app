import { ClipboardCheckIcon } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

import { cn } from '$utils/cn';

export interface LogoProps extends ComponentPropsWithoutRef<'h1'> {
  iconProps?: ComponentPropsWithoutRef<typeof ClipboardCheckIcon>;
  wrapperProps?: ComponentPropsWithoutRef<'div'>;
}

export function Logo({ iconProps, wrapperProps, ...props }: LogoProps) {
  return (
    <div
      {...wrapperProps}
      className={cn(
        'flex gap-1 items-center justify-center text-center',
        wrapperProps?.className,
      )}
    >
      <ClipboardCheckIcon
        {...iconProps}
        className={cn('size-6', iconProps?.className)}
      />

      <h1 {...props} className={cn('text-2xl', props.className)}>
        Todo
        <span className="text-primary font-bold">Saas</span>
      </h1>
    </div>
  );
}
