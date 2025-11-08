import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Opportunity, PipelineStage } from '../../types';

interface PipelineFunnelChartProps {
  opportunities: Opportunity[];
}

export const PipelineFunnelChart: React.FC<PipelineFunnelChartProps> = ({
  opportunities,
}) => {
  const data = React.useMemo(() => {
    const stageOrder: PipelineStage[] = [
      'Introduction',
      'Qualification',
      'Proposal',
      'POC',
      'Contract Negotiation',
      'Closed Won',
    ];

    const stageData: Record<PipelineStage, { count: number; arr: number }> = {
      Introduction: { count: 0, arr: 0 },
      Qualification: { count: 0, arr: 0 },
      Proposal: { count: 0, arr: 0 },
      POC: { count: 0, arr: 0 },
      'Contract Negotiation': { count: 0, arr: 0 },
      'Closed Won': { count: 0, arr: 0 },
      'Closed Lost': { count: 0, arr: 0 },
    };

    opportunities.forEach((opp) => {
      if (stageData[opp.stage]) {
        stageData[opp.stage].count += 1;
        stageData[opp.stage].arr += opp.arr_value;
      }
    });

    return stageOrder.map((stage) => ({
      stage,
      count: stageData[stage].count,
      arr: stageData[stage].arr,
    }));
  }, [opportunities]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sales Pipeline Funnel
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
          <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10B981"
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'ARR') {
                return `$${value.toLocaleString()}`;
              }
              return value;
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#2563EB" name="Count" />
          <Bar yAxisId="right" dataKey="arr" fill="#10B981" name="ARR" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
