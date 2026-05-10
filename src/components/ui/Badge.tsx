import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { HTMLAttributes, ReactNode } from 'react';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        slate: 'bg-bg-tertiary text-text-secondary',
        purple: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
        success: 'bg-success/20 text-success',
        danger: 'bg-danger/20 text-danger',
        warning: 'bg-warning/20 text-warning',
        info: 'bg-info/20 text-info',
      },
    },
    defaultVariants: {
      variant: 'slate',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
