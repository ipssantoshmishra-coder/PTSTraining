from fastapi import APIRouter
from app.api.v1.endpoints import incharges, hostels, recruits,feedback,notices,admin,leaves

api_router = APIRouter()

api_router.include_router(incharges.router, prefix="/incharges", tags=["Incharges"])
api_router.include_router(hostels.router, prefix="/hostels", tags=["Hostels"])
api_router.include_router(recruits.router, prefix="/recruits", tags=["Recruits"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["FeedBack"])
api_router.include_router(notices.router, prefix="/notices", tags=["notices"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(leaves.router, prefix="/leaves", tags=["leaves"])
