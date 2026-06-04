import os
from typing import Dict, Any
from app.services.procurement_autopilot import procurement_autopilot
from app.agents.llm_router import llm_router

class CrewWorkflowManager:
  """
  Autonomous Multi-Agent Workflow Manager
  Two specialized Gemini-powered agents — a Crisis Sourcing Specialist and a Constitutional
  Legal Auditor — autonomously debate and approve/deny emergency procurement in sequence.
  Uses the project's battle-tested llm_router (Gemini -> Groq -> Simulated fallback chain).
  """
  def __init__(self):
    print("✅ [Multi-Agent Crew] Autonomous agent crew initialized via LLM Router.")

  async def _call_agent(self, agent_role: str, agent_backstory: str, task: str) -> str:
    """Executes a single agent turn via llm_router's multi-provider pipeline."""
    system_prompt = (
        f"You are a highly specialized AI agent.\n"
        f"ROLE: {agent_role}\n"
        f"EXPERTISE: {agent_backstory}\n\n"
        f"Be concise, professional, and decisive."
    )
    return await llm_router.generate_response(
        provider="gemini",
        system_prompt=system_prompt,
        user_prompt=task,
        temperature=0.3
    )

  async def run_emergency_contract_crew(self, country_code: str, item_needed: str, quantity: int, urgent_reason: str) -> Dict[str, Any]:
    print(f"[Multi-Agent Crew] Assembling Emergency Procurement Crew for {country_code}: {item_needed}")
    
    # 1. Dataset-backed autopilot generates the real demographics-scaled PO
    autopilot_res = procurement_autopilot.source_and_draft(country_code, item_needed, quantity, urgent_reason)
    
    if not autopilot_res["success"]:
      return autopilot_res

    draft_po = autopilot_res["purchase_order_draft_markdown"]

    # 2. Agent 1: Crisis Sourcing Specialist — justifies the procurement
    print("[Agent 1/2] Crisis Sourcing Specialist reviewing the Purchase Order...")
    sourcing_memo = await self._call_agent(
      agent_role="Crisis Sourcing Specialist",
      agent_backstory=(
          "You negotiate crisis supply contracts under extreme time pressure. You review vendor "
          "histories, demographic scaling, and logistics feasibility to justify procurement decisions."
      ),
      task=(
          f"Review the following emergency purchase order drafted for a '{urgent_reason}':\n\n"
          f"{draft_po}\n\n"
          f"Write a short (3-5 sentence) JUSTIFICATION MEMO confirming the vendor selection and "
          f"quantity scaling are appropriate for the emergency."
      )
    )
    print(f"[Agent 1] Memo drafted ({len(sourcing_memo)} chars).")

    # 3. Agent 2: Constitutional Legal Auditor — reads the memo and issues a verdict
    print("[Agent 2/2] Constitutional Legal Auditor reviewing the memo...")
    legal_verdict = await self._call_agent(
      agent_role="Constitutional Legal Auditor",
      agent_backstory=(
          "You are an expert in emergency powers legislation, federal-state boundaries, and "
          "constitutional procurement law. You issue the final APPROVED or DENIED verdict "
          "on all crisis acquisitions."
      ),
      task=(
          f"Review this emergency procurement package for '{urgent_reason}'.\n\n"
          f"--- SOURCING SPECIALIST MEMO ---\n{sourcing_memo}\n\n"
          f"--- PURCHASE ORDER ---\n{draft_po}\n\n"
          f"Provide your FINAL VERDICT in exactly this format:\n"
          f"VERDICT: APPROVED or DENIED\n"
          f"LEGAL BASIS: [One sentence citing the relevant emergency powers principle]"
      )
    )
    print(f"[Agent 2] Verdict issued: {legal_verdict[:100]}...")

    full_consensus = (
        f"=== SOURCING SPECIALIST MEMO ===\n{sourcing_memo}\n\n"
        f"=== CONSTITUTIONAL AUDITOR VERDICT ===\n{legal_verdict}"
    )

    return {
      "crew_execution_status": "SUCCESSFUL",
      "agent_consensus": full_consensus,
      "sourcing_memo": sourcing_memo,
      "legal_verdict": legal_verdict,
      "matched_vendors": autopilot_res["matched_vendors"],
      "selected_vendor_id": autopilot_res["selected_vendor_id"],
      "purchase_order": draft_po,
      "compliance_packet": autopilot_res["legal_compliance_packet"]
    }

crew_workflow_manager = CrewWorkflowManager()
