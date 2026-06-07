import * as React from 'react';

import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold block',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
