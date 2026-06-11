import random

class ExecutiveBriefingEngine:
    def get_data(self):
        return {
            "tasks": [
                {"id": 1, "title": "Review Systemic Dependencies", "desc": "Analyze the impact of the new silicon supply chain disruption.", "status": "In Progress", "statusColor": "text-amber-400 bg-amber-400/10", "date": "Today, 14:00", "priority": "CRITICAL", "owner": "OP_ALPHA", "dep": "Logistics"},
                {"id": 2, "title": "Authorize Reserve Allocation", "desc": "Sign off on the emergency deployment of strategic food reserves.", "status": "Pending Auth", "statusColor": "text-rose-400 bg-rose-400/10", "date": "Today, 16:30", "priority": "HIGH", "owner": "OP_OMEGA", "dep": "Resource Mgmt"},
                {"id": 3, "title": "Simulate Treaty Breach", "desc": "Run a level-4 simulation on the consequences of withdrawing from Accord #84.", "status": "Queued", "statusColor": "text-gray-400 bg-gray-400/10", "date": "Tomorrow, 09:00", "priority": "MEDIUM", "owner": "OP_DELTA", "dep": "Forecasting"},
                {"id": 4, "title": "Update Public Narrative", "desc": "Review AI-generated press release regarding the recent grid failure.", "status": "Completed", "statusColor": "text-emerald-400 bg-emerald-400/10", "date": "Yesterday", "priority": "LOW", "owner": "OP_BETA", "dep": "Communications"}
            ],
            "meetings": [
                {"id": 1, "color": "bg-purple-500", "title": "National Security Council", "time": "10:00 - 11:30", "participants": 8, "priority": "CRITICAL"},
                {"id": 2, "color": "bg-sky-500", "title": "Tech Infrastructure Sync", "time": "13:00 - 14:00", "participants": 4, "priority": "HIGH"},
                {"id": 3, "color": "bg-emerald-500", "title": "Economic Policy Review", "time": "15:30 - 16:30", "participants": 12, "priority": "MEDIUM"}
            ],
            "totalDirectives": 41 + random.randint(0, 5),
            "resolvedLoops": 16 + random.randint(0, 5),
            "recalibrationRate": f"{23 + random.randint(-2, 2)}%",
            "interruptVectors": 51 + random.randint(-5, 5)
        }

executive_briefing_engine = ExecutiveBriefingEngine()
