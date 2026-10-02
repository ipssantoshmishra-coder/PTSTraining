from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    full_name: str
    role: str

class DashboardStatsResponse(BaseModel):
    total_recruits: int
    active_notices: int
    total_feedbacks: int
    recent_feedbacks_count: int