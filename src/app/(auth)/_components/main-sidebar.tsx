'use client';

import { HomeIcon, SettingsIcon, Users2Icon } from 'lucide-react';
import { Session } from 'next-auth';
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
import { hasSomeRoles, isAdmin } from '$libs/auth/roles';
import { ROUTES } from '$libs/auth/routes';
import { useUIStore } from '$stores/ui';
import { isPathActive } from '$utils/is-path-active';

import { UserInfoDropdown } from './user-info-dropdown';

export interface MainSidebarProps {
  user: Session['user'];
}

const links = [
  {
    ...ROUTES.private.home,
    label: 'Tarefas',
    icon: HomeIcon,
  },

  {
    ...ROUTES.private.users,
    label: 'Usuários',
    icon: Users2Icon,
  },

  {
    ...ROUTES.private.settings,
    label: 'Configurações',
    icon: SettingsIcon,
  },
];

export function MainSidebar({ user }: MainSidebarProps) {
  const pathname = usePathname();

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

      <div className="lg:w-full lg:max-w-[300px]" />

      <DefaultSidebar
        isOpen={isDefaultSidebarOpen}
        onOpenChange={setIsDefaultSidebarOpen}
        className="h-full hidden lg:flex flex-col lg:w-full lg:max-w-[300px] lg:fixed left-0 top-0 lg:border-r"
      >
        <DefaultSidebarHeader>
          <Link href={ROUTES.private.home.path}>
            <Logo />
          </Link>
        </DefaultSidebarHeader>

        <DefaultSidebarNav>
          <DefaultSidebarNavGroup>
            <ScrollArea className="max-h-[40vh]">
              {links
                .filter(
                  (link) => isAdmin(user) || hasSomeRoles(user, ...link.roles),
                )
                .map((link) => (
                  <DefaultSidebarNavItem
                    onClick={() => setIsDefaultSidebarOpen(false)}
                    key={link.path}
                    href={link.path}
                    icon={<link.icon className="size-4" />}
                    isActive={isPathActive({
                      activePath: pathname,
                      path: link.path,
                      mode: 'startsWith',
                    })}
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
