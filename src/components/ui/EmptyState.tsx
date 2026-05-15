import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center space-y-3', className)}>
      {icon && (
        <div className="text-text-tertiary/50 mb-2">
          {icon}
        </div>
      )}
      <p className="text-text-secondary text-sm font-medium">{title}</p>
      {description && (
        <p className="text-text-tertiary text-xs max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
