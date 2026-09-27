"""
Step 7 of your task: Policy Version Control.

This is the logic that runs whenever an admin uploads a new version of
an existing policy. It answers: "what should happen to the OLD version
now that a new one exists?"

Rules implemented here:
- Uploading a DRAFT never touches any other version - drafts are just
  parked for review, they don't replace anything yet.
- Uploading a new ACTIVE version:
    1. Whatever was PREVIOUS before now becomes SUPERSEDED
       (it's now two versions behind, not one)
    2. Whatever was ACTIVE before now becomes PREVIOUS
       (it's one version behind - still useful for reference)
    3. The new version is saved as ACTIVE
- Uploading a document_id for the first time: no old version exists,
  so it's just saved as-is (ACTIVE or DRAFT, whatever the admin chose).

This keeps exactly one ACTIVE version per document_id at all times,
which is what is_effective() and resolve_precedence() rely on.
"""

from knowledge_base.models import DocumentMetadata, PolicyStatus
from knowledge_base import database as db


def register_new_version(new_metadata: DocumentMetadata) -> None:
    """
    Call this instead of calling db.save_document_version() directly
    whenever a document is uploaded - it handles demoting the old
    version(s) automatically before saving the new one.
    """
    if new_metadata.status == PolicyStatus.DRAFT:
        # Drafts don't affect existing active/previous versions at all -
        # they're just parked for someone to review and approve later.
        db.save_document_version(new_metadata)
        return

    if new_metadata.status != PolicyStatus.ACTIVE:
        # Shouldn't normally happen (you wouldn't upload something as
        # PREVIOUS or SUPERSEDED directly) but handle it safely anyway.
        db.save_document_version(new_metadata)
        return

    history = db.get_version_history(new_metadata.document_id)

    for old_version in history:
        if old_version.status == PolicyStatus.ACTIVE:
            db.update_status(old_version.document_id, old_version.version, PolicyStatus.PREVIOUS)
        elif old_version.status == PolicyStatus.PREVIOUS:
            db.update_status(old_version.document_id, old_version.version, PolicyStatus.SUPERSEDED)
        # anything already SUPERSEDED or DRAFT is left untouched

    db.save_document_version(new_metadata)


def promote_draft_to_active(document_id: str, version: str) -> None:
    """
    Call this when an admin reviews and approves a DRAFT, making it the
    new official ACTIVE version. Reuses the same demotion logic above so
    the currently-active version still gets correctly moved to PREVIOUS.
    """
    history = db.get_version_history(document_id)
    draft = next((v for v in history if v.version == version and v.status == PolicyStatus.DRAFT), None)

    if draft is None:
        raise ValueError(f"No draft found for {document_id} version {version}")

    draft.status = PolicyStatus.ACTIVE
    register_new_version(draft)
