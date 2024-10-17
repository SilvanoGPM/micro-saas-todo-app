import { ReactNode } from 'react';

import { cn } from '$utils/cn';

export interface DefaultPageProps {
  className?: string;
  children?: ReactNode;
}

export function DefaultPage({ children, className }: DefaultPageProps) {
  return (
    <main
      className={cn(
        'overflow-auto h-full max-w-full flex-1 flex flex-col',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function DefaultPageSection({ children, className }: DefaultPageProps) {
  return (
    <section className={cn('px-4 py-6 flex-1 flex flex-col', className)}>
      {children}
    </section>
  );
}

export function DefaultPageHeader({ children, className }: DefaultPageProps) {
  return (
    <header
      className={cn(
        'h-20 px-4 pt-6 pb-0 lg:pb-6 lg:border-b flex items-center gap-2',
        className,
      )}
    >
      {children}
    </header>
  );
}

export function DefaultPageTitle({ children, className }: DefaultPageProps) {
  return <h1 className={cn('font-bold text-2xl', className)}>{children}</h1>;
}

export function DefaultPageFooter({ children, className }: DefaultPageProps) {
  return (
    <footer
      className={cn(
        'h-20 px-4 py-6 border-t flex flex-col items-center justify-center',
        className,
      )}
    >
      {children}
    </footer>
  );
}
