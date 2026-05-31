from typing import Dict, Any, List
from app.services.constitutional_layer import constitutional_layer
from app.services.genome_engine import genome_engine

class SovereignMindMCPServer:
  """
  Phoenix MCP Runtime Introspection Server
  Implements the Model Context Protocol (MCP) enabling runtime inspection of
  prompts, agent state tools, and structural laws.
  """
  def __init__(self):
    self.tools = [
      {
        "name": "get_sandbox_state",
        "description": "Inspects PyTorch sandbox states, panic levels, and collapse vectors.",
        "input_schema": {
          "type": "object",
          "properties": {
            "country_code": {"type": "string"}
          },
          "required": ["country_code"]
        }
      },
      {
        "name": "audit_policy_proposal",
        "description": "Evaluates policy proposals against constitutional boundaries.",
        "input_schema": {
          "type": "object",
          "properties": {
            "country_code": {"type": "string"},
            "action": {"type": "string"}
          },
          "required": ["country_code", "action"]
        }
      }
    ]

    self.prompts = [
      {
        "name": "constitutional_adjudication",
        "description": "Enforce limits of authority and evaluate civil rights.",
        "arguments": [
          {"name": "action", "description": "Proposed emergency measure.", "required": True}
        ]
      }
    ]

  def handle_mcp_request(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
    print(f"📡 [MCP Protocol] Received JSON-RPC Request: Method='{method}'")
    
    if method == "tools/list":
      return {"tools": self.tools}
      
    elif method == "prompts/list":
      return {"prompts": self.prompts}
      
    elif method == "tools/call":
      tool_name = params.get("name")
      arguments = params.get("arguments", {})
      
      if tool_name == "get_sandbox_state":
        country = arguments.get("country_code", "US").upper()
        gen = genome_engine.get_genome(country)
        return {
          "content": [
            {
              "type": "text",
              "text": f"Sandbox Baseline calibrated. Resilience index: {gen['overall_resilience_index']:.2f}. "
                      f"Active genes: {[t['name'] for t in gen['traits']]}"
            }
          ]
        }
        
      elif tool_name == "audit_policy_proposal":
        country = arguments.get("country_code", "US")
        action = arguments.get("action", "")
        res = constitutional_layer.evaluate_action(country, action, "MCP Introspection context")
        return {
          "content": [
            {
              "type": "text",
              "text": f"Authorized={res['is_authorized']}, Infraction risk={res['infraction_risk_score']}%. "
                      f"Recommendation: {res['alternate_recommendation']}"
            }
          ]
        }
        
      return {"error": f"Tool '{tool_name}' not found."}
      
    elif method == "prompts/get":
      prompt_name = params.get("name")
      args = params.get("arguments", {})
      
      if prompt_name == "constitutional_adjudication":
        action = args.get("action", "")
        return {
          "description": "System Instruction for Adjudicator",
          "messages": [
            {
              "role": "user",
              "content": f"Review action: '{action}'. Verify First/Fourth Amendment compliance and provide a legal clearance score."
            }
          ]
        }
        
      return {"error": f"Prompt '{prompt_name}' not found."}

    return {"error": f"Method '{method}' not implemented."}

mcp_server = SovereignMindMCPServer()
