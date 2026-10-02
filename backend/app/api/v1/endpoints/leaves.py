from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.models import LeaveApplication
from app.schemas.leave import LeaveCreate, LeaveReview, LeaveResponse

router = APIRouter()

# 1. Recruit: Apply for leave
@router.post("", response_model=LeaveResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=LeaveResponse, status_code=status.HTTP_201_CREATED)
def apply_leave(payload: LeaveCreate, db: Session = Depends(get_db)):
    leave = LeaveApplication(
        roll_number=payload.roll_number,
        recruit_name=payload.recruit_name,
        company=payload.company,
        leave_type=payload.leave_type,
        start_date=payload.start_date,
        end_date=payload.end_date,
        reason=payload.reason.strip(),
        emergency_contact=payload.emergency_contact,
        status="PENDING",
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

# 2. Recruit: Get past leave history
@router.get("/recruit/{roll_number}", response_model=List[LeaveResponse])
def get_recruit_leaves(roll_number: str, db: Session = Depends(get_db)):
    return (
        db.query(LeaveApplication)
        .filter(LeaveApplication.roll_number == str(roll_number))
        .order_by(LeaveApplication.applied_at.desc())
        .all()
    )

# 3. Admin: Get all leave applications (with optional status filter)
@router.get("", response_model=List[LeaveResponse])
@router.get("/", response_model=List[LeaveResponse])
def get_all_leaves(status: str = None, db: Session = Depends(get_db)):
    query = db.query(LeaveApplication)
    if status:
        query = query.filter(LeaveApplication.status == status.upper())
    return query.order_by(LeaveApplication.applied_at.desc()).all()

# 4. Admin: Approve or Reject leave
@router.patch("/{leave_id}/review", response_model=LeaveResponse)
def review_leave(leave_id: int, payload: LeaveReview, db: Session = Depends(get_db)):
    leave = db.query(LeaveApplication).filter(LeaveApplication.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave.status = payload.status.upper()
    leave.admin_remarks = payload.admin_remarks
    leave.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(leave)
    return leave