'use client';

import { HomeIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import {
  DefaultSidebar,
  DefaultSidebarFooter,
  DefaultSidebarHeader,
  DefaultSidebarMobileButton,
  DefaultSidebarMobileHeader,
  DefaultSidebarNav,
  DefaultSidebarNavGroup,
  DefaultSidebarNavItem,
  DefaultSidebarNavSpacer,
  DefaultSidebarNavTitle,
} from '$components/dashboard/sidebar';
import { Logo } from '$components/logo';
import { ToggleThemeButton } from '$components/toggle-theme';
import { ScrollArea } from '$components/ui/scroll-area';
import { ROUTES } from '$libs/auth/routes';
import { useUIStore } from '$stores/ui';

import { UserInfoDropdown } from './user-info-dropdown';

export interface MainSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const links = [
  { label: 'Tarefas', href: ROUTES.private.home.path, icon: HomeIcon },

  {
    label: 'Configurações',
    href: ROUTES.private.settings.path,
    icon: SettingsIcon,
  },
];

export function MainSidebar({ user }: MainSidebarProps) {
  const pathname = usePathname();

  function isPathActive(path: string) {
    return pathname === path;
  }

  const { isDefaultSidebarOpen, setIsDefaultSidebarOpen } = useUIStore(
    useShallow((state) => ({
      isDefaultSidebarOpen: state.isDefaultSidebarOpen,
      setIsDefaultSidebarOpen: state.setIsDefaultSidebarOpen,
    })),
  );

  return (
    <>
      <DefaultSidebarMobileHeader>
        <Logo />

        <DefaultSidebarMobileButton onOpenChange={setIsDefaultSidebarOpen} />
      </DefaultSidebarMobileHeader>

      <DefaultSidebar
        isOpen={isDefaultSidebarOpen}
        onOpenChange={setIsDefaultSidebarOpen}
      >
        <DefaultSidebarHeader>
          <Link href={ROUTES.private.home.path}>
            <Logo />
          </Link>
        </DefaultSidebarHeader>

        <DefaultSidebarNav>
          <DefaultSidebarNavGroup>
            <ScrollArea className="max-h-[40vh]">
              {links.map((link) => (
                <DefaultSidebarNavItem
                  onClick={() => setIsDefaultSidebarOpen(false)}
                  key={link.href}
                  href={link.href}
                  icon={<link.icon className="size-4" />}
                  isActive={isPathActive(link.href)}
                >
                  {link.label}
                </DefaultSidebarNavItem>
              ))}
            </ScrollArea>
          </DefaultSidebarNavGroup>

          <DefaultSidebarNavSpacer />

          <DefaultSidebarNavGroup>
            <DefaultSidebarNavTitle>Links úteis</DefaultSidebarNavTitle>
            <DefaultSidebarNavItem href="#">Ajuda</DefaultSidebarNavItem>
            <DefaultSidebarNavItem href="#">Documentação</DefaultSidebarNavItem>
          </DefaultSidebarNavGroup>
        </DefaultSidebarNav>

        <DefaultSidebarFooter>
          <UserInfoDropdown user={user} />
          <ToggleThemeButton className="flex-shrink-0" />
        </DefaultSidebarFooter>
      </DefaultSidebar>
    </>
  );
}
