import { useMemo } from 'react';
import { useFilteredFeatures, useLookupTables, useFilters, useDashboardStore } from '@/store/dashboardStore';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { calculateKPIMetrics, formatCurrency } from '@/lib/calculations';
import { DollarSign, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TIER_COLORS = {
  'Tier 0: Emergency': '#EF4444',
  'Tier 1: Fast Track': '#8B5CF6',
  'Tier 2: Standard Delivery': '#3B82F6',
  'Tier 3: Custom Engagement': '#F59E0B',
  'Tier 4: Backlog': '#6B7280',
};

export function ExecutiveDashboard() {
  const features = useFilteredFeatures();
  const allFeatures = useDashboardStore((state) => state.features);
  const filters = useFilters();
  const setFilter = useDashboardStore((state) => state.setFilter);
  const lookupTables = useLookupTables();

  // Calculate KPI metrics
  const kpis = useMemo(() => calculateKPIMetrics(allFeatures), [allFeatures]);

  // Calculate tier breakdown
  const tierBreakdown = useMemo(() => {
    const breakdown = new Map<string, { count: number; arr: number }>();

    features.forEach((feature) => {
      const tier = feature.Priority_Tier;
      const current = breakdown.get(tier) || { count: 0, arr: 0 };
      breakdown.set(tier, {
        count: current.count + 1,
        arr: current.arr + feature.ARR_Amount,
      });
    });

    return Array.from(breakdown.entries()).map(([tier, data]) => ({
      name: tier,
      value: data.count,
      arr: data.arr,
    }));
  }, [features]);

  // Calculate ARR by client
  const arrByClient = useMemo(() => {
    const clientMap = new Map<string, number>();

    features.forEach((feature) => {
      const client = feature.Primary_Client;
      const currentARR = clientMap.get(client) || 0;
      clientMap.set(client, currentARR + feature.Weighted_ARR);
    });

    return Array.from(clientMap.entries())
      .map(([client, arr]) => ({ client, arr }))
      .sort((a, b) => b.arr - a.arr)
      .slice(0, 10);
  }, [features]);

  // Get top 10 features by priority score
  const topFeatures = useMemo(() => {
    return [...features]
      .sort((a, b) => b.Priority_Score - a.Priority_Score)
      .slice(0, 10);
  }, [features]);

  // Get features with revenue at risk
  const atRiskFeatures = useMemo(() => {
    return features.filter(f => f.Revenue_at_Risk || f.ARR_Amount < 0);
  }, [features]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-deepsee-navy mb-2">Executive Summary</h1>
        <p className="text-gray-600">
          High-level KPIs and portfolio health at a glance
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardBody className="flex gap-4 items-center flex-wrap">
          <select
            className="filter-select"
            value={filters.quarter || ''}
            onChange={(e) => setFilter({ quarter: e.target.value || undefined })}
          >
            <option value="">All Quarters</option>
            <option value="Q4 2025">Q4 2025</option>
            <option value="Q1 2026">Q1 2026</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q3 2026">Q3 2026</option>
          </select>

          <select
            className="filter-select"
            value={filters.priorityTier || ''}
            onChange={(e) => setFilter({ priorityTier: e.target.value || undefined })}
          >
            <option value="">All Priority Tiers</option>
            {lookupTables.Priority_Tiers.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.client || ''}
            onChange={(e) => setFilter({ client: e.target.value || undefined })}
          >
            <option value="">All Clients</option>
            {lookupTables.Clients.map((client) => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => setFilter({ status: e.target.value || undefined })}
          >
            <option value="">All Statuses</option>
            {lookupTables.Status_Options.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <button
            className="btn btn-secondary"
            onClick={() => useDashboardStore.getState().clearFilters()}
          >
            Clear Filters
          </button>
        </CardBody>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total ARR in Pipeline"
          value={formatCurrency(kpis.totalARRInPipeline)}
          icon={<DollarSign size={40} />}
        />
        <KPICard
          label="Total ARR at Risk"
          value={formatCurrency(kpis.totalARRAtRisk)}
          icon={<AlertTriangle size={40} />}
        />
        <KPICard
          label="Total Features"
          value={kpis.totalFeatures}
          icon={<Target size={40} />}
        />
        <KPICard
          label="Avg Priority Score"
          value={Math.round(kpis.averagePriorityScore).toLocaleString()}
          icon={<TrendingUp size={40} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tier Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Tier Breakdown</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name.split(':')[0]}: ${entry.value}`}
                >
                  {tierBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.name as keyof typeof TIER_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ARR by Client */}
        <Card>
          <CardHeader>
            <CardTitle>ARR by Client (Top 10)</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={arrByClient} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="client" type="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="arr" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Revenue at Risk Alert */}
      {atRiskFeatures.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="bg-red-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-600" />
              <CardTitle className="text-red-800">Revenue at Risk Alert</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {atRiskFeatures.map((feature) => (
                <div key={feature.Feature_ID} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{feature.Feature_Name}</p>
                    <p className="text-sm text-gray-600">{feature.Primary_Client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(Math.abs(feature.ARR_Amount))}
                    </p>
                    <p className="text-sm text-gray-600">{feature.Current_Status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Top 10 Features Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Features by Priority Score</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Feature Name</th>
                  <th>Client</th>
                  <th>Priority Score</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>ARR</th>
                </tr>
              </thead>
              <tbody>
                {topFeatures.map((feature) => (
                  <tr key={feature.Feature_ID}>
                    <td className="font-medium">{feature.Feature_Name}</td>
                    <td>{feature.Primary_Client}</td>
                    <td className="font-mono">{Math.round(feature.Priority_Score).toLocaleString()}</td>
                    <td>
                      <Badge variant={`tier-${feature.Priority_Tier.charAt(5)}` as any}>
                        {feature.Priority_Tier}
                      </Badge>
                    </td>
                    <td>
                      <span className={`badge ${
                        feature.Current_Status === 'Completed' ? 'status-completed' :
                        feature.Current_Status === 'In Progress' ? 'status-in-progress' :
                        feature.Current_Status === 'Blocked' ? 'status-blocked' :
                        'status-not-started'
                      }`}>
                        {feature.Current_Status}
                      </span>
                    </td>
                    <td className="font-semibold">{formatCurrency(feature.ARR_Amount)}</td>
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
