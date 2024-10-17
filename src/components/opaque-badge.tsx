import { ComponentPropsWithoutRef } from 'react';

import { cn } from '$utils/cn';
import { toAlphaHex } from '$utils/to-alpha-hex';

export interface OpaqueBadgeProps extends ComponentPropsWithoutRef<'div'> {
  color: string;
}
export function OpaqueBadge({
  children,
  color,
  className,
  ...props
}: OpaqueBadgeProps) {
  return (
    <div
      className={cn('h-full w-full border text-center rounded-full', className)}
      style={{
        borderColor: color,
        backgroundColor: toAlphaHex(color, 30),
        color,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
