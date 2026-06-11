import json
from typing import Dict, Any

class RiskRadarEngine:
    """
    Risk Radar Engine
    Uses AI to sweep global signals and determine macroeconomic, geopolitical, and environmental threats.
    """
    
    async def generate_risk_radar_data(self) -> Dict[str, Any]:
        """
        AI-powered global risk analysis using Gemini.
        Returns a dict containing lists of threats and signals.
        """
        print(f"📡 [RiskRadarEngine] Running AI risk radar analysis...")
        from app.agents.llm_router import llm_router

        system_prompt = (
            "You are an advanced sovereign risk analysis AI for a global intelligence platform. "
            "Your task is to scan current systemic global trends and synthesize a structured "
            "risk radar report containing top macro threats and early warning signals."
        )

        user_prompt = (
            "Generate a current global risk radar assessment.\n\n"
            "Return strict JSON matching this exact schema:\n"
            "{\n"
            "  \"threats\": [\n"
            "    {\n"
            "      \"threat_name\": string (e.g., 'Water Crisis', 'Cyberattack'),\n"
            "      \"probability\": number (0-100),\n"
            "      \"severity\": string (e.g., 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH', 'CRITICAL'),\n"
            "      \"time_to_impact\": string (e.g., 'Imminent', '12 Months', '48 Months')\n"
            "    }\n"
            "  ],\n"
            "  \"signals\": [\n"
            "    {\n"
            "      \"signal_name\": string (e.g., 'Food Insecurity', 'Civil Unrest'),\n"
            "      \"impact\": string (e.g., 'Low', 'Medium', 'High', 'Severe'),\n"
            "      \"probability_trend\": string (e.g., 'Rising', 'Stable', 'Falling')\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Note: Provide exactly 4-6 threats and 4-6 signals. Return ONLY the JSON object."
        )

        try:
            response_text = await llm_router.generate_response(
                provider="gemini",
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.4
            )

            clean = response_text.strip()
            if clean.startswith("```json"):
                clean = clean[7:]
            if clean.startswith("```"):
                clean = clean[3:]
            if clean.endswith("```"):
                clean = clean[:-3]
            clean = clean.strip()

            data = json.loads(clean)
            return data

        except Exception as e:
            print(f"⚠️ [RiskRadarEngine] Gemini risk radar analysis failed ({e}). Using fallback...")
            return self._fallback_data()

    def _fallback_data(self) -> Dict[str, Any]:
        """Structured fallback when Gemini is unavailable."""
        return {
            "threats": [
                {
                    "threat_name": "Global Supply Chain Contraction",
                    "probability": 78.5,
                    "severity": "HIGH",
                    "time_to_impact": "12 Months"
                },
                {
                    "threat_name": "Systemic Financial De-leveraging",
                    "probability": 65.0,
                    "severity": "VERY HIGH",
                    "time_to_impact": "24 Months"
                },
                {
                    "threat_name": "Coordinated State-Sponsored Cyberattack",
                    "probability": 55.0,
                    "severity": "CRITICAL",
                    "time_to_impact": "Imminent"
                },
                {
                    "threat_name": "Regional Resource Conflict (Water/Energy)",
                    "probability": 82.0,
                    "severity": "HIGH",
                    "time_to_impact": "36 Months"
                }
            ],
            "signals": [
                {
                    "signal_name": "Energy Market Volatility",
                    "impact": "High",
                    "probability_trend": "Rising"
                },
                {
                    "signal_name": "Agricultural Yield Shortfalls",
                    "impact": "Severe",
                    "probability_trend": "Rising"
                },
                {
                    "signal_name": "Capital Flight from Emerging Markets",
                    "impact": "Medium",
                    "probability_trend": "Stable"
                },
                {
                    "signal_name": "Political Polarization & Unrest",
                    "impact": "High",
                    "probability_trend": "Rising"
                }
            ]
        }

risk_radar_engine = RiskRadarEngine()
