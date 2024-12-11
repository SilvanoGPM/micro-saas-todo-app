'use client';

import { useTheme } from 'next-themes';

import Particles from '$components/ui/particles';

export function LandingPageParticles() {
  const { resolvedTheme } = useTheme();

  return (
    <Particles
      className="absolute inset-0"
      quantity={25}
      ease={80}
      color={resolvedTheme === 'dark' ? '#ffffff' : '#000000'}
      refresh
    />
  );
}
