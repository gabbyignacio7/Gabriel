import { Feature, JiraTicket, Opportunity, FilterState } from '../types';

export const applyFeatureFilters = (
  features: Feature[],
  filters: FilterState
): Feature[] => {
  return features.filter((feature) => {
    if (filters.client && feature.primary_client !== filters.client) {
      return false;
    }
    if (filters.quarter && feature.quarter_planned !== filters.quarter) {
      return false;
    }
    if (filters.priorityTier && feature.priority_tier !== filters.priorityTier) {
      return false;
    }
    if (filters.agentType && feature.agent_type !== filters.agentType) {
      return false;
    }
    if (filters.status && feature.current_status !== filters.status) {
      return false;
    }
    return true;
  });
};

export const applyTicketFilters = (
  tickets: JiraTicket[],
  filters: FilterState
): JiraTicket[] => {
  return tickets.filter((ticket) => {
    if (filters.client && ticket.client_name !== filters.client) {
      return false;
    }
    return true;
  });
};

export const applyOpportunityFilters = (
  opportunities: Opportunity[],
  filters: FilterState
): Opportunity[] => {
  return opportunities.filter((opportunity) => {
    if (filters.agentType && opportunity.agent_type !== filters.agentType) {
      return false;
    }
    return true;
  });
};
