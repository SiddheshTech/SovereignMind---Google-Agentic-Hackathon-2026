import asyncio
import os
import sys

# Add current path to sys.path so app modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.dataset_manager import dataset_manager
from app.agents.crew_workflow import crew_workflow_manager

async def test_agents():
    print("🚀 [TEST] Loading dataset baselines...")
    dataset_manager.preload_data()
    
    print("\n--- Testing CrewAI Autonomous Agents (Gemini) ---")
    res = await crew_workflow_manager.run_emergency_contract_crew(
        country_code="US",
        item_needed="Emergency Tents and Field Hospitals",
        quantity=5,
        urgent_reason="Category 5 Hurricane making landfall."
    )
    
    print("\n--- Final Agent Consensus ---")
    print(res.get("agent_consensus"))
    
    print("\n--- Drafted PO Summary ---")
    print(res.get("purchase_order")[:250] + "...\n")
    
if __name__ == "__main__":
    asyncio.run(test_agents())
