import { ComponentPropsWithoutRef } from 'react';

import { cn } from '$utils/cn';

export function Logo(props: ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1 {...props} className={cn('text-2xl', props.className)}>
      Todo
      <span className="text-primary font-bold">Saas</span>
    </h1>
  );
}
