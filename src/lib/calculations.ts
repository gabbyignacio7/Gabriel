/**
 * Priority Score Calculation Engine
 * Formula: (ARR × Replicability × Conversion%) / Effort
 */

import type { Feature, KPIMetrics, CapacityMetrics } from './types';

/**
 * Calculate priority score for a feature
 * @param arr - Annual Recurring Revenue
 * @param replicability - Replicability score (1-5)
 * @param conversionPercent - Conversion probability (0-100)
 * @param effort - Effort estimate in weeks
 * @returns Priority score
 */
export function calculatePriorityScore(
  arr: number,
  replicability: number,
  conversionPercent: number,
  effort: number
): number {
  if (effort === 0) return 0;
  return (Math.abs(arr) * replicability * (conversionPercent / 100)) / effort;
}

/**
 * Assign priority tier based on score and revenue at risk
 * @param priorityScore - Calculated priority score
 * @param revenueAtRisk - Whether revenue is at risk
 * @param manualOverride - Whether manual override exists
 * @param manualOverrideScore - Manual override score if exists
 * @returns Priority tier string
 */
export function assignPriorityTier(
  priorityScore: number,
  revenueAtRisk: boolean,
  manualOverride: boolean = false,
  manualOverrideScore: number | null = null
): string {
  // Emergency tier overrides everything
  if (revenueAtRisk) {
    return 'Tier 0: Emergency';
  }

  // Use manual override score if exists
  const score = manualOverride && manualOverrideScore !== null
    ? manualOverrideScore
    : priorityScore;

  // Tier assignment based on score thresholds
  if (score >= 100) return 'Tier 1: Fast Track';
  if (score >= 50) return 'Tier 2: Standard Delivery';
  if (score >= 10) return 'Tier 3: Custom Engagement';
  return 'Tier 4: Backlog';
}

/**
 * Calculate weighted ARR (ARR × Conversion Probability)
 * @param arr - Annual Recurring Revenue
 * @param conversionPercent - Conversion probability (0-100)
 * @returns Weighted ARR
 */
export function calculateWeightedARR(
  arr: number,
  conversionPercent: number
): number {
  return arr * (conversionPercent / 100);
}

/**
 * Count total clients benefiting from a feature
 * @param primaryClient - Primary client name
 * @param additionalClients - Array of additional client names
 * @returns Total client count
 */
export function calculateClientCount(
  primaryClient: string,
  additionalClients: string[]
): number {
  if (primaryClient === 'Multiple' || primaryClient === 'Internal') {
    return additionalClients.length > 0 ? additionalClients.length : 1;
  }
  return 1 + additionalClients.length;
}

/**
 * Calculate KPI metrics from features data
 * @param features - Array of all features
 * @returns KPI metrics object
 */
export function calculateKPIMetrics(features: Feature[]): KPIMetrics {
  const totalARRInPipeline = features
    .filter(f => f.ARR_Amount > 0)
    .reduce((sum, f) => sum + f.ARR_Amount, 0);

  const totalARRAtRisk = Math.abs(features
    .filter(f => f.Revenue_at_Risk || f.ARR_Amount < 0)
    .reduce((sum, f) => sum + Math.abs(f.ARR_Amount), 0));

  const totalFeatures = features.length;

  const currentQuarter = 'Q4 2025'; // This could be dynamic
  const featuresCompletedQ4 = features
    .filter(f => f.Quarter_Planned === currentQuarter && f.Current_Status === 'Completed')
    .length;

  const scores = features
    .filter(f => f.Priority_Score > 0)
    .map(f => f.Priority_Score);
  const averagePriorityScore = scores.length > 0
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;

  // Calculate on-time delivery rate
  const completedFeatures = features.filter(f => f.Current_Status === 'Completed');
  const onTimeFeatures = completedFeatures.filter(f => {
    if (!f.Target_Completion_Date) return true;
    // This would need actual completion date to calculate properly
    return true;
  });
  const onTimeDeliveryRate = completedFeatures.length > 0
    ? (onTimeFeatures.length / completedFeatures.length) * 100
    : 100;

  const totalWeightedARR = features.reduce((sum, f) => sum + f.Weighted_ARR, 0);
  const pipelineConversionRate = totalARRInPipeline > 0
    ? (totalWeightedARR / totalARRInPipeline) * 100
    : 0;

  const engineeringCapacityRequired = features
    .filter(f => f.Quarter_Planned === currentQuarter && f.Current_Status !== 'Completed')
    .reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);

  return {
    totalARRInPipeline,
    totalARRAtRisk,
    totalFeatures,
    featuresCompletedQ4,
    averagePriorityScore,
    onTimeDeliveryRate,
    pipelineConversionRate,
    engineeringCapacityRequired,
  };
}

/**
 * Calculate capacity metrics for engineering team
 * @param features - Array of all features
 * @param teamCapacityWeeks - Available team capacity in weeks
 * @returns Capacity metrics object
 */
export function calculateCapacityMetrics(
  features: Feature[],
  teamCapacityWeeks: number = 120 // Default from PRD: ~120 engineer-weeks for Q4
): CapacityMetrics {
  const currentQuarter = 'Q4 2025';

  const tier0And1Features = features.filter(f =>
    f.Quarter_Planned === currentQuarter &&
    (f.Priority_Tier === 'Tier 0: Emergency' || f.Priority_Tier === 'Tier 1: Fast Track') &&
    f.Current_Status !== 'Completed'
  );

  const committedCapacityQ4 = tier0And1Features
    .reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);

  const capacityBuffer = teamCapacityWeeks - committedCapacityQ4;
  const isOvercommitted = capacityBuffer < 0;

  return {
    availableCapacityQ4: teamCapacityWeeks,
    committedCapacityQ4,
    capacityBuffer,
    isOvercommitted,
  };
}

/**
 * Format currency for display
 * @param amount - Amount in dollars
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }

  return `$${amount.toLocaleString()}`;
}

/**
 * Format percentage for display
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get tier color for styling
 * @param tier - Priority tier string
 * @returns Tailwind color class
 */
export function getTierColor(tier: string): string {
  const tierMap: Record<string, string> = {
    'Tier 0: Emergency': 'bg-tier-0',
    'Tier 1: Fast Track': 'bg-tier-1',
    'Tier 2: Standard Delivery': 'bg-tier-2',
    'Tier 3: Custom Engagement': 'bg-tier-3',
    'Tier 4: Backlog': 'bg-tier-4',
  };

  return tierMap[tier] || 'bg-gray-500';
}

/**
 * Get status color for styling
 * @param status - Current status string
 * @returns Tailwind color class
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'Completed': 'text-green-600 bg-green-50',
    'In Progress': 'text-blue-600 bg-blue-50',
    'Not Started': 'text-gray-600 bg-gray-50',
    'Blocked': 'text-red-600 bg-red-50',
    'Cancelled': 'text-gray-400 bg-gray-50',
  };

  return statusMap[status] || 'text-gray-600 bg-gray-50';
}

/**
 * Calculate days until a target date
 * @param targetDate - Target date
 * @returns Number of days (negative if overdue)
 */
export function daysUntil(targetDate: Date | null): number | null {
  if (!targetDate) return null;

  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
