import os
from typing import Dict, Any, List
from app.core.config import settings
from app.agents.llm_router import llm_router

class GeminiAgent:
  """
  Universal Multi-Model Agent Personas
  Executes specific civilizational and constitutional duties by routing requests
  through the central LLMRouter supporting Gemini, Claude, GPT, Llama, and Mixtral.
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
  preferred_provider="gpt-4o" # Multi-agent variety: uses GPT model!
)

crisis_director = GeminiAgent(
  name="Sandbox commander",
  role="Coordinating emergency operations across multi-crisis grids.",
  system_prompt=(
    "You are the Sandbox Commander. You specialize in cascading failure propagation and coordinating emergency response measures."
  ),
  preferred_provider="claude" # Multi-agent variety: uses Claude model!
)
export_agents = [constitutional_adjudicator, geopolitical_analyst, crisis_director]
