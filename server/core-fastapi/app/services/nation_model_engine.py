import json
from typing import Dict, Any
from app.agents.llm_router import llm_router
import random

class NationModelEngine:
    def __init__(self):
        # Base state matching the original frontend hardcoded values
        self.state = {
            "economy_val": "1.42x",
            "economy_trend": "+0.04",
            "society_val": "Nominal",
            "society_subtitle": "Cohesion 82%",
            "governance_val": "Stable",
            "governance_subtitle": "Approval 54%",
            "infrastructure_val": "88%",
            "infrastructure_trend": "-2%",
            "security_val": "DEFCON 4",
            "security_subtitle": "Active Threats: 2",
            "taxation_velocity": 45,
            "border_friction": "Medium",
            "cohesion_index": 82,
            "supply_integration": "Optimal",
            "volatility_index": 18,
            "integrity_percentage": 94.2
        }

    async def get_nation_model(self) -> Dict[str, Any]:
        return self.state

    async def execute_shock(self, shock_name: str) -> Dict[str, Any]:
        print(f"🌍 [LLM] Executing Shock Scenario: {shock_name} on Nation Model...")

        system_prompt = f"""You are a Digital Twin Simulation Engine for a sovereign nation.
The user is executing a predictive stress test (Exogenous Shock): "{shock_name}".
Current state variables:
{json.dumps(self.state, indent=2)}

Calculate the cascading impact of this shock on the macroscopic parameters and return the updated state.
Keep changes logical. For example, a Kinetic Impact on Grid Substation should drastically reduce infrastructure_val and integrity_percentage, spike volatility_index, and increase DEFCON level (lower number).

Return ONLY valid JSON matching exactly this schema, with no other text:
{{
  "economy_val": "e.g., 1.10x",
  "economy_trend": "e.g., -0.32",
  "society_val": "e.g., Stressed",
  "society_subtitle": "e.g., Cohesion 65%",
  "governance_val": "e.g., Emergency",
  "governance_subtitle": "e.g., Approval 48%",
  "infrastructure_val": "e.g., 42%",
  "infrastructure_trend": "e.g., -46%",
  "security_val": "e.g., DEFCON 2",
  "security_subtitle": "e.g., Active Threats: 5",
  "taxation_velocity": integer (0-100),
  "border_friction": "e.g., High",
  "cohesion_index": integer (0-100),
  "supply_integration": "e.g., Critical",
  "volatility_index": integer (0-100),
  "integrity_percentage": float (0-100)
}}
"""
        user_prompt = f"Run stress test simulation for: {shock_name}"

        try:
            response = await llm_router.generate_completion(
                prompt=user_prompt,
                system_prompt=system_prompt,
                response_format="json"
            )
            
            data = json.loads(response)
            
            # Simple validation
            required_keys = self.state.keys()
            for key in required_keys:
                if key not in data:
                    raise ValueError(f"Missing key in LLM output: {key}")

            # Update in-memory state
            self.state = data
            return self.state

        except Exception as e:
            print(f"⚠️ [NationModelEngine] LLM generation failed: {e}. Applying fallback logic.")
            return self._fallback_shock(shock_name)

    def _fallback_shock(self, shock_name: str) -> Dict[str, Any]:
        # Dumb fallback if LLM fails
        self.state["volatility_index"] = min(100, self.state["volatility_index"] + 40)
        self.state["integrity_percentage"] = max(0, self.state["integrity_percentage"] - 25.5)
        self.state["infrastructure_val"] = "55%"
        self.state["infrastructure_trend"] = "-33%"
        self.state["security_val"] = "DEFCON 2"
        self.state["security_subtitle"] = "Active Threats: 8"
        self.state["border_friction"] = "High"
        self.state["cohesion_index"] -= 15
        return self.state

nation_model_engine = NationModelEngine()
