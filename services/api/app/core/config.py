import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FocusGuard Insights API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "focusguard_insecure_development_secret_key_change_in_prod")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./focusguard.db")
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "*"]

    class Config:
        case_sensitive = True

settings = Settings()
