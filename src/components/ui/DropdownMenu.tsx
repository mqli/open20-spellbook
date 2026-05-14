import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils/helpers';
import { Check, ChevronRight } from 'lucide-react';

export const DropdownMenu = {
  Root: RadixDropdownMenu.Root,
  Trigger: RadixDropdownMenu.Trigger,
  Group: RadixDropdownMenu.Group,
  Label: RadixDropdownMenu.Label,
  Separator: RadixDropdownMenu.Separator,
  
  Content: ({ className, sideOffset = 4, ...props }: RadixDropdownMenu.DropdownMenuContentProps) => (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg-secondary p-1 text-text-primary shadow-md animate-in fade-in-80',
          className
        )}
        {...props}
      >
        {props.children}
        <RadixDropdownMenu.Arrow className="fill-bg-secondary" />
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  ),
  
  Item: ({ className, children, ...props }: RadixDropdownMenu.DropdownMenuItemProps) => (
    <RadixDropdownMenu.Item
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-bg-tertiary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </RadixDropdownMenu.Item>
  ),
  
  CheckboxItem: ({ className, children, ...props }: RadixDropdownMenu.DropdownMenuCheckboxItemProps) => (
    <RadixDropdownMenu.CheckboxItem
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-bg-tertiary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.CheckboxItem>
  ),
  
  RadioGroup: RadixDropdownMenu.RadioGroup,
  
  RadioItem: ({ className, children, ...props }: RadixDropdownMenu.DropdownMenuRadioItemProps) => (
    <RadixDropdownMenu.RadioItem
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-bg-tertiary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <div className="h-2 w-2 rounded-full bg-primary-600" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.RadioItem>
  ),
  
  Sub: RadixDropdownMenu.Sub,
  
  SubTrigger: ({ className, children, ...props }: RadixDropdownMenu.DropdownMenuSubTriggerProps) => (
    <RadixDropdownMenu.SubTrigger
      className={cn(
        'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-bg-tertiary data-[state=open]:bg-bg-tertiary',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </RadixDropdownMenu.SubTrigger>
  ),
  
  SubContent: ({ className, ...props }: RadixDropdownMenu.DropdownMenuSubContentProps) => (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.SubContent
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg-secondary p-1 text-text-primary shadow-md animate-in fade-in-80',
          className
        )}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  ),
};
