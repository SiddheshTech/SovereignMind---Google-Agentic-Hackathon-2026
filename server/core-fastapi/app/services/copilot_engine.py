from app.agents.llm_router import llm_router

class CopilotEngine:
    def __init__(self):
        pass

    async def generate_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        
        system_prompt = """You are the SovereignMind Executive Advisor, a highly advanced AI copilot for a global governance and resilience simulation platform.
Your primary role is to provide strategic analysis, identify systemic risks, and suggest containment protocols for the nation's leader.
You MUST format your output as valid semantic HTML.
Rules for HTML Formatting:
- DO NOT wrap the output in markdown code blocks like ```html. Just return raw HTML.
- Use Tailwind CSS classes for styling (e.g. text-rose-400, font-bold, text-gray-400).
- Wrap different paragraphs in <div> or <p> tags with appropriate padding/margin (e.g., class="space-y-4", class="mb-2").
- Use <ul> and <li> for lists.
- For emphasis on critical risks or actions, use colors like text-rose-400, text-emerald-400, text-amber-400.
- If you suggest actions, you can wrap them in nice button-like divs or simply present them clearly.
- Maintain a highly professional, authoritative, and analytical tone.
"""

        try:
            # We call the router specifying gemini (it will fallback appropriately if needed)
            res = await llm_router.generate_response(
                provider="gemini",
                system_prompt=system_prompt,
                user_prompt=prompt,
                temperature=0.4
            )
            
            # Clean up potential markdown formatting that the LLM might have added
            clean = res.strip()
            if clean.startswith("```html"):
                clean = clean[7:]
            if clean.startswith("```"):
                clean = clean[3:]
            if clean.endswith("```"):
                clean = clean[:-3]
            return clean.strip()
            
        except Exception as e:
            print(f"⚠️ [CopilotEngine] Error generating dynamic response: {e}")
            return f'<div class="text-rose-400 font-bold p-3 border border-rose-500/20 bg-rose-500/10 rounded">Analysis Error: {str(e)}</div>'

copilot_engine = CopilotEngine()
