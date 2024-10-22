import { PropsWithChildren } from 'react';

import { cn } from '$utils/cn';

const tableAttributes = {
  role: 'presentation',
  cellPadding: 0,
  cellSpacing: 0,
};

interface EmailComponentProps {
  className?: string;
}

export const Row: React.FC<PropsWithChildren<EmailComponentProps>> = ({
  children,
  className,
}) => {
  return (
    <table
      {...tableAttributes}
      {...({ border: '0' } as Record<string, string>)}
      className={cn(className, 'w-full')}
    >
      <tr>{children}</tr>
    </table>
  );
};

export const Column: React.FC<PropsWithChildren<EmailComponentProps>> = ({
  children,
  className,
}) => {
  return <td className={className}>{children}</td>;
};
