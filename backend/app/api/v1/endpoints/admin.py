from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.models import AdminUser, Recruit, Notice, Feedback
from app.schemas.admin import AdminLoginRequest, AdminTokenResponse, DashboardStatsResponse

router = APIRouter()

# 1. Admin Login
@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username.strip()).first()
    
    if not admin or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This admin account is disabled"
        )

    token = create_access_token(data={"sub": admin.username, "role": admin.role})
    
    return AdminTokenResponse(
        access_token=token,
        username=admin.username,
        full_name=admin.full_name,
        role=admin.role
    )

# 2. Live Dashboard Overview Statistics
@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_recruits = db.query(Recruit).count()
    active_notices = db.query(Notice).filter(Notice.is_active == True).count()
    total_feedbacks = db.query(Feedback).count()
    
    return DashboardStatsResponse(
        total_recruits=total_recruits,
        active_notices=active_notices,
        total_feedbacks=total_feedbacks,
        recent_feedbacks_count=min(total_feedbacks, 10)
    )