"""
Step 4 of your task: Document Validation.

Before we ever try to parse a file, we check that it's actually usable.
This catches bad uploads early with a clear error message, instead of
letting a broken file crash the parser three steps downstream.
"""

import hashlib
import os

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_MB = 20


class DocumentValidationError(Exception):
    pass


def validate_file(filepath: str, known_hashes: set[str]) -> str:
    """
    Runs all checks on a single uploaded file.
    Returns the file's hash (used for duplicate detection) if it passes.
    Raises DocumentValidationError with a clear reason if it fails.
    """
    if not os.path.exists(filepath):
        raise DocumentValidationError(f"File not found: {filepath}")

    ext = os.path.splitext(filepath)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise DocumentValidationError(
            f"Unsupported file type '{ext}'. Only PDF and DOCX are allowed."
        )

    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    if size_mb == 0:
        raise DocumentValidationError("File is empty.")
    if size_mb > MAX_FILE_SIZE_MB:
        raise DocumentValidationError(
            f"File is {size_mb:.1f}MB, exceeds the {MAX_FILE_SIZE_MB}MB limit."
        )

    file_hash = _hash_file(filepath)
    if file_hash in known_hashes:
        raise DocumentValidationError("Duplicate document (identical file already uploaded).")

    return file_hash


def _hash_file(filepath: str) -> str:
    """Computes a content hash so identical re-uploads can be detected
    even if the filename is different."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(8192), b""):
            hasher.update(block)
    return hasher.hexdigest()
