// Enum Types
export type AgentType =
  | 'Email Automation'
  | 'Trade Processing'
  | 'Security Settlements'
  | 'Standing Settlement Instructions'
  | 'Matching Engine'
  | 'One View'
  | 'Loan Operations'
  | 'Core Reconciliation'
  | 'DeepPilot'
  | 'Platform';

export type Category =
  | 'Core Infrastructure'
  | 'Client-Specific Work'
  | 'Platform Improvements'
  | 'API Development'
  | 'Bug Fixes';

export type Quarter = 'Q4 2025' | 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';

export type Client =
  | 'Broadridge'
  | 'DTCC'
  | 'JP Morgan'
  | 'Accenture'
  | 'Regional Banks'
  | 'Multiple'
  | 'Internal';

export type RevenueType =
  | 'New Contract'
  | 'Expansion'
  | 'Retention/Risk of Loss'
  | 'Internal';

export type ContractStatus =
  | 'Signed'
  | 'Verbal Commitment'
  | 'POC'
  | 'Exploratory';

export type PipelineStage =
  | 'Introduction'
  | 'Qualification'
  | 'Proposal'
  | 'POC'
  | 'Contract Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type PlatformType =
  | 'Platform Enhancement'
  | 'Client-Specific'
  | 'Both';

export type EffortSize =
  | 'S-Small 2wks'
  | 'M-Medium 4wks'
  | 'L-Large 8wks'
  | 'XL-Extra Large 12wks+';

export type Complexity = 'Low' | 'Medium' | 'High' | 'Very High';

export type Team = 'Frontend' | 'Backend' | 'DevOps' | 'ML' | 'Multiple';

export type PriorityTier =
  | 'Tier 0: Emergency'
  | 'Tier 1: Fast Track'
  | 'Tier 2: Standard Delivery'
  | 'Tier 3: Custom Engagement'
  | 'Tier 4: Backlog';

export type RevenueImpact =
  | 'Negative (Risk of Loss)'
  | 'Positive (New Revenue)'
  | 'Neutral (Internal/Platform)';

export type Status =
  | 'Not Started'
  | 'In Progress'
  | 'Blocked'
  | 'Completed'
  | 'Cancelled';

export type JiraStatus = 'To Do' | 'In Progress' | 'Code Review' | 'Done' | 'Blocked';

export type UserRole = 'Steve' | 'Ryan' | 'Konnor' | 'Nick';

// Main Interfaces
export interface Feature {
  feature_id: string;
  feature_name: string;
  agent_type: AgentType;
  category: Category;
  quarter_planned: Quarter;

  // Client mapping
  primary_client: Client;
  additional_clients?: string;
  client_count?: number;

  // Revenue scoring
  arr_amount?: number;
  revenue_type?: RevenueType;
  contract_status?: ContractStatus;
  revenue_at_risk: boolean;

  // Conversion scoring
  pipeline_stage?: PipelineStage;
  conversion_probability?: number;
  deal_close_date?: string;
  days_to_close?: number;

  // Replicability scoring
  replicability_score: number;
  multi_client_benefit: boolean;
  platform_vs_custom: PlatformType;

  // Engineering effort
  effort_estimate_weeks?: number;
  effort_tshirt_size?: EffortSize;
  engineering_complexity?: Complexity;
  dependencies?: string;
  team_required?: Team;

  // Calculated priority fields
  priority_score: number;
  priority_tier: PriorityTier;
  revenue_impact_type: RevenueImpact;
  weighted_arr?: number;

  // Status tracking
  current_status: Status;
  completion_percent: number;
  assigned_to?: string;
  sprint_assignment?: string;
  jira_ticket_count: number;

  // Dates
  created_date: string;
  target_start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;

  // Notes
  management_notes?: string;
  engineering_notes?: string;
  sales_notes?: string;
  manual_override: boolean;
  manual_override_score?: number;
}

export interface JiraTicket {
  jira_ticket_id: string;
  jira_ticket_title: string;
  jira_status: JiraStatus;
  jira_category: Category;
  client_name: Client;
  effort_tshirt_size: EffortSize;
  story_points: number;
  mapped_feature_id?: string;
  mapped_feature_name?: string;
  assigned_engineer?: string;
  sprint?: string;
  created_date: string;
  target_date?: string;
  completed_date?: string;
}

export interface Opportunity {
  opportunity_id: string;
  opportunity_name: string;
  account_name: string;
  stage: PipelineStage;
  arr_value: number;
  close_date: string;
  probability_percent: number;
  owner: string;
  agent_type: AgentType;
  mapped_feature_id?: string;
  mapped_feature_name?: string;
  status: string;
  created_date: string;
  last_activity_date: string;
  notes?: string;
  weighted_arr: number;
  days_in_stage: number;
}

export interface UserPermissions {
  canEditRevenue: boolean;
  canOverridePriority: boolean;
  canViewAllClients: boolean;
  canEditConversion?: boolean;
  canEditReplicability?: boolean;
  canEditEffort?: boolean;
}

export interface FilterState {
  client?: Client;
  quarter?: Quarter;
  priorityTier?: PriorityTier;
  agentType?: AgentType;
  status?: Status;
  showOnlyMyItems?: boolean;
}
