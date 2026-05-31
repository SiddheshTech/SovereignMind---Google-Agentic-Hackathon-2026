import redis
import sys
from app.core.config import settings

class MockRedis:
  """In-memory Redis fallback mock for offline/local development."""
  def __init__(self):
    self.store = {}
    self.channels = {}

  def get(self, key):
    return self.store.get(key)

  def set(self, key, value, ex=None):
    self.store[key] = value
    return True

  def publish(self, channel, message):
    print(f"[MockRedis Pub] Channel '{channel}' Broadcast: {message[:100]}...")
    if channel in self.channels:
      for handler in self.channels[channel]:
        handler(message)
    return 1

  def subscribe(self, channel, handler):
    if channel not in self.channels:
      self.channels[channel] = []
    self.channels[channel].append(handler)
    return True

# Initialize client with dynamic fallback
try:
  print("🔌 Connecting to Redis...")
  redis_conn = redis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=1)
  redis_conn.ping()
  print("✅ Redis Connection Successful")
except Exception as e:
  print(f"⚠️ Redis unavailable ({e}). Falling back to local In-Memory Mock.")
  redis_conn = MockRedis()
