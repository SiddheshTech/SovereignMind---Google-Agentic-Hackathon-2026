import random

class CommandCenterEngine:
    def get_data(self):
        return {
            "stabilityScore": 72 + random.randint(-5, 5),
            "stabilityLabel": "Stable",
            "trend30d": "↑ +2.1%",
            "activeThreats": 17,
            "criticalNations": 4,
            "emergingRisks": 11,
            "aiBriefing": "Global stability remains cautiously optimistic with a marked resilience in developing economies, notably India, which has shown a 2.4% increase in institutional trust following comprehensive governance reforms.",
            "threats": [
                {"title": "Water Stress in Sub-Saharan Region", "trend": "Critical Alert", "color": "text-rose-500", "time": "2h ago"},
                {"title": "Food Inflation Stabilizing", "trend": "Positive Variance", "color": "text-emerald-500", "time": "5h ago"},
                {"title": "Energy Grid Overload Warning", "trend": "Elevated Risk", "color": "text-amber-500", "time": "12h ago"},
                {"title": "Diplomatic Tension Resolution", "trend": "Risk Mitigated", "color": "text-sky-500", "time": "1d ago"}
            ],
            "futureRisks": [
                {"year": 2026, "risk": "Supply Chain Contract.", "prob": "78%"},
                {"year": 2027, "risk": "Autonomous Weapon Prolif.", "prob": "62%"},
                {"year": 2028, "risk": "Water War Proxy Conflict", "prob": "45%"},
                {"year": 2029, "risk": "AGI Economic Disruption", "prob": "85%"},
                {"year": 2030, "risk": "Bio-Synthetic Pathogen", "prob": "22%"}
            ],
            "rankings": [
                {"category": "Highest Resilience Index", "nation": "Nordic Coalition (92)"},
                {"category": "Fastest Policy Execution", "nation": "Singapore (96)"},
                {"category": "Most Robust Infrastructure", "nation": "Japan (89)"},
                {"category": "Leading AI Integration", "nation": "United States (94)"}
            ],
            "recommendations": [
                {"text": "Deploy emergency water purification subsidies to Central African allies.", "impact": "High Impact", "icon": "Globe"},
                {"text": "Recalibrate global food distribution models factoring in current La Niña predictions.", "impact": "Medium Impact", "icon": "TrendingDown"},
                {"text": "Initiate preemptive cyber-defense protocols across allied energy grids.", "impact": "High Impact", "icon": "ShieldCheck"},
                {"text": "Open back-channel negotiations to resolve emerging Eastern bloc tensions.", "impact": "Strategic", "icon": "ActivitySquare"}
            ],
            "timelineEvents": [
                {"year": "2024", "name": "Global Tech Compact Signed", "type": "Treaty"},
                {"year": "2025", "name": "Quantum Grid Activated", "type": "Milestone"},
                {"year": "2026", "name": "First Autonomous City Ops", "type": "Milestone"},
                {"year": "2028", "name": "Projected AGI Integration", "type": "Forecast"},
                {"year": "2030", "name": "Mars Colony Phase 1", "type": "Forecast"}
            ],
            "metrics": [
                {"id": "stability", "label": "Civilization Stability", "score": "83", "status": "Nominal", "details": "Index aggregating 42 systemic vectors.", "color": "#00B8DB"},
                {"id": "resilience", "label": "National Resilience", "score": "76", "status": "Monitoring", "details": "Vulnerability to infrastructural shocks.", "color": "#7F22FE"},
                {"id": "crisis", "label": "Crisis Probability", "score": "18", "status": "Elevated", "details": "Likelihood of multi-sector cascade.", "color": "#FF6900"},
                {"id": "governance", "label": "Governance Effectiveness", "score": "89", "status": "Optimal", "details": "Policy deployment speed and transparency.", "color": "#00B8DB"},
                {"id": "economic", "label": "Economic Fragility", "score": "32", "status": "Warning", "details": "Exposure to sudden market corrections.", "color": "#FF6900"},
                {"id": "trust", "label": "Institutional Trust", "score": "64", "status": "Stable", "details": "Public confidence in administration.", "color": "#10B981"},
                {"id": "social", "label": "Social Cohesion", "score": "71", "status": "Stable", "details": "Internal harmony and polarization metrics.", "color": "#F43F5E"},
                {"id": "emergency", "label": "Emergency Readiness", "score": "92", "status": "Optimal", "details": "Strategic reserve and response capacities.", "color": "#7F22FE"}
            ],
            "mapPoints": [
                {"id": "us", "x": "25%", "y": "35%", "color": "bg-sky-400", "pulse": True, "stability": "88/100", "resilience": "82/100", "activeRisk": "Grid Vulnerability"},
                {"id": "br", "x": "35%", "y": "70%", "color": "bg-emerald-400", "pulse": False, "stability": "65/100", "resilience": "55/100", "activeRisk": "Economic Fragility"},
                {"id": "eu", "x": "52%", "y": "30%", "color": "bg-purple-400", "pulse": True, "stability": "85/100", "resilience": "78/100", "activeRisk": "Energy Supply"},
                {"id": "ng", "x": "55%", "y": "60%", "color": "bg-amber-400", "pulse": False, "stability": "45/100", "resilience": "40/100", "activeRisk": "Resource Scarcity"},
                {"id": "in", "x": "72%", "y": "45%", "color": "bg-emerald-400", "pulse": True, "stability": "81/100", "resilience": "74/100", "activeRisk": "Drought Exposure"},
                {"id": "cn", "x": "80%", "y": "38%", "color": "bg-purple-400", "pulse": False, "stability": "82/100", "resilience": "80/100", "activeRisk": "Supply Chain"}
            ]
        }

command_center_engine = CommandCenterEngine()
