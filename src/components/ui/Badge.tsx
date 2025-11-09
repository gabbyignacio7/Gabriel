import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'tier-0' | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  'tier-0': 'bg-tier-0 text-white',
  'tier-1': 'bg-tier-1 text-white',
  'tier-2': 'bg-tier-2 text-white',
  'tier-3': 'bg-tier-3 text-white',
  'tier-4': 'bg-tier-4 text-white',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
