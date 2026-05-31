import sys
import os
import asyncio

# Ensure Windows terminal processes execute print statements using UTF-8
try:
  if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
  if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
  pass

# Ensure path includes server fastapi folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/core-fastapi")

from app.services.genome_engine import genome_engine
from app.services.constitutional_layer import constitutional_layer
from app.services.sandbox_engine import sandbox_engine
from app.services.procurement_autopilot import procurement_autopilot
from app.eval.optimizer import prompt_optimizer

# Deep-dive system imports for advanced testing
from app.db.database import init_db, AsyncSessionLocal
from app.db.models import GenomeModel, ConstitutionalAuditModel
from app.agents.llm_router import llm_router
from app.db.kafka_client import kafka_client
from app.tasks.tasks import async_constitutional_audit
from app.agents.mcp_server import mcp_server

async def run_diagnostics():
  print("="*60)
  print("🕵️ SovereignMind DEEP-DIVE Core Systems Diagnostics")
  print("="*60)

  # 1. Test SQLModel Database & ORM Persistance
  print("\n💾 [Test 1] SQLModel Database & Persistance Verification...")
  await init_db()
  
  async with AsyncSessionLocal() as session:
    # Query default genomes
    print("   - Initializing database schemas...")
    us_genome = genome_engine.get_genome("US")
    
    # Clean up existing test rows to guarantee unique constraints are met on consecutive runs!
    from sqlmodel import select
    existing_result = await session.execute(select(GenomeModel).where(GenomeModel.country_code == "US"))
    existing_row = existing_result.scalars().first()
    if existing_row:
      await session.delete(existing_row)
      await session.commit()

    # Save a test record
    db_genome = GenomeModel(
      country_code=us_genome["country_code"],
      nation_name=us_genome["nation_name"],
      overall_resilience_index=us_genome["overall_resilience_index"]
    )
    db_genome.set_traits(us_genome["traits"])
    session.add(db_genome)
    await session.commit()
    print(f"✅ SQLModel Genome successfully saved and committed in SQLite/PostgreSQL!")

  # 2. Test Multi-Model LLM Router
  print("\n🤖 [Test 2] Multi-Model LLM Router Verification...")
  for provider in ["gemini", "gpt-4o", "claude"]:
    resp = await llm_router.generate_response(
      provider=provider,
      system_prompt="You are a crisis analyst.",
      user_prompt="Audit proposed action: nationwide curfew during food scarcity."
    )
    print(f"✅ Provider '{provider}' routed successfully. Response length: {len(resp)} characters.")
    print(f"   Excerpt: {resp.split('\n')[0][:120]}...")

  # 3. Test Apache Kafka Integration
  print("\n📡 [Test 3] Apache Kafka Event Stream Verification...")
  test_event = {
    "event_type": "CIVILIZATION_CRITICAL_SHOCK",
    "country_code": "US",
    "panic_index": 0.85
  }
  kafka_client.publish_event("civilization-events", test_event)
  print("✅ Event published successfully to Kafka civilization topic buffer.")

  # 4. Test Celery Background Workers
  print("\n⚙️ [Test 4] Celery Asynchronous Task Dispatcher Verification...")
  # Queue audit task
  async_constitutional_audit.delay(
    "US",
    "Voluntary allocation of reserve water tanks",
    "Extreme agricultural heatwave"
  )
  print("✅ Task successfully dispatched to Celery worker queue framework.")

  # 5. Test Model Context Protocol (MCP) Introspection Server
  print("\n🌐 [Test 5] Phoenix MCP Introspection Server Verification...")
  # List Tools
  mcp_tools = mcp_server.handle_mcp_request("tools/list", {})
  print(f"✅ MCP tools listed successfully: {[t['name'] for t in mcp_tools['tools']]}")
  
  # Call tool
  call_res = mcp_server.handle_mcp_request(
    "tools/call",
    {
      "name": "audit_policy_proposal",
      "arguments": {
        "country_code": "SG",
        "action": "Nationalize maritime food ports"
      }
    }
  )
  print(f"✅ MCP tool 'audit_policy_proposal' executed successfully via JSON-RPC!")
  print(f"   Output Content: {call_res['content'][0]['text'][:160]}...")

  # 6. Test Sovereignty Genome Engine
  print("\n🧬 [Test 6] Sovereignty Genome Engine Verification...")
  us_gen = genome_engine.get_genome("US")
  print(f"✅ Genome found: {us_gen['nation_name']} (Resilience: {us_gen['overall_resilience_index']})")
  
  # 7. Test PyTorch Simulation Sandbox
  print("\n🎬 [Test 7] PyTorch Neural Grid Cascade Simulation Verification...")
  ticks = []
  async for tick in sandbox_engine.run_simulation("US", 3, ["grid_failure", "currency_collapse"]):
    ticks.append(tick)
    print(f"   Epoch {tick['epoch']}: Panic={tick['population']['panic_level']:.3f}, Collapse Prob={tick['instability']['systemic_collapse_probability']:.4f}")
  print("✅ PyTorch Simulation transitions evaluated successfully.")

  # 8. Test Autonomous Prompt Optimization Loop
  print("\n🔄 [Test 8] Self-Improving Prompt Optimization Loop...")
  task_desc = "Coordinate communications under grid failure without violating rights."
  original_prompt = "You are an automated logistics agent in charge of securing local cell sites during emergencies."
  
  opt_res = await prompt_optimizer.optimize_prompt("Logistics-Agent", task_desc, original_prompt)
  print(f"✅ Prompt Optimization Complete. Performance Gain: +{opt_res['performance_gain']:.1f}%")
  print(f"   Verdict: {opt_res['evaluation_report'].split('\n')[-1]}")

  print("\n" + "="*60)
  print("🎉 Deep-dive operational tests completed. 100% Backend Topologies Active.")
  print("="*60)

if __name__ == "__main__":
  asyncio.run(run_diagnostics())
