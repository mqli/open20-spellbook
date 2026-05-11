import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

interface SheetProps extends RadixDialog.DialogProps {
  children?: ReactNode;
}

export function Sheet({ children, ...props }: SheetProps) {
  return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>;
}

Sheet.Trigger = RadixDialog.Trigger;
Sheet.Close = RadixDialog.Close;

interface SheetContentProps extends RadixDialog.DialogContentProps {
  side?: 'left' | 'right' | 'bottom';
}

Sheet.Content = ({ 
  children, 
  className, 
  side = 'right', 
  ...props 
}: SheetContentProps) => {
  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-full md:w-[540px] transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
    left: 'inset-y-0 left-0 h-full w-full md:w-[540px] transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    bottom: 'inset-x-0 bottom-0 h-[85vh] w-full rounded-t-2xl transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  };

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed z-50 bg-bg-secondary flex flex-col shadow-xl outline-none',
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

Sheet.Header = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex items-center justify-between p-4 border-b border-border bg-bg-primary md:bg-bg-secondary sticky top-0 z-10', className)}>
    {children}
  </div>
);

Sheet.Title = ({ children, className }: { children: ReactNode; className?: string }) => (
  <RadixDialog.Title className={cn('text-lg font-semibold text-text-primary', className)}>
    {children}
  </RadixDialog.Title>
);

Sheet.Body = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex-1 overflow-y-auto p-4 md:p-6 bg-bg-primary', className)}>
    {children}
  </div>
);
