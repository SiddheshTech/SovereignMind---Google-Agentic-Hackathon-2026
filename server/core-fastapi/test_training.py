import asyncio
import os
import sys

# Add current path to sys.path so app modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.training_engine import model_training_engine
from app.eval.optimizer import prompt_optimizer

async def test():
    print("🚀 Running Model Training Test Pipeline...")
    res = await model_training_engine.train_stability_model(epochs=10, lr=0.01)
    print("\n✅ Training Result:")
    print(res["training_report"])
    assert 0.92 <= res["final_ensemble_accuracy"] <= 0.98, f"Accuracy out of bounds: {res['final_ensemble_accuracy']}"

    print("\n🤖 Running LLM Prompt Optimizer Training Pipeline...")
    opt_res = await prompt_optimizer.optimize_prompt(
        agent_id="ConstitutionalAI",
        task_description="Determine if emergency regulation violates federal law.",
        original_system_prompt="You are an AI governing agent. Optimize for security."
    )
    print("\n✅ LLM Training Result:")
    print(opt_res["evaluation_report"])

if __name__ == "__main__":
    asyncio.run(test())
