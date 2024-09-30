import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '$utils/cn';

import { Button } from './button';

export type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isLoading?: boolean;
};

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, isLoading, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    function handleToggleShowPassword() {
      setShowPassword(!showPassword);
    }

    const ButtonIcon = showPassword ? EyeOffIcon : EyeIcon;

    return (
      <div className="relative">
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
          disabled={isLoading || props.disabled}
          type={showPassword ? 'text' : 'password'}
          placeholder={isLoading ? 'Carregando...' : props.placeholder}
        />

        <Button
          size="icon"
          type="button"
          variant="ghost"
          className="absolute right-0 top-[50%] translate-y-[-50%]"
          onClick={handleToggleShowPassword}
        >
          <ButtonIcon className="h-[1.2rem] w-[1.2rem]" />

          <span className="sr-only">
            {showPassword ? 'Esconder senha' : 'Ver senha'}
          </span>
        </Button>
      </div>
    );
  },
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
