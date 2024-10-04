'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button, ButtonProps } from './ui/button';

/**
 * Componente que permite alternar entre os temas claro e escuro.
 *
 * Utiliza o hook `useTheme` da biblioteca `next-themes` para gerenciar o tema atual.
 *
 * - Quando clicado, alterna entre os temas 'light' e 'dark'.
 * - Exibe ícones representando o sol e a lua, dependendo do tema atual.
 */
export function ToggleThemeButton(props: ButtonProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      variant="outline"
      size="icon"
      aria-label="Trocar de tema"
      {...props}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Trocar de tema</span>
    </Button>
  );
}
