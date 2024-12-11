'use client';

import { Loader2Icon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { BorderBeam } from '$components/ui/border-beam';

export function LandingPageSaasImage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full max-w-6xl mx-auto container relative">
      <div className="bg-[#9c40ffaa] blur-[150px] absolute inset-8" />
      <div className="relative max-w-screen-lg border rounded-2xl overflow-hidden min-h-20 ">
        {resolvedTheme && (
          <img
            key={resolvedTheme}
            src={`/images/lp/${resolvedTheme}/tasks-desktop.png`}
          />
        )}

        <div className="z-[-1] absolute inset-0 flex items-center justify-center min-h-20 h-full py-8">
          <Loader2Icon className="size-16 animate-spin" />
        </div>

        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
}
