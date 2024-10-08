'use client';

import { CreditCardIcon, PaintbrushIcon, UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  DefaultSidebar,
  DefaultSidebarNav,
  DefaultSidebarNavGroup,
  DefaultSidebarNavItem,
} from '$components/dashboard/sidebar';
import { ROUTES } from '$libs/auth/routes';
import { isPathActive } from '$utils/is-path-active';

const links = [
  { label: 'Perfil', href: ROUTES.private.settings.path, icon: UserIcon },

  {
    label: 'Tema',
    href: ROUTES.private.theme.path,
    icon: PaintbrushIcon,
  },

  {
    label: 'Planos',
    href: ROUTES.private.billing.path,
    icon: CreditCardIcon,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <DefaultSidebar mobileSheet={false} className="md:max-w-[150px] w-full">
      <DefaultSidebarNav className="p-0">
        <DefaultSidebarNavGroup>
          {links.map((link) => (
            <DefaultSidebarNavItem
              key={link.href}
              href={link.href}
              icon={<link.icon className="size-4" />}
              isActive={isPathActive({
                activePath: pathname,
                path: link.href,
              })}
            >
              {link.label}
            </DefaultSidebarNavItem>
          ))}
        </DefaultSidebarNavGroup>
      </DefaultSidebarNav>
    </DefaultSidebar>
  );
}
