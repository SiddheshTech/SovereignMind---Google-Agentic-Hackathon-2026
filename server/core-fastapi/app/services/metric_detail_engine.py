import random

class MetricDetailEngine:
    def get_data(self, metric_id: str):
        
        PALETTE = {
            'purple': '#7F22FE',     
            'orange': '#FF6900',     
            'darkBrown': '#56280B',  
            'sky': '#00B8DB',        
            'deepTeal': '#073F4D',   
        }

        METRIC_DATA = {
            'stability': {'label': 'Civilization Stability', 'score': '83', 'trend': '+1.2%', 'color': PALETTE['sky'], 'desc': 'Overall measure of the civilization\'s ability to maintain status quo and endure macro forces.'},
            'resilience': {'label': 'National Resilience', 'score': '76', 'trend': '+0.5%', 'color': PALETTE['purple'], 'desc': 'Capacity to absorb shocks and recover from infrastructure or governance failures.'},
            'crisis': {'label': 'Crisis Probability', 'score': '18', 'trend': '-2.1%', 'color': PALETTE['orange'], 'desc': 'Likelihood of a multi-sector crisis occurring within the next 90 days.'},
            'governance': {'label': 'Governance Effectiveness', 'score': '89', 'trend': '+3.4%', 'color': PALETTE['sky'], 'desc': 'Efficiency of policy deployment, bureaucratic transparency, and rule of law.'},
            'economic': {'label': 'Economic Fragility', 'score': '32', 'trend': '+4.0%', 'color': PALETTE['orange'], 'desc': 'Exposure to supply chain disruptions, debt crises, or sudden inflation.'},
            'trust': {'label': 'Institutional Trust', 'score': '64', 'trend': '-1.0%', 'color': '#10B981', 'desc': 'Public confidence in government, media, military, and financial institutions.'},
            'social': {'label': 'Social Cohesion', 'score': '71', 'trend': '+0.2%', 'color': '#F43F5E', 'desc': 'Internal harmony, lack of polarization, and overall unity of the population.'},
            'emergency': {'label': 'Emergency Readiness', 'score': '92', 'trend': '+0.1%', 'color': PALETTE['purple'], 'desc': 'Availability of strategic reserves, emergency response teams, and medical facilities.'},
        }

        data = METRIC_DATA.get(metric_id, METRIC_DATA['stability'])

        return {
            "id": metric_id,
            "label": data['label'],
            "score": data['score'],
            "trend": data['trend'],
            "description": data['desc'],
            "color": data['color'],
            "leadingIndicators": [
                {"label": "Policy Adherence", "value": "High", "trend": "+2.1%"},
                {"label": "Budget Deficit", "value": "Moderate", "trend": "-0.8%"},
                {"label": "Public Sentiment", "value": "Neutral", "trend": "~0.0%"}
            ],
            "riskFactors": [
                {"label": "Resource Scarcity", "percent": 70, "color": "bg-rose-500"},
                {"label": "External Conflicts", "percent": 40, "color": "bg-amber-500"},
                {"label": "Market Volatility", "percent": 15, "color": "bg-emerald-500"}
            ],
            "aiNarrative": f"The {data['label']} score is currently stable but shows underlying vulnerabilities. Recent systemic stress tests indicate an elevated exposure to rapid supply-chain contractions. AI-driven predictive modeling suggests implementing local redundancies within the next quarter to mitigate potential downward drifts in the index."
        }

metric_detail_engine = MetricDetailEngine()
