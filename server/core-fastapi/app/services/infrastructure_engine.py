import json
from typing import Dict, Any, List
from app.services.llm_router import llm_router
import random

class InfrastructureEngine:
    def __init__(self):
        self.state = self._fallback_data()

    def get_infrastructure(self) -> Dict[str, Any]:
        return self.state

    async def simulate_update(self) -> Dict[str, Any]:
        print(f"🏢 [LLM] Generating Infrastructure Update...")

        system_prompt = """You are a Digital Twin Infrastructure Engine. 
The user wants to simulate real-time metrics for critical infrastructure nodes.

Generate a JSON object with a single "nodes" array containing exactly 4 objects.
The 4 nodes should be (but you can creatively update their statuses, loads, and metrics based on a slightly degraded or recovering threat environment):
1. Power Substation Alpha (icon: "zap")
2. Aquifer Pump Station 4 (icon: "droplets")
3. Core Data Facility (Underground) (icon: "server")
4. Logistics Hub 22 (icon: "factory")

For each node, provide:
- id: a unique string
- title: name of the facility
- icon: exactly one of "zap", "droplets", "server", "factory"
- status: "Optimal", "Warning", or "Offline"
- statusColor: "emerald" (if Optimal), "amber" (if Warning), "rose" (if Offline)
- load: integer between 0 and 100
- metrics: array of exactly 3 objects, each with:
  - label: short string (e.g., "Current Draw", "Temperature")
  - val: short string (e.g., "4.2 GW", "82°C")

Return ONLY valid JSON matching exactly this schema, with no other text.
"""
        user_prompt = "Generate the latest infrastructure telemetry and status reports."

        try:
            response = await llm_router.generate_completion(
                prompt=user_prompt,
                system_prompt=system_prompt,
                response_format="json"
            )
            
            data = json.loads(response)
            
            if "nodes" not in data or len(data["nodes"]) == 0:
                raise ValueError("Missing nodes in LLM output")

            self.state = data
            return data

        except Exception as e:
            print(f"⚠️ [InfrastructureEngine] LLM generation failed: {e}. Applying fallback logic.")
            # Randomize loads slightly
            for node in self.state["nodes"]:
                if node["status"] != "Offline":
                    node["load"] = min(100, max(0, node["load"] + random.randint(-15, 15)))
            return self.state

    def _fallback_data(self) -> Dict[str, Any]:
        return {
            "nodes": [
                {
                    "id": "node_power_1",
                    "title": "Power Substation Alpha",
                    "icon": "zap",
                    "status": "Warning",
                    "statusColor": "amber",
                    "load": 88,
                    "metrics": [
                        { "label": "Voltage Stabilizer", "val": "Active" },
                        { "label": "Current Draw", "val": "4.2 GW" },
                        { "label": "Temperature", "val": "82°C" }
                    ]
                },
                {
                    "id": "node_water_1",
                    "title": "Aquifer Pump Station 4",
                    "icon": "droplets",
                    "status": "Optimal",
                    "statusColor": "emerald",
                    "load": 42,
                    "metrics": [
                        { "label": "Flow Rate", "val": "12k L/s" },
                        { "label": "Filter Integrity", "val": "98%" },
                        { "label": "Reservoir Level", "val": "High" }
                    ]
                },
                {
                    "id": "node_data_1",
                    "title": "Core Data Facility (Underground)",
                    "icon": "server",
                    "status": "Optimal",
                    "statusColor": "emerald",
                    "load": 60,
                    "metrics": [
                        { "label": "Uptime", "val": "99.999%" },
                        { "label": "Latency", "val": "4ms" },
                        { "label": "Coolant Flow", "val": "Nominal" }
                    ]
                },
                {
                    "id": "node_logistics_1",
                    "title": "Logistics Hub 22",
                    "icon": "factory",
                    "status": "Offline",
                    "statusColor": "rose",
                    "load": 0,
                    "metrics": [
                        { "label": "Throughput", "val": "0 TPM" },
                        { "label": "Route Blockage", "val": "Detected" },
                        { "label": "Personnel", "val": "Evacuated" }
                    ]
                }
            ]
        }

infrastructure_engine = InfrastructureEngine()
