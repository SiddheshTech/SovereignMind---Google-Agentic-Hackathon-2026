"""
SettingsManager — persistent settings store backed by settings_store.json.

All collections start EMPTY. No hardcoded / mock data whatsoever.
Callers (gRPC handlers) create entries through mutations only.
"""
import os
import json
from typing import Dict, Any, List, Optional

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "../db/settings_store.json")

# ── Minimal blank system settings (no personal / mock data) ──────────────────
BLANK_SYSTEM_SETTINGS: Dict[str, Any] = {
    "operator_name": "",
    "operator_id": "",
    "operator_institution": "",
    "operator_role": "",
    "operator_toggles_json": json.dumps({
        "tfa": False,
        "e2e": False,
        "geo": False,
        "antigravity": False,
        "telemetry": False,
    }),
    "model_processing_bound": "Hybrid Secure Cloud (Default)",
    "clearance_matrix_json": json.dumps({}),
    "active_region": "",
    "storage_policies_json": json.dumps({
        "localization": False,
        "replication": False,
        "sovereignBackups": False,
        "immutableArchives": False,
    }),
    "processing_boundary": "Trusted Regions",
    "theme": "Sovereign Dark",
    "telemetry_toggles_json": json.dumps({
        "usageAnalytics": False,
        "crashReports": False,
        "behavioralMetrics": False,
        "heatmaps": False,
        "diagnosticLogs": False,
    }),
    "notification_channels_json": json.dumps({
        "email": False,
        "sms": False,
        "signal": False,
        "secureRadio": False,
        "internalMessenger": False,
    }),
    "network_protocols_json": json.dumps({
        "https": False,
        "mesh": False,
        "quantum": False,
        "satellite": False,
        "tunnel": False,
    }),
    "network_policies_json": json.dumps({
        "encryption": 0,
        "packetInspection": 0,
        "telemetry": 0,
        "threatDetection": 0,
    }),
}


class SettingsManager:
    def __init__(self):
        # Start completely empty — loaded from disk or blank
        self.data: Dict[str, Any] = {
            "system_settings": dict(BLANK_SYSTEM_SETTINGS),
            "clearances": [],
            "tokens": [],
            "alert_rules": [],
            "compliance_records": [],
        }
        self._load()

    # ── Persistence ───────────────────────────────────────────────────────────

    def _load(self):
        try:
            if os.path.exists(SETTINGS_FILE):
                with open(SETTINGS_FILE, "r") as f:
                    stored = json.load(f)
                # Merge stored data, keeping blank defaults for any missing key
                self.data["system_settings"] = {
                    **BLANK_SYSTEM_SETTINGS,
                    **stored.get("system_settings", {}),
                }
                self.data["clearances"]  = stored.get("clearances",  [])
                self.data["tokens"]      = stored.get("tokens",      [])
                self.data["alert_rules"] = stored.get("alert_rules", [])
                self.data["compliance_records"] = stored.get("compliance_records", [])
                print("⚙️  [SettingsManager] Configurations loaded from disk.")
            else:
                print("⚙️  [SettingsManager] No settings file found — starting fresh.")
                self._save()
        except Exception as exc:
            print(f"⚠️  [SettingsManager] Load error: {exc}")

    def _save(self):
        try:
            os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
            with open(SETTINGS_FILE, "w") as f:
                json.dump(self.data, f, indent=2)
        except Exception as exc:
            print(f"⚠️  [SettingsManager] Save error: {exc}")

    # ── System Settings ───────────────────────────────────────────────────────

    def get_system_settings(self) -> Dict[str, Any]:
        return self.data.get("system_settings", dict(BLANK_SYSTEM_SETTINGS))

    def save_system_settings(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        current = self.data.get("system_settings", dict(BLANK_SYSTEM_SETTINGS))
        for key, val in updates.items():
            if val is not None:
                current[key] = val
        self.data["system_settings"] = current
        self._save()
        return current

    # ── Security Clearances ───────────────────────────────────────────────────

    def get_clearances(self) -> List[Dict[str, Any]]:
        return self.data.get("clearances", [])

    def update_clearance(
        self, id: str, level: Optional[str] = None, status: Optional[str] = None
    ) -> Dict[str, Any]:
        for clearance in self.data.get("clearances", []):
            if clearance["id"] == id:
                if level  is not None:
                    clearance["level"]  = level
                if status is not None:
                    clearance["status"] = status
                self._save()
                return clearance
        return {}

    # ── Access Tokens ─────────────────────────────────────────────────────────

    def get_tokens(self) -> List[Dict[str, Any]]:
        return self.data.get("tokens", [])

    def generate_token(
        self,
        token_type: str,
        environment: str,
        permissions: str,
        owner: Optional[str] = None,
    ) -> Dict[str, Any]:
        import uuid
        import datetime

        token_id = f"tok_{uuid.uuid4().hex[:8]}"
        new_token = {
            "id": token_id,
            "owner": owner or f"{environment} {token_type} Node",
            "token_type": token_type,
            "created": datetime.date.today().isoformat(),
            "last_used": "Never",
            "status": "Active",
        }
        tokens = self.data.setdefault("tokens", [])
        tokens.insert(0, new_token)
        self._save()
        return new_token

    def update_token(self, id: str, action: str) -> Dict[str, Any]:
        for token in self.data.get("tokens", []):
            if token["id"] == id:
                if action == "Revoke":
                    token["status"] = "Revoked"
                elif action == "Suspend":
                    token["status"] = "Suspended"
                elif action == "Regenerate":
                    token["status"] = "Active"
                    token["last_used"] = "Never"
                self._save()
                return token
        return {}

    # ── Alert Rules ───────────────────────────────────────────────────────────

    def get_alert_rules(self) -> List[Dict[str, Any]]:
        return self.data.get("alert_rules", [])

    def save_alert_rule(
        self,
        id: Optional[str],
        name: str,
        severity: str,
        trigger: str,
        destination: str,
        active: bool,
    ) -> Dict[str, Any]:
        rules = self.data.setdefault("alert_rules", [])

        # Update existing rule
        for rule in rules:
            if rule["id"] == id:
                rule.update(
                    name=name, severity=severity,
                    trigger=trigger, destination=destination, active=active,
                )
                self._save()
                return rule

        # Create new rule
        import time
        new_id = id if id else str(int(time.time() * 1000))
        new_rule = {
            "id": new_id,
            "name": name,
            "severity": severity,
            "trigger": trigger,
            "destination": destination,
            "active": active,
        }
        rules.append(new_rule)
        self._save()
        return new_rule

    def delete_alert_rule(self, id: str) -> bool:
        rules = self.data.get("alert_rules", [])
        before = len(rules)
        self.data["alert_rules"] = [r for r in rules if r["id"] != id]
        self._save()
        return len(self.data["alert_rules"]) < before

    # ── Compliance Records ────────────────────────────────────────────────────

    def get_compliance_records(self) -> List[Dict[str, Any]]:
        return self.data.get("compliance_records", [])

    def save_compliance_record(
        self,
        id: Optional[str],
        name: str,
        score: str,
        risk: str,
        last_audit: str,
    ) -> Dict[str, Any]:
        records = self.data.setdefault("compliance_records", [])

        # Update existing
        for record in records:
            if record["id"] == id:
                record.update(
                    name=name, score=score, risk=risk, last_audit=last_audit
                )
                self._save()
                return record

        # Create new
        import time
        new_id = id if id else str(int(time.time() * 1000))
        new_record = {
            "id": new_id,
            "name": name,
            "score": score,
            "risk": risk,
            "last_audit": last_audit,
        }
        records.append(new_record)
        self._save()
        return new_record

    def delete_compliance_record(self, id: str) -> bool:
        records = self.data.get("compliance_records", [])
        before = len(records)
        self.data["compliance_records"] = [r for r in records if r["id"] != id]
        self._save()
        return len(self.data["compliance_records"]) < before

# Module-level singleton
settings_manager = SettingsManager()

