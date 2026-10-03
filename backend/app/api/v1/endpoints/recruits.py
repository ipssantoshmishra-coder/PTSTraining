from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
import app.models.models as models
import app.schemas.recruit as schemas
from app.models.models import Recruit
from app.schemas.recruit import RecruitLoginRequest, SetPinRequest, RecruitResponse
from app.core.security import get_password_hash, verify_password


router = APIRouter()


#1.Login with Rollno, PIN default pin is dob year

@router.post("/login", response_model=RecruitResponse)
def recruit_login(payload: RecruitLoginRequest, db: Session = Depends(get_db)):
    roll = payload.roll_number.strip()
    entered_pin = payload.credential.strip()

    recruit = db.query(Recruit).filter(Recruit.roll_number == roll).first()
    if not recruit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="रोल नंबर पंजीकृत नहीं है (Roll number not registered)"
        )

    # 1. If recruit has explicitly set a custom PIN:
    if recruit.pin_hash and verify_password(entered_pin, recruit.pin_hash):
        return recruit

    # 2. Default PIN fallback: 4-digit Birth Year
    # Extracts 4 consecutive digits (e.g. 1998 from '16/08/1998' or '1998-08-16')
    if recruit.dob:
        import re
        year_match = re.search(r'\b(19\d{2}|20\d{2})\b', str(recruit.dob))
        if year_match:
            default_year_pin = year_match.group(1)
            if entered_pin == default_year_pin:
                return recruit

    # 3. Fail-safe: Also accept full DOB string if someone enters it
    if recruit.dob and recruit.dob.strip() == entered_pin:
        return recruit

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="अमान्य सुरक्षा पिन (Invalid Security PIN. Default PIN is your 4-digit Birth Year, e.g., 1998)"
    )

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

#5. Set Pin 
@router.post("/set-pin")
def set_recruit_pin(payload: SetPinRequest, db: Session = Depends(get_db)):
    roll = payload.roll_number.strip()
    pin = payload.pin.strip()

    if not (pin.isdigit() and len(pin) in (4, 6)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="पिन केवल 4 या 6 अंकों का होना चाहिए (PIN must be 4 or 6 digits)"
        )

    recruit = db.query(Recruit).filter(Recruit.roll_number == roll).first()
    if not recruit:
        raise HTTPException(status_code=404, detail="Recruit not found")

    recruit.pin_hash = get_password_hash(pin)
    db.commit()

    return {"status": "success", "message": "सुरक्षा पिन सफलतापूर्वक सेट हो गया (PIN updated successfully)"}