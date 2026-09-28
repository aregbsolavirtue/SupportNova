# Blog Outline — "Building SupportNova: An AI That Checks Its Own Work"

> **Status: DRAFT OUTLINE.** SRS requires 2,000+ words covering all sections below (Deliverable 17). Write in a friendly, technical-blog voice, not exam-report voice, this is for readers outside the competition too.

**Target length per section is a rough guide, not a rule — adjust based on what's actually interesting to write about.**

## 1. The business problem (≈150 words)
Open with a relatable scenario: a customer's charger arrives broken, and what normally happens when a human has to triage that complaint by hand — slow, inconsistent, easy to miss an escalation. Introduce VoltCart as the example company.

## 2. Why we didn't just "send it to ChatGPT" (≈200 words)
The core idea of the project: AI is good at reading messy text and writing replies, but bad at being trusted to police its own rule-following. Introduce the two-pipeline idea here as the hook of the whole post.

## 3. Our Generative AI approach (≈250 words)
Which API/model, why chosen, what we send it (complaint + retrieved policy context), what it returns (the JSON schema). Include a real (or realistic) example prompt → output pair.

## 4. Python architecture (≈200 words)
High-level description of the two-pipeline architecture and where each module (backend, knowledge base, AI pipeline, validation, frontend) fits.

## 5. Complaint intelligence (≈150 words)
What "complaint intelligence" means here: category, subcategory, sentiment, urgency, priority, department, entities. Real example from `complaints.csv`.

## 6. Prompt engineering (≈200 words)
Lessons learned writing prompts that (a) reliably return valid JSON and (b) resist being hijacked by text inside the complaint. Concrete before/after example if one exists.

## 7. Structured output (≈150 words)
Why free-form AI text wasn't good enough, and what the JSON schema enforces.

## 8. Policy grounding (≈200 words)
How Ajoke's knowledge base retrieves the right policy chunk, and how precedence is resolved when policies conflict (active vs. old vs. draft; safety overrides refund windows, etc. — real examples from `CHANGELOG_v2.md`).

## 9. Routing and escalation (≈200 words)
How department routing and escalation levels are decided, and why Python re-checks both instead of trusting the AI's first answer.

## 10. Resolution generation (≈150 words)
How resolution steps and customer responses are generated, and what guardrails exist against overpromising (refunds, compensation).

## 11. Python validation — the heart of the project (≈250 words)
This is the section to spend the most care on. Explain Faith's verification score, what triggers manual review, and give a real worked example (like the "damaged charger, wrong department, made-up $50 coupon" example from earlier in this project).

## 12. GenAI vs. Python comparison (≈150 words)
How the comparison engine works, and a real example where the AI and Python disagreed, and why Python won.

## 13. Hallucination protection (≈150 words)
Concrete example of a false promise or made-up fact getting caught.

## 14. Prompt injection and security (≈200 words)
Real example from the 30 attack test cases — show an actual injected complaint and how the system handled it correctly.

## 15. Testing (≈150 words)
Overview of the ~200+ test cases across 6 categories, and headline pass-rate results.

## 16. Challenges (≈200 words)
Honest, specific challenges faced — e.g. deciding department mappings for ambiguous subcategories, agreeing on shared naming across modules, keeping AI and Python outputs comparable.

## 17. Lessons learned (≈150 words)
What the team would do differently, what surprised you.

## 18. Limitations (≈100 words)
Simulated dataset, no live integrations, AI wording variability, etc.

## 19. Future enhancements (≈100 words)
Ideas for what's next if this became a real product.

## 20. Closing (≈100 words)
Bring it back to the opening scenario — the broken charger complaint — and show how it resolves cleanly now.

---

**Total target: ~2,850 words across sections (comfortably over the 2,000 minimum, trim as needed).**

**Suggested writer split:** Virtue drafts the connective narrative and business-problem framing; each module owner writes their own technical section (3, 8, 9, 11, 12, 13, 14); Virtue edits for one consistent voice at the end.
