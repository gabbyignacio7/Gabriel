import React from 'react';
import { Feature, JiraTicket, Opportunity } from '../../types';
import { exportToExcel, exportCurrentView } from '../../utils/exportToExcel';

interface ExportButtonProps {
  features?: Feature[];
  tickets?: JiraTicket[];
  opportunities?: Opportunity[];
  currentViewData?: any[];
  currentViewName?: string;
  variant?: 'full' | 'current';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  features,
  tickets,
  opportunities,
  currentViewData,
  currentViewName,
  variant = 'full',
}) => {
  const handleExport = () => {
    if (variant === 'full' && features && tickets && opportunities) {
      exportToExcel(features, tickets, opportunities);
    } else if (variant === 'current' && currentViewData && currentViewName) {
      exportCurrentView(currentViewData, currentViewName);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="btn-primary flex items-center gap-2"
      title={variant === 'full' ? 'Export all data to Excel' : 'Export current view'}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {variant === 'full' ? 'Export to Excel' : 'Export View'}
    </button>
  );
};
