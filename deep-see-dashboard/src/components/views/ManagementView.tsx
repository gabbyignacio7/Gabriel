import React from 'react';
import { useData } from '../../context/DataContext';
import { FilterPanel } from '../common/FilterPanel';
import { DataTable } from '../common/DataTable';
import { formatCurrency } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import { PriorityTier } from '../../types';

export const ManagementView: React.FC = () => {
  const { filteredFeatures, filters, setFilters } = useData();
  const navigate = useNavigate();

  const tierGroups = React.useMemo(() => {
    const groups: Record<PriorityTier, typeof filteredFeatures> = {
      'Tier 0: Emergency': [],
      'Tier 1: Fast Track': [],
      'Tier 2: Standard Delivery': [],
      'Tier 3: Custom Engagement': [],
      'Tier 4: Backlog': [],
    };

    filteredFeatures.forEach((feature) => {
      groups[feature.priority_tier].push(feature);
    });

    // Sort each tier by priority score descending
    Object.keys(groups).forEach((tier) => {
      groups[tier as PriorityTier].sort(
        (a, b) => b.priority_score - a.priority_score
      );
    });

    return groups;
  }, [filteredFeatures]);

  const columns = [
    {
      key: 'feature_name',
      header: 'Feature',
      sortable: true,
    },
    {
      key: 'primary_client',
      header: 'Client',
      sortable: true,
    },
    {
      key: 'arr_amount',
      header: 'ARR',
      sortable: true,
      render: (value: number) => formatCurrency(value || 0),
    },
    {
      key: 'priority_score',
      header: 'Score',
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-blue-600">{value.toFixed(0)}</span>
      ),
    },
    {
      key: 'effort_estimate_weeks',
      header: 'Effort',
      sortable: true,
      render: (value: number) => `${value || 0} weeks`,
    },
    {
      key: 'quarter_planned',
      header: 'Quarter',
      sortable: true,
    },
  ];

  const tierColors: Record<PriorityTier, string> = {
    'Tier 0: Emergency': 'red',
    'Tier 1: Fast Track': 'orange',
    'Tier 2: Standard Delivery': 'yellow',
    'Tier 3: Custom Engagement': 'blue',
    'Tier 4: Backlog': 'gray',
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Management View - Revenue Prioritization
      </h1>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        showClientFilter={true}
        showQuarterFilter={true}
        showAgentFilter={true}
        showTierFilter={false}
      />

      <div className="space-y-6">
        {(Object.keys(tierGroups) as PriorityTier[]).map((tier) => {
          const features = tierGroups[tier];
          if (features.length === 0) return null;

          const totalARR = features.reduce(
            (sum, f) => sum + (f.arr_amount || 0),
            0
          );

          return (
            <div
              key={tier}
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${tierColors[tier]}-500`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{tier}</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total ARR</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(totalARR)}
                  </div>
                </div>
              </div>
              <DataTable
                columns={columns}
                data={features}
                onRowClick={(row) => navigate(`/feature/${row.feature_id}`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
