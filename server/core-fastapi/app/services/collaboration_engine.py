import uuid
import datetime
from typing import Dict, Any, List

class CollaborationEngine:
    def __init__(self):
        self.rooms = [
            { "id": "r1", "name": "Global Threat Triage", "type": "video", "category": "pinned", "ping": True, "unread": 0 },
            { "id": "r2", "name": "Sector 4 Logistics", "type": "chat", "category": "pinned", "ping": False, "unread": 0 },
            { "id": "o1", "name": "Grid Collapse Sigma", "type": "chat", "category": "operation", "ping": False, "unread": 4 },
            { "id": "o2", "name": "Naval Embargo Comms", "type": "video", "category": "operation", "ping": False, "unread": 0 },
            { "id": "o3", "name": "Supply Chain Alpha", "type": "chat", "category": "operation", "ping": False, "unread": 0 },
        ]

        self.users = [
            { "id": "u1", "name": "Cmdr. J. Vance", "status": "online" },
            { "id": "u2", "name": "Operative K. Thorne", "status": "busy" },
            { "id": "u3", "name": "SysAdmin 04", "status": "offline" },
        ]

        self.artifacts = [
            { "id": "1", "title": "Threat Assessment 1A", "date": "Today, 14:00", "type": "report", "metadata": "Sector 4, Risk Lvl 5", "history": [{ "v": "1.2", "d": "Today 13:00" }] },
            { "id": "2", "title": "Logistics Reroute Plan", "date": "Yesterday", "type": "pdf", "metadata": "Supply routes 3 & 4", "history": [{ "v": "1.0", "d": "Yesterday 09:00" }] },
            { "id": "3", "title": "Energy Output Projections", "date": "Oct 12", "type": "sheet", "metadata": "Q4 Projections", "history": [{ "v": "2.4", "d": "Oct 11" }] },
            { "id": "4", "title": "Treaty Violation Evidence", "date": "Oct 10", "type": "image", "metadata": "Visual data pack", "history": [{ "v": "1.0", "d": "Oct 10" }] },
        ]

        self.messages = [
            { "roomId": "r1", "sender": "System", "text": "Channel established.", "time": "09:00" },
            { "roomId": "o1", "sender": "Cmdr. J. Vance", "text": "Status update on collapse?", "time": "11:15" }
        ]

    def get_initial_data(self) -> Dict[str, Any]:
        return {
            "rooms": self.rooms,
            "users": self.users,
            "artifacts": self.artifacts,
            "messages": self.messages
        }

    def simulate_message(self, room_id: str, prompt: str) -> Dict[str, Any]:
        now = datetime.datetime.now().strftime("%H:%M")
        return {
            "roomId": room_id,
            "sender": "System Monitor",
            "text": f"Simulated response to: {prompt}",
            "time": now
        }

collaboration_engine = CollaborationEngine()
