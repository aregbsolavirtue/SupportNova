"""
money_checks.py
----------------
STEP 3 of Faith's module: check whether the AI's refund, replacement, and
compensation decisions are actually allowed by the rules.

This is one of the most important files in the whole project. If the AI
promises a customer $500 when the rule only allows $10, and nobody catches
it, VoltCart just lost money and made a promise it shouldn't have. This
file is the safety net that catches that BEFORE it reaches the customer.
"""


def check_refund_and_replacement(ai_answer, correct_rule):
    """
    Checks if the AI's refund_allowed / replacement_allowed answers match
    what the rule says.

    Special case: the rule sometimes says "Conditional" (meaning "it
    depends, an agent should decide"). We don't treat "Conditional" as a
    strict mismatch if the AI said "Yes" or "No" -- that's a judgment call,
    not a hard error. We flag it as "low" severity so a human can double
    check, instead of "high" like a flat-out wrong answer.
    """
    problems = []

    for field in ("refund_allowed", "replacement_allowed"):
        ai_value = ai_answer.get(field)
        correct_value = correct_rule[field]

        if correct_value == "Conditional":
            # Not a hard mismatch -- just flag it gently for a human to confirm
            problems.append({
                "field": field,
                "ai_said": ai_value,
                "should_be": correct_value,
                "severity": "low",
                "reason": "Rule says 'Conditional' -- AI's choice should be reviewed, not treated as wrong outright.",
            })
        elif ai_value != correct_value:
            problems.append({
                "field": field,
                "ai_said": ai_value,
                "should_be": correct_value,
                "severity": "high",
                "reason": "AI's answer does not match what the rule allows.",
            })

    return problems


def check_compensation(ai_answer, correct_rule):
    """
    Checks whether the AI promised more compensation (in dollars) than the
    rule allows.

    This is a "ceiling" check, not an exact-match check: the rule's
    max_compensation_usd is the MOST that's allowed, so the AI is allowed
    to offer less (including $0), just never more.
    """
    problems = []

    ai_amount = ai_answer.get("compensation_usd", 0)
    max_allowed = correct_rule["max_compensation_usd"]

    if ai_amount > max_allowed:
        problems.append({
            "field": "compensation_usd",
            "ai_said": ai_amount,
            "should_be": f"at most ${max_allowed}",
            "severity": "critical",  # promising money we're not allowed to give is a serious issue
            "reason": f"AI offered ${ai_amount}, but the rule only allows up to ${max_allowed}.",
        })

    return problems


if __name__ == "__main__":
    from rule_matrix import load_rule_matrix

    rules = load_rule_matrix()

    # R002 is the "severe" version of Dead on Arrival: refund Yes,
    # replacement Yes, up to $10 compensation.
    correct_rule = rules["R002"]
    print("Rule R002:", {
        "refund_allowed": correct_rule["refund_allowed"],
        "replacement_allowed": correct_rule["replacement_allowed"],
        "max_compensation_usd": correct_rule["max_compensation_usd"],
    })

    # AI over-promises: offers $500 when only $10 is allowed
    risky_answer = {
        "refund_allowed": "Yes",
        "replacement_allowed": "Yes",
        "compensation_usd": 500,
    }
    print("Refund/replacement problems:", check_refund_and_replacement(risky_answer, correct_rule))
    print("Compensation problems:", check_compensation(risky_answer, correct_rule))
