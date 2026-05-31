import uuid
from typing import List, Dict, Any

class GenomeEngine:
  """
  Sovereignty Genome Engine
  Discovers and indexes structural civilizational traits determining resilience, fragility,
  institutional recovery, and societal adaptation.
  """
  def __init__(self):
    # Seed data representing Civilizational DNA
    self.genomes = {
      "US": {
        "country_code": "US",
        "nation_name": "United States of America",
        "overall_resilience_index": 0.82,
        "traits": [
          {
            "id": "REG-US-01",
            "name": "Decentralized Federalism",
            "category": "REG", # Resilience Gene
            "score": 0.88,
            "description": "Multi-layered authority buffers localized institutional shocks and allows regional policy experimentation during crises."
          },
          {
            "id": "FRS-US-02",
            "name": "Financial Leverage Vulnerability",
            "category": "FRS", # Fragility Signature
            "score": 0.72,
            "description": "Extreme reliance on consumer credit and capital market liquidity; highly sensitive to interest rate hikes and credit freezes."
          },
          {
            "id": "SAT-US-03",
            "name": "Rapid Technological Absorption",
            "category": "SAT", # Societal Adaptation
            "score": 0.90,
            "description": "Highly adaptive digital infrastructure enabling instant remote coordination, payment distribution, and algorithmic logistics."
          },
          {
            "id": "IRP-US-04",
            "name": "Dynamic Capital Allocation",
            "category": "IRP", # Institutional Recovery
            "score": 0.85,
            "description": "Highly responsive capital markets and Chapter 11 legal structures facilitate rapid asset restructuring post-crisis."
          }
        ]
      },
      "SG": {
        "country_code": "SG",
        "nation_name": "Singapore",
        "overall_resilience_index": 0.91,
        "traits": [
          {
            "id": "REG-SG-01",
            "name": "Strategic Sovereign Reserves",
            "category": "REG",
            "score": 0.98,
            "description": "Massive sovereign wealth assets buffer economic contraction, allowing multi-year safety net funding without borrowing."
          },
          {
            "id": "FRS-SG-02",
            "name": "Resource Import Dependency",
            "category": "FRS",
            "score": 0.85,
            "description": "Near total dependency on external supply chains for food, energy, and water; highly vulnerable to maritime blockade or global tariff wars."
          },
          {
            "id": "SAT-SG-03",
            "name": "High Institutional Trust",
            "category": "SAT",
            "score": 0.92,
            "description": "Societal cohesion and high trust in technocratic directives enable rapid compliance with pandemic curfews or resource rationing."
          },
          {
            "id": "IRP-SG-04",
            "name": "Agile State Planning",
            "category": "IRP",
            "score": 0.90,
            "description": "Strong centralized bureaucracy allows swift redirection of labor, supply chains, and emergency reserves within hours."
          }
        ]
      },
      "DE": {
        "country_code": "DE",
        "nation_name": "Germany",
        "overall_resilience_index": 0.79,
        "traits": [
          {
            "id": "REG-DE-01",
            "name": "Mittelstand Manufacturing Base",
            "category": "REG",
            "score": 0.85,
            "description": "Strong family-owned small-to-medium industrial enterprises provide stable employment and technological resilience."
          },
          {
            "id": "FRS-DE-02",
            "name": "Energy Grid Vulnerability",
            "category": "FRS",
            "score": 0.68,
            "description": "Dependence on external natural gas supplies and transition volatility in energy grids exposes heavy industry to price spikes."
          },
          {
            "id": "SAT-DE-03",
            "name": "Formalized Safety Nets",
            "category": "SAT",
            "score": 0.88,
            "description": "Excellent unemployment and short-work ('Kurzarbeit') frameworks prevent sudden socioeconomic drops during downturns."
          },
          {
            "id": "IRP-DE-04",
            "name": "Bureaucratic Standardization",
            "category": "IRP",
            "score": 0.74,
            "description": "Highly structured but slow-moving administrative systems; high procedural overhead limits rapid ad-hoc resource distribution."
          }
        ]
      }
    }

  def get_genome(self, country_code: str) -> Dict[str, Any]:
    """Get civilizational genome for a specific country, with dynamic auto-generation if not seeded."""
    code = country_code.upper()
    if code in self.genomes:
      return self.genomes[code]
    
    # Dynamic Genome synthesis using Geopolitical Genomics rules!
    print(f"🧬 Synthesizing a dynamic genome model for unknown region: {code}")
    resilience = 0.65
    return {
      "country_code": code,
      "nation_name": f"Synthetic Territory {code}",
      "overall_resilience_index": resilience,
      "traits": [
        {
          "id": f"REG-{code}-01",
          "name": "Localized Agricultural Commons",
          "category": "REG",
          "score": 0.70,
          "description": f"Decentralized local food cooperatives in {code} provide baseline caloric security during transport disruptions."
        },
        {
          "id": f"FRS-{code}-02",
          "name": "Infrastructure Concentration",
          "category": "FRS",
          "score": 0.75,
          "description": "Primary electrical and communications lines converge on a single mega-city hub, raising single-point-of-failure risks."
        },
        {
          "id": f"SAT-{code}-03",
          "name": "Informal Network Coordination",
          "category": "SAT",
          "score": 0.80,
          "description": "Robust community-led mutual aid groups coordinate panic relief bypassing grid bottlenecks."
        },
        {
          "id": f"IRP-{code}-04",
          "name": "Debt Restructuring Headwinds",
          "category": "IRP",
          "score": 0.55,
          "description": "High foreign-denominated debt hinders quick credit recovery following fiscal crises."
        }
      ]
    }

  def search_traits(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search civilizational genomes for matches against a semantic/keyword query.
    Calculates query match coefficients based on text descriptions.
    """
    query_lower = query.lower()
    matches = []

    # Simple TF-IDF/semantic simulator for matching query keywords to descriptions
    keywords = query_lower.split()
    
    for nation_code, genome in self.genomes.items():
      match_score = 0.0
      matched_traits = []
      
      # Boost based on generic country matches
      if query_lower in genome["nation_name"].lower() or query_lower in nation_code.lower():
        match_score += 0.5
        
      for trait in genome["traits"]:
        score = 0.0
        desc = trait["description"].lower()
        name = trait["name"].lower()
        
        for word in keywords:
          if word in desc:
            score += 0.3
          if word in name:
            score += 0.4
            
        if score > 0.0:
          match_score += score
          matched_traits.append(trait)
          
      if match_score > 0.0 or query_lower == "all" or not keywords:
        # If query is very general, give a default base score
        final_score = max(match_score, 0.1)
        matches.append((final_score, genome))
        
    # Sort by match score descending
    matches.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in matches[:limit]]

genome_engine = GenomeEngine()
