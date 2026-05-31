import json
from typing import Dict, Any, List

class MockKafkaProducer:
  """Mock Kafka Producer for local off-grid telemetry."""
  def __init__(self, bootstrap_servers: str):
    self.servers = bootstrap_servers
    self.sent_messages = {}

  def send(self, topic: str, value: dict):
    if topic not in self.sent_messages:
      self.sent_messages[topic] = []
    
    serialized = json.dumps(value)
    self.sent_messages[topic].append(serialized)
    print(f"📡 [MockKafka Producer] Published message to topic '{topic}': {serialized[:100]}...")

  def flush(self):
    pass

class MockKafkaConsumer:
  """Mock Kafka Consumer for local off-grid telemetry."""
  def __init__(self, topic: str, bootstrap_servers: str):
    self.topic = topic
    self.servers = bootstrap_servers
    self.buffer = []

  def poll(self, timeout_ms: int = 1000) -> List[dict]:
    # Returns buffered mock events
    messages = list(self.buffer)
    self.buffer.clear()
    return [{"topic": self.topic, "value": msg} for msg in messages]

class KafkaClientManager:
  """
  Apache Kafka Client Manager
  Manages connections to Kafka brokers, exposes message producers and consumers,
  and falls back to local mock buffers if Kafka is unavailable.
  """
  def __init__(self):
    self.bootstrap_servers = "localhost:9092"
    self.producer = None
    self.has_kafka = False

    # Attempt to initialize real kafka-python connection
    try:
      from kafka import KafkaProducer
      print(f"🔌 Connecting to Apache Kafka brokers: {self.bootstrap_servers}")
      self.producer = KafkaProducer(
        bootstrap_servers=self.bootstrap_servers,
        value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        request_timeout_ms=1000
      )
      self.has_kafka = True
      print("✅ Apache Kafka producer connection established.")
    except Exception as e:
      print(f"⚠️ Kafka unavailable ({e}). Falling back to In-Memory Mock.")
      self.producer = MockKafkaProducer(self.bootstrap_servers)

  def publish_event(self, topic: str, event_data: Dict[str, Any]):
    try:
      self.producer.send(topic, event_data)
    except Exception as e:
      print(f"⚠️ Failed to publish Kafka event to '{topic}': {e}")

kafka_client = KafkaClientManager()
