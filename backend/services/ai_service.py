"""AI service: OpenRouter + LLaMA, strict JSON output with retry."""

import json
import os
import re
from typing import Any

from openai import OpenAI

from models.schemas import ExecutionPlan

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
LLAMA_MODEL = "meta-llama/llama-3.3-70b-instruct"
MAX_RETRIES = 3

SYSTEM_PROMPT = """You are a structured planning assistant. Output ONLY valid JSON. No markdown, no code fences, no explanation, no motivational text.

Rules:
- No fluff or motivational speech.
- Clear, actionable steps only.
- Practical advice only.
- Your entire response must be a single valid JSON object matching the exact schema below.

Schema (use these exact keys):
{
  "goal_summary": "Short clarified version of the user's goal (one sentence)",
  "priority_level": "High" or "Medium" or "Low",
  "estimated_total_time": "X days or X weeks (e.g. \"2 weeks\")",
  "execution_plan": [
    {
      "step_number": 1,
      "title": "Step title",
      "description": "Clear actionable explanation",
      "estimated_time": "X hours or X days",
      "priority": "High" or "Medium" or "Low"
    }
  ],
  "first_action_to_take_now": "One specific action the user can do in the next 30 minutes"
}

Return 4-8 steps. first_action_to_take_now must be concrete and doable immediately."""

USER_PROMPT_TEMPLATE = """Convert this goal into a structured execution plan. Output only the JSON object, nothing else.

Goal: {goal}"""


def _get_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY or OPENAI_API_KEY must be set")
    return OpenAI(base_url=OPENROUTER_BASE, api_key=api_key)


def _extract_json(text: str) -> dict[str, Any] | None:
    """Try to parse JSON from LLM output, stripping markdown if present."""
    text = text.strip()
    # Remove optional markdown code block
    if "```json" in text:
        text = re.sub(r"^.*?```json\s*", "", text, flags=re.DOTALL)
    if "```" in text:
        text = re.sub(r"\s*```.*$", "", text, flags=re.DOTALL)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def generate_plan(goal: str) -> ExecutionPlan:
    """Call OpenRouter LLM and return validated ExecutionPlan. Retries on invalid JSON."""
    client = _get_client()
    user_prompt = USER_PROMPT_TEMPLATE.format(goal=goal)
    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        try:
            response = client.chat.completions.create(
                model=LLAMA_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                max_tokens=2048,
            )
            content = (response.choices[0].message.content or "").strip()
            if not content:
                raise ValueError("Empty LLM response")
            data = _extract_json(content)
            if data is None:
                raise ValueError(f"Invalid JSON on attempt {attempt + 1}")
            
            # Normalize priorities to match Literal schema (High, Medium, Low)
            def normalize_priority(p):
                if not isinstance(p, str): return p
                p_lower = p.lower()
                if "high" in p_lower: return "High"
                if "medium" in p_lower: return "Medium"
                if "low" in p_lower: return "Low"
                return p.capitalize()

            if "priority_level" in data:
                data["priority_level"] = normalize_priority(data["priority_level"])
            if "execution_plan" in data and isinstance(data["execution_plan"], list):
                for step in data["execution_plan"]:
                    if "priority" in step:
                        step["priority"] = normalize_priority(step["priority"])
                        
            return ExecutionPlan.model_validate(data)
        except Exception as e:
            last_error = e
            if attempt == MAX_RETRIES - 1:
                raise
            continue

    if last_error:
        raise last_error
    raise ValueError("Failed to get valid plan after retries")
