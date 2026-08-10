from pydantic import BaseModel
from typing import Optional
from app.schemas.incharge import InchargeResponse
from app.schemas.hostel import HostelResponse

class BarrackResponse(BaseModel):
    id: int
    barrack_number: str
    hostel: Optional[HostelResponse] = None

    class Config:
        from_attributes = True

class RecruitCreate(BaseModel):
    roll_number: str
    full_name: str
    phone_number: str
    home_district: Optional[str] = "N/A"
    bed_number: Optional[str] = "N/A"
    barrack_id: Optional[int] = None
    indoor_incharge_id: Optional[int] = None
    outdoor_incharge_id: Optional[int] = None
    mess_incharge_id: Optional[int] = None

class RecruitResponse(BaseModel):
    id: int
    roll_number: str
    full_name: str
    phone_number: str
    home_district: Optional[str]
    bed_number: Optional[str]
    barrack: Optional[BarrackResponse] = None
    indoor_incharge: Optional[InchargeResponse] = None
    outdoor_incharge: Optional[InchargeResponse] = None
    mess_incharge: Optional[InchargeResponse] = None

    class Config:
        from_attributes = True