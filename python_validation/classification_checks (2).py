"""
classification_checks.py
-------------------------
STEP 2 of Faith's module: check whether the AI got the basic facts right.

Before this file runs, someone else's code (Avis's AI Pipeline module) has
already:
  1. Read a customer complaint
  2. Guessed which rule applies (by guessing category + subcategory)
  3. Returned an "AI answer" -- a Python dictionary describing what it thinks
     should happen

This file's job: given that AI answer AND the correct rule from the Rule
Matrix, check whether the AI got category, department, urgency, and
escalation right. This is the "did the AI pick the right department" kind
of checking.

WHAT THE AI'S ANSWER LOOKS LIKE
--------------------------------
We're assuming Avis's module hands us a dictionary shaped like this
(confirm the exact field names with him once his module is finalized --
this is a reasonable guess based on his prompt templates):

    ai_answer = {
        "matched_rule_id": "R001",       # which rule the AI THINKS applies
        "category": "Product Defect",
        "department": "Returns and Refunds",
        "urgency": "Medium",
        "escalate": "No",
        "refund_allowed": "Yes",
        "replacement_allowed": "No",
        "compensation_usd": 0,
        "reply_text": "Hi, sorry to hear your item arrived damaged...",
    }

WHAT "THE CORRECT RULE" LOOKS LIKE
------------------------------------
This comes from rule_matrix.py -- one row from the Rule Matrix, e.g.
rules["R001"].
"""


def check_classification(ai_answer, correct_rule):
    """
    Compares the AI's answer against the correct rule for 4 basic fields:
    category, department, urgency, escalation.

    Returns a list of "problems" (each problem is a short dictionary).
    An empty list means everything matched -- no problems found.

    Why a list, not just True/False?
    Because we want to know WHICH field was wrong, not just "something was
    wrong". Faith's verification score later will use this list to decide
    how many points to take off, and the manual reviewer will read this
    list to understand what to check.
    """
    problems = []

    # --- Check 1: category ---
    if ai_answer.get("category") != correct_rule["category"]:
        problems.append({
            "field": "category",
            "ai_said": ai_answer.get("category"),
            "should_be": correct_rule["category"],
            "severity": "high",  # wrong category usually means everything downstream is wrong too
        })

    # --- Check 2: department ---
    if ai_answer.get("department") != correct_rule["department"]:
        problems.append({
            "field": "department",
            "ai_said": ai_answer.get("department"),
            "should_be": correct_rule["department"],
            "severity": "high",  # sends the complaint to the wrong team entirely
        })

    # --- Check 3: urgency ---
    if ai_answer.get("urgency") != correct_rule["urgency"]:
        problems.append({
            "field": "urgency",
            "ai_said": ai_answer.get("urgency"),
            "should_be": correct_rule["urgency"],
            "severity": "medium",
        })

    # --- Check 4: escalation ---
    # This one is extra important: if the rule says "Yes" (must escalate,
    # e.g. a safety issue) and the AI said "No", that's a serious miss --
    # a real safety complaint could sit un-escalated. So we give this a
    # higher severity specifically when the AI UNDER-escalates.
    ai_escalate = ai_answer.get("escalate")
    correct_escalate = correct_rule["escalate"]
    if ai_escalate != correct_escalate:
        severity = "critical" if correct_escalate == "Yes" and ai_escalate == "No" else "medium"
        problems.append({
            "field": "escalate",
            "ai_said": ai_escalate,
            "should_be": correct_escalate,
            "severity": severity,
        })

    return problems


if __name__ == "__main__":
    # Quick manual test with made-up data, so you can see this work without
    # needing Avis's real AI pipeline connected yet.
    from rule_matrix import load_rule_matrix

    rules = load_rule_matrix()
    correct_rule = rules["R001"]  # Product Defect, Returns and Refunds, Medium, No escalation

    # A "perfect" AI answer -- should produce zero problems
    good_answer = {
        "category": "Product Defect",
        "department": "Returns and Refunds",
        "urgency": "Medium",
        "escalate": "No",
    }
    print("Good answer problems:", check_classification(good_answer, correct_rule))

    # A "bad" AI answer -- wrong department, wrong urgency
    bad_answer = {
        "category": "Product Defect",
        "department": "Billing",          # wrong! should be Returns and Refunds
        "urgency": "Low",                  # wrong! should be Medium
        "escalate": "No",
    }
    print("Bad answer problems:", check_classification(bad_answer, correct_rule))
