from fastapi import APIRouter
from app.api.v1.endpoints import incharges, hostels, recruits

api_router = APIRouter()

api_router.include_router(incharges.router, prefix="/incharges", tags=["Incharges"])
api_router.include_router(hostels.router, prefix="/hostels", tags=["Hostels"])
api_router.include_router(recruits.router, prefix="/recruits", tags=["Recruits"])