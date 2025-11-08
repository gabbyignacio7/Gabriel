import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Feature,
  JiraTicket,
  Opportunity,
  FilterState,
  UserRole,
  UserPermissions,
} from '../types';
import featuresData from '../data/features.json';
import ticketsData from '../data/jiraTickets.json';
import opportunitiesData from '../data/salesPipeline.json';
import { applyFeatureFilters } from '../utils/filters';

interface DataContextType {
  features: Feature[];
  tickets: JiraTicket[];
  opportunities: Opportunity[];
  filters: FilterState;
  currentUser: UserRole;
  userPermissions: UserPermissions;
  setFilters: (filters: FilterState) => void;
  setCurrentUser: (user: UserRole) => void;
  filteredFeatures: Feature[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getUserPermissions = (user: UserRole): UserPermissions => {
  const permissions: Record<UserRole, UserPermissions> = {
    Steve: {
      canEditRevenue: true,
      canOverridePriority: true,
      canViewAllClients: true,
      canEditConversion: true,
    },
    Ryan: {
      canEditRevenue: false,
      canOverridePriority: true,
      canViewAllClients: true,
      canEditReplicability: true,
    },
    Konnor: {
      canEditRevenue: false,
      canOverridePriority: false,
      canViewAllClients: true,
      canEditEffort: true,
    },
    Nick: {
      canEditRevenue: false,
      canOverridePriority: false,
      canViewAllClients: true,
      canEditEffort: true,
    },
  };
  return permissions[user];
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [features] = useState<Feature[]>(featuresData as Feature[]);
  const [tickets] = useState<JiraTicket[]>(ticketsData as JiraTicket[]);
  const [opportunities] = useState<Opportunity[]>(
    opportunitiesData as Opportunity[]
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [currentUser, setCurrentUser] = useState<UserRole>('Steve');
  const [userPermissions, setUserPermissions] = useState<UserPermissions>(
    getUserPermissions('Steve')
  );

  useEffect(() => {
    setUserPermissions(getUserPermissions(currentUser));
  }, [currentUser]);

  const filteredFeatures = React.useMemo(() => {
    return applyFeatureFilters(features, filters);
  }, [features, filters]);

  const value: DataContextType = {
    features,
    tickets,
    opportunities,
    filters,
    currentUser,
    userPermissions,
    setFilters,
    setCurrentUser,
    filteredFeatures,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
