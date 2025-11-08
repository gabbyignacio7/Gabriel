import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Feature } from '../../types';

interface ARRByQuarterChartProps {
  features: Feature[];
}

export const ARRByQuarterChart: React.FC<ARRByQuarterChartProps> = ({ features }) => {
  const data = React.useMemo(() => {
    const quarterData: Record<string, number> = {
      'Q4 2025': 0,
      'Q1 2026': 0,
      'Q2 2026': 0,
      'Q3 2026': 0,
      'Q4 2026': 0,
    };

    features.forEach((feature) => {
      const quarter = feature.quarter_planned;
      const arr = feature.arr_amount || 0;
      if (quarter && quarterData.hasOwnProperty(quarter)) {
        quarterData[quarter] += Math.abs(arr);
      }
    });

    return Object.entries(quarterData).map(([quarter, arr]) => ({
      quarter,
      arr,
    }));
  }, [features]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ARR by Quarter</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis
            tickFormatter={(value) =>
              `$${(value / 1000000).toFixed(1)}M`
            }
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="arr"
            stroke="#2563EB"
            strokeWidth={2}
            name="ARR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
