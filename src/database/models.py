from datetime import datetime
from typing import Optional
from enum import Enum

from typing import Annotated
from beanie import Document, Indexed
from pydantic import EmailStr


class UserRole(str, Enum):
    customer = "customer"
    agent = "agent"
    reviewer = "reviewer"
    manager = "manager"
    admin = "admin"


class ComplaintStatus(str, Enum):
    new = "New"
    analyzed = "Analyzed"
    assigned = "Assigned"
    in_progress = "In Progress"
    awaiting_customer = "Awaiting Customer"
    escalated = "Escalated"
    resolved = "Resolved"
    closed = "Closed"
    reopened = "Reopened"


class User(Document):
    email: Annotated[EmailStr, Indexed(unique=True)]
    password_hash: str
    full_name: str
    role: Annotated[UserRole, Indexed()] = UserRole.customer
    is_active: bool = True
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"          # actual MongoDB collection name


class Complaint(Document):
    complaint_code: Annotated[str, Indexed(unique=True)]   # e.g. CMP-00421
    customer_id: str                             # the User document's id, stored as text

    title: str
    description: str                             # raw, exactly as submitted
    cleaned_description: str                     # sanitized version — see Part 10

    product_service: Optional[str] = None
    order_reference: Optional[str] = None
    channel: Optional[str] = "web"

    status: ComplaintStatus = ComplaintStatus.new

    category: Optional[str] = None
    subcategory: Optional[str] = None
    department: Optional[str] = None
    urgency: Optional[str] = None
    priority: Optional[str] = None
    sentiment: Optional[str] = None

    is_duplicate_of: Optional[str] = None
    duplicate_score: Optional[float] = None

    sla_response_due: Optional[datetime] = None
    sla_resolution_due: Optional[datetime] = None

    submitted_at: datetime = datetime.utcnow()
    updated_at: Optional[datetime] = None

    class Settings:
        name = "complaints"


class ComplaintStatusHistory(Document):
    complaint_id: str
    old_status: Optional[str] = None
    new_status: str
    changed_by: Optional[str] = None
    note: Optional[str] = None
    changed_at: datetime = datetime.utcnow()

    class Settings:
        name = "complaint_status_history"


class AuditLog(Document):
    entity_type: str            # "complaint", "user", etc.
    entity_id: str
    action: str                  # "created", "escalated", "overridden", etc.
    actor_id: Optional[str] = None
    before_json: Optional[str] = None
    after_json: Optional[str] = None
    timestamp: datetime = datetime.utcnow()

    class Settings:
        name = "audit_log"


class ReviewerOverride(Document):
    complaint_id: str
    original_genai_json: Optional[str] = None
    original_python_json: Optional[str] = None
    reviewer_decision: str        # approve / modify / reassign / escalate
    reviewer_id: str
    comment: Optional[str] = None
    timestamp: datetime = datetime.utcnow()

    class Settings:
        name = "reviewer_overrides"


class SlaRule(Document):
    priority: Annotated[str, Indexed(unique=True)]     # P0, P1, P2, P3
    response_target_minutes: int
    resolution_target_hours: int

    class Settings:
        name = "sla_rules"