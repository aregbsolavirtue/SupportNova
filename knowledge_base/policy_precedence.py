"""
Step 7 + policy-precedence: deciding which policy 'wins' when more
than one relevant policy is retrieved for the same complaint.

This is exactly the kind of deterministic, rule-based logic the SRS
says must NOT be left to the GenAI model to decide on its own
(Section 1.8, "Contradictory Policy Challenge": active policy vs.
outdated SOP vs. conflicting FAQ - the app must apply documented
precedence rules).

Precedence order (highest wins first):
1. ACTIVE beats PREVIOUS/SUPERSEDED/DRAFT, always
2. Among ACTIVE documents, higher version number wins
3. Among ACTIVE documents with equal version, later effective_date wins
4. DRAFT policies are never used for a final resolution - only
   surfaced as "pending policy change" context if explicitly asked for
"""

from datetime import date
from knowledge_base.models import DocumentMetadata, PolicyStatus, RetrievedChunk


class PolicyConflict(Exception):
    """Raised when two ACTIVE policies genuinely disagree and cannot
    be resolved by version/date alone - this should route the
    complaint to manual review rather than guessing."""
    pass


def resolve_precedence(
    retrieved_chunks: list[RetrievedChunk],
    documents: dict[str, DocumentMetadata],
) -> RetrievedChunk:
    """
    Given several retrieved chunks (possibly from different documents
    or versions), returns the single chunk that should be treated as
    authoritative.
    """
    # 1. Filter out anything that isn't active - drafts/superseded
    #    policies should never be the basis for a final resolution.
    candidates = [
        rc for rc in retrieved_chunks
        if rc.chunk.status == PolicyStatus.ACTIVE
    ]

    if not candidates:
        raise PolicyConflict(
            "No ACTIVE policy found among retrieved chunks - route to manual review."
        )

    # 2. If they're all the same document, no conflict - just take the
    #    top-ranked (most similar) chunk.
    doc_ids = {rc.chunk.document_id for rc in candidates}
    if len(doc_ids) == 1:
        return max(candidates, key=lambda rc: rc.similarity_score)

    # 3. Multiple different documents are relevant - break ties by
    #    version, then by effective_date.
    def sort_key(rc: RetrievedChunk):
        doc = documents[rc.chunk.document_id]
        return (_version_to_tuple(doc.version), doc.effective_date)

    candidates.sort(key=sort_key, reverse=True)
    return candidates[0]


def _version_to_tuple(version_str: str) -> tuple[int, ...]:
    """Turns '2.1' into (2, 1) so versions compare correctly as numbers,
    not as strings (string comparison would wrongly say '10.0' < '9.0')."""
    return tuple(int(part) for part in version_str.split("."))


def is_effective(document: DocumentMetadata, as_of: date | None = None) -> bool:
    """Checks whether a document is currently in force - i.e. active
    status AND within its effective/expiry window."""
    as_of = as_of or date.today()
    if document.status != PolicyStatus.ACTIVE:
        return False
    if document.effective_date > as_of:
        return False
    if document.expiry_date and document.expiry_date < as_of:
        return False
    return True
