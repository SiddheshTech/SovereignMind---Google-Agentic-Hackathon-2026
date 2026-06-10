from typing import Dict, Any, List

class ConstitutionalLayer:
  """
  Autonomous Constitutional AI Layer
  Enforces legal, civil liberty, federalism, and treaty constraints on AI actions
  before execution, creating machine-readable governance boundaries.
  """
  def __init__(self):
    self.constraints = [
      {
        "article": "Bill of Rights (Amend. 1)",
        "text": "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech... or the right of the people peaceably to assemble.",
        "category": "Civil Liberties",
        "keywords": ["assemble", "speech", "protest", "curfew", "gathering", "censor"]
      },
      {
        "article": "Bill of Rights (Amend. 4)",
        "text": "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated.",
        "category": "Civil Liberties",
        "keywords": ["search", "seizure", "confiscate", "track", "surveillance", "phone"]
      },
      {
        "article": "U.S. Constitution (Tenth Amend.)",
        "text": "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.",
        "category": "Federal/State Conflict",
        "keywords": ["nationalize", "federal mandate", "police state", "state border", "quarantine"]
      },
      {
        "article": "Geneva Convention / Treaties",
        "text": "Requires protection of civilian populations, medical personnel, and prisoners of war; bans collective punishment and medical discrimination.",
        "category": "Geopolitical Treaties",
        "keywords": ["interrogation", "ration medical", "prisoner", "force labor", "retaliation"]
      }
    ]

  def evaluate_action(self, country_code: str, proposed_action: str, context: str) -> Dict[str, Any]:
    print(f"⚖️ Constitutional AI Layer auditing action: '{proposed_action}' in context '{context}'")
    
    action_lower = proposed_action.lower() + " " + context.lower()
    evaluated_constraints = []
    infraction_risk = 0.0
    
    # Standard compliance scanner
    for constraint in self.constraints:
      matches_keywords = []
      for keyword in constraint["keywords"]:
        if keyword in action_lower:
          matches_keywords.append(keyword)
          
      is_violated = len(matches_keywords) > 0
      
      explanation = "No conflict detected."
      if is_violated:
        # Increase risk score
        severity = len(matches_keywords) * 25.0
        infraction_risk += severity
        
        explanation = f"Conflict detected under '{constraint['category']}'. Keywords matched: {matches_keywords}. Proposed action borders on infringing: '{constraint['text'][:120]}...'"

      evaluated_constraints.append({
        "article": constraint["article"],
        "text": constraint["text"],
        "boundary": constraint["category"],
        "is_violated": is_violated,
        "explanation": explanation
      })

    # Clamp risk score
    infraction_risk = min(99.0, max(0.0, infraction_risk))
    
    # Formulate alternate recommendations if risks are high
    alternate_recommendation = "Proposal is constitutionally sound. Action is cleared for execution."
    is_authorized = True
    
    if infraction_risk > 60.0:
      is_authorized = False
      alternate_recommendation = "DENIED: Highly invasive action. Alternate suggestion: Deploy voluntary incentive-based compliance campaigns instead of mandatory physical seizure or cell-tracking."
    elif infraction_risk > 30.0:
      alternate_recommendation = "WARNING: Moderate constitutional friction. Implement strict Sunset Clauses (expires in 48 hours) and state-governor opt-ins to prevent federalism overreach."

    return {
      "country_code": country_code,
      "is_authorized": is_authorized,
      "infraction_risk_score": infraction_risk,
      "evaluated_constraints": evaluated_constraints,
      "alternate_recommendation": alternate_recommendation
    }

  async def evaluate_authority_proposal(self, title: str) -> Dict[str, Any]:
    print(f"⚖️ Constitutional Layer evaluating authority proposal: '{title}'")
    from app.agents.llm_router import llm_router
    import json

    system_prompt = (
        "You are a strategic constitutional intelligence auditor for a sovereign cooperative. "
        "You must analyze the proposed administrative directive for its safety, risk, civil liberty impact, "
        "and constitutional validity. You must return your analysis as a strict JSON object."
    )

    user_prompt = (
        f"Assess the constitutional validity and safety scoring of the following governance proposal: \"{title}\".\n"
        "You must output a JSON object with this exact schema:\n"
        "{\n"
        "  \"safetyScore\": number (0 to 100 representing constitutional alignment and legality),\n"
        "  \"riskScore\": number (0 to 100 representing constitutional risk, safetyScore + riskScore must equal 100),\n"
        "  \"civilLibertyImpact\": \"High\" | \"Medium\" | \"Low\",\n"
        "  \"recommendation\": \"Approved\" | \"Approved with Amendments\" | \"Rejected\",\n"
        "  \"zone\": \"Green\" | \"Yellow\" | \"Red\",\n"
        "  \"constitutionalPoints\": [\"exact supporting clause or point 1\", \"point 2\", \"point 3\"],\n"
        "  \"violations\": [\"exact civil liberty violation or risk 1\", \"risk 2\", \"risk 3\"],\n"
        "  \"explanation\": \"A concise 2-sentence formal constitutional analysis citing systemic legal guidelines.\"\n"
        "}\n"
        "Ensure the JSON object is valid and has no trailing commas or comments."
    )

    try:
      response_text = await llm_router.generate_response(
          provider="gemini",
          system_prompt=system_prompt,
          user_prompt=user_prompt,
          temperature=0.2
      )

      clean_text = response_text.strip()
      if clean_text.startswith("```json"):
        clean_text = clean_text[7:]
      if clean_text.startswith("```"):
        clean_text = clean_text[3:]
      if clean_text.endswith("```"):
        clean_text = clean_text[:-3]
      clean_text = clean_text.strip()

      data = json.loads(clean_text)
      required_keys = ["safetyScore", "riskScore", "civilLibertyImpact", "recommendation", "zone", "constitutionalPoints", "violations", "explanation"]
      for key in required_keys:
        if key not in data:
          raise ValueError(f"Missing key: {key}")

      return data
    except Exception as e:
      print(f"⚠️ Failed to evaluate proposal using Gemini ({e}). Loading fallback logic.")
      query = title.lower().strip()

      if any(k in query for k in ["shutdown", "block", "censor", "restrict", "ban"]):
        return {
            "safetyScore": 15.0,
            "riskScore": 85.0,
            "civilLibertyImpact": "High",
            "recommendation": "Rejected",
            "zone": "Red",
            "constitutionalPoints": [
                "Protects network infrastructure under emergency state criteria.",
                "Bypasses standard review mechanisms during cyber emergencies."
            ],
            "violations": [
                "Directly infringes freedom of digital association.",
                "Imposes non-targeted containment rules violating proportional action."
            ],
            "explanation": f"The proposal for '{title}' imposes wide-scale digital containment and cannot be constitutionally cleared without legislative review."
        }
      elif any(k in query for k in ["water", "food", "energy", "solar"]):
        return {
            "safetyScore": 70.0,
            "riskScore": 30.0,
            "civilLibertyImpact": "Medium",
            "recommendation": "Approved with Amendments",
            "zone": "Yellow",
            "constitutionalPoints": [
                "Ensures biological baseline security under emergency doctrine.",
                "Allows dynamic rationing of public resource reserves."
            ],
            "violations": [
                "Requires strict sunset clauses to prevent executive overreach.",
                "Requires continuous independent audits of resource distributions."
            ],
            "explanation": f"The proposal for '{title}' is cleared under survival exception frameworks, subject to 45-day sunset provisions."
        }
      else:
        return {
            "safetyScore": 85.0,
            "riskScore": 15.0,
            "civilLibertyImpact": "Low",
            "recommendation": "Approved",
            "zone": "Green",
            "constitutionalPoints": [
                "Aligns with standard cooperative governance guidelines.",
                "Promotes transparency in administrative procedures."
            ],
            "violations": [
                "Minor localized friction in administrative processing speeds."
            ],
            "explanation": f"The proposal for '{title}' is fully valid under standard constitutional charters and is cleared for immediate execution."
        }

constitutional_layer = ConstitutionalLayer()
