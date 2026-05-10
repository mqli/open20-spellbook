import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/helpers';
import type { ComponentPropsWithoutRef } from 'react';

export const Dialog = {
  Root: RadixDialog.Root,
  Trigger: RadixDialog.Trigger,
  
  Content: ({ className, children, ...props }: RadixDialog.DialogContentProps) => (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
      <RadixDialog.Content
        className={cn(
          'fixed z-50 bg-bg-secondary rounded-lg shadow-xl',
          'p-6 max-h-[85vh] overflow-y-auto',
          'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]',
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  ),
  
  Header: ({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) => (
    <div className={cn('mb-4 pb-4 border-b border-border', className)} {...props}>
      {children}
    </div>
  ),
  
  Title: ({ className, ...props }: RadixDialog.DialogTitleProps) => (
    <RadixDialog.Title
      className={cn('text-xl font-bold text-text-primary', className)}
      {...props}
    />
  ),
  
  Description: ({ className, ...props }: RadixDialog.DialogDescriptionProps) => (
    <RadixDialog.Description
      className={cn('text-sm text-text-secondary mt-1', className)}
      {...props}
    />
  ),
  
  Close: ({ className, children, ...props }: RadixDialog.DialogCloseProps) => (
    <RadixDialog.Close
      className={cn(
        'absolute top-4 right-4 p-1 rounded hover:bg-bg-tertiary',
        'text-text-secondary hover:text-text-primary transition-colors',
        className
      )}
      {...props}
    >
      {children || '×'}
    </RadixDialog.Close>
  ),
};
