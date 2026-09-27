"""
Shared data models for the Knowledge Base module.

Using Pydantic here means every document and chunk that flows through
your pipeline is automatically validated - if a required field is
missing or the wrong type, you get a clear error immediately instead
of a silent bug three steps later.
"""

from datetime import date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class PolicyStatus(str, Enum):
    ACTIVE = "active"
    PREVIOUS = "previous"
    SUPERSEDED = "superseded"
    DRAFT = "draft"


class DocumentCategory(str, Enum):
    REFUND_POLICY = "refund_policy"
    REPLACEMENT_POLICY = "replacement_policy"
    BILLING_PROCEDURE = "billing_procedure"
    DELIVERY_POLICY = "delivery_policy"
    WARRANTY_POLICY = "warranty_policy"
    SLA = "sla"
    ESCALATION_PROCEDURE = "escalation_procedure"
    COMPLAINT_SOP = "complaint_sop"
    ROUTING_RULES = "routing_rules"
    FAQ = "faq"
    COMPLIANCE = "compliance"
    RESPONSE_TEMPLATE = "response_template"
    OTHER = "other"


class DocumentMetadata(BaseModel):
    """One record per uploaded file."""
    document_id: str                     # e.g. "DEL-POL-04"
    title: str
    category: DocumentCategory
    version: str                         # e.g. "1.0", "2.1"
    status: PolicyStatus
    effective_date: date
    expiry_date: Optional[date] = None
    source_filename: str
    file_type: str                       # "pdf" or "docx"
    page_count: Optional[int] = None


class Chunk(BaseModel):
    """One retrievable piece of a document."""
    chunk_id: str                        # e.g. "DEL-POL-04-c003"
    document_id: str
    section: Optional[str] = None        # e.g. "5.2"
    heading: Optional[str] = None
    page_number: Optional[int] = None
    version: str
    status: PolicyStatus
    text: str


class RetrievedChunk(BaseModel):
    """A chunk returned from a similarity search, with its score."""
    chunk: Chunk
    similarity_score: float
