import uuid
from fastapi import APIRouter, Depends, HTTPException

from src.database.models import Complaint, ComplaintStatusHistory, AuditLog, User
from src.security.auth import get_current_user
from src.complaint_processing.schemas import ComplaintCreate
from src.complaint_processing.cleaning import clean_complaint_text
from src.complaint_processing.duplicates import find_duplicate

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.post("/")
async def submit_complaint(
    data: ComplaintCreate,
    current_user: User = Depends(get_current_user),
):
    cleaned = clean_complaint_text(data.description)
    duplicate_match = await find_duplicate(str(current_user.id), cleaned)

    complaint = Complaint(
        complaint_code=f"CMP-{uuid.uuid4().hex[:8].upper()}",
        customer_id=str(current_user.id),
        title=data.title,
        description=data.description,
        cleaned_description=cleaned,
        product_service=data.product_service,
        order_reference=data.order_reference,
        channel=data.channel,
        is_duplicate_of=duplicate_match["id"] if duplicate_match else None,
        duplicate_score=duplicate_match["score"] if duplicate_match else None,
    )
    await complaint.insert()

    await ComplaintStatusHistory(
        complaint_id=str(complaint.id), old_status=None, new_status="New",
        changed_by=str(current_user.id), note="Complaint submitted",
    ).insert()
    await AuditLog(
        entity_type="complaint", entity_id=str(complaint.id), action="created",
        actor_id=str(current_user.id), after_json=str(data.model_dump()),
    ).insert()

    return {
        "complaint_id": str(complaint.id),
        "complaint_code": complaint.complaint_code,
        "status": complaint.status,
        "possible_duplicate": duplicate_match is not None,
    }


@router.patch("/{complaint_id}/status")
async def update_status(
    complaint_id: str,
    new_status: str,
    note: str | None = None,
    current_user: User = Depends(get_current_user),
):
    complaint = await Complaint.get(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = complaint.status
    complaint.status = new_status
    await complaint.save()

    await ComplaintStatusHistory(
        complaint_id=str(complaint.id), old_status=old_status, new_status=new_status,
        changed_by=str(current_user.id), note=note,
    ).insert()
    await AuditLog(
        entity_type="complaint", entity_id=str(complaint.id), action="status_changed",
        actor_id=str(current_user.id),
        before_json=str(old_status), after_json=str(new_status),
    ).insert()

    return {"complaint_id": str(complaint.id), "status": new_status}


@router.get("/{complaint_id}/history")
async def get_history(complaint_id: str):
    rows = (
        await ComplaintStatusHistory.find(ComplaintStatusHistory.complaint_id == complaint_id)
        .sort(+ComplaintStatusHistory.changed_at)
        .to_list()
    )
    return [
        {
            "old_status": r.old_status, "new_status": r.new_status,
            "changed_by": r.changed_by, "note": r.note,
            "changed_at": r.changed_at,
        }
        for r in rows
    ]