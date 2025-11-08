import * as XLSX from 'xlsx';
import { Feature, JiraTicket, Opportunity } from '../types';

export const exportToExcel = (
  features: Feature[],
  tickets: JiraTicket[],
  opportunities: Opportunity[]
): void => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Format features data for export
  const featuresData = features.map((f) => ({
    'Feature ID': f.feature_id,
    'Feature Name': f.feature_name,
    'Agent Type': f.agent_type,
    Category: f.category,
    Quarter: f.quarter_planned,
    Client: f.primary_client,
    'ARR Amount': f.arr_amount || 0,
    'Revenue Type': f.revenue_type || '',
    'Revenue at Risk': f.revenue_at_risk ? 'Yes' : 'No',
    'Replicability Score': f.replicability_score,
    'Conversion %': f.conversion_probability || 0,
    'Effort (weeks)': f.effort_estimate_weeks || 0,
    'Priority Score': f.priority_score.toFixed(2),
    'Priority Tier': f.priority_tier,
    Status: f.current_status,
    'Completion %': f.completion_percent,
    'JIRA Tickets': f.jira_ticket_count,
  }));

  // Format JIRA tickets data
  const ticketsData = tickets.map((t) => ({
    'Ticket ID': t.jira_ticket_id,
    Title: t.jira_ticket_title,
    Status: t.jira_status,
    Category: t.jira_category,
    Client: t.client_name,
    'Effort Size': t.effort_tshirt_size,
    'Story Points': t.story_points,
    'Feature ID': t.mapped_feature_id || '',
    'Feature Name': t.mapped_feature_name || '',
    Engineer: t.assigned_engineer || '',
    Sprint: t.sprint || '',
  }));

  // Format opportunities data
  const opportunitiesData = opportunities.map((o) => ({
    'Opportunity ID': o.opportunity_id,
    'Opportunity Name': o.opportunity_name,
    Account: o.account_name,
    Stage: o.stage,
    'ARR Value': o.arr_value,
    'Close Date': o.close_date,
    'Probability %': o.probability_percent,
    Owner: o.owner,
    'Agent Type': o.agent_type,
    'Feature ID': o.mapped_feature_id || '',
    'Weighted ARR': o.weighted_arr,
  }));

  // Create worksheets
  const wsFeatures = XLSX.utils.json_to_sheet(featuresData);
  const wsTickets = XLSX.utils.json_to_sheet(ticketsData);
  const wsOpportunities = XLSX.utils.json_to_sheet(opportunitiesData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, wsFeatures, 'Features');
  XLSX.utils.book_append_sheet(wb, wsTickets, 'JIRA Tickets');
  XLSX.utils.book_append_sheet(wb, wsOpportunities, 'Sales Pipeline');

  // Generate file name with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `DeepSee_Dashboard_Export_${timestamp}.xlsx`;

  // Write file
  XLSX.writeFile(wb, fileName);
};

export const exportCurrentView = (data: any[], fileName: string): void => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  const timestamp = new Date().toISOString().split('T')[0];
  const fullFileName = `${fileName}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, fullFileName);
};
