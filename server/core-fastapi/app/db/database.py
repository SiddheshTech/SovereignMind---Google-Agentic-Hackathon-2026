import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from sqlmodel import SQLModel
from typing import AsyncGenerator, Any
from app.core.config import settings

# Graceful fallback to local SQLite if PostgreSQL is not running or available
DATABASE_URL = settings.DATABASE_URL
engine = None
is_async = True

try:
  if not DATABASE_URL or "postgresql" not in DATABASE_URL:
    raise ValueError("SQLite preferred")
  
  # Try creating PostgreSQL async engine (will fail here if asyncpg is not installed)
  engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
  )
except Exception:
  try:
    # Try creating async SQLite engine (requires aiosqlite package)
    os.makedirs("data", exist_ok=True)
    DATABASE_URL = "sqlite+aiosqlite:///./data/sovereignmind.db"
    engine = create_async_engine(
      DATABASE_URL,
      echo=False,
      future=True,
      connect_args={"check_same_thread": False}
    )
  except Exception as e:
    # Fallback to standard SYNCHRONOUS native SQLite (guaranteed to succeed on all Python installations!)
    print(f"⚠️ Async drivers unavailable ({e}). Falling back to native synchronous SQLite engine.")
    DATABASE_URL = "sqlite:///./data/sovereignmind.db"
    engine = create_engine(
      DATABASE_URL,
      echo=False,
      future=True,
      connect_args={"check_same_thread": False}
    )
    is_async = False

print(f"🔌 SovereignMind Connecting to Database: {DATABASE_URL}")

# Define Session Managers based on sync/async engine status
if is_async:
  AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
  )
else:
  # Define a Mock Async Session wrapper that wraps the sync Session to preserve async API compatibility!
  class SyncToAsyncSessionWrapper:
    def __init__(self, sync_session):
      self.sync_session = sync_session

    async def __aenter__(self):
      return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
      self.sync_session.close()

    def add(self, model):
      self.sync_session.add(model)

    async def delete(self, model):
      self.sync_session.delete(model)

    async def execute(self, statement, *args, **kwargs):
      return self.sync_session.execute(statement, *args, **kwargs)

    async def commit(self):
      self.sync_session.commit()

    async def close(self):
      self.sync_session.close()

  # Factory mimicking session maker
  def AsyncSessionLocalFactory():
    sync_sess = Session(bind=engine)
    return SyncToAsyncSessionWrapper(sync_sess)
  
  AsyncSessionLocal = AsyncSessionLocalFactory

async def init_db():
  if is_async:
    async with engine.begin() as conn:
      await conn.run_sync(SQLModel.metadata.create_all)
  else:
    # Synchronous metadata creation (natively synchronous in sqlite3)
    SQLModel.metadata.create_all(bind=engine)
  print("✅ [Database] Table structures verified.")

async def get_db() -> AsyncGenerator[Any, None]:
  session = AsyncSessionLocal()
  try:
    yield session
  finally:
    await session.close()
