# Deep See AI - Unified Prioritization Dashboard

## Overview

Interactive web dashboard for prioritizing product features across Sales, Management, Engineering, and Product teams. This dashboard consolidates JIRA engineering tickets, product roadmap features, and sales pipeline opportunities into a single unified view with real-time priority scoring and stakeholder-specific dashboards.

## Features

- **13 pre-configured product features** with priority scoring
- **14 JIRA tickets** mapped to features for engineering tracking
- **10 sales opportunities** with revenue tracking and conversion probabilities
- **Real-time priority scoring** based on ARR, replicability, conversion, and effort
- **Multi-stakeholder views** (Executive, Sales, Management, Engineering, Product)
- **Export to Excel** functionality for offline analysis
- **Role-based access control** for Steve, Ryan, Konnor, and Nick
- **Interactive charts** using Recharts (Pie, Bar, Line charts)
- **Responsive design** built with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: React Context API
- **Data Visualization**: Recharts 2.x
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router 6.x
- **Data Export**: xlsx library
- **Build Tool**: Vite 5.x
- **Data Storage**: JSON files (can be upgraded to API)

## Project Structure

```
deep-see-dashboard/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── ExportButton.tsx
│   │   ├── charts/           # Chart components
│   │   │   ├── PriorityPieChart.tsx
│   │   │   ├── ARRByQuarterChart.tsx
│   │   │   └── PipelineFunnelChart.tsx
│   │   └── views/            # Page views
│   │       ├── ExecutiveSummary.tsx
│   │       ├── SalesView.tsx
│   │       ├── ManagementView.tsx
│   │       ├── EngineeringView.tsx
│   │       ├── ProductRoadmap.tsx
│   │       └── FeatureDetail.tsx
│   ├── data/                 # JSON data files
│   │   ├── features.json
│   │   ├── jiraTickets.json
│   │   └── salesPipeline.json
│   ├── utils/                # Utility functions
│   │   ├── calculations.ts
│   │   ├── filters.ts
│   │   └── exportToExcel.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── context/              # React Context
│   │   └── DataContext.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## User Roles

The dashboard supports four user roles with different permissions:

### Steve (CEO)
- Full access to all features
- Can edit revenue data
- Can override priority scores
- Can view all clients
- Can edit conversion probabilities

### Ryan (Product)
- Feature management
- Can override priority scores
- Can view all clients
- Can edit replicability scores
- Cannot edit revenue data

### Konnor (Engineering Lead)
- Engineering oversight
- Can view all clients
- Can edit effort estimates
- Cannot override priority scores
- Cannot edit revenue data

### Nick (CTO)
- Engineering oversight
- Can view all clients
- Can edit effort estimates
- Cannot override priority scores
- Cannot edit revenue data

## Priority Scoring Formula

The dashboard uses a sophisticated scoring algorithm:

```
Priority Score = (ARR × Replicability × Conversion%) / Effort Weeks
```

Where:
- **ARR**: Annual Recurring Revenue (can be negative for at-risk revenue)
- **Replicability**: Score from 1-5 (5 = highly replicable across clients)
- **Conversion %**: Probability of deal closing (0-100%)
- **Effort**: Estimated engineering effort in weeks

## Priority Tiers

Features are automatically assigned to tiers based on their score:

- **Tier 0: Emergency** - Revenue at risk (immediate action required)
- **Tier 1: Fast Track** - Score ≥ 100 (high priority, quick wins)
- **Tier 2: Standard Delivery** - Score ≥ 50 (normal priority)
- **Tier 3: Custom Engagement** - Score ≥ 10 (lower priority)
- **Tier 4: Backlog** - Score < 10 (future consideration)

## Dashboard Views

### 1. Executive Summary (`/`)
- 8 KPI cards with key metrics
- ARR by Priority Tier (Pie Chart)
- ARR by Quarter (Line Chart)
- Sales Pipeline Funnel
- Top 5 Priorities
- At-Risk Items

### 2. Sales View (`/sales`)
- Client-centric view
- Features grouped by client
- Client-specific KPIs (ARR, feature count, progress)
- Filterable by client, quarter, tier, agent

### 3. Management View (`/management`)
- Revenue-focused prioritization
- Features grouped by Priority Tier
- Sortable by ARR, score, quarter
- Revenue/Effort ratio analysis

### 4. Engineering View (`/engineering`)
- Capacity planning dashboard
- JIRA tickets grouped by sprint
- Story point tracking
- Sprint burndown progress
- Team utilization metrics

### 5. Product Roadmap (`/roadmap`)
- Timeline view by quarter
- Features with status and progress
- Quarter-level ARR totals
- Gantt-style visualization

### 6. Feature Detail (`/feature/:id`)
- Complete feature details
- Linked JIRA tickets
- Progress tracking
- Activity timeline
- Notes (management, engineering, sales)

## Data Model

### Feature
Key fields:
- `feature_id`: Unique identifier (F-001, F-002, etc.)
- `feature_name`: Descriptive name
- `arr_amount`: Annual Recurring Revenue
- `priority_score`: Calculated priority score
- `priority_tier`: Calculated tier assignment
- `replicability_score`: 1-5 rating
- `conversion_probability`: 0-100%
- `effort_estimate_weeks`: Engineering effort

### JIRA Ticket
Key fields:
- `jira_ticket_id`: Unique identifier (DS-001, DS-002, etc.)
- `mapped_feature_id`: Link to parent feature
- `story_points`: Effort estimation
- `jira_status`: To Do, In Progress, Code Review, Done

### Opportunity
Key fields:
- `opportunity_id`: Unique identifier (OPP-001, etc.)
- `arr_value`: Revenue value
- `stage`: Pipeline stage
- `probability_percent`: Conversion probability
- `weighted_arr`: ARR × probability

## Export Functionality

### Export Full Dashboard
Click "Export to Excel" to generate a comprehensive Excel file with three sheets:
1. **Features** - All feature data
2. **JIRA Tickets** - All ticket data
3. **Sales Pipeline** - All opportunity data

### Export Current View
Each view has an option to export the currently filtered data to Excel.

## Customization

### Adding New Features
Edit `/src/data/features.json` to add new features. The priority score and tier will be calculated automatically.

### Adding New Tickets
Edit `/src/data/jiraTickets.json` and set `mapped_feature_id` to link to a feature.

### Modifying Color Palette
Edit `/tailwind.config.js` to customize the color scheme.

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Deployment

### Build for production
```bash
npm run build
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## CI/CD

A GitHub Actions workflow is included in `.github/workflows/ci.yml` for:
- Running tests on push/PR
- Building the application
- Deploying to production (when configured)

## Future Enhancements

Potential improvements:
- [ ] Real-time collaboration with WebSocket
- [ ] AI-powered insights and recommendations
- [ ] What-if scenario planning
- [ ] Advanced drag-and-drop sprint planning
- [ ] Mobile app version
- [ ] API backend integration
- [ ] User authentication with Auth0
- [ ] Advanced analytics and reporting
- [ ] Email notifications for priority changes

## Support

For issues or questions:
- Create an issue on GitHub
- Contact the development team

## License

Proprietary - Deep See AI

---

**Built with ❤️ by the Deep See AI Team**

Last Updated: November 2025
