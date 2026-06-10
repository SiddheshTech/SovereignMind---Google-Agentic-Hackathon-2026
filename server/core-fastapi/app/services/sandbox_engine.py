import torch
import torch.nn as nn
import asyncio
from typing import List, AsyncGenerator, Dict, Any
from app.db.redis_client import redis_conn
from app.services.genome_engine import genome_engine

class CivilizationTransitionModel(nn.Module):
  """
  PyTorch transition network modeling systemic feedback loops.
  Computes how civilization state variables propagate under stress.
  State vector indices:
    0: Panic Level
    1: Economic Disruption
    2: Infrastructure Instability
    3: Supply Chain Failure
    4: Civil Unrest
    5: Systemic Collapse Probability
  """
  def __init__(self):
    super().__init__()
    # Linear interaction matrix representing feedback weights
    # e.g., how index i influences index j
    self.transition_weights = nn.Parameter(torch.tensor([
      [0.85, 0.40, 0.10, 0.30, 0.50, 0.20], # Influenced by Panic
      [0.30, 0.80, 0.20, 0.50, 0.40, 0.30], # Influenced by Econ Disruption
      [0.20, 0.30, 0.75, 0.40, 0.30, 0.40], # Influenced by Infra Instability
      [0.40, 0.50, 0.30, 0.85, 0.50, 0.30], # Influenced by Supply Failure
      [0.60, 0.30, 0.20, 0.40, 0.80, 0.50], # Influenced by Civil Unrest
      [0.10, 0.20, 0.30, 0.30, 0.40, 0.90]  # Influenced by Systemic Collapse
    ], dtype=torch.float32))

    # Bias adjustments
    self.bias = nn.Parameter(torch.zeros(6, dtype=torch.float32))

  def forward(self, state: torch.Tensor, external_stress: torch.Tensor) -> torch.Tensor:
    # State transitions: state_(t+1) = Sigmoid( W * state_t + Stress + Bias )
    # matrix multiplication of state [6] with transition weights [6, 6]
    activated = torch.matmul(self.transition_weights, state) + external_stress + self.bias
    return torch.sigmoid(activated)

class SandboxEngine:
  """
  Synthetic Civilization Sandbox
  Uses PyTorch-driven neural tensor state machines to simulate cascade failures
  and crisis propagation under extreme stress.
  """
  def __init__(self):
    self.model = CivilizationTransitionModel()

  async def run_simulation(self, country_code: str, epochs: int, active_crises: List[str]) -> AsyncGenerator[Dict[str, Any], None]:
    # 1. Fetch Civilizational Genome to calibrate baseline resistances
    genome = genome_engine.get_genome(country_code)
    resilience_index = genome.get("overall_resilience_index", 0.70)
    
    # 2. Setup baseline state vector [Panic, Econ, Infra, Supply, Unrest, Collapse]
    # More resilient nations start with lower baseline vulnerabilities
    base_vulnerability = 1.0 - resilience_index
    state = torch.tensor([
      base_vulnerability * 0.2, # Panic
      base_vulnerability * 0.3, # Econ
      base_vulnerability * 0.1, # Infra
      base_vulnerability * 0.2, # Supply
      base_vulnerability * 0.1, # Unrest
      0.02                      # Collapse
    ], dtype=torch.float32)

    # 3. Formulate stress vector based on active crises
    # e.g., "currency_collapse", "grid_failure", "cyber_attack"
    stress = torch.zeros(6, dtype=torch.float32)
    for crisis in active_crises:
      c = crisis.lower()
      if "currency" in c or "finance" in c:
        stress[1] += 0.4 # Target Econ
        stress[0] += 0.2 # Target Panic
      if "grid" in c or "power" in c or "infra" in c:
        stress[2] += 0.5 # Target Infra
        stress[3] += 0.3 # Target Supply
        stress[4] += 0.2 # Target Unrest
      if "cyber" in c or "comms" in c:
        stress[2] += 0.3 # Target Infra
        stress[0] += 0.2 # Target Panic
      if "supply" in c or "food" in c:
        stress[3] += 0.5 # Target Supply
        stress[0] += 0.3 # Target Panic
      if "rebellion" in c or "unrest" in c:
        stress[4] += 0.6 # Target Unrest
        stress[5] += 0.2 # Target Collapse

    # Add general baseline stress coefficient
    stress += 0.05

    print(f"🎬 Initializing PyTorch Sandbox for {country_code} over {epochs} epochs...")
    print(f"🧬 Calibrated Resilience: {resilience_index:.2f}. External Stress Tensor: {stress.tolist()}")

    # Iterate through epochs
    for epoch in range(1, epochs + 1):
      # Disable gradient tracking for speed during inference
      with torch.no_grad():
        # Transition state vector using our neural model
        state = self.model(state, stress)
        
        # Slowly decay stress if no new input occurs (civilization adaptation)
        stress = stress * 0.95

      # Convert state tensors back to standard float metrics
      panic = float(state[0])
      econ = float(state[1])
      infra = float(state[2])
      supply_failure = float(state[3])
      unrest = float(state[4])
      collapse = float(state[5])

      # Build result packet
      tick_data = {
        "epoch": epoch,
        "population": {
          "total_population": 10000000.0 * (1.0 - collapse * 0.1), # Population drops with collapse
          "panic_level": panic,
          "displacement_rate": panic * 0.4 + unrest * 0.2
        },
        "economy": {
          "gdp_growth_rate": 0.03 - (econ * 0.15), # Drops under economic disruption
          "inflation": 0.02 + (econ * 0.30) + (supply_failure * 0.15),
          "supply_chain_integrity": 1.0 - supply_failure
        },
        "instability": {
          "civil_unrest": unrest,
          "systemic_collapse_probability": collapse
        },
        "status_message": self._generate_status_message(epoch, panic, econ, unrest, collapse)
      }

      # Publish tick to Redis PubSub for real-time WebSockets tracking
      redis_conn.publish("sandbox_stream", str(tick_data))

      # Yield output for the gRPC stream
      yield tick_data

      # Simulate processing delay
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
