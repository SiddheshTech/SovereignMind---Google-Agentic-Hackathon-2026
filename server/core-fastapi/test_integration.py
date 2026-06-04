import asyncio
import os
import sys

# Add current path to sys.path so app modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.dataset_manager import dataset_manager
from app.services.genome_engine import genome_engine
from app.services.constitutional_layer import constitutional_layer
from app.services.procurement_autopilot import procurement_autopilot

async def test_integrations():
    print("[TEST] Preloading real datasets...")
    dataset_manager.preload_data()
    
    print("\n--- 1. Testing Sovereignty Genome Engine (US) ---")
    genome = genome_engine.get_genome("US")
    print(f"Name: {genome['nation_name']}, Resilience: {genome['overall_resilience_index']}")
    print(f"Metrics Applied: {genome.get('dataset_metrics_applied')}")
    
    print("\n--- 2. Testing Constitutional AI Layer (DE) ---")
    audit = constitutional_layer.evaluate_action("DE", "Seize all communication masts", "Emergency response")
    print(f"Infraction Risk: {audit['infraction_risk_score']} | V-Dem Civil Liberty Context: {audit['vdem_civil_liberty_index_used']}")
    print(f"Auth: {audit['is_authorized']}")
    
    print("\n--- 3. Testing Emergency Contracting Autopilot (SG) ---")
    po = procurement_autopilot.source_and_draft("SG", "Water Purification", 5, "Typhoon crisis")
    print(f"Scaled PO length: {len(po['purchase_order_draft_markdown'])} chars. Success: {po['success']}")
    
if __name__ == "__main__":
    asyncio.run(test_integrations())
