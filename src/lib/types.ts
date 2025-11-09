/**
 * TypeScript interfaces for Deep See AI Priority Dashboard
 * Based on PRD v1.0 Data Model
 */

export interface Feature {
  Feature_ID: string;
  Feature_Name: string;
  Agent_Type: string;
  Category: string;
  Quarter_Planned: string;
  Replicability_Score: number;
  Primary_Client: string;
  Additional_Clients: string[];
  Platform_vs_Custom: string;
  ARR_Amount: number;
  Revenue_Type: string;
  Contract_Status: string;
  Pipeline_Stage: string;
  Conversion_Probability_Percent: number;
  Current_Status: string;
  Completion_Percent: number;
  Target_Completion_Date: Date | null;
  Effort_Estimate_Weeks: number;
  Revenue_at_Risk: boolean;
  Priority_Score: number;
  Priority_Tier: string;
  Client_Count: number;
  Weighted_ARR: number;
  Manual_Override: boolean;
  Manual_Override_Score: number | null;
  Management_Notes: string;
  Engineering_Notes: string;
  Sales_Notes: string;
  JIRA_Ticket_Count: number;
  Dependencies?: string;
  Team_Required?: string;
  Sprint_Assignment?: string;
  Engineering_Complexity?: string;
}

export interface JiraTicket {
  JIRA_Ticket_ID: string;
  Title: string;
  Status: string;
  Category: string;
  Client_Name: string;
  Effort_T_Shirt_Size: string;
  Story_Points: number;
  Mapped_Feature_ID: string;
  Team_Required?: string;
  Priority_Score?: number;
  Priority_Tier?: string;
}

export interface SalesOpportunity {
  Opportunity_ID: string;
  Opportunity_Name: string;
  Account_Name: string;
  Stage: string;
  ARR_Value: number;
  Close_Date: Date | null;
  Probability_Percent: number;
  Owner: string;
  Agent_Type: string;
  Mapped_Feature_ID: string[];
  Status: string;
  Weighted_ARR: number;
}

export interface ClientProject {
  Project_ID: string;
  Client_Name: string;
  Project_Name: string;
  Status: string;
  Start_Date: Date | null;
  End_Date: Date | null;
  Project_Value: number;
  Features_Required: string;
  Mapped_Feature_IDs: string[];
}

export interface WonDeal {
  Client_Name: string;
  Original_Contract_Value: number;
  Renewal_Date: Date | null;
  Upsell_Opportunity: string;
  Potential_Expansion_ARR: number;
  Risk_Level: string;
}

export interface ChangeLogEntry {
  Date: Date;
  User: string;
  Feature_ID: string;
  Field_Changed: string;
  Old_Value: string;
  New_Value: string;
  Reason_for_Change: string;
}

export interface LookupTables {
  Clients: string[];
  Agent_Types: string[];
  Pipeline_Stages: string[];
  Priority_Tiers: string[];
  Categories: string[];
  Team_Assignment: string[];
  Status_Options: string[];
  Revenue_Types: string[];
  Contract_Status: string[];
}

export interface ScoringRubric {
  formula: string;
  tierDefinitions: {
    tier: string;
    name: string;
    scoreThreshold: number;
    description: string;
  }[];
  replicabilityScale: {
    score: number;
    description: string;
  }[];
}

export interface DashboardState {
  features: Feature[];
  jiraTickets: JiraTicket[];
  salesOpportunities: SalesOpportunity[];
  clientProjects: ClientProject[];
  wonDeals: WonDeal[];
  changeLog: ChangeLogEntry[];
  lookupTables: LookupTables;
  scoringRubric: ScoringRubric;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationWarning {
  type: 'error' | 'warning';
  message: string;
  featureId?: string;
  field?: string;
}

export interface ValidationReport {
  featuresLoaded: number;
  jiraTicketsLoaded: number;
  opportunitiesLoaded: number;
  clientsIdentified: number;
  warnings: ValidationWarning[];
}

export interface FilterState {
  quarter?: string;
  priorityTier?: string;
  client?: string;
  status?: string;
  agentType?: string;
  category?: string;
  team?: string;
  replicability?: number;
}

// Utility types for calculations
export interface KPIMetrics {
  totalARRInPipeline: number;
  totalARRAtRisk: number;
  totalFeatures: number;
  featuresCompletedQ4: number;
  averagePriorityScore: number;
  onTimeDeliveryRate: number;
  pipelineConversionRate: number;
  engineeringCapacityRequired: number;
}

export interface CapacityMetrics {
  availableCapacityQ4: number;
  committedCapacityQ4: number;
  capacityBuffer: number;
  isOvercommitted: boolean;
}
