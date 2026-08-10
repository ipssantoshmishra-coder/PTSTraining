from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
import app.models.models as models
import app.schemas.recruit as schemas

router = APIRouter()

@router.post("/", response_model=schemas.RecruitResponse)
def create_recruit(data: schemas.RecruitCreate, db: Session = Depends(get_db)):
    try:
        recruit = models.Recruit(**data.model_dump())
        db.add(recruit)
        db.commit()
        db.refresh(recruit)
        return recruit
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.RecruitResponse])
def get_all_recruits(db: Session = Depends(get_db)):
    return db.query(models.Recruit).options(
        joinedload(models.Recruit.indoor_incharge),
        joinedload(models.Recruit.outdoor_incharge),
        joinedload(models.Recruit.mess_incharge),
        joinedload(models.Recruit.barrack).joinedload(models.Barrack.hostel)
    ).all()

@router.get("/by-roll/{roll_number}", response_model=schemas.RecruitResponse)
def get_recruit_by_roll(roll_number: str, db: Session = Depends(get_db)):
    recruit = db.query(models.Recruit).options(
        joinedload(models.Recruit.barrack).joinedload(models.Barrack.hostel).joinedload(models.Hostel.incharge),
        joinedload(models.Recruit.barrack).joinedload(models.Barrack.incharge),
        joinedload(models.Recruit.indoor_incharge),
        joinedload(models.Recruit.outdoor_incharge),
        joinedload(models.Recruit.mess_incharge)
    ).filter(models.Recruit.roll_number == roll_number).first()

    if not recruit:
        raise HTTPException(status_code=404, detail="Roll number not found.")
    
    return recruit