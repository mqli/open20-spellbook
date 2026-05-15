import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { HTMLAttributes, ReactNode } from 'react';

const cardVariants = cva(
  'bg-bg-secondary border rounded-xl p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm hover:shadow-md hover:border-primary-300',
        interactive: 'cursor-pointer hover:shadow-md hover:border-primary-300',
        selected: 'border-primary-400 shadow-md ring-1 ring-primary-400/60',
        warning: 'border-warning ring-2 ring-warning/50 bg-warning/5',
        info: 'border-info/50 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export function Card({
  variant,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
