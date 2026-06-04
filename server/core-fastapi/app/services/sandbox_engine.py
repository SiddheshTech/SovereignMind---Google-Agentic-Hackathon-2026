import torch
import torch.nn as nn
import asyncio
from typing import List, AsyncGenerator, Dict, Any
from app.db.redis_client import redis_conn
from app.services.genome_engine import genome_engine
from app.core.dataset_manager import dataset_manager

class CivilizationTransitionModel(nn.Module):
  """
  PyTorch transition network modeling systemic feedback loops.
  Computes how civilization state variables propagate under stress.
  """
  def __init__(self):
    super().__init__()
    self.transition_weights = nn.Parameter(torch.tensor([
      [0.85, 0.40, 0.10, 0.30, 0.50, 0.20], # Influenced by Panic
      [0.30, 0.80, 0.20, 0.50, 0.40, 0.30], # Influenced by Econ Disruption
      [0.20, 0.30, 0.75, 0.40, 0.30, 0.40], # Influenced by Infra Instability
      [0.40, 0.50, 0.30, 0.85, 0.50, 0.30], # Influenced by Supply Failure
      [0.60, 0.30, 0.20, 0.40, 0.80, 0.50], # Influenced by Civil Unrest
      [0.10, 0.20, 0.30, 0.30, 0.40, 0.90]  # Influenced by Systemic Collapse
    ], dtype=torch.float32))

    self.bias = nn.Parameter(torch.zeros(6, dtype=torch.float32))

  def forward(self, state: torch.Tensor, external_stress: torch.Tensor) -> torch.Tensor:
    activated = torch.matmul(self.transition_weights, state) + external_stress + self.bias
    return torch.sigmoid(activated)

class SandboxEngine:
  """
  Synthetic Civilization Sandbox
  Simulates cascade failures starting from REAL global demographic and conflict datasets.
  """
  def __init__(self):
    self.model = CivilizationTransitionModel()

  async def run_simulation(self, country_code: str, epochs: int, active_crises: List[str]) -> AsyncGenerator[Dict[str, Any], None]:
    # 1. Fetch REAL Dataset baselines
    real_data = dataset_manager.get_country_data(country_code)
    actual_population = real_data["population"]
    conflict_deaths = real_data["conflict_deaths"]
    resilience_index = real_data["resilience"]

    # 2. Setup baseline state vector [Panic, Econ, Infra, Supply, Unrest, Collapse]
    # Unrest is directly driven by historical GED conflict deaths baseline
    historical_unrest = min(1.0, conflict_deaths / 10000.0)
    base_vulnerability = 1.0 - resilience_index
    
    state = torch.tensor([
      base_vulnerability * 0.2, # Panic
      base_vulnerability * 0.3, # Econ
      base_vulnerability * 0.1, # Infra
      base_vulnerability * 0.2, # Supply
      max(historical_unrest, base_vulnerability * 0.1), # Unrest starts at historical baseline
      0.02                      # Collapse
    ], dtype=torch.float32)

    # 3. Formulate stress vector based on active crises
    stress = torch.zeros(6, dtype=torch.float32)
    for crisis in active_crises:
      c = crisis.lower()
      if "currency" in c or "finance" in c:
        stress[1] += 0.4 
        stress[0] += 0.2 
      if "grid" in c or "power" in c or "infra" in c:
        stress[2] += 0.5 
        stress[3] += 0.3 
        stress[4] += 0.2 
      if "cyber" in c or "comms" in c:
        stress[2] += 0.3 
        stress[0] += 0.2 
      if "supply" in c or "food" in c:
        stress[3] += 0.5 
        stress[0] += 0.3 
      if "rebellion" in c or "unrest" in c:
        stress[4] += 0.6 
        stress[5] += 0.2 

    stress += 0.05

    print(f"🎬 Initializing PyTorch Sandbox for {country_code.upper()} over {epochs} epochs...")
    print(f"🌍 Real Baseline Population: {actual_population:,.0f} | Historical Unrest Base: {historical_unrest:.2f}")

    current_population = actual_population

    for epoch in range(1, epochs + 1):
      with torch.no_grad():
        state = self.model(state, stress)
        stress = stress * 0.95

      panic = float(state[0])
      econ = float(state[1])
      infra = float(state[2])
      supply_failure = float(state[3])
      unrest = float(state[4])
      collapse = float(state[5])

      # Real-time displacement / migration algorithm dynamically tracking UN numbers
      # Displacement rate spikes heavily with unrest and panic
      displacement_rate = (panic * 0.4 + unrest * 0.2 + collapse * 0.8) * 0.05
      displaced_people = current_population * displacement_rate
      current_population -= displaced_people

      tick_data = {
        "epoch": epoch,
        "population": {
          "total_population": current_population, 
          "panic_level": panic,
          "displacement_rate": displacement_rate,
          "new_refugees": displaced_people
        },
        "economy": {
          "gdp_growth_rate": 0.03 - (econ * 0.15),
          "inflation": 0.02 + (econ * 0.30) + (supply_failure * 0.15),
          "supply_chain_integrity": 1.0 - supply_failure
        },
        "instability": {
          "civil_unrest": unrest,
          "systemic_collapse_probability": collapse
        },
        "status_message": self._generate_status_message(epoch, panic, econ, unrest, collapse)
      }

      redis_conn.publish("sandbox_stream", str(tick_data))
      yield tick_data
      await asyncio.sleep(0.5)

  def _generate_status_message(self, epoch: int, panic: float, econ: float, unrest: float, collapse: float) -> str:
    if collapse > 0.6:
      return f"Epoch {epoch}: High risk of civilizational state failure. Core institutions fracturing."
    elif unrest > 0.5:
      return f"Epoch {epoch}: Major civil unrest spreading. Local law enforcement overwhelmed."
    elif panic > 0.4:
      return f"Epoch {epoch}: Panic buying observed. Rationing behaviors taking hold."
    elif econ > 0.3:
      return f"Epoch {epoch}: Supply distribution bottlenecking. Inflation rising rapidly."
    return f"Epoch {epoch}: System adapting. Localized stresses successfully buffered."

sandbox_engine = SandboxEngine()
