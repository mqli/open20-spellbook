import * as RadixSelect from '@radix-ui/react-select';
import { cn } from '../../utils/helpers';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

export const Select = {
  Root: RadixSelect.Root,
  Group: RadixSelect.Group,
  Value: RadixSelect.Value,
  
  Trigger: ({ className, children, ...props }: RadixSelect.SelectTriggerProps) => (
    <RadixSelect.Trigger
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  ),
  
  Content: ({ className, children, ...props }: RadixSelect.SelectContentProps) => (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={cn(
          'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg-secondary text-text-primary shadow-md animate-in fade-in-80',
          className
        )}
        position="popper"
        {...props}
      >
        <RadixSelect.ScrollUpButton className="flex items-center justify-center h-6 bg-bg-secondary cursor-default">
          <ChevronUp className="h-4 w-4" />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="p-1">
          {children}
        </RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="flex items-center justify-center h-6 bg-bg-secondary cursor-default">
          <ChevronDown className="h-4 w-4" />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  ),
  
  Item: ({ className, children, ...props }: RadixSelect.SelectItemProps) => (
    <RadixSelect.Item
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-bg-tertiary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  ),
  
  Label: ({ className, ...props }: RadixSelect.SelectLabelProps) => (
    <RadixSelect.Label
      className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold text-text-secondary', className)}
      {...props}
    />
  ),
  
  Separator: ({ className, ...props }: RadixSelect.SelectSeparatorProps) => (
    <RadixSelect.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  ),
};
