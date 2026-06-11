import json
from typing import Dict, Any

class ForecastEngine:
    """
    Forecast Engine
    Uses AI to analyze current systemic global trends and synthesize a structured
    timeline representing a future trajectory.
    """
    
    async def generate_forecast(self) -> Dict[str, Any]:
        """
        AI-powered global forecast generation using Gemini.
        Returns a dict containing timeline points, stability deviation, and convergence point.
        """
        print(f"🔮 [ForecastEngine] Running AI forecasting analysis...")
        from app.agents.llm_router import llm_router

        system_prompt = (
            "You are an advanced sovereign foresight AI. "
            "Your task is to analyze global systemic markers to project future civilizational stability."
        )

        user_prompt = (
            "Generate an AI Future Timeline projection from Today to 2030.\n\n"
            "Return strict JSON matching this exact schema:\n"
            "{\n"
            "  \"timeline_points\": [\n"
            "    {\n"
            "      \"year\": string (e.g., 'Today', '2027', '2028', '2030'),\n"
            "      \"title\": string (e.g., 'Current State', 'Urban Migration Surge'),\n"
            "      \"description\": string (1-2 sentences of projected conditions)\n"
            "    }\n"
            "  ],\n"
            "  \"stability_deviation\": string (e.g., '-14.2%', '+5.0%'),\n"
            "  \"convergence_point_description\": string (2-3 sentences explaining how major timeline events overlap to create a vulnerability or strength)\n"
            "}\n"
            "Note: Provide exactly 4 timeline points in chronological order. Return ONLY the JSON object."
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
            print(f"⚠️ [ForecastEngine] Gemini forecasting analysis failed ({e}). Using fallback...")
            return self._fallback_data()

    def _fallback_data(self) -> Dict[str, Any]:
        """Structured fallback when Gemini is unavailable."""
        return {
            "timeline_points": [
                {
                    "year": "Today",
                    "title": "Baseline Tension",
                    "description": "Geopolitical polarization high but contained. Core infrastructure is operational but stressed."
                },
                {
                    "year": "2027",
                    "title": "Supply Chain Fracturing",
                    "description": "Resource nationalism disrupts critical semiconductor and rare-earth mineral flows."
                },
                {
                    "year": "2028",
                    "title": "Financial Decoupling",
                    "description": "Creation of parallel financial systems fragments global capital markets, impacting liquidity."
                },
                {
                    "year": "2030",
                    "title": "Systemic Realignment",
                    "description": "New multilateral frameworks emerge to handle compound environmental and economic crises."
                }
            ],
            "stability_deviation": "-11.4%",
            "convergence_point_description": "Supply chain fracturing (2027) compounded by financial decoupling (2028) creates a severe vulnerability window where capital is unavailable to rapidly repair trade routes."
        }

forecast_engine = ForecastEngine()
