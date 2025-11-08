import React from 'react';
import { useData } from '../../context/DataContext';
import { FilterPanel } from '../common/FilterPanel';
import { KPICard } from '../common/KPICard';
import { DataTable } from '../common/DataTable';
import { formatCurrency, getTierColor } from '../../utils/calculations';
import { useNavigate } from 'react-router-dom';

export const SalesView: React.FC = () => {
  const { filteredFeatures, filters, setFilters } = useData();
  const navigate = useNavigate();

  const clientGroups = React.useMemo(() => {
    const groups: Record<string, typeof filteredFeatures> = {};
    filteredFeatures.forEach((feature) => {
      const client = feature.primary_client;
      if (!groups[client]) {
        groups[client] = [];
      }
      groups[client].push(feature);
    });
    return groups;
  }, [filteredFeatures]);

  const columns = [
    {
      key: 'feature_name',
      header: 'Feature Name',
      sortable: true,
    },
    {
      key: 'current_status',
      header: 'Status',
      sortable: true,
    },
    {
      key: 'arr_amount',
      header: 'ARR',
      sortable: true,
      render: (value: number) => formatCurrency(value || 0),
    },
    {
      key: 'priority_tier',
      header: 'Tier',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getTierColor(value as any)}`}>
          {value}
        </span>
      ),
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
        Sales View - Client Dashboard
      </h1>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        showTierFilter={true}
        showQuarterFilter={true}
        showAgentFilter={true}
        showStatusFilter={true}
      />

      <div className="space-y-6">
        {Object.entries(clientGroups).map(([client, features]) => {
          const totalARR = features.reduce(
            (sum, f) => sum + (f.arr_amount || 0),
            0
          );
          const avgProgress =
            features.reduce((sum, f) => sum + f.completion_percent, 0) /
            features.length;

          return (
            <div key={client} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {client}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <KPICard
                    title="Total ARR"
                    value={formatCurrency(totalARR)}
                    color={totalARR < 0 ? 'red' : 'green'}
                  />
                  <KPICard
                    title="Features"
                    value={features.length}
                    color="blue"
                  />
                  <KPICard
                    title="Avg Progress"
                    value={`${avgProgress.toFixed(0)}%`}
                    color="blue"
                  />
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
