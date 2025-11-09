import { useMemo } from 'react';
import { useFilteredJiraTickets, useDashboardStore } from '@/store/dashboardStore';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { calculateCapacityMetrics } from '@/lib/calculations';

export function EngineeringView() {
  const tickets = useFilteredJiraTickets();
  const features = useDashboardStore((state) => state.features);

  const capacityMetrics = useMemo(() => calculateCapacityMetrics(features), [features]);

  const ticketsByStatus = useMemo(() => {
    const statusMap = new Map<string, number>();
    tickets.forEach(ticket => {
      const count = statusMap.get(ticket.Status) || 0;
      statusMap.set(ticket.Status, count + 1);
    });
    return statusMap;
  }, [tickets]);

  const blockedTickets = tickets.filter(t => t.Status === 'Blocked');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deepsee-navy mb-2">Engineering Capacity</h1>
        <p className="text-gray-600">
          Sprint planning, capacity forecasting, and progress tracking
        </p>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Available Capacity (Q4)</p>
          <p className="text-3xl font-bold text-deepsee-navy">
            {capacityMetrics.availableCapacityQ4} weeks
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Committed Capacity</p>
          <p className="text-3xl font-bold text-deepsee-accent">
            {capacityMetrics.committedCapacityQ4} weeks
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Capacity Buffer</p>
          <p className={`text-3xl font-bold ${
            capacityMetrics.isOvercommitted ? 'text-red-600' : 'text-green-600'
          }`}>
            {capacityMetrics.capacityBuffer} weeks
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Tickets</p>
          <p className="text-3xl font-bold text-deepsee-navy">{tickets.length}</p>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>JIRA Ticket Status Breakdown</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from(ticketsByStatus.entries()).map(([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-2xl font-bold text-deepsee-navy">{count}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Blocked Tickets Alert */}
      {blockedTickets.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="bg-red-100">
            <CardTitle className="text-red-800">Blocked Tickets ({blockedTickets.length})</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {blockedTickets.map(ticket => (
                <div key={ticket.JIRA_Ticket_ID} className="p-3 bg-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.JIRA_Ticket_ID}</p>
                      <p className="text-sm text-gray-600">{ticket.Title}</p>
                    </div>
                    <Badge variant="danger">Blocked</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* All Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All JIRA Tickets</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Story Points</th>
                  <th>Team</th>
                  <th>Priority Tier</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 50).map(ticket => (
                  <tr key={ticket.JIRA_Ticket_ID}>
                    <td className="font-mono text-sm">{ticket.JIRA_Ticket_ID}</td>
                    <td>{ticket.Title}</td>
                    <td>
                      <Badge>{ticket.Status}</Badge>
                    </td>
                    <td>{ticket.Client_Name}</td>
                    <td className="text-center font-semibold">{ticket.Story_Points}</td>
                    <td>{ticket.Team_Required}</td>
                    <td>
                      {ticket.Priority_Tier && (
                        <Badge variant={`tier-${ticket.Priority_Tier.charAt(5)}` as any}>
                          {ticket.Priority_Tier.split(':')[0]}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
