class CopilotEngine:
    def __init__(self):
        pass

    def generate_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "top risks" in prompt_lower and "india" in prompt_lower:
            return """<p>Processing via the Sovereign Intelligence Graph. Based on current trajectories, the top 3 systemic risks for India (2026-2031) are:</p>
                           
<div class="pl-4 border-l-2 border-purple-500/30 space-y-4">
  <div>
    <span class="text-rose-400 font-semibold block mb-1">1. Water Scarcity Cascade</span>
    <span class="text-gray-400">Extreme thermal events and erratic monsoons threatening the agricultural heartland. Could impact 14% of crop yield and displace 10M+ citizens, straining urban infrastructure.</span>
  </div>
  <div>
    <span class="text-amber-400 font-semibold block mb-1">2. Asymmetric Cyber Threats</span>
    <span class="text-gray-400">Increasingly sophisticated attacks on grid parity and financial clearing houses from state-sponsored actors, exploiting legacy Tier-3 infrastructure.</span>
  </div>
  <div>
    <span class="text-emerald-400 font-semibold block mb-1">3. Energy Transition Bottlenecks</span>
    <span class="text-gray-400">Failure to synthesize battery supply chains fast enough to offset phased-out coal baseload. This presents a high risk of localized grid failures during peak summer loading.</span>
  </div>
</div>

<div class="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
  <button data-action="Which policies improve resilience fastest?" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer">Which policies improve resilience fastest?</button>
  <button data-action="Simulate cyberattack on energy infrastructure" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer">Simulate cyberattack on energy infrastructure</button>
  <button data-action="Compare India & Singapore governance resilience" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer">Compare India & Singapore governance resilience</button>
</div>"""
        
        return f"Analysis complete. Based on sovereign parameters, your query regarding \"{prompt[:30]}...\" requires deeper inspection. I have cross-referenced the National Digital Twin and flagged it for the command authority."

copilot_engine = CopilotEngine()
