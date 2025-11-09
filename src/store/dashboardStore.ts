/**
 * Global Dashboard State Management using Zustand
 */

import { create } from 'zustand';
import type {
  DashboardState,
  Feature,
  JiraTicket,
  SalesOpportunity,
  FilterState,
  ValidationReport,
} from '../lib/types';
import { parseExcelFile } from '../lib/dataParser';

interface DashboardStore extends DashboardState {
  // Actions
  loadExcelFile: (file: File) => Promise<ValidationReport>;
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilters: () => void;
  getFilteredFeatures: () => Feature[];
  getFilteredJiraTickets: () => JiraTicket[];
  getFilteredOpportunities: () => SalesOpportunity[];

  // Filter state
  filters: FilterState;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  features: [],
  jiraTickets: [],
  salesOpportunities: [],
  clientProjects: [],
  wonDeals: [],
  changeLog: [],
  lookupTables: {
    Clients: [],
    Agent_Types: [],
    Pipeline_Stages: [],
    Priority_Tiers: [],
    Categories: [],
    Team_Assignment: [],
    Status_Options: [],
    Revenue_Types: [],
    Contract_Status: [],
  },
  scoringRubric: {
    formula: '(ARR × Replicability × Conversion%) / Effort',
    tierDefinitions: [
      {
        tier: '0',
        name: 'Emergency',
        scoreThreshold: 0,
        description: 'Critical bug or churn risk requiring immediate attention',
      },
      {
        tier: '1',
        name: 'Fast Track',
        scoreThreshold: 100,
        description: 'High-value work with multi-client benefit',
      },
      {
        tier: '2',
        name: 'Standard Delivery',
        scoreThreshold: 50,
        description: 'Important features with good ROI',
      },
      {
        tier: '3',
        name: 'Custom Engagement',
        scoreThreshold: 10,
        description: 'Client-specific work justified economically',
      },
      {
        tier: '4',
        name: 'Backlog',
        scoreThreshold: 0,
        description: 'Low priority, revisit quarterly',
      },
    ],
    replicabilityScale: [
      { score: 5, description: 'Platform enhancement benefiting ALL clients' },
      { score: 4, description: 'Useful for multiple clients in same vertical' },
      { score: 3, description: 'Adaptable to 2-3 specific clients' },
      { score: 2, description: 'Highly customized but potentially reusable component' },
      { score: 1, description: 'One-off client-specific work with no reuse potential' },
    ],
  },
  lastUpdated: null,
  isLoading: false,
  error: null,
  filters: {},

  // Load Excel file
  loadExcelFile: async (file: File): Promise<ValidationReport> => {
    set({ isLoading: true, error: null });

    try {
      const { data, validation } = await parseExcelFile(file);

      set({
        ...data,
        isLoading: false,
        lastUpdated: new Date(),
      });

      return validation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Set filter
  setFilter: (filter: Partial<FilterState>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filter,
      },
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({ filters: {} });
  },

  // Get filtered features
  getFilteredFeatures: (): Feature[] => {
    const { features, filters } = get();

    return features.filter((feature) => {
      if (filters.quarter && feature.Quarter_Planned !== filters.quarter) {
        return false;
      }

      if (filters.priorityTier && feature.Priority_Tier !== filters.priorityTier) {
        return false;
      }

      if (filters.client) {
        const matchesPrimary = feature.Primary_Client === filters.client;
        const matchesAdditional = feature.Additional_Clients.includes(filters.client);
        if (!matchesPrimary && !matchesAdditional) {
          return false;
        }
      }

      if (filters.status && feature.Current_Status !== filters.status) {
        return false;
      }

      if (filters.agentType && feature.Agent_Type !== filters.agentType) {
        return false;
      }

      if (filters.category && feature.Category !== filters.category) {
        return false;
      }

      if (filters.replicability && feature.Replicability_Score !== filters.replicability) {
        return false;
      }

      return true;
    });
  },

  // Get filtered JIRA tickets
  getFilteredJiraTickets: (): JiraTicket[] => {
    const { jiraTickets, filters } = get();

    return jiraTickets.filter((ticket) => {
      if (filters.status && ticket.Status !== filters.status) {
        return false;
      }

      if (filters.team && ticket.Team_Required !== filters.team) {
        return false;
      }

      if (filters.client && ticket.Client_Name !== filters.client) {
        return false;
      }

      if (filters.priorityTier && ticket.Priority_Tier !== filters.priorityTier) {
        return false;
      }

      return true;
    });
  },

  // Get filtered opportunities
  getFilteredOpportunities: (): SalesOpportunity[] => {
    const { salesOpportunities, filters } = get();

    return salesOpportunities.filter((opp) => {
      if (filters.client && opp.Account_Name !== filters.client) {
        return false;
      }

      if (filters.agentType && opp.Agent_Type !== filters.agentType) {
        return false;
      }

      if (filters.status && opp.Status !== filters.status) {
        return false;
      }

      return true;
    });
  },
}));

// Helper hooks for specific data selections
export const useFeatures = () => useDashboardStore((state) => state.features);
export const useFilteredFeatures = () => useDashboardStore((state) => state.getFilteredFeatures());
export const useJiraTickets = () => useDashboardStore((state) => state.jiraTickets);
export const useFilteredJiraTickets = () => useDashboardStore((state) => state.getFilteredJiraTickets());
export const useSalesOpportunities = () => useDashboardStore((state) => state.salesOpportunities);
export const useFilteredOpportunities = () => useDashboardStore((state) => state.getFilteredOpportunities());
export const useLookupTables = () => useDashboardStore((state) => state.lookupTables);
export const useFilters = () => useDashboardStore((state) => state.filters);
export const useIsLoading = () => useDashboardStore((state) => state.isLoading);
export const useError = () => useDashboardStore((state) => state.error);
export const useLastUpdated = () => useDashboardStore((state) => state.lastUpdated);
