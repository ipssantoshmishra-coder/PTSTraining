from pydantic import BaseModel
from typing import Optional

class RecruitLoginRequest(BaseModel):
    roll_number: str
    dob: str

class RecruitCreate(BaseModel):
    roll_number: str
    dob: str
    full_name: str
    phone_number: str
    home_district: Optional[str] = "N/A"

    hostel_name: Optional[str] = "N/A"
    barrack_no: Optional[str] = "N/A"
    bed_no: Optional[str] = "N/A"
    barrack_incharge_name: Optional[str] = "N/A"
    barrack_incharge_phone: Optional[str] = "N/A"

    mess_name: Optional[str] = "Central Mess"
    mess_incharge_name: Optional[str] = "N/A"
    mess_incharge_phone: Optional[str] = "N/A"

    indoor_batch_no: Optional[str] = "N/A"
    indoor_room_no: Optional[str] = "N/A"
    indoor_incharge_name: Optional[str] = "N/A"
    indoor_incharge_phone: Optional[str] = "N/A"

    outdoor_company: Optional[str] = "N/A"
    outdoor_platoon: Optional[str] = "N/A"
    outdoor_incharge_name: Optional[str] = "N/A"
    outdoor_incharge_phone: Optional[str] = "N/A"

class RecruitResponse(RecruitCreate):
    id: int

    class Config:
        from_attributes = True