import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Button } from '$components/ui/button';
import { Sheet, SheetContent } from '$components/ui/sheet';
import { cn } from '$utils/cn';

export interface DefaultSidebarSharedProps {
  className?: string;
  children?: ReactNode;
}

export interface DefaultSidebarProps extends DefaultSidebarSharedProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  mobileSheet?: boolean;
}

export interface DefaultSidebarNavItemProps extends DefaultSidebarSharedProps {
  onClick?: () => void;
  icon?: ReactNode;
  href: string;
  isActive?: boolean;
}

export function DefaultSidebar({
  className,
  children,
  isOpen,
  onOpenChange,
  mobileSheet = true,
}: DefaultSidebarProps) {
  return (
    <>
      <aside className={cn('flex flex-col', className)}>{children}</aside>

      {mobileSheet && (
        <DefaultSidebarMobileSheet
          className="lg:hidden"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </DefaultSidebarMobileSheet>
      )}
    </>
  );
}

export function DefaultSidebarHeader({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <header
      className={cn('h-20 py-6 px-4 border-b flex items-center ', className)}
    >
      {children}
    </header>
  );
}

export function DefaultSidebarFooter({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <footer
      className={cn(
        'h-20 py-6 px-4 border-t flex items-center justify-between',
        className,
      )}
    >
      {children}
    </footer>
  );
}

export function DefaultSidebarNav({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <nav className={cn('py-6 px-4 flex-1 flex flex-col gap-2', className)}>
      {children}
    </nav>
  );
}

export function DefaultSidebarNavGroup({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <div className={cn('w-full flex flex-col', className)}>{children}</div>
  );
}

export function DefaultSidebarNavTitle({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <h3
      className={cn('uppercase text-muted-foreground text-sm px-2', className)}
    >
      {children}
    </h3>
  );
}

export function DefaultSidebarNavItem({
  href,
  icon,
  className,
  children,
  isActive,
  onClick,
}: DefaultSidebarNavItemProps) {
  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        'flex gap-2 items-center text-foreground p-2 rounded-md',
        className,
        {
          'bg-muted': isActive,
        },
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function DefaultSidebarNavSpacer({
  className,
}: DefaultSidebarSharedProps) {
  return <div className={cn('mt-auto', className)} />;
}

export function DefaultSidebarMobileHeader({
  className,
  children,
}: DefaultSidebarSharedProps) {
  return (
    <header
      className={cn(
        'p-4 border-b flex gap-2 items-center justify-between lg:hidden',
        className,
      )}
    >
      {children}
    </header>
  );
}

export function DefaultSidebarMobileButton({
  className,
  children,
  onOpenChange,
}: DefaultSidebarProps) {
  return (
    <Button
      onClick={() => onOpenChange?.(true)}
      size="icon"
      className={cn('lg:hidden', className)}
      variant="outline"
    >
      {children ?? <MenuIcon className="size-4" />}
    </Button>
  );
}

function DefaultSidebarMobileSheet({
  className,
  children,
  isOpen,
  onOpenChange,
}: DefaultSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className={cn('p-0 w-full flex flex-col gap-2', className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
