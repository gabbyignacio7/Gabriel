import { useFilteredOpportunities } from '@/store/dashboardStore';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

export function SalesPipelineView() {
  const opportunities = useFilteredOpportunities();

  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.ARR_Value, 0);
  const totalWeightedValue = opportunities.reduce((sum, opp) => sum + opp.Weighted_ARR, 0);
  const atRiskCount = opportunities.filter(opp => opp.Status === 'At Risk').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deepsee-navy mb-2">Sales Pipeline</h1>
        <p className="text-gray-600">
          Client opportunities driving roadmap decisions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-deepsee-navy">{formatCurrency(totalPipelineValue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Weighted Pipeline Value</p>
          <p className="text-3xl font-bold text-deepsee-accent">{formatCurrency(totalWeightedValue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">At-Risk Opportunities</p>
          <p className="text-3xl font-bold text-red-600">{atRiskCount}</p>
        </Card>
      </div>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Opportunities</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Opportunity</th>
                  <th>Stage</th>
                  <th>ARR Value</th>
                  <th>Probability</th>
                  <th>Weighted ARR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.Opportunity_ID}>
                    <td className="font-medium">{opp.Account_Name}</td>
                    <td>{opp.Opportunity_Name}</td>
                    <td><Badge>{opp.Stage}</Badge></td>
                    <td className="font-semibold">{formatCurrency(opp.ARR_Value)}</td>
                    <td>{formatPercentage(opp.Probability_Percent)}</td>
                    <td className="font-semibold text-deepsee-accent">
                      {formatCurrency(opp.Weighted_ARR)}
                    </td>
                    <td>
                      <Badge variant={opp.Status === 'At Risk' ? 'danger' : 'success'}>
                        {opp.Status}
                      </Badge>
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
