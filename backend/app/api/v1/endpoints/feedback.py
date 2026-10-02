from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse

# Note: support both with and without trailing slash
router = APIRouter()

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    try:
        new_feedback = Feedback(
            roll_number=payload.roll_number,
            recruit_name=payload.recruit_name,
            feedback_text=payload.feedback_text
        )
        db.add(new_feedback)
        db.commit()
        db.refresh(new_feedback)
        return new_feedback
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/recruit/{roll_number}", response_model=List[FeedbackResponse])
def get_recruit_feedbacks(roll_number: str, db: Session = Depends(get_db)):
    """Fetch previous feedback submitted specifically by this recruit"""
    return (
        db.query(Feedback)
        .filter(Feedback.roll_number == str(roll_number))
        .order_by(Feedback.created_at.desc())
        .all()
    )