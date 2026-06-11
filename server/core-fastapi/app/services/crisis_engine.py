import json
import uuid
import datetime
from typing import Dict, Any
from app.agents.llm_router import llm_router

class CrisisEngine:
    def __init__(self):
        self.state = self._fallback_data()

    def get_crisis_data(self) -> Dict[str, Any]:
        return self.state

    async def simulate_update(self) -> Dict[str, Any]:
        print("🚨 [CrisisEngine] Simulating Crisis Update via LLM...")
        system_prompt = """You are a global crisis management AI orchestrator. 
The user is triggering an active incident broadcast.
Generate a JSON payload updating the crisis state with 1 new severe incident and some new log entries.
Format MUST strictly match:
{
  "incidents": [
    {
      "id": "INC-XXXX",
      "title": "String",
      "time": "String (e.g. T-minus 2 mins)",
      "desc": "String",
      "severity": "Critical",
      "status": "Uncontained",
      "responders": 12
    }
  ],
  "logs": [
    {
      "time": "HH:MM",
      "msg": "String",
      "type": "critical"
    }
  ],
  "activeDefcon": "2"
}
Only output the JSON.
"""
        try:
            response = await llm_router.generate_completion(
                prompt="Trigger crisis alert and escalate scenarios.",
                system_prompt=system_prompt,
                response_format="json"
            )
            data = json.loads(response)
            
            if "incidents" in data:
                self.state["incidents"] = data["incidents"] + self.state["incidents"]
                self.state["incidents"] = self.state["incidents"][:4]
            if "logs" in data:
                self.state["logs"] = data["logs"] + self.state["logs"]
                self.state["logs"] = self.state["logs"][:8]
            if "activeDefcon" in data:
                self.state["activeDefcon"] = data["activeDefcon"]
                
        except Exception as e:
            print(f"⚠️ [CrisisEngine] LLM update failed: {e}")
            
        return self.state

    async def generate_policy_options(self, prompt: str) -> Dict[str, Any]:
        print(f"⚖️ [CrisisEngine] Generating policies for: {prompt}")
        system_prompt = f"""You are a top-tier policy synthesis AI.
Generate 3 strategic policy options to address: '{prompt}'.
Return strictly JSON matching:
{{
  "options": [
    {{"title": "Option A Title", "desc": "Short desc", "tag": "OPTION A"}},
    {{"title": "Option B Title", "desc": "Short desc", "tag": "OPTION B"}},
    {{"title": "Option C Title", "desc": "Short desc", "tag": "OPTION C"}}
  ],
  "rows": [
    {{"metric": "Cost", "optA": "Low", "optB": "Medium", "optC": "High"}},
    {{"metric": "Risk", "optA": "High", "optB": "Low", "optC": "Medium"}},
    {{"metric": "Public Reaction", "optA": "Negative", "optB": "Positive", "optC": "Mixed"}},
    {{"metric": "Long-term", "optA": "Stagnation", "optB": "Growth", "optC": "Dependency"}}
  ]
}}
"""
        try:
            response = await llm_router.generate_completion(
                prompt="Synthesize policy options.",
                system_prompt=system_prompt,
                response_format="json"
            )
            data = json.loads(response)
            
            if "options" in data:
                self.state["policyOptions"] = data["options"]
            if "rows" in data:
                self.state["comparatorRows"] = data["rows"]
                
            return {
                "options": self.state["policyOptions"],
                "rows": self.state["comparatorRows"]
            }
        except Exception as e:
            print(f"⚠️ [CrisisEngine] LLM policy generation failed: {e}")
            return {
                "options": self.state["policyOptions"],
                "rows": self.state["comparatorRows"]
            }

    def _fallback_data(self) -> Dict[str, Any]:
        return {
            "activeDefcon": "3",
            "incidents": [
                {
                    "id": "INC-9481",
                    "title": "Regional Grid Collapse & Substation Alpha",
                    "time": "T-minus 14 mins",
                    "desc": "Multiple cascading faults detected along transmission corridor C. Weather anomaly confirmed as primary stressor.",
                    "severity": "Critical",
                    "status": "Uncontained",
                    "responders": 8
                },
                {
                    "id": "INC-9480",
                    "title": "Logistics Route Blockade",
                    "time": "T-minus 42 mins",
                    "desc": "Critical supply route blocked due to kinetic interference. Affecting medical delivery window.",
                    "severity": "High",
                    "status": "Mitigating",
                    "responders": 3
                },
                {
                    "id": "INC-9479",
                    "title": "Data Integrity Fluctuation",
                    "time": "T-minus 1.4 hrs",
                    "desc": "Localized ledger desync occurring on Pacific cluster. Node consensus falling below 80%.",
                    "severity": "Medium",
                    "status": "Containing",
                    "responders": 1
                }
            ],
            "mapNodes": [
                {"id": "HQ_NODE_1", "x": 60, "y": 50, "type": "secure", "status": "active"},
                {"id": "SUBSTATION_A", "x": 40, "y": 30, "type": "critical", "status": "failing"}
            ],
            "channels": [
                {"name": "SECURE: Regional Command", "active": True, "status": "Live"},
                {"name": "LOGISTICS: Transit Hub B", "active": True, "status": "Live"},
                {"name": "MEDICAL: Triage Unit 4", "active": False, "status": "Encrypted"}
            ],
            "logs": [
                {"time": "18:42", "msg": "Authorized rerouting of medical supplies to Sector 4 Hub.", "type": "authoritative"},
                {"time": "18:35", "msg": "Automated failover engaged for Substation Alpha.", "type": "automated"},
                {"time": "18:12", "msg": "Kinetic impact confirmed on transit corridor C. Deploying rapid response.", "type": "critical"},
                {"time": "17:55", "msg": "Elevated anomaly patterns detected in grid frequency.", "type": "warning"}
            ],
            "policyOptions": [
                {"title": "Interest Rate Adjustment", "desc": "Central bank intervention to dynamically adjust base rates, aiming for a 0.5% contraction.", "tag": "OPTION A"},
                {"title": "Subsidy Reform", "desc": "Targeted removal of broad energy subsidies, reallocating 30% of savings to direct welfare.", "tag": "OPTION B"},
                {"title": "Import Diversification", "desc": "Reducing tariffs on regional bloc imports to lower consumer staple prices.", "tag": "OPTION C"}
            ],
            "comparatorRows": [
                {"metric": "Cost", "optA": "Low", "optB": "Medium", "optC": "High"},
                {"metric": "Risk", "optA": "Low", "optB": "High", "optC": "Medium"},
                {"metric": "Public Reaction", "optA": "Negative", "optB": "Severe", "optC": "Positive"},
                {"metric": "Constitutional", "optA": "Legal", "optB": "Exec. Ord.", "optC": "Vote Reqd"},
                {"metric": "Long-term", "optA": "Stagnation", "optB": "Struct. Fix", "optC": "Dependency"}
            ],
            "chatMsgs": [
                {"name": "Chief Advisor", "msg": "If we push Option B, we lose the union vote.", "time": "10:02", "isAI": False},
                {"name": "Min. of Finance", "msg": "We don't have capital for Option C without breaking the debt ceiling.", "time": "10:04", "isAI": False},
                {"name": "Min. of Defense", "msg": "Internal security says Option B will trigger protests in Sector 4.", "time": "10:06", "isAI": False},
                {"name": "AI Copilot", "msg": "Based on historical data, Option A combined with targeted subsidies offers the highest stability.", "time": "10:07", "isAI": True}
            ],
            "jointResolutionDraft": "Whereas the current inflationary pressures exceed the acceptable threshold of 4.5%, the Cabinet hereby invokes Article 12(b). The Central Bank is directed to adjust the lending rate by 0.5% effective immediately over the next two fiscal quarters. Furthermore, energy subsidies will be recalibrated targeting industrial sectors, while shielding domestic households."
        }

crisis_engine = CrisisEngine()
