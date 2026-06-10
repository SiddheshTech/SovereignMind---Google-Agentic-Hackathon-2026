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

  async def run_crisis_scenario(self, crises: list, scenario_name: str = "Custom Scenario") -> dict:
    """
    AI-powered crisis scenario analysis using Gemini.
    Returns demographics, economic shock, panic sentiment, and political preference data.
    """
    print(f"🎬 [SandboxEngine] Running AI crisis scenario for: {crises}")
    from app.agents.llm_router import llm_router
    import json

    crises_str = ", ".join(crises)

    system_prompt = (
        "You are a sovereign civilization modeling AI for a global governance simulation platform. "
        "You must analyze the given crisis combination and output a detailed JSON model of how "
        "a nation of 10 million would react demographically, economically, and socially."
    )

    user_prompt = (
        f"Model the combined crisis scenario: [{crises_str}]\n\n"
        "Output strict JSON with this exact schema:\n"
        "{\n"
        "  \"simulatedPopulation\": {\n"
        "    \"totalAgents\": number (8000000-12000000),\n"
        "    \"ageGroups\": [{\"group\": string, \"percentage\": number, \"reaction\": string}],\n"
        "    \"incomeClasses\": [{\"class\": string, \"percentage\": number, \"vulnerability\": string}],\n"
        "    \"migrationTendencies\": {\"rate\": string, \"hotspots\": [string], \"description\": string},\n"
        "    \"consumptionPatterns\": {\"hoardingRisk\": string, \"essentialGoodDemand\": string, \"description\": string},\n"
        "    \"politicalPreferences\": [{\"faction\": string, \"percentage\": number, \"sentiment\": string}]\n"
        "  },\n"
        "  \"economicShock\": {\n"
        "    \"oilCrisisPremium\": number (USD per barrel extra),\n"
        "    \"foodShortagesIndex\": number (0-100),\n"
        "    \"disruptionSummary\": string\n"
        "  },\n"
        "  \"panicSentiment\": {\n"
        "    \"realtimeNarratives\": [string (3-5 vivid crisis narratives from citizens)],\n"
        "    \"protestPropensity\": number (0-100),\n"
        "    \"misinformationStrength\": number (0-100)\n"
        "  },\n"
        "  \"cascadeLinks\": [string (key cascade effects between selected crises)],\n"
        "  \"resilienceScore\": number (0-100),\n"
        "  \"estimatedRecoveryMonths\": number\n"
        "}\n"
        "Return only the JSON object, no markdown fences or comments."
    )

    try:
      response_text = await llm_router.generate_response(
          provider="gemini",
          system_prompt=system_prompt,
          user_prompt=user_prompt,
          temperature=0.3
      )

      clean = response_text.strip()
      if clean.startswith("```json"):
        clean = clean[7:]
      if clean.startswith("```"):
        clean = clean[3:]
      if clean.endswith("```"):
        clean = clean[:-3]
      clean = clean.strip()

      data = json.loads(clean)
      data["scenarioName"] = scenario_name
      data["crises"] = crises
      return data

    except Exception as e:
      print(f"⚠️ [SandboxEngine] Gemini scenario analysis failed ({e}). Using structured fallback...")
      return self._fallback_scenario(crises, scenario_name)

  def _fallback_scenario(self, crises: list, scenario_name: str) -> dict:
    """Structured fallback when Gemini is unavailable."""
    crisis_str = " + ".join(crises)
    severity = min(95, 30 + len(crises) * 15)
    return {
      "scenarioName": scenario_name,
      "crises": crises,
      "simulatedPopulation": {
        "totalAgents": 10000000,
        "ageGroups": [
          {"group": "Children (0-17)", "percentage": 22, "reaction": f"Critical school disruptions under {crisis_str}. Family displacement acceleration."},
          {"group": "Young Adults (18-35)", "percentage": 28, "reaction": "Digital information reliance peaks. Protest propensity elevated."},
          {"group": "Middle-Aged (36-55)", "percentage": 30, "reaction": "Economic pressure intensifies. Essential goods prioritization."},
          {"group": "Senior Citizens (56+)", "percentage": 20, "reaction": "Critical medical supply dependency triggers evacuation patterns."},
        ],
        "incomeClasses": [
          {"class": "Lower Class", "percentage": 35, "vulnerability": f"Highly vulnerable to {crisis_str}. No buffer savings or mobility."},
          {"class": "Middle Class", "percentage": 45, "vulnerability": "Moderate vulnerability. Savings will deplete in 3-6 months without intervention."},
          {"class": "Upper Class", "percentage": 20, "vulnerability": "Low short-term risk. Asset flight and capital reallocation likely."},
        ],
        "migrationTendencies": {
          "rate": "High (23% projected displacement)",
          "hotspots": ["Eastern Border Corridors", "Coastal Zones", "Mountain Refuge Settlements"],
          "description": f"Internal displacement surging. {crisis_str} accelerating rural-to-urban and cross-border movement."
        },
        "consumptionPatterns": {
          "hoardingRisk": "Critical",
          "essentialGoodDemand": "+340% vs baseline",
          "description": "Panic buying cycles emerging. Rationing enforcement recommended for fuel, food, and medicine."
        },
        "politicalPreferences": [
          {"faction": "Authoritarian Stability", "percentage": 38, "sentiment": "Demanding strong emergency powers"},
          {"faction": "Democratic Reform", "percentage": 30, "sentiment": "Calling for transparent crisis management"},
          {"faction": "Nationalist Isolationism", "percentage": 22, "sentiment": "Blaming external actors for crisis origin"},
          {"faction": "Neutral / Apolitical", "percentage": 10, "sentiment": "Focused on personal survival"},
        ]
      },
      "economicShock": {
        "oilCrisisPremium": round(12 + len(crises) * 8, 1),
        "foodShortagesIndex": min(95, 40 + len(crises) * 12),
        "disruptionSummary": f"Compound effects of {crisis_str} create supply-demand imbalance across energy and food sectors."
      },
      "panicSentiment": {
        "realtimeNarratives": [
          f"[{crisis_str}] Shelves in district 7 completely empty — third consecutive day of shortages.",
          "Emergency broadcast: all non-essential travel suspended until further notice.",
          f"Local hospitals overwhelmed. Community leaders urge calm amid rising {crises[0].lower() if crises else 'crisis'} fears.",
          "Digital currency wallets frozen — citizens unable to access savings.",
          "Protest reported at capital square. Military presence confirmed but restrained."
        ],
        "protestPropensity": min(95, 35 + len(crises) * 12),
        "misinformationStrength": min(90, 40 + len(crises) * 8)
      },
      "cascadeLinks": [f"{crises[i]} → {crises[i+1]}" for i in range(len(crises)-1)] if len(crises) > 1 else [],
      "resilienceScore": max(10, 75 - len(crises) * 12),
      "estimatedRecoveryMonths": min(48, 8 + len(crises) * 5)
    }

  async def generate_recovery_paths(self, crises: list, scenario_id: str = "") -> dict:
    """
    AI-powered three-path recovery projection using Gemini.
    """
    print(f"🔮 [SandboxEngine] Generating recovery paths for: {crises}")
    from app.agents.llm_router import llm_router
    import json

    crises_str = ", ".join(crises)

    system_prompt = (
        "You are a sovereign recovery modeling AI specializing in long-term civilizational restoration. "
        "Analyze the given crisis combination and compute three distinct recovery trajectories."
    )

    user_prompt = (
        f"Generate recovery path projections for a nation experiencing: [{crises_str}]\n\n"
        "Return strict JSON:\n"
        "{\n"
        "  \"bestCase\": {\"trajectory\": string (short title), \"probability\": number (%), \"description\": string (2-3 sentences), \"estimatedMonths\": number},\n"
        "  \"expected\": {\"trajectory\": string, \"probability\": number, \"description\": string, \"estimatedMonths\": number},\n"
        "  \"worstCase\": {\"trajectory\": string, \"probability\": number, \"description\": string, \"estimatedMonths\": number},\n"
        "  \"overallRecommendation\": string (key policy action in 1-2 sentences)\n"
        "}\n"
        "Note: probabilities should sum to approximately 100. Return ONLY the JSON object."
    )

    try:
      response_text = await llm_router.generate_response(
          provider="gemini",
          system_prompt=system_prompt,
          user_prompt=user_prompt,
          temperature=0.2
      )

      clean = response_text.strip()
      if clean.startswith("```json"):
        clean = clean[7:]
      if clean.startswith("```"):
        clean = clean[3:]
      if clean.endswith("```"):
        clean = clean[:-3]
      clean = clean.strip()

      data = json.loads(clean)
      data["crises"] = crises
      data["scenarioId"] = scenario_id
      return data

    except Exception as e:
      print(f"⚠️ [SandboxEngine] Gemini recovery path failed ({e}). Using fallback...")
      recovery_months_base = 8 + len(crises) * 4
      return {
        "crises": crises,
        "scenarioId": scenario_id,
        "bestCase": {
          "trajectory": "Rapid Sovereign Stabilization",
          "probability": 20,
          "description": f"International aid mobilizes within 72 hours. Emergency reserve buffers activated. Combined {', '.join(crises)} crisis contained in {recovery_months_base} months through coordinated multilateral response.",
          "estimatedMonths": recovery_months_base
        },
        "expected": {
          "trajectory": "Managed Gradual Recovery",
          "probability": 55,
          "description": f"Standard emergency protocols activated. Moderate international support. Recovery from {', '.join(crises)} follows standard 18-24 month stabilization curve with periodic setbacks.",
          "estimatedMonths": recovery_months_base + 8
        },
        "worstCase": {
          "trajectory": "Cascading Sovereignty Failure",
          "probability": 25,
          "description": f"Inadequate initial response allows cascade amplification. {', '.join(crises)} compounds into institutional collapse requiring 3-4 year reconstruction with international oversight.",
          "estimatedMonths": recovery_months_base + 24
        },
        "overallRecommendation": f"Immediate activation of emergency reserves, multilateral coordination, and targeted support for lower-income populations are critical to preventing worst-case cascades from the {', '.join(crises)} combination."
      }

sandbox_engine = SandboxEngine()

