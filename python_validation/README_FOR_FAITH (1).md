# Read this first — your Python Validation module, explained simply

Hi Faith! Virtue asked me to build a starting version of your part while
you were away, since the team needed to keep moving. **This is meant to be
yours** — please read this whole page (15-20 minutes), run the code
yourself, and change anything you want. You'll be asked to explain this
module, so it needs to make sense to you, not just to me.

## The one-sentence version

> The AI guesses an answer. Your code checks the guess against fixed
> rules. If the guess looks risky, a human reviews it instead of it going
> straight to the customer.

## The 6 files, in the order to read them

| File | What it does | Read time |
|---|---|---|
| `rule_matrix.py` | Loads the 100-rule spreadsheet into Python | 3 min |
| `classification_checks.py` | Checks: did the AI pick the right category/department/urgency/escalation? | 5 min |
| `money_checks.py` | Checks: is the AI's refund/replacement/compensation actually allowed? | 5 min |
| `false_promise_checks.py` | Scans the AI's reply TEXT for risky phrases ("guaranteed", "cash back") | 5 min |
| `verification.py` | **The main file.** Runs all the checks above, turns problems into a score, decides pass or manual review | 8 min |
| `comparison_engine.py` | Runs the checker against all 500 real complaints, prints a summary | 5 min |

Every file has a big comment block at the top explaining what it's for and
why, in plain English, before any code starts. Start there each time.

## How to run it yourself (do this first)

```bash
cd python_validation
python3 rule_matrix.py           # step 1: check it loads all 100 rules
python3 classification_checks.py # step 2: see a good vs bad example
python3 money_checks.py          # step 3: see it catch an over-promise
python3 false_promise_checks.py  # step 4: see it catch a risky sentence
python3 verification.py          # step 5: see the full score + decision
python3 comparison_engine.py     # step 6: run it against 50 real complaints
```

Each file has a small demo at the bottom (`if __name__ == "__main__":`)
so you can see it work without needing anyone else's code connected yet.

## The core idea, with a real example

Say a customer's charger arrived broken. The rule for this says: refund
allowed, but no more than $10, and department should be "Returns and
Refunds".

If the AI answers correctly, your checker gives it a high score and it
goes straight to the customer.

If the AI instead says "Department: Billing" and writes "we guarantee
$75 cash back", your checker catches BOTH problems:
- Wrong department → points off
- $75 is more than the $10 allowed AND "guarantee"/"cash back" are risky
  phrases → more points off, and this one is serious enough (a
  "critical" problem) to force manual review no matter what the total
  score is

Run `python3 verification.py` to see this exact example happen.

## What's still fake / needs your work

1. **`simulate_ai_answer()` inside `comparison_engine.py` is not real.**
   It's a stand-in I built so we could test your checker before Avis's
   real AI pipeline was ready. Once his module is connected, this
   function gets replaced by an actual call to his code. This is a good
   first real task for you: read that function, understand what shape of
   answer it fakes, then swap it for the real thing when Avis is ready.

2. **The false-promise phrase list is short and simple on purpose.**
   Right now it only catches a handful of obvious risky phrases
   (`ALWAYS_RISKY_PHRASES` in `false_promise_checks.py`). A good next
   step for you: look at the attack/trick complaints Virtue built
   (`complaint_type = attack_embedded` or `attack_pure` in
   `complaints.csv`), and add more phrases based on what you find there.

3. **The scoring numbers (40/25/15/5 points off, 70 = review threshold)
   are a reasonable starting guess, not tested against real results
   yet.** Once the team has run this against enough real complaints, you
   might want to adjust these numbers — that's your call to make.

4. **Ajoke's policy citations aren't checked yet.** Once her Knowledge
   Base module tells us which policy document the AI should have cited,
   you can add one more check here: does the AI's `policy_id` match what
   Ajoke's system actually retrieved?

## If you get asked to explain this module

The honest, easy answer is: *"I got a starting version built by a
teammate using Claude, then I read through it, ran it myself, and [made
X change / added Y check]. The core idea is: I never trust the AI's
answer directly — I check it against our Rule Matrix with plain Python,
no AI involved in the checking itself, and anything risky goes to a
human."* That's a true, confident answer as long as you've actually done
the reading and run the code — which this file is here to help you do.

Questions, message Virtue. Good luck!
