import React from 'react';
import { FilterState, Client, Quarter, PriorityTier, AgentType, Status } from '../../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  showClientFilter?: boolean;
  showQuarterFilter?: boolean;
  showTierFilter?: boolean;
  showAgentFilter?: boolean;
  showStatusFilter?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  showClientFilter = true,
  showQuarterFilter = true,
  showTierFilter = true,
  showAgentFilter = true,
  showStatusFilter = true,
}) => {
  const clients: Client[] = [
    'Broadridge',
    'DTCC',
    'JP Morgan',
    'Accenture',
    'Regional Banks',
    'Multiple',
    'Internal',
  ];

  const quarters: Quarter[] = ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

  const tiers: PriorityTier[] = [
    'Tier 0: Emergency',
    'Tier 1: Fast Track',
    'Tier 2: Standard Delivery',
    'Tier 3: Custom Engagement',
    'Tier 4: Backlog',
  ];

  const agentTypes: AgentType[] = [
    'Email Automation',
    'Trade Processing',
    'Security Settlements',
    'Standing Settlement Instructions',
    'Matching Engine',
    'One View',
    'Loan Operations',
    'Core Reconciliation',
    'DeepPilot',
    'Platform',
  ];

  const statuses: Status[] = [
    'Not Started',
    'In Progress',
    'Blocked',
    'Completed',
    'Cancelled',
  ];

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {showClientFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={filters.client || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  client: e.target.value ? (e.target.value as Client) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        )}

        {showQuarterFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quarter
            </label>
            <select
              value={filters.quarter || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  quarter: e.target.value ? (e.target.value as Quarter) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Quarters</option>
              {quarters.map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </div>
        )}

        {showTierFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Tier
            </label>
            <select
              value={filters.priorityTier || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priorityTier: e.target.value
                    ? (e.target.value as PriorityTier)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tiers</option>
              {tiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        )}

        {showAgentFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Type
            </label>
            <select
              value={filters.agentType || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  agentType: e.target.value ? (e.target.value as AgentType) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {agentTypes.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  status: e.target.value ? (e.target.value as Status) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
