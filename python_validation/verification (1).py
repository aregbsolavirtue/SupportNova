"""
verification.py
-----------------
STEP 5 of Faith's module: the piece that ties everything together.

This file:
  1. Runs ALL the earlier checks (classification, money, false promises)
  2. Turns the combined list of problems into ONE score out of 100
  3. Decides: does this case pass, or does it go to manual review?

This is the file the rest of the team (Isaac's backend, Nelius's frontend)
will actually call. Everything else in this folder is a building block FOR
this file.

HOW THE SCORE WORKS (simple version)
--------------------------------------
Start at 100 points. For every problem found, subtract points based on how
serious it is:

    critical  -> minus 40   (e.g. promised money we're not allowed to give)
    high      -> minus 25   (e.g. wrong department, risky phrase in reply)
    medium    -> minus 15   (e.g. wrong urgency)
    low       -> minus 5    (e.g. a "Conditional" field that needs a human glance)

If the score drops below 70, OR there's even ONE "critical" problem, the
case is sent to manual review. A single critical problem (like promising
$500 when only $10 is allowed) should never slip through just because
everything else about the answer looked fine.
"""

from rule_matrix import load_rule_matrix
from classification_checks import check_classification
from money_checks import check_refund_and_replacement, check_compensation
from false_promise_checks import check_false_promises

POINTS_OFF = {
    "critical": 40,
    "high": 25,
    "medium": 15,
    "low": 5,
}

REVIEW_THRESHOLD = 70  # score below this -> manual review


def verify_ai_answer(ai_answer, rules):
    """
    The main function. Give it the AI's answer (a dict) and the loaded
    rule matrix (from load_rule_matrix()), and it gives back a full
    verification result.

    ai_answer is expected to look like:
        {
            "matched_rule_id": "R001",   # which rule the AI thinks applies
            "category": "...",
            "department": "...",
            "urgency": "...",
            "escalate": "Yes" / "No",
            "refund_allowed": "Yes" / "No" / "Conditional",
            "replacement_allowed": "Yes" / "No" / "Conditional",
            "compensation_usd": 0,
            "reply_text": "the message that would be sent to the customer",
        }

    Returns a dict:
        {
            "rule_id_used": "R001",
            "problems": [ ...list of every problem found... ],
            "score": 62,
            "decision": "manual_review",   # or "auto_approved"
        }
    """
    rule_id = ai_answer.get("matched_rule_id")

    # If the AI didn't even point to a real rule, we can't check anything
    # else against it -- that's an automatic manual review case.
    if rule_id not in rules:
        return {
            "rule_id_used": rule_id,
            "problems": [{
                "field": "matched_rule_id",
                "issue": f"AI referenced rule '{rule_id}', which does not exist in the Rule Matrix.",
                "severity": "critical",
            }],
            "score": 0,
            "decision": "manual_review",
        }

    correct_rule = rules[rule_id]

    # Run every check and combine the results into one list.
    problems = []
    problems += check_classification(ai_answer, correct_rule)
    problems += check_refund_and_replacement(ai_answer, correct_rule)
    problems += check_compensation(ai_answer, correct_rule)
    problems += check_false_promises(ai_answer.get("reply_text", ""), correct_rule)

    # Turn the list of problems into one score.
    score = 100
    for problem in problems:
        score -= POINTS_OFF.get(problem["severity"], 10)
    score = max(score, 0)  # never let it go below 0

    has_critical = any(p["severity"] == "critical" for p in problems)
    needs_review = has_critical or score < REVIEW_THRESHOLD

    return {
        "rule_id_used": rule_id,
        "problems": problems,
        "score": score,
        "decision": "manual_review" if needs_review else "auto_approved",
    }


if __name__ == "__main__":
    rules = load_rule_matrix()

    # Example 1: a good AI answer -- should auto-approve
    good_answer = {
        "matched_rule_id": "R001",
        "category": "Product Defect",
        "department": "Returns and Refunds",
        "urgency": "Medium",
        "escalate": "No",
        "refund_allowed": "Conditional",
        "replacement_allowed": "Conditional",
        "compensation_usd": 0,
        "reply_text": "Sorry to hear this happened. We'll take a look at your order and follow up shortly.",
    }
    print("=== GOOD ANSWER ===")
    result = verify_ai_answer(good_answer, rules)
    print(f"Score: {result['score']}  Decision: {result['decision']}")
    print(f"Problems found: {len(result['problems'])}")

    print()

    # Example 2: a bad AI answer -- wrong department + over-promises
    bad_answer = {
        "matched_rule_id": "R001",
        "category": "Product Defect",
        "department": "Billing",           # wrong
        "urgency": "Medium",
        "escalate": "No",
        "refund_allowed": "Yes",
        "replacement_allowed": "Yes",
        "compensation_usd": 75,             # rule only allows $0
        "reply_text": "We guarantee a full replacement and $75 cash compensation by tomorrow!",
    }
    print("=== BAD ANSWER ===")
    result = verify_ai_answer(bad_answer, rules)
    print(f"Score: {result['score']}  Decision: {result['decision']}")
    print("Problems found:")
    for p in result["problems"]:
        print(" -", p)
