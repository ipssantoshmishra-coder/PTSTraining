from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Police Training Institute Platform"
    DATABASE_URL: str = "postgresql://police_admin:police_secure_pass@localhost:5432/police_training"
    SECRET_KEY: str = "POLICE_TRAINING_SECRET_KEY_DEV_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    class Config:
        env_file = ".env"

settings = Settings()
