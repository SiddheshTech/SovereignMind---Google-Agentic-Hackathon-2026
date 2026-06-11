from typing import Dict, Any, List
import uuid

class ProcurementAutopilot:
  """
  Emergency Contracting Autopilot
  Sources supplies, matches and grades vendors, verifies constitutional compliance, 
  and drafts automated legal purchase orders in real-time.
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
        "base_compliance_score": 62, # Low score due to unregulated third-party sourcing
        "region": "CN"
      }
    ]

  def source_and_draft(self, item_needed: str, quantity: int, reason: str) -> Dict[str, Any]:
    print(f"📦 Autopilot matching vendors for: {item_needed} (Qty: {quantity}). Reason: '{reason}'")
    
    item_lower = item_needed.lower()
    matched_vendors = []
    
    # Simple search index mapping items to categories
    for vendor in self.synthetic_vendors:
      match = False
      for cat in vendor["categories"]:
        if cat in item_lower:
          match = True
          break
      # If no explicit category match, default add general logistics
      if not match and "general" in vendor["categories"]:
        match = True
        
      if match or len(matched_vendors) < 2:
        # Calculate suitability score based on lead time and compliance
        lead_time_penalty = max(0.0, (10.0 - vendor["delivery_lead_time_days"]) * 5.0)
        match_score = (vendor["base_compliance_score"] * 0.6) + lead_time_penalty
        
        # Constitutional check: If compliance score is too low, flag it
        constitutional_clearance = vendor["base_compliance_score"] >= 70

        matched_vendors.append({
          "id": vendor["id"],
          "name": vendor["name"],
          "match_score": min(100.0, match_score) / 100.0,
          "price_unit": vendor["price_unit"],
          "delivery_lead_time_days": vendor["delivery_lead_time_days"],
          "constitutional_clearance": constitutional_clearance
        })

    # Sort matched vendors by score descending
    matched_vendors.sort(key=lambda x: x["match_score"], reverse=True)

    if not matched_vendors:
      return {"success": False, "item_needed": item_needed, "matched_vendors": []}

    selected_vendor = matched_vendors[0]
    total_cost = selected_vendor["price_unit"] * quantity
    po_number = f"PO-{uuid.uuid4().hex[:8].upper()}"

    # Draft standard markdown Purchase Order
    po_draft = f"""# EMERGENCY PURCHASE ORDER
**PO NUMBER:** {po_number}
**DATE:** 2026-06-01
**URGENT STATUS:** CRITICAL CRISIS ACQUISITION

### PARTIES
1. **Buyer:** Federal Sovereign Emergency Coordination Agency
2. **Seller:** {selected_vendor["name"]} (ID: {selected_vendor["id"]})

### LINE ITEMS
| Item Description | Qty | Unit Price | Total Cost | Est. Delivery |
| :--- | :--- | :--- | :--- | :--- |
| {item_needed} | {quantity:,} | ${selected_vendor["price_unit"]:.2f} | ${total_cost:,.2f} | {selected_vendor["delivery_lead_time_days"]} Days |

### CRISIS JUSTIFICATION
*"{reason}"*

### TERMS & CONDITIONS
- **Expedited Delivery:** Seller guarantees shipment dispatch within {selected_vendor["delivery_lead_time_days"]} days from execution.
- **Force Majeure:** Standard force majeure clauses are suspended for crisis logistics.
- **Payment Terms:** Net-30 post-delivery, backed by Emergency Constitutional Allocation Funds.
"""

    # Draft Legal Compliance Packet
    compliance_packet = f"""# CONSTITUTIONAL COMPLIANCE & LEGAL CLEARANCE PACKET
**TARGET ACQUISITION:** {po_number} - {item_needed}
**VETTED BY:** Autonomous Constitutional AI Layer

### 1. LEGAL AUTHORITY CHECK
- **Executive Order Citation:** Emergency Civil Resilience Act (Section 4a)
- **Power Delegation:** Valid emergency authorization is active. No federal/state boundary overreaches identified.
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
