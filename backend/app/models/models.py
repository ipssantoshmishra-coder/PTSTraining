from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Recruit(Base):
    __tablename__ = "recruits"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    dob = Column(String, nullable=False)  # Stored as DD/MM/YYYY
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    home_district = Column(String, default="N/A")

    # Lodging Info
    hostel_name = Column(String, default="N/A")
    barrack_no = Column(String, default="N/A")
    bed_no = Column(String, default="N/A")
    barrack_incharge_name = Column(String, default="N/A")
    barrack_incharge_phone = Column(String, default="N/A")

    # Fooding / Mess Info
    mess_name = Column(String, default="Central Mess")
    mess_incharge_name = Column(String, default="N/A")
    mess_incharge_phone = Column(String, default="N/A")

    # Indoor Training Info
    indoor_batch_no = Column(String, default="N/A")
    indoor_room_no = Column(String, default="N/A")
    indoor_incharge_name = Column(String, default="N/A")
    indoor_incharge_phone = Column(String, default="N/A")

    # Outdoor Training Info
    outdoor_company = Column(String, default="N/A")
    outdoor_platoon = Column(String, default="N/A")
    outdoor_incharge_name = Column(String, default="N/A")
    outdoor_incharge_phone = Column(String, default="N/A")

    created_at = Column(DateTime, default=datetime.utcnow)


class LeaveApplication(Base):
    __tablename__ = "leave_applications"

    id = Column(Integer, primary_key=True, index=True)
    recruit_id = Column(Integer, ForeignKey("recruits.id"), nullable=False)
    leave_type = Column(String, nullable=False)  # "Casual", "Medical", "City Pass"
    from_date = Column(String, nullable=False)
    to_date = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String, default="Pending")  # "Pending", "Approved", "Rejected"
    applied_at = Column(DateTime, default=datetime.utcnow)


class ExamSchedule(Base):
    __tablename__ = "exam_schedules"

    id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String, nullable=False)
    training_type = Column(String, nullable=False)  # "Indoor" or "Outdoor"
    exam_date = Column(String, nullable=False)
    exam_time = Column(String, nullable=False)
    room_or_ground = Column(String, nullable=False)