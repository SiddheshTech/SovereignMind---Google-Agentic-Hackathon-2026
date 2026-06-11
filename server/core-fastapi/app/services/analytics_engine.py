import json
from typing import Dict, Any
from app.services.llm_router import llm_router
import random
import uuid

class AnalyticsEngine:
    def __init__(self):
        self.state = self._fallback_data()

    def get_analytics(self) -> Dict[str, Any]:
        return self.state

    async def simulate_update(self) -> Dict[str, Any]:
        print(f"📊 [LLM] Generating Analytics Update...")

        # For the update, we will use a mix of LLM generated reports and programmatic updates for numbers
        # to ensure it's fast and realistic.
        
        system_prompt = """You are a global intelligence AI.
The user wants to simulate a real-time analytics update.
Generate a JSON object containing exactly 4 updated 'keyMetrics', 5 'scoring' matrix items, and 1 new 'intelligenceReport'.
Use this schema strictly:
{
  "keyMetrics": [
    { "title": "Global Resilience Index", "value": "82.4", "trend": "-1.2%", "trendDir": "down", "statusColor": "amber" },
    ...
  ],
  "scoring": [
    { "label": "Institutional Viability", "score": 88, "baseline": 85, "color": "emerald" },
    ...
  ],
  "newReport": {
    "title": "String",
    "desc": "String",
    "confidence": 92,
    "category": "Strategic",
    "isCritical": true
  }
}
Generate varied metrics showing some slight degradation or improvement from typical nominal values.
"""
        try:
            response = await llm_router.generate_completion(
                prompt="Generate the latest analytics update.",
                system_prompt=system_prompt,
                response_format="json"
            )
            
            data = json.loads(response)
            
            if "keyMetrics" in data:
                self.state["keyMetrics"] = data["keyMetrics"]
            if "scoring" in data:
                self.state["scoring"] = data["scoring"]
            if "newReport" in data:
                report = data["newReport"]
                report["id"] = str(uuid.uuid4())
                report["date"] = "Just now"
                self.state["reports"].insert(0, report)
                self.state["reports"] = self.state["reports"][:4] # keep top 4
                
        except Exception as e:
            print(f"⚠️ [AnalyticsEngine] LLM generation failed: {e}. Applying fallback logic.")

        # Always dynamically program the vector chart
        self.state["vectorData"] = self._generate_vector_data()

        return self.state

    async def generate_synthesis(self, domain: str, horizon: str) -> Dict[str, Any]:
        print(f"🧠 [LLM] Generating Synthesis Report for {domain} ({horizon})...")
        system_prompt = f"""You are an executive intelligence AI synthesizing data for domain: {domain} over time horizon: {horizon}.
Generate a single highly detailed and realistic intelligence report.
Return ONLY valid JSON:
{{
  "title": "A strong executive title",
  "desc": "A 2-3 sentence deep-dive synthesis of compound effects.",
  "confidence": integer between 60 and 99,
  "category": "{domain.split(' ')[0]}",
  "isCritical": boolean
}}
"""
        try:
            response = await llm_router.generate_completion(
                prompt="Generate synthesis report.",
                system_prompt=system_prompt,
                response_format="json"
            )
            data = json.loads(response)
            data["id"] = str(uuid.uuid4())
            data["date"] = "Just now"
            
            # Prepend to existing reports
            self.state["reports"].insert(0, data)
            self.state["reports"] = self.state["reports"][:4]
            return data
            
        except Exception as e:
            print(f"⚠️ [AnalyticsEngine] LLM synthesis failed: {e}.")
            return {
                "id": str(uuid.uuid4()),
                "title": f"Fallback Synthesis: {domain}",
                "desc": "Synthesis generation failed, falling back to static cache.",
                "confidence": 50,
                "category": "Error",
                "isCritical": True,
                "date": "Just now"
            }

    def _generate_vector_data(self) -> List[Dict[str, Any]]:
        points = []
        for i in range(40):
            val = 40.0 + random.random() * 60.0
            isAnomaly = random.random() > 0.95
            points.append({"value": val, "isAnomaly": isAnomaly})
        return points

    def _fallback_data(self) -> Dict[str, Any]:
        return {
            "keyMetrics": [
                { "title": "Global Resilience Index", "value": "84.2", "trend": "+1.4%", "trendDir": "up", "statusColor": "blue" },
                { "title": "Supply Shock Delta", "value": "2.8%", "trend": "-0.5%", "trendDir": "down", "statusColor": "emerald" },
                { "title": "Systemic Volatility", "value": "14.1", "trend": "+2.2%", "trendDir": "up", "statusColor": "amber" },
                { "title": "Critical Node failures", "value": "0", "trend": "Nominal", "trendDir": "neutral", "statusColor": "emerald" }
            ],
            "vectorData": self._generate_vector_data(),
            "scoring": [
                { "label": "Institutional Viability", "score": 92, "baseline": 85, "color": "emerald" },
                { "label": "Energy Grid Resilience", "score": 78, "baseline": 80, "color": "amber" },
                { "label": "Financial Vector Stability", "score": 64, "baseline": 70, "color": "rose" },
                { "label": "Cyber Defense Posture", "score": 88, "baseline": 85, "color": "blue" },
                { "label": "Logistics & Supply Link", "score": 94, "baseline": 90, "color": "emerald" }
            ],
            "reports": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Macro-Economic Stress Analysis (Q3 Projection)",
                    "desc": "Analysis of compound effects of fiat volatility overlapping with sector 4 supply constraint over next 180 days.",
                    "date": "2 hours ago",
                    "confidence": 94,
                    "category": "Strategic",
                    "isCritical": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Grid Vulnerability Audit - Nordic Sector",
                    "desc": "Automated review of dependency cascades arising from winter anomaly baseline.",
                    "date": "14 hours ago",
                    "confidence": 88,
                    "category": "Infrastructure",
                    "isCritical": True
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Socio-Political Cohesion Index Update",
                    "desc": "Sentiment aggregation across public/private channels indicating a 1.2% dip in localized trust metrics.",
                    "date": "1 day ago",
                    "confidence": 96,
                    "category": "Intelligence",
                    "isCritical": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Water Reservoir Predictive Model Variance",
                    "desc": "Discrepancy detected between forecasted inflow and projected consumption in Zone C.",
                    "date": "2 days ago",
                    "confidence": 82,
                    "category": "Environmental",
                    "isCritical": False
                }
            ]
        }

analytics_engine = AnalyticsEngine()
