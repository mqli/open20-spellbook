import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/helpers';

export const Tabs = {
  Root: RadixTabs.Root,
  List: ({ className, ...props }: RadixTabs.TabsListProps) => (
    <RadixTabs.List
      className={cn(
        'flex border-b border-border overflow-x-auto hide-scrollbar',
        className
      )}
      {...props}
    />
  ),
  Trigger: ({ className, ...props }: RadixTabs.TabsTriggerProps) => (
    <RadixTabs.Trigger
      className={cn(
        'px-4 py-2 -mb-[1px] border-b-2 border-transparent whitespace-nowrap',
        'text-text-secondary hover:text-text-primary',
        'data-[state=active]:border-primary-600 data-[state=active]:text-primary-600',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400',
        className
      )}
      {...props}
    />
  ),
  Content: ({ className, ...props }: RadixTabs.TabsContentProps) => (
    <RadixTabs.Content
      className={cn('outline-none mt-4', className)}
      {...props}
    />
  ),
};
