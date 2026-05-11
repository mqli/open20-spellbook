import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { HTMLAttributes, ReactNode } from 'react';

const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors',
  {
    variants: {
      variant: {
        slate: 'bg-bg-tertiary text-text-secondary border border-border/50',
        purple: 'bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20',
        success: 'bg-success/15 text-success border border-success/20',
        danger: 'bg-danger/15 text-danger border border-danger/20',
        warning: 'bg-warning/15 text-warning border border-warning/20',
        info: 'bg-info/15 text-info border border-info/20',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px] rounded-full',
        md: 'px-2 py-0.5 text-xs rounded-full',
        lg: 'px-3 py-1 text-sm rounded-lg',
      }
    },
    defaultVariants: {
      variant: 'slate',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ variant, size, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
