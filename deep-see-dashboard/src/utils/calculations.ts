import {
  PriorityTier,
  RevenueImpact,
  RevenueType,
  PipelineStage,
  EffortSize,
} from '../types';

export const calculatePriorityScore = (
  arrAmount: number,
  replicabilityScore: number,
  conversionProbability: number,
  effortWeeks: number
): number => {
  if (
    !arrAmount ||
    !replicabilityScore ||
    !conversionProbability ||
    !effortWeeks ||
    effortWeeks <= 0
  ) {
    return 0;
  }
  return (
    (arrAmount * replicabilityScore * (conversionProbability / 100)) /
    effortWeeks
  );
};

export const calculatePriorityTier = (
  revenueAtRisk: boolean,
  priorityScore: number
): PriorityTier => {
  if (revenueAtRisk) return 'Tier 0: Emergency';
  if (priorityScore >= 100) return 'Tier 1: Fast Track';
  if (priorityScore >= 50) return 'Tier 2: Standard Delivery';
  if (priorityScore >= 10) return 'Tier 3: Custom Engagement';
  return 'Tier 4: Backlog';
};

export const calculateRevenueImpactType = (
  revenueAtRisk: boolean,
  revenueType?: RevenueType,
  arrAmount?: number
): RevenueImpact => {
  if (revenueAtRisk) return 'Negative (Risk of Loss)';
  if (revenueType === 'Retention/Risk of Loss') return 'Negative (Risk of Loss)';
  if (
    arrAmount &&
    arrAmount > 0 &&
    (revenueType === 'New Contract' || revenueType === 'Expansion')
  ) {
    return 'Positive (New Revenue)';
  }
  return 'Neutral (Internal/Platform)';
};

export const calculateWeightedARR = (
  arrValue: number,
  conversionProbability: number
): number => {
  return arrValue * (conversionProbability / 100);
};

export const calculateConversionFromStage = (stage: PipelineStage): number => {
  const mapping: Record<PipelineStage, number> = {
    Introduction: 10,
    Qualification: 30,
    Proposal: 50,
    POC: 60,
    'Contract Negotiation': 80,
    'Closed Won': 100,
    'Closed Lost': 0,
  };
  return mapping[stage] || 0;
};

export const calculateEffortFromTShirt = (size: EffortSize): number => {
  const mapping: Record<EffortSize, number> = {
    'S-Small 2wks': 2,
    'M-Medium 4wks': 4,
    'L-Large 8wks': 8,
    'XL-Extra Large 12wks+': 12,
  };
  return mapping[size] || 0;
};

export const calculateDaysToClose = (closeDate: string): number => {
  const today = new Date();
  const target = new Date(closeDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateDaysInStage = (lastActivityDate: string): number => {
  const today = new Date();
  const lastActivity = new Date(lastActivityDate);
  const diffTime = today.getTime() - lastActivity.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatCurrency = (value: number): string => {
  if (value < 0) {
    return `-$${Math.abs(value).toLocaleString()}`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(0)}%`;
};

export const getTierColor = (tier: PriorityTier): string => {
  const colorMap: Record<PriorityTier, string> = {
    'Tier 0: Emergency': 'tier-0',
    'Tier 1: Fast Track': 'tier-1',
    'Tier 2: Standard Delivery': 'tier-2',
    'Tier 3: Custom Engagement': 'tier-3',
    'Tier 4: Backlog': 'tier-4',
  };
  return colorMap[tier] || 'gray-500';
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'Not Started': 'status-not-started',
    'In Progress': 'status-in-progress',
    Blocked: 'status-blocked',
    Completed: 'status-completed',
    Cancelled: 'status-cancelled',
    'To Do': 'status-not-started',
    'Code Review': 'status-in-progress',
    Done: 'status-completed',
  };
  return colorMap[status] || 'gray-500';
};
