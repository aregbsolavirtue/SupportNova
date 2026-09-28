# VoltCart Dataset v2 - What Changed and Why

Rebuilt to match the official SupportNova SRS minimums and the team's agreed
11-category / 10-department / Sentiment / Priority scheme.

## Category → Department map (source of truth, use these exact words)

| Category | Subcategories | Department |
|---|---|---|
| Product Defect | Dead on Arrival, Damaged in Transit | Returns and Refunds |
| Product Defect | Malfunction After Use | Technical Support |
| Billing | Duplicate Charge, Incorrect Charge | Billing |
| Billing | Subscription Renewal | Billing |
| Delivery | Delayed Delivery, Lost Package, Wrong Item Delivered | Logistics Support |
| Refund | Refund Delay, Refund Denied, Partial Refund Dispute | Returns and Refunds |
| Warranty | Claim Rejected, Repair Delay | Warranty Services |
| Account | Login Problem | Technical Support |
| Account | Account Locked, Unauthorized Account Change | Account Security |
| Technical Support | Setup Help, Software or Firmware Issue | Technical Support |
| Service Quality | Long Wait Time, Repeated Unresolved Contact | Customer Relations |
| Staff Behavior | Rude Agent, Misleading Information | Customer Relations |
| Privacy and Security | Data Exposure, Unwanted Marketing | Compliance and Privacy |
| Privacy and Security | Suspected Fraud | Account Security |
| Safety | Overheating Battery, Fire or Shock Risk | Product Safety |

Note: **Management Escalations** is the escalation *destination*, not a primary
routing department, it's never in `expected_department`, but appears as an
`expected_escalation_level` value ("Critical Management Escalation") for the
most severe cases. That satisfies the SRS's 10-department list without
forcing every case to originate there.

Two judgment calls made explicitly, flag if you disagree:
- "Malfunction After Use" → Technical Support (diagnosed before any refund decision), not Returns
- "Suspected Fraud" → Account Security (account/payment compromise), not Compliance and Privacy

## Numbers vs. SRS minimums

| Requirement | Minimum | v2 has |
|---|---|---|
| Complaints | 500 | 500 |
| Categories | 10 | 11 |
| Subcategories | 20 | 28 |
| Departments | 8 | 10 (9 as primary routing + Management Escalations as target) |
| Policy documents | 20 | 20 |
| Structured rules | 100 | 100 |
| Mandatory escalation rules | 30 | 44 |
| Ambiguous/multi-issue complaints | 25 | 26 |
| Contradictory/difficult policy cases | 20 | 22 |
| Prompt-injection/adversarial complaints | 20 | 30 (15 embedded + 15 pure) |
| Repeated/near-duplicate complaints | 25 | 45 |

## New fields added (complaints.csv and rule_matrix.csv)

- `sentiment`: Positive / Neutral / Negative / Strongly Negative
- `expected_priority`: P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)
- `expected_escalation_level`: No Escalation / Supervisor Review / Department Manager / Specialist Team / Compliance Review / Critical Management Escalation

## What's the same as v1

- Company: VoltCart
- Policy version-control pattern (P02 Active v2.0, P02OLD Old v1.0, P02DRAFT Draft v3.0)
- Attack/injection test design, duplicate/repeat design, vague-complaint design
- AI_USAGE.md content is still accurate, no changes needed there

## Superseded files (from v1, do not use)

`rules_data.py`, the old `complaints.csv`/`rule_matrix.csv`/`policy_registry.csv`, and the old `policies/`
folder built on the 6-category scheme. Replace them in the repo with the files in this folder.
