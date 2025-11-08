#!/usr/bin/env python3
import json
from datetime import datetime, timedelta

# Feature mapping - each feature will have tickets
feature_mapping = {
    "F-001": ("LLM-Enhanced Extraction", "Platform Improvements", "Multiple", 8),
    "F-002": ("Client Agent Interaction Enhancements", "Platform Improvements", "Multiple", 5),
    "F-003": ("DeepSee Service Fabric Internal Enhancements", "Core Infrastructure", "Internal", 15),
    "F-004": ("Retention Prediction UI", "Platform Improvements", "Multiple", 4),
    "F-005": ("Double-click to view dashboard messages", "Platform Improvements", "Multiple", 2),
    "F-006": ("Simplified Agentic UI Design", "Platform Improvements", "Multiple", 3),
    "F-007": ("Matching Engine UI", "Platform Improvements", "Multiple", 4),
    "F-008": ("Information Graph Enhanced Infrastructure", "Core Infrastructure", "Multiple", 15),
    "F-009": ("Enhanced Agent Outcome Reasoning and Planning", "Platform Improvements", "Multiple", 6),
    "F-010": ("Inference/Training speed improvements", "Core Infrastructure", "Multiple", 5),
    "F-011": ("DTCC Trade Processing Phase 1", "Client-Specific Work", "DTCC", 22),
    "F-012": ("DTCC Trade Processing Phase 2", "Client-Specific Work", "DTCC", 10),
    "F-013": ("DTCC Core Recon Enhancement", "Client-Specific Work", "DTCC", 8),
    "F-014": ("Broadridge Critical Bug Fix", "Bug Fixes", "Broadridge", 3),
    "F-015": ("Broadridge Email Automation", "Client-Specific Work", "Broadridge", 7),
    "F-016": ("Broadridge Trade Matching Enhancement", "Client-Specific Work", "Broadridge", 5),
    "F-017": ("Colony Bank SSI Implementation", "Client-Specific Work", "Regional Banks", 8),
    "F-018": ("Accenture Email Automation POC", "Client-Specific Work", "Accenture", 12),
    "F-019": ("Accenture Multi-Agent Orchestration", "Client-Specific Work", "Accenture", 15),
    "F-020": ("Vantage Bank POC", "Client-Specific Work", "Regional Banks", 6),
    "F-021": ("JP Morgan Reconciliation Enhancement", "Client-Specific Work", "JP Morgan", 10),
    "F-022": ("Sunwest Bank SSI Deployment", "Client-Specific Work", "Regional Banks", 7),
    "F-023": ("Large Bank Trade Processing Platform", "Client-Specific Work", "[Confidential]", 18),
    "F-024": ("Insurance Company Loan Operations", "Client-Specific Work", "[Prospect]", 8),
    "F-025": ("Asset Manager Email Automation", "Client-Specific Work", "[Prospect]", 6),
    "F-026": ("Regional Bank Consortium Platform", "Platform Improvements", "Multiple", 10),
    "F-027": ("Hedge Fund Matching Engine", "Client-Specific Work", "[Prospect]", 5),
    "F-028": ("Global Bank Security Settlements", "Client-Specific Work", "[Prospect]", 9),
    "F-029": ("Investment Bank One View", "Client-Specific Work", "[Prospect]", 7),
    "F-030": ("European Bank Multi-Agent Platform", "Platform Improvements", "Multiple", 4),
    "F-031": ("Pension Fund DeepPilot", "Client-Specific Work", "[Prospect]", 3),
}

# Continue with more features (F-032 to F-047)
additional_features = {
    "F-032": ("API Gateway Enhancement", "API Development", "Multiple", 5),
    "F-033": ("Webhook Integration System", "API Development", "Multiple", 4),
    "F-034": ("GraphQL API Layer", "API Development", "Multiple", 6),
    "F-035": ("DevOps Pipeline Automation", "Core Infrastructure", "Internal", 8),
    "F-036": ("Security Vulnerability Remediation", "Core Infrastructure", "Internal", 6),
    "F-037": ("Performance Optimization - Query Engine", "Platform Improvements", "Multiple", 5),
    "F-038": ("Data Migration Tools", "Platform Improvements", "Multiple", 4),
    "F-039": ("Monitoring Dashboard v2", "Platform Improvements", "Internal", 3),
    "F-040": ("Backup and Recovery System", "Core Infrastructure", "Internal", 7),
    "F-041": ("Multi-Tenant Architecture", "Core Infrastructure", "Multiple", 12),
    "F-042": ("Mobile App Support", "Platform Improvements", "Multiple", 10),
    "F-043": ("Real-time Analytics Engine", "Platform Improvements", "Multiple", 9),
    "F-044": ("Machine Learning Model Updates", "Platform Improvements", "Multiple", 8),
    "F-045": ("Document Processing Enhancement", "Platform Improvements", "Multiple", 6),
    "F-046": ("Audit Trail System", "Core Infrastructure", "Internal", 5),
    "F-047": ("Compliance Reporting Module", "Core Infrastructure", "Internal", 4),
}

feature_mapping.update(additional_features)

# Ticket templates
ticket_templates = [
    "{feature_name} - Requirements gathering",
    "{feature_name} - Design and architecture",
    "{feature_name} - Core implementation",
    "{feature_name} - API development",
    "{feature_name} - Database schema updates",
    "{feature_name} - Frontend components",
    "{feature_name} - Backend services",
    "{feature_name} - Unit tests",
    "{feature_name} - Integration tests",
    "{feature_name} - Performance testing",
    "{feature_name} - Security review",
    "{feature_name} - Code review",
    "{feature_name} - Documentation",
    "{feature_name} - Deployment preparation",
    "{feature_name} - UAT testing",
    "{feature_name} - Bug fixes",
    "{feature_name} - Production deployment",
    "{feature_name} - Post-deployment monitoring",
]

statuses = ["To Do", "In Progress", "Code Review", "Done", "Blocked"]
t_shirt_sizes = ["S-Small 2wks", "M-Medium 4wks", "L-Large 8wks", "XL-Extra Large 12wks+"]
story_points_map = {
    "S-Small 2wks": [1, 2, 3],
    "M-Medium 4wks": [5, 8],
    "L-Large 8wks": [8, 13],
    "XL-Extra Large 12wks+": [13, 21],
}

engineers = [
    "John Smith", "Sarah Johnson", "Mike Chen", "Emily Davis",
    "Alex Rodriguez", "Jessica Lee", "David Kim", "Rachel Green",
    "Tom Wilson", "Lisa Anderson"
]

sprints = ["Sprint 1", "Sprint 2", "Unassigned", None]

tickets = []
ticket_id = 1

for feature_id, (feature_name, category, client, num_tickets) in feature_mapping.items():
    for i in range(num_tickets):
        # Select template
        template_idx = i % len(ticket_templates)
        title = ticket_templates[template_idx].format(feature_name=feature_name)

        # Assign status based on feature progress
        if feature_id in ["F-011", "F-014", "F-017", "F-018", "F-021"]:  # Active features
            if i < num_tickets * 0.6:
                status = "Done"
            elif i < num_tickets * 0.8:
                status = "In Progress"
            elif i < num_tickets * 0.9:
                status = "Code Review"
            else:
                status = "To Do"
        elif feature_id in ["F-003", "F-008", "F-019"]:  # Partially complete
            if i < num_tickets * 0.3:
                status = "Done"
            elif i < num_tickets * 0.5:
                status = "In Progress"
            else:
                status = "To Do"
        else:
            status = "To Do"

        # Select t-shirt size based on template
        if "Requirements" in title or "Documentation" in title:
            t_shirt = "S-Small 2wks"
        elif "Core implementation" in title or "Backend services" in title:
            t_shirt = "L-Large 8wks"
        elif "Design" in title or "Testing" in title:
            t_shirt = "M-Medium 4wks"
        else:
            t_shirt = t_shirt_sizes[i % len(t_shirt_sizes)]

        # Story points
        story_points = story_points_map[t_shirt][i % len(story_points_map[t_shirt])]

        # Engineer assignment
        engineer = engineers[i % len(engineers)] if status != "To Do" else None

        # Sprint assignment
        if status in ["In Progress", "Code Review"]:
            sprint = "Sprint 1" if i % 2 == 0 else "Sprint 2"
        elif status == "Done":
            sprint = None  # Already completed
        elif status == "Blocked":
            sprint = "Sprint 1 (Buffer)"
        else:
            sprint = "Unassigned"

        # Dates
        created_date = (datetime.now() - timedelta(days=60-i)).strftime("%Y-%m-%d")
        target_date = None
        if status in ["In Progress", "Code Review"]:
            target_date = (datetime.now() + timedelta(days=14+i)).strftime("%Y-%m-%d")

        completed_date = None
        if status == "Done":
            completed_date = (datetime.now() - timedelta(days=30-i)).strftime("%Y-%m-%d")

        ticket = {
            "jira_ticket_id": f"DS-{ticket_id:03d}",
            "jira_ticket_title": title,
            "jira_status": status,
            "jira_category": category,
            "client_name": client,
            "effort_tshirt_size": t_shirt,
            "story_points": story_points,
            "mapped_feature_id": feature_id,
            "mapped_feature_name": feature_name,
            "assigned_engineer": engineer,
            "sprint": sprint,
            "created_date": created_date,
            "target_date": target_date,
            "completed_date": completed_date,
        }

        tickets.append(ticket)
        ticket_id += 1

        # Stop at 198 tickets
        if ticket_id > 198:
            break

    if ticket_id > 198:
        break

# Output JSON
with open('/home/user/Gabriel/deep-see-dashboard/src/data/jiraTickets.json', 'w') as f:
    json.dump(tickets, f, indent=2)

print(f"Generated {len(tickets)} JIRA tickets")
