"""
comparison_engine.py
----------------------
STEP 6: runs verify_ai_answer() against many complaints at once, and
compares the result to the "expected_" answers already in complaints.csv.

Why this file exists:
Right now, Avis's real AI pipeline isn't connected to this module yet.
So this file FAKES an AI answer for each complaint (using a simple
simulate_ai_answer() function below), just so we can test that Faith's
checker itself works correctly against a large batch of real complaints.

Once Avis's pipeline is ready, someone (probably Faith, with help) swaps
out simulate_ai_answer() for a real call to Avis's generateCustomerReply()
equivalent, and everything else in this file keeps working unchanged.

THIS IS THE "GenAI vs Python comparison" PIECE OF THE TASK.
"""

import csv
import random

from rule_matrix import load_rule_matrix
from verification import verify_ai_answer


def simulate_ai_answer(complaint_row, rules, mistake_chance=0.3, seed=None):
    """
    FAKE STAND-IN for Avis's real AI pipeline, used only for testing this
    checker before the real pipeline is connected.

    Most of the time it returns the CORRECT answer (based on the
    complaint's expected_rule_id), but sometimes (mistake_chance) it
    deliberately introduces a mistake -- wrong department, or an
    over-promised compensation amount -- so we can see the checker
    actually catch problems, not just always say "all good".

    Delete this function once Avis's real pipeline is wired in.
    """
    rng = random.Random(seed)
    rule_id = complaint_row["expected_rule_id"]

    if not rule_id or rule_id not in rules:
        # Complaints with no single expected rule (vague, attack, etc.)
        # aren't meant to be tested this way -- skip them here.
        return None

    rule = rules[rule_id]

    answer = {
        "matched_rule_id": rule_id,
        "category": rule["category"],
        "department": rule["department"],
        "urgency": rule["urgency"],
        "escalate": rule["escalate"],
        "refund_allowed": rule["refund_allowed"],
        "replacement_allowed": rule["replacement_allowed"],
        "compensation_usd": rule["max_compensation_usd"],
        "reply_text": "Thank you for reaching out. We're looking into this for you.",
    }

    if rng.random() < mistake_chance:
        mistake_type = rng.choice(["wrong_department", "over_promise", "risky_phrase"])
        if mistake_type == "wrong_department":
            answer["department"] = "Billing" if rule["department"] != "Billing" else "Technical Support"
        elif mistake_type == "over_promise":
            answer["compensation_usd"] = rule["max_compensation_usd"] + 100
            answer["reply_text"] = f"We'll get you ${rule['max_compensation_usd'] + 100} sorted right away!"
        elif mistake_type == "risky_phrase":
            answer["reply_text"] = "We guarantee this will be fixed by tomorrow!"

    return answer


def run_comparison(complaints_path="complaints.csv", rules_path="rule_matrix.csv", limit=None):
    """
    Reads complaints.csv, simulates an AI answer for each testable
    complaint, runs it through verify_ai_answer(), and prints a summary.

    limit: optional -- only test the first N complaints (useful while
    you're still building/debugging, so you're not waiting on all 500
    every time).
    """
    rules = load_rule_matrix(rules_path)

    tested = 0
    auto_approved = 0
    manual_review = 0
    total_score = 0

    with open(complaints_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if limit and i >= limit:
                break

            ai_answer = simulate_ai_answer(row, rules, seed=i)  # seed=i makes results repeatable
            if ai_answer is None:
                continue  # skip complaints with no single expected rule

            result = verify_ai_answer(ai_answer, rules)

            tested += 1
            total_score += result["score"]
            if result["decision"] == "auto_approved":
                auto_approved += 1
            else:
                manual_review += 1

    print(f"Tested {tested} complaints")
    print(f"  Auto-approved: {auto_approved}")
    print(f"  Sent to manual review: {manual_review}")
    if tested:
        print(f"  Average score: {total_score / tested:.1f}")


if __name__ == "__main__":
    run_comparison(limit=50)
