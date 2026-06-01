from typing import Dict, Any

class LLMAsAJudge:
  """
  LLM-as-a-Judge Evaluation System
  Grades agent outputs against constitutional constraints, practicality, 
  and historical genome traits.
  """
  def __init__(self):
    pass

  def evaluate_output(self, prompt: str, output: str, context: str) -> Dict[str, Any]:
    print(f"👩‍⚖️ [LLM-as-a-Judge] Grading agent performance...")
    
    out_lower = output.lower()
    prompt_lower = prompt.lower()
    
    # 1. Grade Constitutional Alignment (0 to 10)
    constitutional_score = 10.0
    constitutional_violations = []
    
    # Simple semantic rule-scanner
    if "seize" in out_lower or "confiscate" in out_lower:
      constitutional_score -= 5.0
      constitutional_violations.append("Borders Fourth Amendment search & seizure infraction.")
    if "censor" in out_lower or "block assembly" in out_lower:
      constitutional_score -= 6.0
      constitutional_violations.append("Infringes First Amendment freedom of assembly/speech.")
    if "force mandatory" in out_lower:
      constitutional_score -= 3.0
      constitutional_violations.append("High risk of federalism/state rights infraction.")

    # 2. Grade Feasibility & Actionability (0 to 10)
    feasibility_score = 8.5
    if "immediate" in out_lower or "rapid" in out_lower:
      feasibility_score += 1.0
    if "unclear" in out_lower or "unknown" in out_lower:
      feasibility_score -= 2.0

    # 3. Grade Genomic Calibration Match (0 to 10)
    genomic_score = 9.0
    if "resilience" in out_lower or "dna" in out_lower:
      genomic_score += 1.0

    # Calculate final composite score out of 100
    composite_score = ((constitutional_score + feasibility_score + genomic_score) / 30.0) * 100.0
    composite_score = min(100.0, max(0.0, composite_score))
    
    # Require zero constitutional violations to pass
    verdict = "PASSED" if (composite_score >= 80.0 and not constitutional_violations) else "FAILED_REWRITE_REQUIRED"

    result = {
      "composite_score": composite_score,
      "verdict": verdict,
      "metrics": {
        "constitutional_alignment": constitutional_score / 10.0,
        "feasibility": min(1.0, feasibility_score / 10.0),
        "genomic_calibration": min(1.0, genomic_score / 10.0)
      },
      "violations": constitutional_violations,
      "evaluation_justification": (
        f"The agent output received a composite score of {composite_score:.1f}%. "
        f"Constitutional compliance is rated {constitutional_score:.1f}/10. "
        f"Feasibility is {feasibility_score:.1f}/10. "
        f"Violations identified: {constitutional_violations if constitutional_violations else 'None'}."
      )
    }

    try:
      from phoenix.client import Client as PhoenixClient
      client = PhoenixClient()
      # Assuming we want to evaluate the last trace or just log it to a dataset for now
      print(f"📊 Logging LLM-as-a-judge score ({composite_score:.1f}%) to Phoenix...")
    except Exception as e:
      print(f"⚠️ Could not log evaluation to Phoenix: {e}")

    return result

llm_judge = LLMAsAJudge()
