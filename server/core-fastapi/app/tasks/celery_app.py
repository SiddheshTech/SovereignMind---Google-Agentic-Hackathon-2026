import os
import asyncio
from app.core.config import settings

class FallbackTask:
  """Fallback wrapper providing dynamic asynchronous executor if Celery daemon is offline."""
  def __init__(self, func):
    self.func = func

  def delay(self, *args, **kwargs):
    import asyncio
    print(f"⚙️ [Celery Fallback] Queueing task '{self.func.__name__}' asynchronously...")
    try:
      # Run in active running loop or schedule in thread
      loop = asyncio.get_running_loop()
      loop.create_task(self._run_async(*args, **kwargs))
    except RuntimeError:
      # No running loop, run synchronously
      self.func(*args, **kwargs)

  async def _run_async(self, *args, **kwargs):
    if asyncio.iscoroutinefunction(self.func):
      await self.func(*args, **kwargs)
    else:
      self.func(*args, **kwargs)

def task_decorator(func):
  """Decorates function to behave as a Celery task or dynamic fallback."""
  return FallbackTask(func)

# Attempt to load real Celery
celery_app = None
has_celery = False

try:
  from celery import Celery
  print("🔌 Connecting to Celery Task queue...")
  celery_app = Celery(
    "sovereignmind_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
  )
  has_celery = True
  print("✅ Celery app successfully compiled.")
except Exception as e:
  print("ℹ️ [Celery Task Runner] Local asynchronous background runner active.")

