from pydantic import BaseModel

class InchargeBase(BaseModel):
    full_name: str
    phone_number: str
    designation: str

class InchargeCreate(InchargeBase):
    pass

class InchargeResponse(InchargeBase):
    id: int

    class Config:
        from_attributes = True