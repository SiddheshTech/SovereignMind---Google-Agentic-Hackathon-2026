import asyncio
from app.tasks.celery_app import celery_app, has_celery, task_decorator
from app.services.constitutional_layer import constitutional_layer
from app.services.procurement_autopilot import procurement_autopilot
from app.services.sandbox_engine import sandbox_engine
from app.eval.optimizer import prompt_optimizer
from app.db.models import ConstitutionalAuditModel, EmergencyContractModel, SandboxSimulationModel, PromptOptimizationModel
from app.db.database import AsyncSessionLocal
import json

# Decorator definition based on Celery availability
def make_task(func):
  if has_celery and celery_app:
    return celery_app.task(func)
  return task_decorator(func)

def execute_async(coro):
  """
  Defensive Async Coroutine Runner
  Checks if an event loop is already running. If so, schedules the task 
  within the current loop. Otherwise, spins up a new loop to prevent 
  'asyncio.run() cannot be called from a running event loop' RuntimeErrors.
  """
  try:
    loop = asyncio.get_running_loop()
    if loop.is_running():
      loop.create_task(coro)
      return
  except RuntimeError:
    pass
  
  asyncio.run(coro)

@make_task
def async_constitutional_audit(country_code: str, proposed_action: str, context: str):
  """Asynchronously audits policy proposal and saves results to DB."""
  print(f"⚙️ [Celery Worker] Starting audit task for {country_code}...")
  
  res = constitutional_layer.evaluate_action(country_code, proposed_action, context)
  
  async def save_to_db():
    async with AsyncSessionLocal() as session:
      audit_record = ConstitutionalAuditModel(
        country_code=res["country_code"],
        proposed_action=proposed_action,
        context=context,
        is_authorized=res["is_authorized"],
        infraction_risk_score=res["infraction_risk_score"],
        alternate_recommendation=res["alternate_recommendation"]
      )
      audit_record.set_constraints(res["evaluated_constraints"])
      session.add(audit_record)
      await session.commit()
      print("✅ [Celery DB Engine] Constitutional audit successfully saved.")
      
  execute_async(save_to_db())

@make_task
def async_emergency_procurement(item_needed: str, quantity_required: int, urgent_reason: str):
  """Asynchronously processes emergency contracting log."""
  print(f"⚙️ [Celery Worker] Processing sourcing task for: {item_needed}...")
  
  res = procurement_autopilot.source_and_draft(item_needed, quantity_required, urgent_reason)
  
  async def save_to_db():
    async with AsyncSessionLocal() as session:
      contract_record = EmergencyContractModel(
        item_needed=item_needed,
        quantity_required=quantity_required,
        urgent_reason=urgent_reason,
        success=res["success"],
        selected_vendor_id=res["selected_vendor_id"],
        purchase_order_draft=res["purchase_order_draft_markdown"],
        legal_compliance_packet=res["legal_compliance_packet"]
      )
      contract_record.set_vendors(res["matched_vendors"])
      session.add(contract_record)
      await session.commit()
      print("✅ [Celery DB Engine] Emergency contract PO successfully saved.")
      
  execute_async(save_to_db())

@make_task
def async_sandbox_run(country_code: str, epochs: int, active_crises_list: list):
  """Asynchronously executes sandbox epochs and saves complete trajectory."""
  print(f"⚙️ [Celery Worker] Orchestrating Sandbox run for {country_code} over {epochs} epochs...")
  
  ticks = []
  
  async def run_sim_loop():
    async for tick in sandbox_engine.run_simulation(country_code, epochs, active_crises_list):
      ticks.append(tick)
      
    async with AsyncSessionLocal() as session:
      sim_record = SandboxSimulationModel(
        country_code=country_code,
        epochs=epochs
      )
      sim_record.set_crises(active_crises_list)
      sim_record.set_ticks(ticks)
      session.add(sim_record)
      await session.commit()
      print("✅ [Celery DB Engine] Sandbox simulation run saved.")
      
  execute_async(run_sim_loop())
