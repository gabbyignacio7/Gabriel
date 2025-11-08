import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { KPICard } from '../common/KPICard';
import { DataTable } from '../common/DataTable';
import { formatCurrency, getTierColor } from '../../utils/calculations';

export const FeatureDetail: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const { features, tickets } = useData();
  const navigate = useNavigate();

  const feature = React.useMemo(() => {
    return features.find((f) => f.feature_id === featureId);
  }, [features, featureId]);

  const relatedTickets = React.useMemo(() => {
    return tickets.filter((t) => t.mapped_feature_id === featureId);
  }, [tickets, featureId]);

  if (!feature) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Feature not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-blue-600 hover:underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'jira_ticket_id',
      header: 'Ticket ID',
      sortable: true,
    },
    {
      key: 'jira_ticket_title',
      header: 'Title',
      sortable: true,
    },
    {
      key: 'jira_status',
      header: 'Status',
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
  ];

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {feature.feature_id} - {feature.feature_name}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <span className={`px-3 py-1 rounded text-sm font-medium bg-${getTierColor(feature.priority_tier)}`}>
                {feature.priority_tier}
              </span>
              <span className="text-gray-600">{feature.agent_type}</span>
              <span className="text-gray-600">{feature.category}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Priority Score"
            value={feature.priority_score.toFixed(0)}
            color="blue"
          />
          <KPICard
            title="Client"
            value={feature.primary_client}
            color="gray"
          />
          <KPICard
            title="ARR"
            value={formatCurrency(feature.arr_amount || 0)}
            color={feature.arr_amount && feature.arr_amount > 0 ? 'green' : feature.arr_amount && feature.arr_amount < 0 ? 'red' : 'gray'}
          />
          <KPICard
            title="Due Date"
            value={feature.target_completion_date || feature.quarter_planned}
            color="gray"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{feature.current_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Replicability Score:</span>
                <span className="font-medium">{feature.replicability_score}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Effort:</span>
                <span className="font-medium">
                  {feature.effort_estimate_weeks || 'TBD'} weeks
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Complexity:</span>
                <span className="font-medium">
                  {feature.engineering_complexity || 'TBD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Type:</span>
                <span className="font-medium">{feature.platform_vs_custom}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{feature.completion_percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${feature.completion_percent}%` }}
                />
              </div>
            </div>
            {feature.assigned_to && (
              <div className="text-sm">
                <span className="text-gray-600">Assigned to:</span>{' '}
                <span className="font-medium">{feature.assigned_to}</span>
              </div>
            )}
            {feature.sprint_assignment && (
              <div className="text-sm mt-2">
                <span className="text-gray-600">Sprint:</span>{' '}
                <span className="font-medium">{feature.sprint_assignment}</span>
              </div>
            )}
          </div>
        </div>

        {(feature.management_notes || feature.engineering_notes || feature.sales_notes) && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
            {feature.management_notes && (
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Management:</span>
                <p className="text-sm text-gray-600">{feature.management_notes}</p>
              </div>
            )}
            {feature.engineering_notes && (
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Engineering:</span>
                <p className="text-sm text-gray-600">{feature.engineering_notes}</p>
              </div>
            )}
            {feature.sales_notes && (
              <div>
                <span className="text-sm font-medium text-gray-700">Sales:</span>
                <p className="text-sm text-gray-600">{feature.sales_notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          JIRA Tickets ({relatedTickets.length})
        </h2>
        {relatedTickets.length > 0 ? (
          <DataTable columns={columns} data={relatedTickets} />
        ) : (
          <p className="text-gray-500">No JIRA tickets linked to this feature</p>
        )}
      </div>
    </div>
  );
};
