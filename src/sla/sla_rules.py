from datetime import datetime, timedelta
from src.database.models import SlaRule, Complaint, ComplaintStatus


async def apply_sla(complaint: Complaint):
    """Call this once a complaint's priority has been set
    (typically right after the classification module runs)."""
    sla_rule = await SlaRule.find_one(SlaRule.priority == complaint.priority)
    if not sla_rule:
        return  # no matching rule configured — leave SLA fields blank rather than guessing

    complaint.sla_response_due = datetime.utcnow() + timedelta(minutes=sla_rule.response_target_minutes)
    complaint.sla_resolution_due = datetime.utcnow() + timedelta(hours=sla_rule.resolution_target_hours)
    await complaint.save()


async def get_sla_risks():
    """Returns complaints whose resolution deadline is within 2 hours
    and that aren't already Resolved/Closed — for dashboard flagging."""
    soon = datetime.utcnow() + timedelta(hours=2)
    candidates = await Complaint.find(Complaint.sla_resolution_due <= soon).to_list()
    return [
        c for c in candidates
        if c.status not in (ComplaintStatus.resolved, ComplaintStatus.closed)
    ]