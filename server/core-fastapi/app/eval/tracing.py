import os
from app.core.config import settings

def setup_phoenix_tracing():
  """
  Phoenix Tracing & OpenInference Instrumentation setup
  Enables cross-agent observability, runtime prompt introspection, 
  and telemetry exports to Arize Phoenix.
  """
  print("🔥 Initializing Arize Phoenix Tracing & OpenInference Instrumentation...")
  
  # Configure OpenInference environment variables for automatic tracing export
  os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = settings.PHOENIX_COLLECTOR_ENDPOINT
  
  try:
    # 1. Setup OpenTelemetry Tracer Provider
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from phoenix.otel import register
    
    # Register Arize Phoenix telemetry exporter
    # This captures prompt templates, tokens, latencies, and cross-agent calls
    register(
      endpoint=f"{settings.PHOENIX_COLLECTOR_ENDPOINT}/v1/traces"
    )
    print("✅ Phoenix OpenTelemetry exporter successfully registered.")

  except Exception as e:
    print(f"⚠️ Phoenix Tracing modules not fully available locally ({e}). Recording logs locally.")

def log_agent_trace(agent_name: str, prompt: str, response: str, tokens: int, latency_ms: float, metadata: dict = None):
  """
  Manual fallback logging of agent execution traces to ensure Cross-Agent Observability
  and Runtime Prompt Introspection even if Phoenix collector is offline.
  """
  import json
  trace_entry = {
    "agent_name": agent_name,
    "runtime_prompt": prompt,
    "response": response,
    "token_count": tokens,
    "latency_ms": latency_ms,
    "metadata": metadata or {}
  }
  print(f"🌐 [Phoenix Introspection Trace] {json.dumps(trace_entry)[:180]}...")
