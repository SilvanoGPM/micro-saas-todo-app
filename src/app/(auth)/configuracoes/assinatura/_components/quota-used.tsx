'use client';

import { Progress } from '$components/ui/progress';
import { cn } from '$utils/cn';

export interface QuotaUsedProps {
  name: string;
  current: number;
  max: number;
  usage?: number;
  className?: string;
}

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function QuotaUsed({
  name,
  current,
  max,
  className,
  usage: rawUsage,
}: QuotaUsedProps) {
  const usage = rawUsage ?? current / max;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between text-muted-foreground mb-1">
        <span>
          {name}: {current}/{max === Infinity ? <>&#8734;</> : max}
        </span>

        <span>{percentageFormatter.format(usage)}</span>
      </div>

      <Progress value={usage * 100} />
    </div>
  );
}
