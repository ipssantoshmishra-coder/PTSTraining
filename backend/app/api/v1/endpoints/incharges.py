from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
import app.models.models as models
import app.schemas.incharge as schemas

router = APIRouter()

@router.post("/", response_model=schemas.InchargeResponse)
def create_incharge(data: schemas.InchargeCreate, db: Session = Depends(get_db)):
    incharge = models.Incharge(**data.model_dump())
    db.add(incharge)
    db.commit()
    db.refresh(incharge)
    return incharge

@router.get("/", response_model=List[schemas.InchargeResponse])
def get_incharges(db: Session = Depends(get_db)):
    return db.query(models.Incharge).all()