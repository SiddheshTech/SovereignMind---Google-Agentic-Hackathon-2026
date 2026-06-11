import json
from typing import Dict, Any, List
from app.agents.llm_router import llm_router
import random

class DependenciesEngine:
    async def generate_dependencies(self) -> Dict[str, Any]:
        print(f"🔗 [LLM] Generating System Dependency Graph...")

        system_prompt = """You are a Digital Twin Simulation Engine mapping critical cascading nodes.
The user wants to generate a dynamic system dependency graph representing the current vulnerability of the nation's infrastructure and societal layers.

Generate a linear or slightly branched chain of 4-6 systems.
For each node, provide:
- id: a unique string
- title: name of the system (e.g. "National Energy Grid", "Water Infrastructure", "Financial Clearinghouse")
- status: exactly one of "optimal", "strained", or "high_vulnerability"
- icon: exactly one of "zap", "droplets", "database", "factory", "users", "shield", "activity"

For each edge (representing dependency from one node to another), provide:
- from_id: id of the source node
- to_id: id of the target node
- status: exactly one of "optimal", "strained", or "high_vulnerability"

Ensure the cascade is logical (e.g. Energy Grid powers Water Infrastructure, which supplies Agriculture, which supplies Food Chain). Introduce a vulnerability somewhere in the chain and propagate it.

Return ONLY valid JSON matching exactly this schema, with no other text:
{
  "nodes": [
    {"id": "n1", "title": "...", "status": "...", "icon": "..."}
  ],
  "edges": [
    {"from_id": "n1", "to_id": "n2", "status": "..."}
  ]
}
"""
        user_prompt = "Generate the current systemic dependency cascade map based on simulated threat levels."

        try:
            response = await llm_router.generate_completion(
                prompt=user_prompt,
                system_prompt=system_prompt,
                response_format="json"
            )
            
            data = json.loads(response)
            
            # Simple validation
            if "nodes" not in data or "edges" not in data:
                raise ValueError("Missing nodes or edges in LLM output")

            return data

        except Exception as e:
            print(f"⚠️ [DependenciesEngine] LLM generation failed: {e}. Applying fallback logic.")
            return self._fallback_data()

    def _fallback_data(self) -> Dict[str, Any]:
        return {
            "nodes": [
                {"id": "node_energy", "title": "National Energy Grid", "status": "optimal", "icon": "zap"},
                {"id": "node_water", "title": "Water Infrastructure", "status": "strained", "icon": "droplets"},
                {"id": "node_agri", "title": "Agricultural Production", "status": "high_vulnerability", "icon": "database"},
                {"id": "node_food", "title": "Food Supply Chain", "status": "high_vulnerability", "icon": "factory"}
            ],
            "edges": [
                {"from_id": "node_energy", "to_id": "node_water", "status": "optimal"},
                {"from_id": "node_water", "to_id": "node_agri", "status": "strained"},
                {"from_id": "node_agri", "to_id": "node_food", "status": "high_vulnerability"}
            ]
        }

dependencies_engine = DependenciesEngine()
