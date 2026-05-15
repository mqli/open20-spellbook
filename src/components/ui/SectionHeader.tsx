import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  icon,
  title,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2 mb-4', className)}>
      {icon && <span className="text-primary-500">{icon}</span>}
      <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] flex-1">
        {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
}
