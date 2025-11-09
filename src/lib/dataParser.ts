/**
 * Excel File Parser using SheetJS
 * Parses the DeepSee prioritization dashboard Excel file
 */

import * as XLSX from 'xlsx';
import type {
  Feature,
  JiraTicket,
  SalesOpportunity,
  ClientProject,
  WonDeal,
  ChangeLogEntry,
  LookupTables,
  ValidationWarning,
  ValidationReport,
  DashboardState,
} from './types';
import {
  calculatePriorityScore,
  assignPriorityTier,
  calculateWeightedARR,
  calculateClientCount,
} from './calculations';

/**
 * Parse Excel file and extract all data
 * @param file - Excel file object
 * @returns Promise resolving to dashboard state
 */
export async function parseExcelFile(file: File): Promise<{
  data: DashboardState;
  validation: ValidationReport;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });

        // Extract all sheets
        const features = parseFeaturesSheet(workbook);
        const jiraTickets = parseJiraTicketsSheet(workbook);
        const salesOpportunities = parseSalesOpportunitiesSheet(workbook);
        const clientProjects = parseClientProjectsSheet(workbook);
        const wonDeals = parseWonDealsSheet(workbook);
        const changeLog = parseChangeLogSheet(workbook);
        const lookupTables = parseLookupTablesSheet(workbook);

        // Perform validation
        const validation = validateData(features, jiraTickets, salesOpportunities);

        // Enrich features with calculated fields
        const enrichedFeatures = enrichFeatures(features, jiraTickets);

        // Enrich JIRA tickets with feature data
        const enrichedTickets = enrichJiraTickets(jiraTickets, enrichedFeatures);

        const dashboardState: DashboardState = {
          features: enrichedFeatures,
          jiraTickets: enrichedTickets,
          salesOpportunities,
          clientProjects,
          wonDeals,
          changeLog,
          lookupTables,
          scoringRubric: {
            formula: '(ARR × Replicability × Conversion%) / Effort',
            tierDefinitions: [],
            replicabilityScale: [],
          },
          lastUpdated: new Date(),
          isLoading: false,
          error: null,
        };

        resolve({
          data: dashboardState,
          validation,
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse Master_Data_Features sheet
 */
function parseFeaturesSheet(workbook: XLSX.WorkBook): Feature[] {
  const sheetName = 'Master_Data_Features';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => {
    // Parse additional clients from comma-separated string
    const additionalClients = row.Additional_Clients
      ? String(row.Additional_Clients).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    // Calculate priority score
    const arr = Number(row.ARR_Amount) || 0;
    const replicability = Number(row.Replicability_Score) || 1;
    const conversion = Number(row.Conversion_Probability_Percent) || Number(row['Conversion_Probability_%']) || 0;
    const effort = Number(row.Effort_Estimate_Weeks) || 1;

    const calculatedPriorityScore = calculatePriorityScore(arr, replicability, conversion, effort);
    const manualOverride = row.Manual_Override === 'Yes' || row.Manual_Override === true;
    const manualOverrideScore = Number(row.Manual_Override_Score) || null;
    const priorityScore = manualOverride && manualOverrideScore !== null
      ? manualOverrideScore
      : calculatedPriorityScore;

    const revenueAtRisk = row.Revenue_at_Risk === 'Yes' || row.Revenue_at_Risk === true;
    const priorityTier = assignPriorityTier(priorityScore, revenueAtRisk, manualOverride, manualOverrideScore);

    const clientCount = calculateClientCount(row.Primary_Client || '', additionalClients);
    const weightedARR = calculateWeightedARR(arr, conversion);

    return {
      Feature_ID: String(row.Feature_ID || ''),
      Feature_Name: String(row.Feature_Name || ''),
      Agent_Type: String(row.Agent_Type || ''),
      Category: String(row.Category || ''),
      Quarter_Planned: String(row.Quarter_Planned || ''),
      Replicability_Score: replicability,
      Primary_Client: String(row.Primary_Client || ''),
      Additional_Clients: additionalClients,
      Platform_vs_Custom: String(row.Platform_vs_Custom || ''),
      ARR_Amount: arr,
      Revenue_Type: String(row.Revenue_Type || ''),
      Contract_Status: String(row.Contract_Status || ''),
      Pipeline_Stage: String(row.Pipeline_Stage || ''),
      Conversion_Probability_Percent: conversion,
      Current_Status: String(row.Current_Status || 'Not Started'),
      Completion_Percent: Number(row.Completion_Percent) || Number(row['Completion_%']) || 0,
      Target_Completion_Date: parseDate(row.Target_Completion_Date),
      Effort_Estimate_Weeks: effort,
      Revenue_at_Risk: revenueAtRisk,
      Priority_Score: priorityScore,
      Priority_Tier: priorityTier,
      Client_Count: clientCount,
      Weighted_ARR: weightedARR,
      Manual_Override: manualOverride,
      Manual_Override_Score: manualOverrideScore,
      Management_Notes: String(row.Management_Notes || ''),
      Engineering_Notes: String(row.Engineering_Notes || ''),
      Sales_Notes: String(row.Sales_Notes || ''),
      JIRA_Ticket_Count: 0, // Will be calculated during enrichment
      Dependencies: String(row.Dependencies || ''),
      Team_Required: String(row.Team_Required || ''),
      Sprint_Assignment: String(row.Sprint_Assignment || ''),
      Engineering_Complexity: String(row.Engineering_Complexity || ''),
    };
  });
}

/**
 * Parse Master_Data_JIRA_Tickets sheet
 */
function parseJiraTicketsSheet(workbook: XLSX.WorkBook): JiraTicket[] {
  const sheetName = 'Master_Data_JIRA_Tickets';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => ({
    JIRA_Ticket_ID: String(row.JIRA_Ticket_ID || ''),
    Title: String(row.Title || ''),
    Status: String(row.Status || 'To Do'),
    Category: String(row.Category || ''),
    Client_Name: String(row.Client_Name || ''),
    Effort_T_Shirt_Size: String(row.Effort_T_Shirt_Size || 'M'),
    Story_Points: Number(row.Story_Points) || 0,
    Mapped_Feature_ID: String(row.Mapped_Feature_ID || ''),
    Team_Required: String(row.Team_Required || ''),
  }));
}

/**
 * Parse Master_Data_Sales_Pipeline sheet
 */
function parseSalesOpportunitiesSheet(workbook: XLSX.WorkBook): SalesOpportunity[] {
  const sheetName = 'Master_Data_Sales_Pipeline';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => {
    const arrValue = Number(row.ARR_Value) || 0;
    const probability = Number(row.Probability_Percent) || Number(row['Probability_%']) || 0;
    const weightedARR = calculateWeightedARR(arrValue, probability);

    // Parse mapped feature IDs
    const mappedFeatureIDs = row.Mapped_Feature_ID
      ? String(row.Mapped_Feature_ID).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    return {
      Opportunity_ID: String(row.Opportunity_ID || ''),
      Opportunity_Name: String(row.Opportunity_Name || ''),
      Account_Name: String(row.Account_Name || ''),
      Stage: String(row.Stage || ''),
      ARR_Value: arrValue,
      Close_Date: parseDate(row.Close_Date),
      Probability_Percent: probability,
      Owner: String(row.Owner || ''),
      Agent_Type: String(row.Agent_Type || ''),
      Mapped_Feature_ID: mappedFeatureIDs,
      Status: String(row.Status || 'Active'),
      Weighted_ARR: weightedARR,
    };
  });
}

/**
 * Parse Master_Data_Client_Projects sheet
 */
function parseClientProjectsSheet(workbook: XLSX.WorkBook): ClientProject[] {
  const sheetName = 'Master_Data_Client_Projects';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => {
    const mappedFeatureIDs = row.Mapped_Feature_IDs
      ? String(row.Mapped_Feature_IDs).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    return {
      Project_ID: String(row.Project_ID || ''),
      Client_Name: String(row.Client_Name || ''),
      Project_Name: String(row.Project_Name || ''),
      Status: String(row.Status || ''),
      Start_Date: parseDate(row.Start_Date),
      End_Date: parseDate(row.End_Date),
      Project_Value: Number(row.Project_Value) || 0,
      Features_Required: String(row.Features_Required || ''),
      Mapped_Feature_IDs: mappedFeatureIDs,
    };
  });
}

/**
 * Parse Master_Data_Won_Deals sheet
 */
function parseWonDealsSheet(workbook: XLSX.WorkBook): WonDeal[] {
  const sheetName = 'Master_Data_Won_Deals';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => ({
    Client_Name: String(row.Client_Name || ''),
    Original_Contract_Value: Number(row.Original_Contract_Value) || 0,
    Renewal_Date: parseDate(row.Renewal_Date),
    Upsell_Opportunity: String(row.Upsell_Opportunity || ''),
    Potential_Expansion_ARR: Number(row.Potential_Expansion_ARR) || 0,
    Risk_Level: String(row.Risk_Level || 'Low'),
  }));
}

/**
 * Parse Change_Log sheet
 */
function parseChangeLogSheet(workbook: XLSX.WorkBook): ChangeLogEntry[] {
  const sheetName = 'Change_Log';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map((row: any) => ({
    Date: parseDate(row.Date) || new Date(),
    User: String(row.User || ''),
    Feature_ID: String(row.Feature_ID || ''),
    Field_Changed: String(row.Field_Changed || ''),
    Old_Value: String(row.Old_Value || ''),
    New_Value: String(row.New_Value || ''),
    Reason_for_Change: String(row.Reason_for_Change || ''),
  }));
}

/**
 * Parse Lookup_Tables sheet
 */
function parseLookupTablesSheet(workbook: XLSX.WorkBook): LookupTables {
  const sheetName = 'Lookup_Tables';
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found, using defaults`);
    return getDefaultLookupTables();
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Parse columns into arrays
  const lookupTables: LookupTables = {
    Clients: [],
    Agent_Types: [],
    Pipeline_Stages: [],
    Priority_Tiers: [],
    Categories: [],
    Team_Assignment: [],
    Status_Options: [],
    Revenue_Types: [],
    Contract_Status: [],
  };

  // Extract column headers and data
  if (data.length > 0) {
    const headers = data[0] as string[];
    const rows = data.slice(1);

    headers.forEach((header, colIndex) => {
      const columnName = header as keyof LookupTables;
      if (lookupTables[columnName] !== undefined) {
        lookupTables[columnName] = rows
          .map((row: any) => row[colIndex])
          .filter(Boolean)
          .map(String);
      }
    });
  }

  return lookupTables;
}

/**
 * Enrich features with calculated fields
 */
function enrichFeatures(features: Feature[], jiraTickets: JiraTicket[]): Feature[] {
  return features.map(feature => {
    // Count JIRA tickets mapped to this feature
    const ticketCount = jiraTickets.filter(
      ticket => ticket.Mapped_Feature_ID === feature.Feature_ID
    ).length;

    return {
      ...feature,
      JIRA_Ticket_Count: ticketCount,
    };
  });
}

/**
 * Enrich JIRA tickets with feature priority data
 */
function enrichJiraTickets(tickets: JiraTicket[], features: Feature[]): JiraTicket[] {
  return tickets.map(ticket => {
    const feature = features.find(f => f.Feature_ID === ticket.Mapped_Feature_ID);

    return {
      ...ticket,
      Priority_Score: feature?.Priority_Score,
      Priority_Tier: feature?.Priority_Tier,
    };
  });
}

/**
 * Validate parsed data
 */
function validateData(
  features: Feature[],
  jiraTickets: JiraTicket[],
  opportunities: SalesOpportunity[]
): ValidationReport {
  const warnings: ValidationWarning[] = [];

  // Check for required fields in features
  features.forEach(feature => {
    if (!feature.Feature_ID) {
      warnings.push({
        type: 'error',
        message: 'Feature missing Feature_ID',
        featureId: feature.Feature_ID,
      });
    }

    if (!feature.Feature_Name) {
      warnings.push({
        type: 'warning',
        message: `Feature ${feature.Feature_ID} missing Feature_Name`,
        featureId: feature.Feature_ID,
      });
    }

    if (feature.Conversion_Probability_Percent < 30 && feature.Conversion_Probability_Percent > 0) {
      warnings.push({
        type: 'warning',
        message: `Feature ${feature.Feature_ID} has low conversion probability (${feature.Conversion_Probability_Percent}%)`,
        featureId: feature.Feature_ID,
      });
    }
  });

  // Check for broken feature mappings in JIRA tickets
  const featureIds = new Set(features.map(f => f.Feature_ID));
  jiraTickets.forEach(ticket => {
    if (ticket.Mapped_Feature_ID && !featureIds.has(ticket.Mapped_Feature_ID)) {
      warnings.push({
        type: 'warning',
        message: `JIRA ticket ${ticket.JIRA_Ticket_ID} mapped to non-existent feature ${ticket.Mapped_Feature_ID}`,
      });
    }
  });

  // Check for at-risk opportunities
  opportunities.forEach(opp => {
    if (opp.Status === 'At Risk') {
      warnings.push({
        type: 'warning',
        message: `Opportunity ${opp.Opportunity_Name} is marked At Risk`,
      });
    }
  });

  // Count unique clients
  const clients = new Set(features.map(f => f.Primary_Client));

  return {
    featuresLoaded: features.length,
    jiraTicketsLoaded: jiraTickets.length,
    opportunitiesLoaded: opportunities.length,
    clientsIdentified: clients.size,
    warnings,
  };
}

/**
 * Parse date from various formats
 */
function parseDate(value: any): Date | null {
  if (!value) return null;

  // If already a Date object
  if (value instanceof Date) {
    return value;
  }

  // If it's an Excel serial date number
  if (typeof value === 'number') {
    // Excel dates are days since 1900-01-01 (with some quirks)
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date;
  }

  // Try parsing as string
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Get default lookup tables if sheet is missing
 */
function getDefaultLookupTables(): LookupTables {
  return {
    Clients: ['Broadridge', 'DTCC', 'JP Morgan', 'Accenture', 'Regional Banks', 'Multiple', 'Internal'],
    Agent_Types: [
      'Email Automation',
      'Trade Processing',
      'Core Reconciliation',
      'SSI (Standing Settlement Instructions)',
      'Platform (All Agents)',
      'API Development',
      'Bug Fixes',
      'Infrastructure',
      'Other'
    ],
    Pipeline_Stages: [
      'Introduction',
      'Qualification',
      'Proposal',
      'POC',
      'Contract Negotiation',
      'Closed Won',
      'Closed Lost'
    ],
    Priority_Tiers: [
      'Tier 0: Emergency',
      'Tier 1: Fast Track',
      'Tier 2: Standard Delivery',
      'Tier 3: Custom Engagement',
      'Tier 4: Backlog'
    ],
    Categories: [
      'Core Infrastructure',
      'Client-Specific Work',
      'Platform Improvements',
      'API Development',
      'Bug Fixes'
    ],
    Team_Assignment: ['Frontend', 'Backend', 'DevOps', 'ML'],
    Status_Options: ['Not Started', 'In Progress', 'Blocked', 'Completed', 'Cancelled'],
    Revenue_Types: ['New Contract', 'Expansion', 'Retention/Risk of Loss', 'Internal'],
    Contract_Status: ['Signed', 'Verbal Commitment', 'POC', 'Exploratory'],
  };
}
