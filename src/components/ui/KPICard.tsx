import { Card } from './Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  description?: string;
  icon?: React.ReactNode;
}

export function KPICard({ label, value, trend, description, icon }: KPICardProps) {
  return (
    <Card className="kpi-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="kpi-label">{label}</p>
          <p className="kpi-value">{value}</p>

          {trend && (
            <div className={`kpi-trend flex items-center gap-1 ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {icon && (
          <div className="text-deepsee-accent opacity-20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
