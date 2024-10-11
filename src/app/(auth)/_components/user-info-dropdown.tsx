'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '$components/ui/dropdown-menu';
import { ROUTES } from '$libs/auth/routes';
import { getFirstString } from '$utils/strings';

import type { MainSidebarProps } from './main-sidebar';

export function UserInfoDropdown({ user }: MainSidebarProps) {
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);

  async function handleSignOut(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    setIsLeaving(true);

    try {
      await signOut({
        redirect: false,
      });

      router.push(ROUTES.auth.login);
    } catch {
      setIsLeaving(false);
    }
  }

  return (
    <DropdownMenu>
      <div className="flex gap-2 items-center max-w-[60%]">
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.image || ''} alt={user?.name || ''} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <div className="max-w-full">
          <p title={user?.name || ''} className="truncate">
            {getFirstString(user.name || '')}
          </p>

          <p
            title={user.email}
            className="truncate text-muted-foreground text-sm"
          >
            {user.email}
          </p>
        </div>
      </div>

      <DropdownMenuContent align="end" className="ml-4">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Configurações</DropdownMenuItem>
        <DropdownMenuItem>Suporte</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isLeaving}
          onClick={handleSignOut}
          className="text-destructive"
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
