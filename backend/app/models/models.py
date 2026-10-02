from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text,Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from sqlalchemy import Date

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

    created_at = Column(DateTime, default=datetime.now)


class LeaveApplication(Base):
    __tablename__ = "leave_applications"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(50), nullable=False, index=True)
    recruit_name = Column(String(100), nullable=True)
    company = Column(String(50), nullable=True)
    leave_type = Column(String(50), default="Casual Leave") # Medical, Casual, Emergency
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    emergency_contact = Column(String(20), nullable=True)
    status = Column(String(20), default="PENDING") # PENDING, APPROVED, REJECTED
    admin_remarks = Column(Text, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)





class ExamSchedule(Base):
    __tablename__ = "exam_schedules"

    id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String, nullable=False)
    training_type = Column(String, nullable=False)  # "Indoor" or "Outdoor"
    exam_date = Column(String, nullable=False)
    exam_time = Column(String, nullable=False)
    room_or_ground = Column(String, nullable=False)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(50), nullable=False, index=True)
    recruit_name = Column(String(100), nullable=True)
    feedback_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="General")  # e.g., Parade, Exam, Mess, General
    is_active = Column(Boolean, default=True)         # True = published, False = archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="staff")  # 'super_admin', 'staff', 'viewer'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())    
      
       