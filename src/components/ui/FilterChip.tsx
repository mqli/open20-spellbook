import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import Toggle from './Toggle';
import type { ReactNode } from 'react';

const filterChipVariants = cva(
  'inline-flex items-center font-medium transition-all duration-200 border',
  {
    variants: {
      variant: {
        slate: 'border-border/50',
        purple: 'border-primary-500/30 shadow-sm shadow-primary-500/10',
        success: 'border-success/30',
        danger: 'border-danger/30',
        warning: 'border-warning/30',
        info: 'border-info/30',
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

export interface FilterChipProps
  extends Omit<VariantProps<typeof filterChipVariants>, 'active'> {
  children: ReactNode;
  active?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  className?: string;
}

export function FilterChip({ 
  variant, 
  size, 
  active = false,
  className, 
  children, 
  onPressedChange,
  ...props 
}: FilterChipProps) {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onPressedChange}
      className={cn(
        filterChipVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {children}
    </Toggle>
  );
}
