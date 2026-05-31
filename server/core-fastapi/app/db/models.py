from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
import json

class GenomeModel(SQLModel, table=True):
  __tablename__ = "civilization_genomes"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  country_code: str = Field(index=True, unique=True)
  nation_name: str
  overall_resilience_index: float
  traits_json: str = Field(default="[]") # JSON serialized list of traits

  def get_traits(self) -> List[dict]:
    try:
      return json.loads(self.traits_json)
    except Exception:
      return []

  def set_traits(self, traits: List[dict]):
    self.traits_json = json.dumps(traits)

class ConstitutionalAuditModel(SQLModel, table=True):
  __tablename__ = "constitutional_audits"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  country_code: str = Field(index=True)
  proposed_action: str
  context: str
  is_authorized: bool
  infraction_risk_score: float
  evaluated_constraints_json: str = Field(default="[]") # JSON serialized constraints
  alternate_recommendation: str

  def get_constraints(self) -> List[dict]:
    try:
      return json.loads(self.evaluated_constraints_json)
    except Exception:
      return []

  def set_constraints(self, constraints: List[dict]):
    self.evaluated_constraints_json = json.dumps(constraints)

class SandboxSimulationModel(SQLModel, table=True):
  __tablename__ = "sandbox_simulations"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  country_code: str = Field(index=True)
  epochs: int
  active_crises_json: str = Field(default="[]") # JSON list of crises
  trajectory_ticks_json: str = Field(default="[]") # JSON list of simulation tick outputs

  def get_crises(self) -> List[str]:
    try:
      return json.loads(self.active_crises_json)
    except Exception:
      return []

  def set_crises(self, crises: List[str]):
    self.active_crises_json = json.dumps(crises)

  def get_ticks(self) -> List[dict]:
    try:
      return json.loads(self.trajectory_ticks_json)
    except Exception:
      return []

  def set_ticks(self, ticks: List[dict]):
    self.trajectory_ticks_json = json.dumps(ticks)

class EmergencyContractModel(SQLModel, table=True):
  __tablename__ = "emergency_contracts"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  item_needed: str
  quantity_required: int
  urgent_reason: str
  success: bool
  selected_vendor_id: Optional[str] = None
  matched_vendors_json: str = Field(default="[]") # JSON list of matches
  purchase_order_draft: str = Field(default="")
  legal_compliance_packet: str = Field(default="")

  def get_vendors(self) -> List[dict]:
    try:
      return json.loads(self.matched_vendors_json)
    except Exception:
      return []

  def set_vendors(self, vendors: List[dict]):
    self.matched_vendors_json = json.dumps(vendors)

class PromptOptimizationModel(SQLModel, table=True):
  __tablename__ = "prompt_optimizations"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  agent_id: str = Field(index=True)
  task_description: str
  original_prompt: str
  optimized_prompt: str
  performance_gain: float
  evaluation_report: str
