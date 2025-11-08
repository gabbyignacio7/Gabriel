import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'red' | 'green' | 'blue' | 'gray' | 'yellow' | 'orange';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  color = 'blue',
}) => {
  const colorClasses = {
    red: 'border-red-500 bg-red-50',
    green: 'border-green-500 bg-green-50',
    blue: 'border-blue-500 bg-blue-50',
    gray: 'border-gray-300 bg-gray-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    orange: 'border-orange-500 bg-orange-50',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${colorClasses[color]} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="mt-2 flex items-baseline">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div
            className={`ml-2 text-sm ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {trendIcons[trend]} {trendValue}
          </div>
        )}
      </div>
      {subtitle && <div className="mt-1 text-sm text-gray-500">{subtitle}</div>}
    </div>
  );
};
