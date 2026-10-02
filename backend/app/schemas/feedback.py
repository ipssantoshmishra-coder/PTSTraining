from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FeedbackCreate(BaseModel):
    roll_number: str
    recruit_name: Optional[str] = None
    feedback_text: str = Field(..., min_length=5, description="Feedback must have sufficient details")

class FeedbackResponse(BaseModel):
    id: int
    roll_number: str
    recruit_name: Optional[str]
    feedback_text: str
    created_at: datetime

    class Config:
        from_attributes = True