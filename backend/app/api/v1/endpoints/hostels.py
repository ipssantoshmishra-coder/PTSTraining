from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
import app.models.models as models
import app.schemas.hostel as schemas

router = APIRouter()

@router.post("/", response_model=schemas.HostelResponse)
def create_hostel(data: schemas.HostelCreate, db: Session = Depends(get_db)):
    hostel = models.Hostel(**data.model_dump())
    db.add(hostel)
    db.commit()
    db.refresh(hostel)
    return hostel

@router.get("/", response_model=List[schemas.HostelResponse])
def get_hostels(db: Session = Depends(get_db)):
    return db.query(models.Hostel).options(joinedload(models.Hostel.incharge)).all()