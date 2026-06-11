import asyncio
import json
import random
from typing import Dict, Any, List

class ProcurementEngine:
    def __init__(self):
        self.vendors = [
            {"name": "Mercy General Hospital", "id": "VND-8491A", "category": "Hospitals", "tier": "Tier 1", "status": "Active", "reliability": 98.4, "distance": "12 km", "capacity": "450 Beds"},
            {"name": "Agri-Corp Provisions", "id": "VND-4102B", "category": "Food Suppliers", "tier": "Tier 2", "status": "Review", "reliability": 82.1, "distance": "85 km", "capacity": "12 Tons/Day"},
            {"name": "Global Logistics Partners", "id": "VND-1100X", "category": "Logistics Partners", "tier": "Tier 1", "status": "Active", "reliability": 99.9, "distance": "Global", "capacity": "120 Vehicles"},
            {"name": "SafeHaven Shelters", "id": "VND-9921E", "category": "Shelter Providers", "tier": "Tier 1", "status": "Active", "reliability": 94.5, "distance": "4 km", "capacity": "2,500 Units"},
            {"name": "Med-Tech Emergency Equipment", "id": "VND-3340M", "category": "Emergency Equipment", "tier": "Tier 3", "status": "Restricted", "reliability": 68.2, "distance": "250 km", "capacity": "Limited Stock"}
        ]
        self.contracts = [
            {"id": "EMG-2026-X1", "entity": "Mercy General Hospital", "type": "Emergency Contract", "date": "10 mins ago", "status": "Pending Signature"},
            {"id": "RFQ-2026-A2", "entity": "Global Logistics Partners", "type": "RFQ", "date": "1 hr ago", "status": "Dispatched"},
            {"id": "PRQ-2026-X8", "entity": "Agri-Corp Provisions", "type": "Procurement Req", "date": "4 hrs ago", "status": "Approved"},
            {"id": "EVA-2026-B4", "entity": "SafeHaven Shelters", "type": "Vendor Eval", "date": "Yesterday", "status": "Completed"},
            {"id": "EMG-2026-C1", "entity": "Oceana Desalination", "type": "Emergency Contract", "date": "Yesterday", "status": "Active"}
        ]
        self.mapNodes = [
            {"id": "Stable: Node A", "x": 10, "y": 20, "type": "factory", "statusText": "Stable"},
            {"id": "Processing", "x": 45, "y": 50, "type": "distribution", "statusText": "Processing"},
            {"id": "Endpoint1", "x": 85, "y": 30, "type": "endpoint", "statusText": ""},
            {"id": "Disrupted", "x": 90, "y": 80, "type": "disruption", "statusText": "Disrupted"}
        ]
        self.mapPaths = [
            {"path": "M 12 25 Q 30 25 45 50", "stroke": "#10B981", "animated": True},
            {"path": "M 45 50 Q 65 50 85 33", "stroke": "#3B82F6", "animated": False},
            {"path": "M 45 50 Q 60 70 90 77", "stroke": "#F43F5E", "animated": False}
        ]
        self.riskVectors = [
            {"label": "Supplier Stability", "val": "92%", "trend": "stable", "color": "emerald", "detail": "Most Tier 1 vendors operating at optimal capacity."},
            {"label": "Logistics Disruption", "val": "Elevated", "trend": "rising", "color": "rose", "detail": "Route blockage at Node E. Re-routing cargo vectors."},
            {"label": "Price Volatility", "val": "Moderate", "trend": "falling", "color": "amber", "detail": "Raw material index fluctuating within acceptable margins."}
        ]
        self.defcon = "3"
        self.activeScanAgents = 24105

    def get_procurement_data(self) -> Dict[str, Any]:
        return {
            "vendors": self.vendors,
            "contracts": self.contracts,
            "mapNodes": self.mapNodes,
            "mapPaths": self.mapPaths,
            "riskVectors": self.riskVectors,
            "defcon": self.defcon,
            "activeScanAgents": self.activeScanAgents
        }

    async def simulate_update(self) -> Dict[str, Any]:
        # Simulate an intelligence / state update in real-time
        self.activeScanAgents += random.randint(-50, 150)
        
        # Modify some vendor reliabilities
        for v in self.vendors:
            if random.random() > 0.5:
                v["reliability"] = round(max(0, min(100, v["reliability"] + random.uniform(-2, 2))), 1)
                
        # Simulate contract advancing status
        statuses = ["Pending Signature", "Dispatched", "Approved", "Active", "Completed"]
        if random.random() > 0.5 and self.contracts:
            contract_idx = random.randint(0, len(self.contracts) - 1)
            curr = self.contracts[contract_idx]["status"]
            if curr in statuses and statuses.index(curr) < len(statuses) - 1:
                self.contracts[contract_idx]["status"] = statuses[statuses.index(curr) + 1]

        # Simulate risk vector fluctuations
        if random.random() > 0.7:
            self.riskVectors[0]["val"] = f"{random.randint(85, 99)}%"
            self.riskVectors[1]["val"] = random.choice(["Elevated", "Critical", "Moderate"])
            self.riskVectors[2]["val"] = random.choice(["Moderate", "High", "Low"])

        return self.get_procurement_data()

procurement_engine = ProcurementEngine()
