from rapidfuzz import fuzz
from src.database.models import Complaint

SIMILARITY_THRESHOLD = 80  # out of 100; tune after testing with real examples


async def find_duplicate(customer_id: str, new_cleaned_text: str):
    """Compares a new complaint against this customer's recent complaints.
    Returns the best match if it's similar enough, otherwise None."""
    recent_complaints = (
        await Complaint.find(Complaint.customer_id == customer_id)
        .sort(-Complaint.submitted_at)
        .limit(20)
        .to_list()
    )

    best_match = None
    best_score = 0

    for existing in recent_complaints:
        score = fuzz.token_sort_ratio(new_cleaned_text, existing.cleaned_description)
        if score > best_score:
            best_score = score
            best_match = existing

    if best_match and best_score >= SIMILARITY_THRESHOLD:
        return {"id": str(best_match.id), "score": best_score}
    return None