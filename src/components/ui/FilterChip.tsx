import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const filterChipVariants = cva(
  'inline-flex items-center font-medium transition-all duration-200 border cursor-pointer select-none',
  {
    variants: {
      variant: {
        slate: 'bg-bg-tertiary text-text-secondary border-border/50 hover:bg-border hover:text-text-primary',
        purple: 'bg-primary-500/15 text-primary-600 dark:text-primary-400 border-primary-500/30 hover:bg-primary-500/25 shadow-sm shadow-primary-500/10',
        success: 'bg-success/15 text-success border-success/30 hover:bg-success/25',
        danger: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/25',
        warning: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/25',
        info: 'bg-info/15 text-info border-info/30 hover:bg-info/25',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] rounded-full',
        md: 'px-2.5 py-0.5 text-xs rounded-full',
        lg: 'px-3 py-1 text-sm rounded-lg',
      },
      active: {
        true: '',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'slate',
      size: 'md',
    },
  }
);

export interface FilterChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof filterChipVariants> {
  children: ReactNode;
  active?: boolean;
}

export function FilterChip({ 
  variant, 
  size, 
  active = false,
  className, 
  children, 
  onClick,
  ...props 
}: FilterChipProps) {
  return (
    <button
      className={cn(
        filterChipVariants({ variant, size }),
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1',
        className
      )}
      onClick={onClick}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}
