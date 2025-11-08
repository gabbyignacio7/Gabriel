import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Feature } from '../../types';

interface PriorityPieChartProps {
  features: Feature[];
}

export const PriorityPieChart: React.FC<PriorityPieChartProps> = ({ features }) => {
  const tierColors: Record<string, string> = {
    'Tier 0: Emergency': '#FF0000',
    'Tier 1: Fast Track': '#FFA500',
    'Tier 2: Standard Delivery': '#FFFF00',
    'Tier 3: Custom Engagement': '#ADD8E6',
    'Tier 4: Backlog': '#D3D3D3',
  };

  const data = React.useMemo(() => {
    const tierData: Record<string, number> = {};

    features.forEach((feature) => {
      const tier = feature.priority_tier;
      const arr = feature.arr_amount || 0;
      tierData[tier] = (tierData[tier] || 0) + Math.abs(arr);
    });

    return Object.entries(tierData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [features]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ARR by Priority Tier
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={tierColors[entry.name] || '#999999'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
