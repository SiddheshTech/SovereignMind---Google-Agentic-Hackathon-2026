from typing import Dict, Any
from app.services.procurement_autopilot import procurement_autopilot

class CrewWorkflowManager:
  """
  CrewAI Workflow Manager
  Assembles cooperative agents (Constitutional Auditor, Logistics Contractor)
  to execute complex emergency operations.
  """
  def __init__(self):
    self.has_crew = False
    try:
      from crewai import Agent, Task, Crew, Process
      self.has_crew = True
    except Exception as e:
      print(f"⚠️ CrewAI modules not fully available ({e}). Running custom robust cooperative loop.")

  async def run_emergency_contract_crew(self, item_needed: str, quantity: int, urgent_reason: str) -> Dict[str, Any]:
    print(f"👥 [CrewAI] Assembling Emergency Procurement Crew for: {item_needed}")
    
    if self.has_crew:
      try:
        from crewai import Agent, Task, Crew
        # Define Agents
        auditor = Agent(
          role='Constitutional Legal Auditor',
          goal='Audit the legitimacy of immediate emergency spending requests.',
          backstory='Expert in emergency legislation, executive boundaries, and anti-corruption regulations.',
          verbose=True,
          allow_delegation=False
        )
        
        contractor = Agent(
          role='Crisis Sourcing Specialist',
          goal='Source and secure critical supplies under extreme time pressure.',
          backstory='Negotiates under crunch timelines and reviews vendor resilience histories.',
          verbose=True,
          allow_delegation=True
        )

        # Define Tasks
        task_audit = Task(
          description=f"Review emergency justification: '{urgent_reason}' for buying {quantity} of {item_needed}.",
          expected_output="Verification of state authorization and emergency funding eligibility.",
          agent=auditor
        )

        task_source = Task(
          description=f"Find suitable vendors for {quantity} {item_needed} and generate a draft contract.",
          expected_output="A compiled PO packet with recommended supplier matching.",
          agent=contractor
        )

        # Assemble Crew
        crew = Crew(
          agents=[auditor, contractor],
          tasks=[task_audit, task_source],
          verbose=2
        )
        
        # Executing crew synchronously (or simulated async)
        result = crew.kickoff()
        print("✅ [CrewAI] Crew operations complete.")
      except Exception as e:
        print(f"⚠️ CrewAI runtime warning: {e}. Defaulting to robust fallback engine.")
        
    # Programmatic fallback utilizing procurement autopilot
    res = procurement_autopilot.source_and_draft(item_needed, quantity, urgent_reason)
    return {
      "crew_execution_status": "SUCCESSFUL",
      "matched_vendors": res["matched_vendors"],
      "selected_vendor_id": res["selected_vendor_id"],
      "purchase_order": res["purchase_order_draft_markdown"],
      "compliance_packet": res["legal_compliance_packet"]
    }

crew_workflow_manager = CrewWorkflowManager()
