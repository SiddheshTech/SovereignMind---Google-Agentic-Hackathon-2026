import os
import requests
from typing import Dict, Any, Optional
from app.core.config import settings

class LLMRouter:
  """
  Multi-Model LLM Router
  Routes prompt requests to the appropriate LLM engine (Gemini, Claude, GPT, Llama, Mixtral)
  based on provider selection, with robust dynamic fallbacks for hackathon environments.
  """
  def __init__(self):
    self.gemini_key = settings.GEMINI_API_KEY
    self.openai_key = settings.OPENAI_API_KEY
    self.claude_key = settings.CLAUDE_API_KEY
    self.ollama_endpoint = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/api/generate")

  async def generate_response(self, provider: str, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
    prov = provider.lower()
    print(f"🔌 [LLM Router] Routing request to '{provider}' (Temp: {temperature})...")

    # 1. Google Gemini Route
    if prov in ["gemini", "google"]:
      if self.gemini_key:
        try:
          from google import genai
          client = genai.Client(api_key=self.gemini_key)
          response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config={
              'system_instruction': system_prompt,
              'temperature': temperature,
            }
          )
          return response.text
        except Exception as e:
          print(f"⚠️ Gemini SDK error: {e}. Running fallback.")
      return self._generate_simulated_response(prov, system_prompt, user_prompt)

    # 2. OpenAI GPT Route
    elif prov in ["openai", "gpt", "gpt-4o"]:
      if self.openai_key:
        try:
          from openai import OpenAI
          client = OpenAI(api_key=self.openai_key)
          response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
              {"role": "system", "content": system_prompt},
              {"role": "user", "content": user_prompt}
            ],
            temperature=temperature
          )
          return response.choices[0].message.content
        except Exception as e:
          print(f"⚠️ OpenAI SDK error: {e}. Running fallback.")
      return self._generate_simulated_response(prov, system_prompt, user_prompt)

    # 3. Anthropic Claude Route
    elif prov in ["claude", "anthropic"]:
      if self.claude_key:
        try:
          # Simple REST fallback for Claude to avoid deep SDK installs if not present
          headers = {
            "x-api-key": self.claude_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          }
          data = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1024,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": temperature
          }
          res = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data, timeout=5)
          if res.status_code == 200:
            return res.json()["content"][0]["text"]
          else:
            print(f"⚠️ Claude API status: {res.status_code}. Running fallback.")
        except Exception as e:
          print(f"⚠️ Claude error: {e}. Running fallback.")
      return self._generate_simulated_response(prov, system_prompt, user_prompt)

    # 4. Ollama Llama/Mixtral Local Route
    elif prov in ["llama", "mixtral", "ollama"]:
      try:
        model_name = "llama3" if prov == "llama" else "mixtral"
        data = {
          "model": model_name,
          "prompt": f"System Instruction: {system_prompt}\nUser Input: {user_prompt}",
          "stream": False,
          "options": {"temperature": temperature}
        }
        res = requests.post(self.ollama_endpoint, json=data, timeout=2)
        if res.status_code == 200:
          return res.json()["response"]
      except Exception as e:
        print(f"⚠️ Ollama unavailable locally ({e}). Running local simulation model.")
      return self._generate_simulated_response(prov, system_prompt, user_prompt)

    # Default general route
    else:
      return self._generate_simulated_response("generic", system_prompt, user_prompt)

  def _generate_simulated_response(self, provider: str, system: str, user: str) -> str:
    """Intelligent context-aware mock generator matching the SovereignMind theme."""
    user_lower = user.lower()
    
    if "constitution" in system.lower() or "constitutional" in user_lower:
      return (
        f"### [{provider.upper()} - CONSTITUTIONAL ANALYSIS]\n"
        f"Audited Action: '{user[:60]}...'\n"
        f"Verdict: Under high emergency stress parameters, direct physical asset seizure is blocked "
        f"to satisfy Fourth Amendment limits. Alternate pathway: Draft localized incentive-based service agreements."
      )
    elif "procurement" in system.lower() or "source" in user_lower:
      return (
        f"### [{provider.upper()} - CRISIS CONTRACTING]\n"
        f"Procurement Target: Sourcing logistics completed. Graded Global Med as high-resilience matching candidate. "
        f"Purchase order PO-998 has been automatically compiled with a legal compliance packet."
      )
    else:
      return (
        f"### [{provider.upper()} - GEOPOLITICAL INTELLIGENCE REPORT]\n"
        f"State Assessment: Cascading failures detected across grid systems. "
        f"Decentralization genes (REG-US-01) successfully buffered regional collapse probability coefficients by 18%."
      )

llm_router = LLMRouter()
