import os
import sys
from pydantic_settings import BaseSettings
from typing import Optional

# Ensure Windows terminal processes execute print statements using UTF-8
try:
  if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
  if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
  pass


class Settings(BaseSettings):
  PROJECT_NAME: str = "SovereignMind Core AI"
  API_V1_STR: str = "/api/v1"
  SECRET_KEY: str = os.getenv("SECRET_KEY", "SUPER_SECRET_CONSTITUTIONAL_GOVERNANCE_DNA_KEY")
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

  # Database settings
  DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/soverginmind")
  REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

  # gRPC Settings
  GRPC_PORT: int = int(os.getenv("GRPC_PORT", "50051"))

  # LLM API Keys
  GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
  OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
  CLAUDE_API_KEY: Optional[str] = os.getenv("CLAUDE_API_KEY")

  # Firebase configuration
  FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH")

  # Phoenix / OpenInference Tracing Endpoint
  PHOENIX_COLLECTOR_ENDPOINT: str = os.getenv("PHOENIX_COLLECTOR_ENDPOINT", "http://localhost:6006")

  class Config:
    case_sensitive = True

settings = Settings()
