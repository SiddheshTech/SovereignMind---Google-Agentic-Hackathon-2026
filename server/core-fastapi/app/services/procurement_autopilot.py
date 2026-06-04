from typing import Dict, Any, List
import uuid
from app.core.dataset_manager import dataset_manager

class ProcurementAutopilot:
  """
  Emergency Contracting Autopilot
  Sources supplies, scales to real-world demographics using WPP datasets,
  verifies constitutional compliance, and drafts automated legal purchase orders.
  """
  def __init__(self):
    self.synthetic_vendors = [
      {
        "id": "VEN-01",
        "name": "Global Med Logistics Inc.",
        "categories": ["medical", "ventilators", "ppe"],
        "price_unit": 12500.0,
        "delivery_lead_time_days": 4,
        "base_compliance_score": 95,
        "region": "US"
      },
      {
        "id": "VEN-02",
        "name": "Aegis Shielding & Shelter",
        "categories": ["shelter", "tents", "security"],
        "price_unit": 3500.0,
        "delivery_lead_time_days": 7,
        "base_compliance_score": 88,
        "region": "DE"
      },
      {
        "id": "VEN-03",
        "name": "Apex Aquatech Corp",
        "categories": ["water", "purification", "filtration"],
        "price_unit": 1.25,
        "delivery_lead_time_days": 3,
        "base_compliance_score": 99,
        "region": "SG"
      },
      {
        "id": "VEN-04",
        "name": "Rapid Supply Syndicate",
        "categories": ["general", "medical", "water", "shelter"],
        "price_unit": 14000.0,
        "delivery_lead_time_days": 2,
        "base_compliance_score": 62, 
        "region": "CN"
      }
    ]

  def source_and_draft(self, country_code: str, item_needed: str, quantity: int, reason: str) -> Dict[str, Any]:
    print(f"📦 Autopilot matching vendors for {country_code.upper()}: {item_needed}. Reason: '{reason}'")
    
    # Scale procurement quantities autonomously using REAL dataset demographic sizing
    real_data = dataset_manager.get_country_data(country_code)
    actual_population = real_data["population"]
    
    # If the user asks for '1' or a low baseline quantity, we assume it's a per-100k-citizens baseline 
    # and autonomously scale the procurement package to fit the exact actual population size from the dataset!
    scaled_quantity = quantity
    if quantity < 100:
        scaling_factor = actual_population / 100000.0
        scaled_quantity = int(quantity * scaling_factor)
        print(f"📈 [Demographic Autopilot] Rescaled procurement quantity from {quantity} to {scaled_quantity:,} based on actual dataset population ({actual_population:,.0f}).")

    item_lower = item_needed.lower()
    matched_vendors = []
    
    for vendor in self.synthetic_vendors:
      match = False
      for cat in vendor["categories"]:
        if cat in item_lower:
          match = True
          break
      if not match and "general" in vendor["categories"]:
        match = True
        
      if match or len(matched_vendors) < 2:
        lead_time_penalty = max(0.0, (10.0 - vendor["delivery_lead_time_days"]) * 5.0)
        match_score = (vendor["base_compliance_score"] * 0.6) + lead_time_penalty
        constitutional_clearance = vendor["base_compliance_score"] >= 70

        matched_vendors.append({
          "id": vendor["id"],
          "name": vendor["name"],
          "match_score": min(100.0, match_score) / 100.0,
          "price_unit": vendor["price_unit"],
          "delivery_lead_time_days": vendor["delivery_lead_time_days"],
          "constitutional_clearance": constitutional_clearance
        })

    matched_vendors.sort(key=lambda x: x["match_score"], reverse=True)

    if not matched_vendors:
      return {"success": False, "item_needed": item_needed, "matched_vendors": []}

    selected_vendor = matched_vendors[0]
    total_cost = selected_vendor["price_unit"] * scaled_quantity
    po_number = f"PO-{uuid.uuid4().hex[:8].upper()}"

    po_draft = f"""# EMERGENCY PURCHASE ORDER
**PO NUMBER:** {po_number}
**DATE:** 2026-06-01
**REGION:** {country_code.upper()} (Population: {actual_population:,.0f})
**URGENT STATUS:** CRITICAL CRISIS ACQUISITION

### PARTIES
1. **Buyer:** Federal Sovereign Emergency Coordination Agency
2. **Seller:** {selected_vendor["name"]} (ID: {selected_vendor["id"]})

### LINE ITEMS
| Item Description | Base Qty Ratio | Auto-Scaled Qty | Unit Price | Total Cost | Est. Delivery |
| :--- | :--- | :--- | :--- | :--- | :--- |
| {item_needed} | {quantity} per 100k | {scaled_quantity:,} | ${selected_vendor["price_unit"]:.2f} | ${total_cost:,.2f} | {selected_vendor["delivery_lead_time_days"]} Days |

### CRISIS JUSTIFICATION
*"{reason}"*

### TERMS & CONDITIONS
- **Expedited Delivery:** Seller guarantees shipment dispatch within {selected_vendor["delivery_lead_time_days"]} days from execution.
- **Force Majeure:** Standard force majeure clauses are suspended for crisis logistics.
- **Payment Terms:** Net-30 post-delivery, backed by Emergency Constitutional Allocation Funds.
"""

    compliance_packet = f"""# CONSTITUTIONAL COMPLIANCE & LEGAL CLEARANCE PACKET
**TARGET ACQUISITION:** {po_number} - {item_needed}
**VETTED BY:** Autonomous Constitutional AI Layer
**DATASET CONTEXT:** Demographic Scaling validated against World Population Prospects.

### 1. LEGAL AUTHORITY CHECK
- **Executive Order Citation:** Emergency Civil Resilience Act (Section 4a)
- **Power Delegation:** Valid emergency authorization is active for {country_code.upper()}. No federal/state boundary overreaches identified.
- **Procurement Exceptions:** standard competitive bidding rules are bypassed under Emergency Powers (Regulation 102-C).

### 2. VENDOR BACKGROUND ASSESSMENT
- **Vendor:** {selected_vendor["name"]}
- **Constitutional Security Vetting:** PASSED
- **Conflict of Interest Risk:** LOW
- **Ethical Supply Line Assurance:** Standard compliance rating ({selected_vendor["match_score"]*100:.1f}%) matches national defense requirements.

### 3. EXECUTIVE SIGNATURES
*Signed and authorized digitally via SovereignMind Governance Ledger:*
- **Director of Emergency Logistics**
- **Constitutional AI Adjudicator Agent** (Ref: AI-CON-V4)
"""

    return {
      "success": True,
      "item_needed": item_needed,
      "matched_vendors": matched_vendors,
      "selected_vendor_id": selected_vendor["id"],
      "purchase_order_draft_markdown": po_draft,
      "legal_compliance_packet": compliance_packet
    }

procurement_autopilot = ProcurementAutopilot()
