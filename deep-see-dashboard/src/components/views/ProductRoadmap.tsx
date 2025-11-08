import React from 'react';
import { useData } from '../../context/DataContext';
import { FilterPanel } from '../common/FilterPanel';
import { DataTable } from '../common/DataTable';
import { formatCurrency, getTierColor } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';
import { Quarter } from '../../types';

export const ProductRoadmap: React.FC = () => {
  const { filteredFeatures, filters, setFilters } = useData();
  const navigate = useNavigate();

  const quarterGroups = React.useMemo(() => {
    const groups: Record<Quarter, typeof filteredFeatures> = {
      'Q4 2025': [],
      'Q1 2026': [],
      'Q2 2026': [],
      'Q3 2026': [],
      'Q4 2026': [],
    };

    filteredFeatures.forEach((feature) => {
      groups[feature.quarter_planned].push(feature);
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
      key: 'agent_type',
      header: 'Agent Type',
      sortable: true,
    },
    {
      key: 'primary_client',
      header: 'Client',
      sortable: true,
    },
    {
      key: 'priority_tier',
      header: 'Tier',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getTierColor(value as any)}`}>
          {value.replace('Tier ', 'T')}
        </span>
      ),
    },
    {
      key: 'arr_amount',
      header: 'ARR',
      sortable: true,
      render: (value: number) => formatCurrency(value || 0),
    },
    {
      key: 'current_status',
      header: 'Status',
      sortable: true,
    },
    {
      key: 'completion_percent',
      header: 'Progress',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Product Roadmap - Timeline View
      </h1>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        showClientFilter={true}
        showQuarterFilter={false}
        showTierFilter={true}
        showAgentFilter={true}
        showStatusFilter={true}
      />

      <div className="space-y-6">
        {(Object.keys(quarterGroups) as Quarter[]).map((quarter) => {
          const features = quarterGroups[quarter];
          if (features.length === 0) return null;

          const totalARR = features.reduce(
            (sum, f) => sum + (f.arr_amount || 0),
            0
          );

          return (
            <div key={quarter} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{quarter}</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Quarter ARR</div>
                  <div className="text-lg font-bold text-green-600">
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
