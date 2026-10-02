from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Notice
from app.schemas.notice import NoticeCreate, NoticeResponse, NoticeUpdate

router = APIRouter()

# 1. Trainees & Admin: Get Active Notices (Latest First)
@router.get("", response_model=List[NoticeResponse])
@router.get("/", response_model=List[NoticeResponse])
def get_active_notices(db: Session = Depends(get_db)):
    """Fetch all active notices ordered by most recent first"""
    return (
        db.query(Notice)
        .filter(Notice.is_active == True)
        .order_by(Notice.created_at.desc())
        .all()
    )

# 2. Trainees: Get Single Latest Notice (For Home Screen Banner)
@router.get("/latest", response_model=NoticeResponse)
def get_latest_notice(db: Session = Depends(get_db)):
    """Fetch the single latest published notice for the dashboard card"""
    notice = (
        db.query(Notice)
        .filter(Notice.is_active == True)
        .order_by(Notice.created_at.desc())
        .first()
    )
    if not notice:
        raise HTTPException(status_code=404, detail="No active notice found")
    return notice

# 3. Admin: Post a New Notice
@router.post("", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
def create_notice(payload: NoticeCreate, db: Session = Depends(get_db)):
    """Admin endpoint to publish a notice"""
    new_notice = Notice(
        title=payload.title.strip(),
        message=payload.message.strip(),
        category=payload.category,
        is_active=payload.is_active,
    )
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice

# 4. Admin: Deactivate / Archive a Notice
@router.patch("/{notice_id}/toggle", response_model=NoticeResponse)
def toggle_notice_status(notice_id: int, db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    notice.is_active = not notice.is_active
    db.commit()
    db.refresh(notice)
    return notice

# Edit an existing notice
@router.put("/{notice_id}", response_model=NoticeResponse)
def update_notice(notice_id: int, payload: NoticeUpdate, db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    if payload.title is not None:
        notice.title = payload.title.strip()
    if payload.message is not None:
        notice.message = payload.message.strip()
    if payload.category is not None:
        notice.category = payload.category
    if payload.is_active is not None:
        notice.is_active = payload.is_active

    db.commit()
    db.refresh(notice)
    return notice

# Delete a notice permanently
@router.delete("/{notice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notice(notice_id: int, db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return None