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

constitutional_layer = ConstitutionalLayer()
