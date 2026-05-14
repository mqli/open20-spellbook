import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/helpers';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 hover:bg-primary-800 text-white',
        secondary: 'bg-bg-tertiary hover:bg-border text-text-primary',
        ghost: 'hover:bg-bg-tertiary text-primary-600 dark:text-primary-400',
        danger: 'bg-danger hover:bg-red-700 text-white',
        warning: 'bg-warning hover:bg-amber-600 text-white',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ 
  variant, 
  size, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
