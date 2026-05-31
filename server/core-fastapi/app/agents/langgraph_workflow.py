from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from app.services.constitutional_layer import constitutional_layer
from app.services.procurement_autopilot import procurement_autopilot
from app.agents.gemini_agents import constitutional_adjudicator, geopolitical_analyst

# Define State Schema
class CrisisState(TypedDict):
  proposed_action: str
  country_code: str
  active_crises: List[str]
  constitutional_score: float
  evaluation_report: str
  procurement_draft: str
  is_cleared: bool

# Define Nodes
async def constitutional_audit_node(state: CrisisState) -> Dict[str, Any]:
  print("🕸️ [LangGraph] Node: Constitutional Audit")
  # Audit the proposed action using constitutional layer
  audit = constitutional_layer.evaluate_action(
    state["country_code"],
    state["proposed_action"],
    ", ".join(state["active_crises"])
  )
  
  # Run Gemini agent for a rich narrative review
  agent_review = await constitutional_adjudicator.execute(
    f"Audit this action: {state['proposed_action']}. Context score: {audit['infraction_risk_score']}"
  )
  
  return {
    "constitutional_score": audit["infraction_risk_score"],
    "evaluation_report": f"Risk Score: {audit['infraction_risk_score']}\n{agent_review}",
    "is_cleared": audit["is_authorized"]
  }

async def geopolitical_analysis_node(state: CrisisState) -> Dict[str, Any]:
  print("🕸️ [LangGraph] Node: Geopolitical DNA Analysis")
  # Map traits using Geopolitical Strategist
  review = await geopolitical_analyst.execute(
    f"State: {state['country_code']}. Crises: {state['active_crises']}. Action: {state['proposed_action']}"
  )
  
  # Append to evaluation report
  report = state["evaluation_report"] + f"\n\n### Geopolitical Vulnerability Review\n{review}"
  return {
    "evaluation_report": report
  }

async def procurement_drafting_node(state: CrisisState) -> Dict[str, Any]:
  print("🕸️ [LangGraph] Node: Procurement Drafting Autopilot")
  # Draft contracting packets based on proposed action keyword
  action_lower = state["proposed_action"].lower()
  
  item = "Emergency General Logistics"
  qty = 1000
  reason = f"Crisis mitigation for {state['country_code']}"
  
  if "medical" in action_lower or "ventilator" in action_lower:
    item = "Mechanical Ventilators"
    qty = 250
  elif "water" in action_lower or "purify" in action_lower:
    item = "Water Purification Tablets"
    qty = 100000
  elif "shelter" in action_lower or "tents" in action_lower:
    item = "Mobile Shelters"
    qty = 500
    
  draft = procurement_autopilot.source_and_draft(item, qty, reason)
  
  return {
    "procurement_draft": draft.get("purchase_order_draft_markdown", "No procurement triggered.")
  }

# Route Decider
def route_post_audit(state: CrisisState) -> str:
  if state["is_cleared"]:
    return "geopolitical_analysis"
  return "procurement_drafting" # Denied actions route to alternative procurement sourcing

# Build the Graph
workflow = StateGraph(CrisisState)

# Add Nodes
workflow.add_node("constitutional_audit", constitutional_audit_node)
workflow.add_node("geopolitical_analysis", geopolitical_analysis_node)
workflow.add_node("procurement_drafting", procurement_drafting_node)

# Set Entry
workflow.set_entry_point("constitutional_audit")

# Set Conditional Edges
workflow.add_conditional_edges(
  "constitutional_audit",
  route_post_audit,
  {
    "geopolitical_analysis": "geopolitical_analysis",
    "procurement_drafting": "procurement_drafting"
  }
)

# Connect Rest
workflow.add_edge("geopolitical_analysis", END)
workflow.add_edge("procurement_drafting", END)

# Compile Workflow Graph
langgraph_app = workflow.compile()

async def run_langgraph_sandbox_flow(country_code: str, proposed_action: str, active_crises: List[str]) -> Dict[str, Any]:
  initial_state = {
    "proposed_action": proposed_action,
    "country_code": country_code,
    "active_crises": active_crises,
    "constitutional_score": 0.0,
    "evaluation_report": "",
    "procurement_draft": "",
    "is_cleared": True
  }
  
  print(f"🚀 Launching LangGraph sandbox pipeline for {country_code}...")
  return await langgraph_app.ainvoke(initial_state)
