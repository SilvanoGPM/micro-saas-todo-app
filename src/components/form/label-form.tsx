import { ComponentType, ReactNode } from 'react';

import { FormLabel } from '$components/ui/form';
import { cn } from '$utils/cn';

export interface LabelFormProps {
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function LabelForm({
  icon: Icon,
  children,
  required,
  className,
}: LabelFormProps) {
  if (!children) return null;

  return (
    <FormLabel className={cn('flex items-center space-x-1', className)}>
      {Icon && <Icon className="size-4" />}

      <span className="flex-1">
        {children} {required && <span className="text-red-500">*</span>}
      </span>
    </FormLabel>
  );
}
