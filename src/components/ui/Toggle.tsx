import * as RadixToggle from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

const toggleVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 border cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        slate: 'bg-bg-tertiary text-text-secondary border-border/50 hover:bg-border hover:text-text-primary data-[state=on]:bg-border data-[state=on]:text-text-primary',
        purple: 'bg-primary-500/15 text-primary-600 dark:text-primary-400 border-primary-500/30 hover:bg-primary-500/25 shadow-sm shadow-primary-500/10 data-[state=on]:bg-primary-500/30 data-[state=on]:border-primary-500/50',
        success: 'bg-success/15 text-success border-success/30 hover:bg-success/25 data-[state=on]:bg-success/30 data-[state=on]:border-success/50',
        danger: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/25 data-[state=on]:bg-danger/30 data-[state=on]:border-danger/50',
        warning: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/25 data-[state=on]:bg-warning/30 data-[state=on]:border-warning/50',
        info: 'bg-info/15 text-info border-info/30 hover:bg-info/25 data-[state=on]:bg-info/30 data-[state=on]:border-info/50',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] rounded-full',
        md: 'px-2.5 py-0.5 text-xs rounded-full',
        lg: 'px-3 py-1 text-sm rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'slate',
      size: 'md',
    },
  }
);

export interface ToggleProps
  extends Omit<RadixToggle.ToggleProps, 'asChild'>,
    VariantProps<typeof toggleVariants> {
  children: ReactNode;
}

export function Toggle({ variant, size, className, children, ...props }: ToggleProps) {
  return (
    <RadixToggle.Root
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </RadixToggle.Root>
  );
}

export default Toggle;
