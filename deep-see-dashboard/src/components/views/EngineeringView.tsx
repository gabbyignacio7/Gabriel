import React from 'react';
import { useData } from '../../context/DataContext';
import { FilterPanel } from '../common/FilterPanel';
import { KPICard } from '../common/KPICard';
import { DataTable } from '../common/DataTable';
import { getStatusColor } from '../../utils/calculations';

export const EngineeringView: React.FC = () => {
  const { tickets, filters, setFilters } = useData();

  const sprintGroups = React.useMemo(() => {
    const groups: Record<string, typeof tickets> = {
      'Sprint 1': [],
      'Sprint 2': [],
      'Unassigned': [],
    };

    tickets.forEach((ticket) => {
      const sprint = ticket.sprint || 'Unassigned';
      if (!groups[sprint]) {
        groups[sprint] = [];
      }
      groups[sprint].push(ticket);
    });

    return groups;
  }, [tickets]);

  const totalSP = React.useMemo(() => {
    return tickets.reduce((sum, t) => sum + t.story_points, 0);
  }, [tickets]);

  const completedSP = React.useMemo(() => {
    return tickets
      .filter((t) => t.jira_status === 'Done')
      .reduce((sum, t) => sum + t.story_points, 0);
  }, [tickets]);

  const blockedItems = React.useMemo(() => {
    return tickets.filter((t) => t.jira_status === 'Blocked').length;
  }, [tickets]);

  const columns = [
    {
      key: 'jira_ticket_id',
      header: 'Ticket',
      sortable: true,
    },
    {
      key: 'jira_ticket_title',
      header: 'Title',
      sortable: true,
    },
    {
      key: 'mapped_feature_name',
      header: 'Feature',
      sortable: true,
    },
    {
      key: 'assigned_engineer',
      header: 'Engineer',
      sortable: true,
      render: (value: string) => value || 'Unassigned',
    },
    {
      key: 'story_points',
      header: 'SP',
      sortable: true,
    },
    {
      key: 'jira_status',
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium bg-${getStatusColor(value)}`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Engineering View - Capacity Planning
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Story Points"
          value={totalSP}
          color="blue"
        />
        <KPICard
          title="Completed SP"
          value={completedSP}
          subtitle={`${((completedSP / totalSP) * 100).toFixed(0)}%`}
          color="green"
        />
        <KPICard
          title="Sprint Capacity"
          value="64 SP"
          subtitle="Per sprint"
          color="gray"
        />
        <KPICard
          title="Blocked Items"
          value={blockedItems}
          color={blockedItems > 0 ? 'red' : 'green'}
        />
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        showClientFilter={true}
        showQuarterFilter={false}
        showTierFilter={false}
        showAgentFilter={false}
        showStatusFilter={false}
      />

      <div className="space-y-6">
        {Object.entries(sprintGroups).map(([sprint, sprintTickets]) => {
          if (sprintTickets.length === 0) return null;

          const sprintSP = sprintTickets.reduce(
            (sum, t) => sum + t.story_points,
            0
          );
          const completedSprintSP = sprintTickets
            .filter((t) => t.jira_status === 'Done')
            .reduce((sum, t) => sum + t.story_points, 0);
          const progress = (completedSprintSP / sprintSP) * 100;

          return (
            <div key={sprint} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{sprint}</h2>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {completedSprintSP} / {sprintSP} SP
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <DataTable columns={columns} data={sprintTickets} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
