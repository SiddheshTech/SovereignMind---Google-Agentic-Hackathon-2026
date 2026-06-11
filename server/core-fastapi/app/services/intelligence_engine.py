import asyncio
import random
from typing import Dict, Any, List

class IntelligenceEngine:
    def __init__(self):
        self.nodes = [
            {"id": "Gov Hub", "type": "Governments", "baseColor": "indigo", "connections": 124, "x": 50, "y": 45, "size": 80, "classStr": "bg-indigo-500/10 border-indigo-500/30 text-indigo-300", "dot": "bg-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.6)]", "pulse": False},
            {"id": "Treaty Network", "type": "Treaties", "baseColor": "cyan", "connections": 89, "x": 30, "y": 20, "size": 64, "classStr": "bg-cyan-500/10 border-cyan-500/30 text-cyan-300", "dot": "bg-cyan-500/40", "pulse": False},
            {"id": "Supply Matrix", "type": "Supply Chains", "baseColor": "emerald", "connections": 210, "x": 25, "y": 65, "size": 56, "classStr": "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", "dot": "bg-emerald-500/40", "pulse": False},
            {"id": "Corp Entities", "type": "Corporations", "baseColor": "purple", "connections": 340, "x": 75, "y": 30, "size": 64, "classStr": "bg-purple-500/10 border-purple-500/30 text-purple-300", "dot": "bg-purple-500/40", "pulse": False},
            {"id": "Global Inst", "type": "Institutions", "baseColor": "blue", "connections": 45, "x": 70, "y": 75, "size": 48, "classStr": "bg-pink-500/10 border-pink-500/40 text-pink-300", "dot": "bg-pink-500/40", "pulse": False},
            {"id": "Infra Core", "type": "Infrastructure", "baseColor": "orange", "connections": 78, "x": 55, "y": 15, "size": 40, "classStr": "bg-orange-500/10 border-orange-500/40 text-orange-300", "dot": "bg-orange-500/40", "pulse": False},
            {"id": "Crisis Nodes", "type": "Crises", "baseColor": "rose", "connections": 12, "x": 35, "y": 80, "size": 64, "classStr": "bg-rose-500/10 border-rose-500/40 text-rose-400", "dot": "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]", "pulse": True}
        ]
        self.edges = [
            {"source": "Gov Hub", "target": "Corp Entities", "color": "#8B5CF6", "width": 2, "dashed": True, "opacity": 0.5, "pulse": False},
            {"source": "Gov Hub", "target": "Treaty Network", "color": "#06B6D4", "width": 2, "dashed": True, "opacity": 0.5, "pulse": False},
            {"source": "Gov Hub", "target": "Supply Matrix", "color": "#10B981", "width": 3, "dashed": False, "opacity": 0.6, "pulse": False},
            {"source": "Supply Matrix", "target": "Treaty Network", "color": "#0F172A", "width": 1, "dashed": False, "opacity": 0.4, "pulse": False},
            {"source": "Gov Hub", "target": "Global Inst", "color": "#3B82F6", "width": 2, "dashed": False, "opacity": 0.5, "pulse": False},
            {"source": "Supply Matrix", "target": "Crisis Nodes", "color": "#F43F5E", "width": 2, "dashed": False, "opacity": 0.8, "pulse": True},
            {"source": "Corp Entities", "target": "Global Inst", "color": "#0F172A", "width": 1, "dashed": True, "opacity": 0.3, "pulse": False},
            {"source": "Infra Core", "target": "Gov Hub", "color": "#F97316", "width": 2, "dashed": False, "opacity": 0.5, "pulse": False},
            {"source": "Infra Core", "target": "Treaty Network", "color": "#0F172A", "width": 1, "dashed": True, "opacity": 0.3, "pulse": False}
        ]
        self.topologyStats = {
            "totalNodes": "14,284",
            "activeEdges": "39,102",
            "densityScore": "0.884",
            "centralityDrift": "-1.2%"
        }
        self.simulations = [
            {
                "id": "port",
                "trigger": "Port Closure",
                "mitigations": [
                    {"label": "Strategic Reserves", "val": "Low", "pct": 30},
                    {"label": "Alternative Routes", "val": "Constrained", "pct": 40},
                    {"label": "Domestic Supply", "val": "30%", "pct": 30}
                ],
                "steps": [
                    {"time": "T+0 Days", "title": "Port Closure", "desc": "Critical maritime logistics hub ceases operations due to sudden catalyst.", "color": "orange", "isWarning": False, "isFinal": False},
                    {"time": "T+4 Days", "title": "Trade Delay", "desc": "Vessels stalled in holding patterns. Import/export timelines derailed.", "color": "blue", "isWarning": False, "isFinal": False},
                    {"time": "T+12 Days", "title": "Food Prices Rise", "desc": "Agri-bulk imports halt. Supermarket hoarding behavior spikes retail costs.", "color": "amber", "isWarning": True, "isFinal": False},
                    {"time": "T+25 Days", "title": "Public Dissatisfaction", "desc": "Inflation combined with visible scarcity erodes trust. Protests begin.", "color": "rose", "isWarning": True, "isFinal": False},
                    {"time": "T+45 Days", "title": "Political Instability", "desc": "Government faces severe pressure, potential votes of no confidence.", "color": "rose", "isWarning": False, "isFinal": True}
                ]
            },
            {
                "id": "cyber",
                "trigger": "Grid Cyberattack",
                "mitigations": [
                    {"label": "Redundant Power", "val": "Medium", "pct": 50},
                    {"label": "Cyber Defense", "val": "Active", "pct": 80},
                    {"label": "Backups", "val": "Segregated", "pct": 90}
                ],
                "steps": [
                    {"time": "T+0 Sec", "title": "Grid Cyberattack", "desc": "Malware payload detonated internally within regional energy substations.", "color": "orange", "isWarning": False, "isFinal": False},
                    {"time": "T+2 Hrs", "title": "Rolling Blackouts", "desc": "Automated load shedding triggers cascade failures across three counties.", "color": "blue", "isWarning": False, "isFinal": False},
                    {"time": "T+1 Day", "title": "Comms Degradation", "desc": "Cellular backup batteries fail. Internet routing loses 40% capacity.", "color": "amber", "isWarning": True, "isFinal": False},
                    {"time": "T+4 Days", "title": "Supply Chain Halt", "desc": "Logistics freeze due to digital inventory lockouts and fuel pump failures.", "color": "rose", "isWarning": True, "isFinal": False},
                    {"time": "T+7 Days", "title": "Economic Contagion", "desc": "Immediate market slump. GDP forecast revised down 1.2%.", "color": "rose", "isWarning": False, "isFinal": True}
                ]
            }
        ]

    def get_intelligence_data(self) -> Dict[str, Any]:
        return {
            "nodes": self.nodes,
            "edges": self.edges,
            "topologyStats": self.topologyStats,
            "simulations": self.simulations
        }

    async def simulate_update(self) -> Dict[str, Any]:
        # Fluctuate node positions slightly to simulate live network drift
        for n in self.nodes:
            n["x"] = max(15, min(85, n["x"] + random.uniform(-1, 1)))
            n["y"] = max(15, min(85, n["y"] + random.uniform(-1, 1)))

        # Update Topology Stats randomly
        val = float(self.topologyStats["centralityDrift"].replace("%", ""))
        val += random.uniform(-0.1, 0.1)
        self.topologyStats["centralityDrift"] = f"{round(val, 2)}%"
        
        edges_int = int(self.topologyStats["activeEdges"].replace(",", ""))
        edges_int += random.randint(-5, 5)
        self.topologyStats["activeEdges"] = f"{edges_int:,}"

        # Fluctuate mitigation percentages
        for sim in self.simulations:
            for m in sim["mitigations"]:
                if random.random() > 0.5:
                    m["pct"] = max(10, min(100, m["pct"] + random.randint(-5, 5)))

        return self.get_intelligence_data()

intelligence_engine = IntelligenceEngine()
