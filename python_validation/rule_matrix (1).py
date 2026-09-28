"""
rule_matrix.py
--------------
STEP 1 of Faith's module: load the Rule Matrix.

The Rule Matrix (rule_matrix.csv) is the "answer key" our team built. It has
100 rows. Each row is one rule that says: for this category + subcategory,
here is the correct department, urgency, whether it should escalate, whether
a refund/replacement is allowed, and the maximum compensation in dollars.

This file's only job is: read that CSV into Python, and give other files an
easy way to look up a rule by its rule_id (e.g. "R001").

Nothing here talks to AI. This is plain Python reading a spreadsheet.
"""

import csv


def load_rule_matrix(path="rule_matrix.csv"):
    """
    Reads rule_matrix.csv and returns a dictionary that looks like:

        {
            "R001": {
                "rule_id": "R001",
                "category": "Product Defect",
                "department": "Returns and Refunds",
                "urgency": "Medium",
                "escalate": "No",
                "refund_allowed": "Conditional",
                "replacement_allowed": "Conditional",
                "max_compensation_usd": 0,
                "policy_id": "P01",
                ... (other columns too)
            },
            "R002": { ... },
            ...
        }

    Using a dictionary (instead of a list) means we can instantly find a
    rule by its ID, like rules["R001"], instead of searching through 100
    rows every time.
    """
    rules = {}

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)  # reads each row as a dict, using the header row as keys
        for row in reader:
            # The compensation column comes in as text (e.g. "10"). We turn
            # it into a real number so we can compare amounts later
            # (e.g. "is 50 greater than the rule's max of 10?").
            row["max_compensation_usd"] = int(row["max_compensation_usd"])

            rule_id = row["rule_id"]
            rules[rule_id] = row

    return rules


if __name__ == "__main__":
    # This block only runs if you execute THIS file directly
    # (python rule_matrix.py) -- it's a quick sanity check, not part of
    # the real pipeline. Good habit: always check your loader works before
    # building on top of it.
    rules = load_rule_matrix()
    print(f"Loaded {len(rules)} rules.")
    print("Example rule R001:", rules["R001"])
