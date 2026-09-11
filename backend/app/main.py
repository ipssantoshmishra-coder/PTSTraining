from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.api.v1.router import api_router

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/db-check", tags=["System"])
def db_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT version();")).fetchone()
        return {"database_status": "Connected Successfully", "version": result[0]}
    except Exception as e:
        return {"database_status": "Error", "details": str(e)}

# MOUNT API ROUTER (Must be before the debug print loop)
app.include_router(api_router, prefix="/api/v1")

# Debug: Print registered routes on startup
for route in app.routes:
    if hasattr(route, "methods"):
        print(f"REGISTERED ROUTE: {route.methods} -> {route.path}")