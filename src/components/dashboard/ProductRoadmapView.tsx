import { useMemo } from 'react';
import { useFilteredFeatures } from '@/store/dashboardStore';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/calculations';

export function ProductRoadmapView() {
  const features = useFilteredFeatures();

  // Calculate platform vs custom ratio
  const platformVsCustom = useMemo(() => {
    const platformFeatures = features.filter(f => f.Platform_vs_Custom === 'Platform Enhancement');
    const customFeatures = features.filter(f => f.Platform_vs_Custom === 'Custom Development');

    const platformEffort = platformFeatures.reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    const customEffort = customFeatures.reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    const totalEffort = platformEffort + customEffort;

    return {
      platformCount: platformFeatures.length,
      customCount: customFeatures.length,
      platformEffort,
      customEffort,
      platformRatio: totalEffort > 0 ? (platformEffort / totalEffort) * 100 : 0,
      customRatio: totalEffort > 0 ? (customEffort / totalEffort) * 100 : 0,
    };
  }, [features]);

  // Group by quarter
  const featuresByQuarter = useMemo(() => {
    const quarters = new Map<string, typeof features>();
    features.forEach(feature => {
      const quarter = feature.Quarter_Planned;
      const current = quarters.get(quarter) || [];
      quarters.set(quarter, [...current, feature]);
    });
    return quarters;
  }, [features]);

  // Group by replicability
  const featuresByReplicability = useMemo(() => {
    return features.reduce((acc, feature) => {
      const score = feature.Replicability_Score;
      if (!acc[score]) acc[score] = [];
      acc[score].push(feature);
      return acc;
    }, {} as Record<number, typeof features>);
  }, [features]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deepsee-navy mb-2">Product Roadmap</h1>
        <p className="text-gray-600">
          Long-term planning, feature replication analysis, and platform vs custom work balance
        </p>
      </div>

      {/* Platform vs Custom Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Platform Enhancement</p>
          <p className="text-3xl font-bold text-deepsee-accent">
            {platformVsCustom.platformCount} features
          </p>
          <p className="text-sm text-gray-500 mt-2">{platformVsCustom.platformEffort} weeks</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Custom Development</p>
          <p className="text-3xl font-bold text-gray-600">
            {platformVsCustom.customCount} features
          </p>
          <p className="text-sm text-gray-500 mt-2">{platformVsCustom.customEffort} weeks</p>
        </Card>
        <Card className={`p-6 ${
          platformVsCustom.platformRatio >= 80 ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <p className="text-sm text-gray-600 mb-2">Platform/Custom Ratio</p>
          <p className="text-3xl font-bold text-deepsee-navy">
            {platformVsCustom.platformRatio.toFixed(0)}% / {platformVsCustom.customRatio.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Target: 80% / 20%</p>
        </Card>
      </div>

      {/* Replicability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Features by Replicability Score</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map(score => (
              <div key={score} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Replicability {score}</p>
                <p className="text-2xl font-bold text-deepsee-navy">
                  {(featuresByReplicability[score] || []).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {score === 5 && 'All clients'}
                  {score === 4 && 'Multiple clients'}
                  {score === 3 && '2-3 clients'}
                  {score === 2 && 'Reusable component'}
                  {score === 1 && 'One-off'}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Roadmap by Quarter */}
      <Card>
        <CardHeader>
          <CardTitle>Roadmap Timeline</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {Array.from(featuresByQuarter.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([quarter, quarterFeatures]) => (
                <div key={quarter}>
                  <h3 className="text-lg font-semibold text-deepsee-navy mb-3">{quarter}</h3>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Agent Type</th>
                          <th>Feature Name</th>
                          <th>Replicability</th>
                          <th>Client Count</th>
                          <th>ARR Impact</th>
                          <th>Effort (Weeks)</th>
                          <th>Priority Tier</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quarterFeatures.slice(0, 10).map(feature => (
                          <tr key={feature.Feature_ID}>
                            <td><Badge variant="info">{feature.Agent_Type}</Badge></td>
                            <td className="font-medium">{feature.Feature_Name}</td>
                            <td className="text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                feature.Replicability_Score >= 4 ? 'bg-green-100 text-green-800' :
                                feature.Replicability_Score >= 3 ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              } font-bold text-sm`}>
                                {feature.Replicability_Score}
                              </span>
                            </td>
                            <td className="text-center">{feature.Client_Count}</td>
                            <td className="font-semibold">{formatCurrency(feature.ARR_Amount)}</td>
                            <td className="text-center">{feature.Effort_Estimate_Weeks}</td>
                            <td>
                              <Badge variant={`tier-${feature.Priority_Tier.charAt(5)}` as any}>
                                {feature.Priority_Tier.split(':')[0]}
                              </Badge>
                            </td>
                            <td><Badge>{feature.Current_Status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
