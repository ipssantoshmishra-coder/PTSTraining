from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class LeaveCreate(BaseModel):
    roll_number: str
    recruit_name: Optional[str] = None
    company: Optional[str] = None
    leave_type: str = "Casual Leave"
    start_date: date
    end_date: date
    reason: str
    emergency_contact: Optional[str] = None

class LeaveReview(BaseModel):
    status: str # "APPROVED" or "REJECTED"
    admin_remarks: Optional[str] = None

class LeaveResponse(BaseModel):
    id: int
    roll_number: str
    recruit_name: Optional[str] = None
    company: Optional[str] = None
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    emergency_contact: Optional[str] = None
    status: str
    admin_remarks: Optional[str] = None
    applied_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True