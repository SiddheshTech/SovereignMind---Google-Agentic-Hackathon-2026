import random

class OperatorDashboardEngine:
    def get_data(self):
        return {
            "notifications": [
                {"id": 1, "text": "System update scheduled for 02:00 AM UTC", "time": "10m ago", "read": False},
                {"id": 2, "text": "Anomaly detected in Sector 7 power grid", "time": "1h ago", "read": True},
                {"id": 3, "text": "New intelligence report available for review", "time": "3h ago", "read": True}
            ],
            "timeline": [
                {"time": "09:42", "event": "Login successful via Biometric Auth", "type": "AUTH"},
                {"time": "10:15", "event": "Accessed Confidential Report: 'Water Scarcity Q3'", "type": "ACCESS"},
                {"time": "11:05", "event": "Triggered Simulation: 'Grid Failure Protocol'", "type": "ACTION"},
                {"time": "13:30", "event": "Updated Security Clearance for Operative Beta", "type": "ADMIN"}
            ]
        }

operator_dashboard_engine = OperatorDashboardEngine()
