import re
import unicodedata


def clean_complaint_text(raw_text: str) -> str:
    """Normalizes and sanitizes complaint text before storing it
    or passing it to any downstream AI pipeline."""
    text = unicodedata.normalize("NFKC", raw_text)             # standardize character forms
    text = text.replace("\u200b", "").replace("\ufeff", "")     # strip invisible characters
    text = re.sub(r"\s+", " ", text).strip()                     # collapse repeated whitespace
    return text