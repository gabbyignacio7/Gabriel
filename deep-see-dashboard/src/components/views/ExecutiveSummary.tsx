import React from 'react';
import { useData } from '../../context/DataContext';
import { KPICard } from '../common/KPICard';
import { ExportButton } from '../common/ExportButton';
import { PriorityPieChart } from '../charts/PriorityPieChart';
import { ARRByQuarterChart } from '../charts/ARRByQuarterChart';
import { PipelineFunnelChart } from '../charts/PipelineFunnelChart';
import { formatCurrency } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';

export const ExecutiveSummary: React.FC = () => {
  const { features, tickets, opportunities, filteredFeatures } = useData();
  const navigate = useNavigate();

  const totalARR = React.useMemo(() => {
    return features.reduce((sum, f) => sum + Math.abs(f.arr_amount || 0), 0);
  }, [features]);

  const arrAtRisk = React.useMemo(() => {
    return features
      .filter((f) => f.revenue_at_risk)
      .reduce((sum, f) => sum + Math.abs(f.arr_amount || 0), 0);
  }, [features]);

  const completedFeatures = React.useMemo(() => {
    return features.filter((f) => f.current_status === 'Completed').length;
  }, [features]);

  const avgPriorityScore = React.useMemo(() => {
    const scores = features.filter((f) => f.priority_score > 0);
    if (scores.length === 0) return 0;
    return (
      scores.reduce((sum, f) => sum + f.priority_score, 0) / scores.length
    );
  }, [features]);

  const totalEffort = React.useMemo(() => {
    return features.reduce(
      (sum, f) => sum + (f.effort_estimate_weeks || 0),
      0
    );
  }, [features]);

  const avgConversion = React.useMemo(() => {
    const withConversion = opportunities.filter((o) => o.probability_percent > 0);
    if (withConversion.length === 0) return 0;
    return (
      withConversion.reduce((sum, o) => sum + o.probability_percent, 0) /
      withConversion.length
    );
  }, [opportunities]);

  const topPriorities = React.useMemo(() => {
    return [...features]
      .filter((f) => f.priority_score > 0)
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, 5);
  }, [features]);

  const atRiskFeatures = React.useMemo(() => {
    return features.filter((f) => f.revenue_at_risk || f.current_status === 'Blocked');
  }, [features]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Executive Summary Dashboard
        </h1>
        <ExportButton
          features={features}
          tickets={tickets}
          opportunities={opportunities}
          variant="full"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total ARR"
          value={formatCurrency(totalARR)}
          color="blue"
        />
        <KPICard
          title="ARR at Risk"
          value={formatCurrency(arrAtRisk)}
          color={arrAtRisk > 0 ? 'red' : 'green'}
        />
        <KPICard
          title="Features Completed"
          value={`${completedFeatures} / ${features.length}`}
          subtitle={`${((completedFeatures / features.length) * 100).toFixed(0)}%`}
          color="green"
        />
        <KPICard
          title="Avg Priority Score"
          value={avgPriorityScore.toFixed(0)}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Engineering Capacity"
          value={`${totalEffort} weeks`}
          subtitle="Total effort estimated"
          color="gray"
        />
        <KPICard
          title="Pipeline Conv Rate"
          value={`${avgConversion.toFixed(0)}%`}
          subtitle="Average probability"
          color="blue"
        />
        <KPICard
          title="Active Opportunities"
          value={opportunities.length}
          subtitle={`${opportunities.filter((o) => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost').length} in pipeline`}
          color="orange"
        />
        <KPICard
          title="On-Time Delivery"
          value="85%"
          subtitle="Historical average"
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriorityPieChart features={filteredFeatures} />
        <ARRByQuarterChart features={filteredFeatures} />
      </div>

      <div className="mb-6">
        <PipelineFunnelChart opportunities={opportunities} />
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Priorities
          </h3>
          <div className="space-y-2">
            {topPriorities.map((feature) => (
              <div
                key={feature.feature_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/feature/${feature.feature_id}`)}
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {feature.feature_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {feature.primary_client} • {feature.priority_tier}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {feature.priority_score.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(feature.arr_amount || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            At-Risk Items ({atRiskFeatures.length})
          </h3>
          <div className="space-y-2">
            {atRiskFeatures.slice(0, 5).map((feature) => (
              <div
                key={feature.feature_id}
                className="flex items-center justify-between p-3 bg-red-50 rounded border-l-4 border-red-500"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {feature.feature_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {feature.primary_client} • {feature.current_status}
                  </div>
                </div>
                <div className="text-sm font-medium text-red-600">
                  {feature.revenue_at_risk ? 'Revenue Risk' : 'Blocked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
