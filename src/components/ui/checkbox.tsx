import { forwardRef } from 'react';

import { cn } from '../../lib/utils';

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'checkbox', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'h-4 w-4 rounded border-[#D1CEBF] text-[#A6A18F] focus:ring-2 focus:ring-[#A6A18F]/20 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';
