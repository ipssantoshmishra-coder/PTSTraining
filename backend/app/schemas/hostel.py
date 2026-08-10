from pydantic import BaseModel
from typing import Optional
from app.schemas.incharge import InchargeResponse

class HostelBase(BaseModel):
    name: str

class HostelCreate(HostelBase):
    incharge_id: Optional[int] = None

class HostelResponse(HostelBase):
    id: int
    incharge: Optional[InchargeResponse] = None

    class Config:
        from_attributes = True