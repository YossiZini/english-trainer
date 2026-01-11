# Change Requests

This folder contains all change requests (CRs) for the English Learning Platform. Each change request is a self-contained folder with its own PRD and implementation workplan.

## Folder Structure

Each change request follows this structure:
```
CR-XXX-feature-name/
├── PRD.md          # Product Requirements Document
└── workplan.md     # Phased implementation plan
```

## Naming Convention

- **CR-XXX**: Change Request number (zero-padded, e.g., CR-001, CR-002)
- **feature-name**: Brief, lowercase, hyphen-separated description

Example: `CR-001-gamification`

## Process

1. **Create Folder**: Create new folder following naming convention
2. **Write PRD**: Document requirements, user stories, acceptance criteria
3. **Write Workplan**: Break down implementation into phases with file references
4. **Review**: Get approval before implementation
5. **Implement**: Follow the phased workplan
6. **Test**: Verify all acceptance criteria are met
7. **Deploy**: Merge to main branch

## Current Change Requests

| CR # | Feature | Status | Description |
|------|---------|--------|-------------|
| CR-001 | Gamification | 📝 Planning | Add points system with Clash Royale themed levels |

## Status Legend

- 📝 Planning - PRD and workplan in progress
- ⏳ In Progress - Currently being implemented
- ✅ Completed - Merged to main
- 🚫 Rejected - Not moving forward
