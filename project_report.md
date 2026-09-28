# SupportNova Project Report — VoltCart

> **Status: DRAFT / SKELETON.** Sections copy the exact structure required by the SRS (Section 1.10, Deliverable 1). Fill in as each module is finished; do not remove a section even if short.

## 1. Problem Definition
`[1-2 paragraphs: what problem does manual complaint handling cause — inconsistent classification, slow routing, missed escalations, etc. Can adapt from the SRS's own Section 1.1.]`

## 2. Background
`[Why this matters for VoltCart specifically — describe VoltCart briefly: what it sells, typical complaint volume, why AI-assisted triage helps.]`

## 3. Proposed Solution
`[Summarize the two-pipeline approach: GenAI pipeline drafts an answer, Python Ground-Truth pipeline independently checks it, disagreements go to manual review.]`

## 4. Purpose
`[Why this document exists — can reuse the SRS's own wording, adapted to "this report".]`

## 5. Scope
`[What's in scope: web app, AI-assisted classification/response, Python validation, dashboards. What's out of scope: no real payment/CRM integration, per SRS Section 1.4.]`

## 6. Constraints
`[Dependency on complaint/policy quality, AI model behavior/cost, differences between AI wording and Python's ground truth, privacy/security considerations.]`

## 7. Functional Requirements
`[List the ~75 functional requirements from SRS Section 1.6, or reference "see SRS Section 1.6" and note which are implemented / partially implemented / not implemented, with one line each.]`

## 8. Non-Functional Requirements
`[Performance (<20s response), scalability (10,000 complaints), usability, accuracy/compliance, availability (99% uptime) — state how each was addressed or tested.]`

## 9. Application Architecture
`[Diagram + description: Intake → Validation → Knowledge Base → Rule Matrix → Pipeline 1 (GenAI) + Pipeline 2 (Python) → Comparison Engine → Verification Decision → Final Resolution → Dashboards. Use the SRS's own architecture diagram as a starting point.]`

## 10. Module Descriptions
`[One subsection per module, 1 paragraph each, written by each owner:]`
- 10.1 Backend and Security (Isaac)
- 10.2 Knowledge Base (Ajoke)
- 10.3 AI Pipeline (Avis)
- 10.4 Python Validation (Faith)
- 10.5 Frontend and Analytics (Nelius)
- 10.6 Data, Testing and Docs (Virtue)

## 11. Database Design
`[Isaac to fill in: schema/tables, e.g. users, complaints, policies, rules, audit_log. Include an ER diagram if possible.]`

## 12. Data Flow Diagram
`[Diagram: complaint in → processing stages → response/resolution out. Required by SRS.]`

## 13. Use Case Diagram
`[Diagram: actors (customer, agent, reviewer, manager, admin) and their actions.]`

## 14. Activity Diagram
`[Diagram: the step-by-step flow of a single complaint through the system, from submission to resolution.]`

## 15. Sequence Diagram
`[Diagram: the order of calls between frontend → backend → AI API → Python validation → database → back to frontend.]`

## 16. Complaint-Processing Pipeline
`[Narrative walkthrough: intake, validation, preprocessing, GenAI analysis, Python validation, comparison, manual review if needed, response.]`

## 17. Knowledge-Base Processing
`[Ajoke's section: document upload, validation, parsing, chunking, version control, retrieval method (FAISS/ChromaDB), precedence logic.]`

## 18. Complaint Resolution Rule Matrix
`[Summary of the 100-rule matrix: structure, how it's used by both pipelines. Full matrix lives in data/rule_matrix.csv.]`

## 19. Prompt Design
`[Avis's section: prompt template structure, what context is sent to the AI, how injection protection is built into the prompt itself.]`

## 20. Prompt Versions
`[How prompt versions are tracked and logged, per SRS Steps 48-49.]`

## 21. GenAI API
`[Which provider/model used, why chosen, sample request/response.]`

## 22. JSON Schema
`[The structured output schema the AI must return — reuse/adapt the SRS's sample schema.]`

## 23. Ground-Truth Validation
`[Faith's section: how the Python pipeline independently checks category, department, urgency, escalation, refund/compensation eligibility, without using AI.]`

## 24. Routing Validation
`[How department assignment is independently checked against the Rule Matrix.]`

## 25. Escalation Logic
`[How escalation triggers and levels are enforced by Python regardless of what the AI decided.]`

## 26. Policy Validation
`[How policy applicability/version/precedence is checked before a resolution is finalized.]`

## 27. Hallucination Handling
`[How unsupported claims/promises in AI output are detected and flagged.]`

## 28. Prompt-Injection Protection
`[How complaint text is treated as untrusted data, never as an instruction — reference the 30 attack test cases.]`

## 29. Testing
`[Summary of testing approach — reference testcases/VoltCart_Test_Cases_v2.xlsx and its 6 sheets, and overall pass rate once run.]`

## 30. Security
`[Summary — reference security_report.md for full detail.]`

## 31. Limitations
`[Honest list: simulated dataset, no live payment/CRM integration, AI wording may vary run to run, etc.]`

## 32. Future Enhancements
`[Ideas: multi-language support, real CRM integration, live agent chat, etc.]`

---
*Compiled by Virtue (Data, Testing and Docs). Each numbered section above should be filled in by its respective module owner, or by Virtue based on their input.*
