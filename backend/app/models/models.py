from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

# 1. Staff / Incharge Master Table (No hardcoded names)
class Incharge(Base):
    __tablename__ = "incharges"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    designation = Column(String, nullable=False)  # e.g., "Hostel Incharge", "Indoor Instructor"


# 2. Hostels / Lodging Table
class Hostel(Base):
    __tablename__ = "hostels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Himalaya"
    incharge_id = Column(Integer, ForeignKey("incharges.id"), nullable=True)

    barracks = relationship("Barrack", back_populates="hostel")
    incharge = relationship("Incharge")


# 3. Barracks Table
class Barrack(Base):
    __tablename__ = "barracks"

    id = Column(Integer, primary_key=True, index=True)
    barrack_number = Column(String, nullable=False)
    hostel_id = Column(Integer, ForeignKey("hostels.id"), nullable=False)
    incharge_id = Column(Integer, ForeignKey("incharges.id"), nullable=True)

    hostel = relationship("Hostel", back_populates="barracks")
    incharge = relationship("Incharge")


# 4. Recruit Master Table
class Recruit(Base):
    __tablename__ = "recruits"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    home_district = Column(String, nullable=True)
    bed_number = Column(String, nullable=True)

    # Dynamic References (Allows different recruits to have different incharges)
    barrack_id = Column(Integer, ForeignKey("barracks.id"), nullable=True)
    indoor_incharge_id = Column(Integer, ForeignKey("incharges.id"), nullable=True)
    outdoor_incharge_id = Column(Integer, ForeignKey("incharges.id"), nullable=True)
    mess_incharge_id = Column(Integer, ForeignKey("incharges.id"), nullable=True)

    barrack = relationship("Barrack")
    indoor_incharge = relationship("Incharge", foreign_keys=[indoor_incharge_id])
    outdoor_incharge = relationship("Incharge", foreign_keys=[outdoor_incharge_id])
    mess_incharge = relationship("Incharge", foreign_keys=[mess_incharge_id])