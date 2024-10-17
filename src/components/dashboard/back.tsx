'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button, ButtonProps } from '$components/ui/button';

export function BackButton(props: ButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      {...props}
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="size-4" />
      {props.children}
    </Button>
  );
}
