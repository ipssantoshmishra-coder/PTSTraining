from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
import app.models.models as models
import app.schemas.recruit as schemas

router = APIRouter()

# 1. Login with Roll Number + DOB
@router.post("/login", response_model=schemas.RecruitResponse)
def login_recruit(credentials: schemas.RecruitLoginRequest, db: Session = Depends(get_db)):
    recruit = db.query(models.Recruit).filter(
        models.Recruit.roll_number == credentials.roll_number.strip(),
        models.Recruit.dob == credentials.dob.strip()
    ).first()

    if not recruit:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Roll Number or Date of Birth."
        )
    return recruit

# 2. Get All Recruits (Admin view)
@router.get("/", response_model=List[schemas.RecruitResponse])
def get_all_recruits(db: Session = Depends(get_db)):
    return db.query(models.Recruit).all()

# 3. Create or Register Recruit
@router.post("/", response_model=schemas.RecruitResponse)
def create_recruit(data: schemas.RecruitCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Recruit).filter(models.Recruit.roll_number == data.roll_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Recruit with this Roll Number already exists.")

    recruit = models.Recruit(**data.model_dump())
    db.add(recruit)
    db.commit()
    db.refresh(recruit)
    return recruit

# 4. Lookup by Roll Number directly
@router.get("/by-roll/{roll_number}", response_model=schemas.RecruitResponse)
def get_recruit_by_roll(roll_number: str, db: Session = Depends(get_db)):
    recruit = db.query(models.Recruit).filter(models.Recruit.roll_number == roll_number.strip()).first()
    if not recruit:
        raise HTTPException(status_code=404, detail="Roll number not found.")
    return recruit