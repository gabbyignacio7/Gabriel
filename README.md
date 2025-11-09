# DeepSee AI Priority Dashboard

A unified, web-based prioritization dashboard that consolidates Sales, Engineering, and Product perspectives using a universal scoring system.

## 🎯 Overview

Deep See AI currently operates with three disconnected views of the same work:
- **Sales** tracks opportunities in Monday.com
- **Engineering** manages ~200 JIRA tickets
- **Product** maintains roadmaps

This dashboard provides **five distinct views** from the same underlying data model:

1. **Executive Summary** - High-level KPIs and portfolio health
2. **Sales Pipeline** - Client opportunities and revenue tracking
3. **Engineering Capacity** - Sprint planning and capacity forecasting
4. **Product Roadmap** - Feature replication analysis and platform vs. custom balance
5. **Feature Detail** - Deep dive into individual features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone https://github.com/gabbyignacio7/deepsee-priority-dashboard.git
cd deepsee-priority-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using the Dashboard

1. **Upload Excel Data**
   - Click "Upload Data" in the navigation
   - Select your DeepSee prioritization Excel file (.xlsx)
   - Review the validation report
   - Click "Accept & View Dashboard"

2. **Explore Views**
   - Navigate between views using the top menu
   - Use filters to focus on specific quarters, clients, or priority tiers
   - Export data as CSV from any view

## 📊 Priority Scoring System

The dashboard uses a universal formula to prioritize all work:

```
Priority Score = (ARR × Replicability × Conversion%) / Effort
```

### Components:

- **ARR (Annual Recurring Revenue)**: Contract value per year
- **Replicability (1-5 scale)**: How many clients benefit
  - 5: Platform enhancement (all clients)
  - 4: Multiple clients in same vertical
  - 3: Adaptable to 2-3 clients
  - 2: Reusable component
  - 1: One-off custom work
- **Conversion % (0-100)**: Probability of closing the deal
- **Effort (weeks)**: Engineering time required

### Priority Tiers:

- **Tier 0: Emergency** - Critical bug or churn risk (drop everything)
- **Tier 1: Fast Track** - Score ≥ 100 (high-value, multi-client benefit)
- **Tier 2: Standard Delivery** - Score ≥ 50 (important work with good ROI)
- **Tier 3: Custom Engagement** - Score ≥ 10 (client-specific, justified economically)
- **Tier 4: Backlog** - Score < 10 (deferred to future quarters)

## 📁 Excel File Structure

The dashboard expects an Excel workbook with these sheets:

- **Master_Data_Features** (47 rows) - Product roadmap features
- **Master_Data_JIRA_Tickets** (198 rows) - Engineering backlog
- **Master_Data_Sales_Pipeline** (16 rows) - Sales opportunities
- **Master_Data_Client_Projects** (5 rows) - Active client engagements
- **Master_Data_Won_Deals** (5 rows) - Existing clients
- **Lookup_Tables** - Reference data for dropdowns
- **Change_Log** - Audit trail for manual overrides
- **Scoring_Rubric** - Documentation of formulas

See the PRD for complete column specifications.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Excel Parsing**: SheetJS (xlsx)
- **Routing**: React Router
- **Deployment**: GitHub Pages

## 🎨 Branding

The dashboard uses DeepSee's brand colors:

- **Primary Deep Blue**: `#1E3A5F`
- **Ocean Blue Accent**: `#2563EB`
- **Light Blue Background**: `#E6F2FF`

## 🚢 Deployment

### GitHub Pages (Automatic)

Push to the `main` or `claude/build-prioritization-dashboard-011CUxxMRSoSD1b22fX3Nnkn` branch:

```bash
git add .
git commit -m "Update dashboard"
git push origin claude/build-prioritization-dashboard-011CUxxMRSoSD1b22fX3Nnkn
```

GitHub Actions will automatically build and deploy to:
`https://gabbyignacio7.github.io/deepsee-priority-dashboard/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 📝 Key Features

### ✅ Implemented

- [x] Excel file upload with validation
- [x] Priority score calculation engine
- [x] Executive Summary Dashboard with KPIs
- [x] Sales Pipeline View
- [x] Engineering Capacity View
- [x] Product Roadmap View
- [x] Filtering by quarter, tier, client, status
- [x] DeepSee branding and color scheme
- [x] Responsive design (desktop/tablet)
- [x] Client-side processing (no backend required)
- [x] GitHub Actions CI/CD

### 🚧 Future Enhancements (Phase 2)

- [ ] Monday.com API integration
- [ ] JIRA API integration
- [ ] Real-time data sync
- [ ] Feature Detail Page (deep dive view)
- [ ] User authentication
- [ ] Historical trending
- [ ] PDF export functionality
- [ ] Mobile optimization

## 🔒 Privacy & Security

- **All data processing happens in your browser**
- **No data is uploaded to any server**
- **Your Excel file remains on your local machine**
- **Dashboard state is cleared when you close the tab**

## 🤝 Contributing

This dashboard was built for Deep See AI's internal use. For issues or feature requests, please contact:

- **Product Manager**: Gabriel Ignacio
- **CPO**: Ryan McQueen
- **Chief Architect**: Konnor Willison

## 📄 License

Copyright © 2025 Deep See AI. All rights reserved.

---

**Built with ❤️ for Deep See AI**