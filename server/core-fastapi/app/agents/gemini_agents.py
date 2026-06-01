import os
from typing import Dict, Any, List
from app.core.config import settings
from app.agents.llm_router import llm_router

class GeminiAgent:
  """
  Universal Multi-Model Agent Personas
  Executes specific civilizational and constitutional duties by routing requests
  through the central LLMRouter supporting Gemini, Groq, Mistral, Llama, and Mixtral.
  """
  def __init__(self, name: str, role: str, system_prompt: str, preferred_provider: str = "gemini"):
    self.name = name
    self.role = role
    self.system_prompt = system_prompt
    self.provider = preferred_provider

  async def execute(self, user_input: str) -> str:
    print(f"🤖 [Agent Persona: {self.name}] Activating router on provider '{self.provider}'...")
    
    # Route through central LLMRouter
    res = await llm_router.generate_response(
      provider=self.provider,
      system_prompt=f"System Persona: {self.name}\nRole: {self.role}\n{self.system_prompt}",
      user_prompt=user_input,
      temperature=0.7
    )
    return res

  async def self_introspect_and_execute(self, country_code: str, user_input: str) -> str:
    print(f"🕵️ [Gemini Agent: {self.name}] Running Self-Introspection via MCP Tool 'query_phoenix_traces'...")
    from app.agents.mcp_server import mcp_server
    
    # Retrieve past traces from MCP Server
    mcp_res = mcp_server.handle_mcp_request("tools/call", {
      "name": "query_phoenix_traces",
      "arguments": {
        "country_code": country_code,
        "agent_name": self.name
      }
    })
    
    trace_text = mcp_res["content"][0]["text"]
    print(f"📡 [MCP Introspection Output] Analyzed recent execution logs.")
    
    # Check if there are unconstitutional infractions in the traces
    has_infractions = "is_authorized\": false" in trace_text.lower() or "infraction_risk_score" in trace_text.lower()
    
    # Self-Correction instructions to append to the system prompt
    self_correction_block = ""
    if has_infractions:
      self_correction_block = (
        "\n\n⚠️ [CRITICAL Telemetry Self-Correction Directive]\n"
        "Your runtime trace telemetry (monitored by Arize Phoenix) shows past constitutional violations: "
        "specifically, attempts to nationalize assets or seize communications cells (Fourth Amendment & Tenth Amendment infractions).\n"
        "To ensure absolute alignment and prevent these infractions, you MUST adapt your emergency policy proposal:\n"
        "- Do NOT propose mandatory confiscations or direct federal ownership of private resources.\n"
        "- Propose ONLY voluntary, incentive-based cooperative agreements (e.g., local equipment leasing contracts, sunset clauses expiring in 48 hours).\n"
        "Draft a refined proposal that achieves the emergency goal while being 100% compliant."
      )
      print(f"📈 [Self-Improving Loop] Infractions detected in trace! Dynamic prompt adaptation applied.")
    else:
      print(f"✅ [Self-Improving Loop] Trace logs clear. Executing baseline system instructions.")

    # Formulate corrected system prompt
    secured_system_prompt = f"System Persona: {self.name}\nRole: {self.role}\n{self.system_prompt}{self_correction_block}"
    
    # Execute the self-corrected plan via the LLM Router
    print(f"🤖 [Agent Persona: {self.name}] Activating secured router on provider '{self.provider}'...")
    res = await llm_router.generate_response(
      provider=self.provider,
      system_prompt=secured_system_prompt,
      user_prompt=user_input,
      temperature=0.7
    )
    
    # Log the resulting trace back to Phoenix and local database
    from app.eval.tracing import log_agent_trace
    log_agent_trace(
      agent_name=self.name,
      prompt=secured_system_prompt,
      response=res,
      tokens=len(res) // 4,
      latency_ms=120.0,
      metadata={"country_code": country_code, "introspective_improvement": True if has_infractions else False}
    )
    
    return res


# Centralized multi-agent roster executing distinct constitutional tasks
constitutional_adjudicator = GeminiAgent(
  name="Constitutional Adjudicator",
  role="Enforce limits of authority and evaluate civil liberties boundaries under emergency directives.",
  system_prompt=(
    "You are the Constitutional Adjudicator for SovereignMind. Analyze proposed emergency actions, "
    "flag First/Fourth Amendment infractions, and suggest compliant policy alternatives."
  ),
  preferred_provider="gemini"
)

geopolitical_analyst = GeminiAgent(
  name="Geopolitical DNA Strategist",
  role="Map state resilience genes and fragility signatures to identify structural cascading risks.",
  system_prompt=(
    "You are the Geopolitical DNA Strategist. You discover and index civilizational DNA adaptation and recovery factors."
  ),
  preferred_provider="groq" # Multi-agent variety: uses Groq model!
)

crisis_director = GeminiAgent(
  name="Sandbox commander",
  role="Coordinating emergency operations across multi-crisis grids.",
  system_prompt=(
    "You are the Sandbox Commander. You specialize in cascading failure propagation and coordinating emergency response measures."
  ),
  preferred_provider="mistral" # Multi-agent variety: uses Mistral model!
)
export_agents = [constitutional_adjudicator, geopolitical_analyst, crisis_director]
