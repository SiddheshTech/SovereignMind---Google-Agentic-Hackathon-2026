import asyncio
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, select
from typing import Dict, Any, List

from app.schemas import UserSignUpRequest, UserSignInRequest, UserResponse
from app.db.models import UserModel

# Core, Database, and SQLModel imports
from app.core.config import settings
from app.core import security
from app.db.database import init_db, get_db
from app.db.redis_client import redis_conn
from app.db.firebase_client import firestore_client
from app.db.mongodb_client import mongo_client
# Import models to ensure they are registered in SQLModel metadata for auto-creation
import app.db.models 
 

# Service, Agent, and Kafka imports
from app.services.genome_engine import genome_engine
from app.services.constitutional_layer import constitutional_layer
from app.services.sandbox_engine import sandbox_engine
from app.services.procurement_autopilot import procurement_autopilot
from app.agents.langgraph_workflow import run_langgraph_sandbox_flow
from app.agents.crew_workflow import crew_workflow_manager
from app.agents.autogen_workflow import autogen_workflow
from app.db.kafka_client import kafka_client
from app.services.training_engine import model_training_engine


# Celery task imports
from app.tasks.tasks import async_constitutional_audit, async_emergency_procurement, async_sandbox_run

# MCP Introspection imports
from app.agents.mcp_server import mcp_server

# Dataset Caching import
from app.core.dataset_manager import dataset_manager

# Tracing and Eval imports
from app.eval.tracing import setup_phoenix_tracing, log_agent_trace
from app.eval.optimizer import prompt_optimizer
from app.grpc_server.server import serve_grpc

# Initialize FastAPI App
app = FastAPI(
  title=settings.PROJECT_NAME,
  description="Core AI Engine for SovereignMind civilizational modeling, multi-agent sandbox testing, and constitutional auditing.",
  version="1.0.0",
  docs_url="/docs",
  redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Startup Events ---
@app.on_event("startup")
async def startup_event():
  print("🔥 Starting up SovereignMind FastAPI Core AI Service...")
  
  # 1. Initialize SQLite/PostgreSQL schemas
  await init_db()
  
  # 2. Preload global datasets into memory for instant real-time response
  dataset_manager.preload_data()
  
  # 3. Register OpenTelemetry instrumentation for Arize Phoenix
  setup_phoenix_tracing()
  
  # 4. Spin up the gRPC Server in the background loop!
  asyncio.create_task(serve_grpc())
  print("📡 Concurrent background gRPC Server scheduled.")

# --- API Endpoints ---

@app.get("/health")
async def health_check():
  return {
    "status": "OK",
    "service": settings.PROJECT_NAME,
    "database": "CONNECTED",
    "redis": "CONNECTED" if not hasattr(redis_conn, "store") else "MOCK_CONNECTED",
    "firebase": "CONNECTED" if not hasattr(firestore_client, "db") else "MOCK_CONNECTED",
    "mongodb": "CONNECTED" if not hasattr(mongo_client, "db") else "MOCK_CONNECTED",
    "kafka": "CONNECTED" if kafka_client.has_kafka else "MOCK_CONNECTED"
  }


# --- OAuth 2.0 Auth Endpoints ---

@app.post("/api/v1/auth/signup", response_model=UserResponse)
async def signup(user_data: UserSignUpRequest, db=Depends(get_db)):
  # Check if email exists
  query = select(UserModel).where(UserModel.email == user_data.email)
  result = await db.execute(query)
  existing_user = result.scalars().first()
  if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")
    
  # Create new user
  hashed_password = security.get_password_hash(user_data.password)
  new_user = UserModel(
    call_sign=user_data.call_sign,
    email=user_data.email,
    hashed_password=hashed_password
  )
  db.add(new_user)
  await db.commit()
  await db.refresh(new_user)
  return new_user

@app.post("/api/v1/auth/signin")
async def signin(login_data: UserSignInRequest, db=Depends(get_db)):
  query = select(UserModel).where(UserModel.email == login_data.email)
  result = await db.execute(query)
  user = result.scalars().first()
  
  if not user or not security.verify_password(login_data.password, user.hashed_password):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect email or password",
      headers={"WWW-Authenticate": "Bearer"},
    )
    
  # Optional: Log or process the cryptographic badge key if provided
  if login_data.badge_key:
    print(f"🔐 Badge Key provided for {user.email}: {login_data.badge_key}")
    
  access_token = security.create_access_token(subject=user.email)
  return {
    "access_token": access_token, 
    "token_type": "bearer",
    "user": {
      "id": user.id,
      "email": user.email,
      "call_sign": user.call_sign
    }
  }

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
  if form_data.username == "admin" and form_data.password == "sovereign_mind_2026":
    access_token = security.create_access_token(subject=form_data.username)
    return {"access_token": access_token, "token_type": "bearer"}
  
  raise HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect username or password",
    headers={"WWW-Authenticate": "Bearer"},
  )

@app.get("/api/v1/protected-data")
async def get_protected_data(token: str = Depends(oauth2_scheme)):
  payload = security.decode_token(token)
  if not payload:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid or expired access token",
      headers={"WWW-Authenticate": "Bearer"},
    )
  return {
    "message": "Access authorized.",
    "user": payload.get("sub"),
    "clearance": "CONSTITUTIONAL_ADMINISTRATOR"
  }

# --- Core Business REST Endpoints ---

@app.get("/api/v1/genome/{country_code}")
async def get_civilization_genome(country_code: str):
  res = genome_engine.get_genome(country_code)
  return res

@app.get("/api/v1/genome/search/")
async def search_civilization_genomes(query: str, limit: int = 5):
  res = genome_engine.search_traits(query, limit)
  return {"results": res}

@app.post("/api/v1/constitutional-audit")
async def run_constitutional_audit(payload: Dict[str, Any]):
  country_code = payload.get("country_code", "US")
  action = payload.get("proposed_action", "")
  context = payload.get("context", "")
  
  if not action:
    raise HTTPException(status_code=400, detail="proposed_action is required")
    
  res = constitutional_layer.evaluate_action(country_code, action, context)
  return res

@app.post("/api/v1/sandbox/simulate")
async def start_sandbox_simulation_endpoint(payload: Dict[str, Any]):
  country_code = payload.get("country_code", "US")
  epochs = payload.get("epochs", 10)
  active_crises = payload.get("active_crises", [])
  
  # Trigger in background and publish events to Kafka topic!
  async def run_sim():
    async for tick in sandbox_engine.run_simulation(country_code, epochs, active_crises):
      # Publish sandbox tick outputs directly to Kafka civilization topic!
      kafka_client.publish_event("civilization-events", {
        "event_type": "SANDBOX_TICK",
        "country": country_code,
        "tick_data": tick
      })
      
  asyncio.create_task(run_sim())
  return {
    "status": "SIMULATION_LAUNCHED_WITH_KAFKA_PUBLISHER",
    "country_code": country_code,
    "epochs": epochs
  }

@app.websocket("/ws/v1/sandbox/{country_code}")
async def websocket_sandbox_endpoint(websocket: WebSocket, country_code: str):
  """Real-time WebSocket streaming of the PyTorch transition network state."""
  await websocket.accept()
  print(f"🔌 WebSocket connected for Live Sandbox: {country_code}")
  try:
    async for tick in sandbox_engine.run_simulation(country_code, epochs=10, active_crises=["supply", "rebellion"]):
      await websocket.send_json(tick)
  except WebSocketDisconnect:
    print(f"❌ WebSocket disconnected: {country_code}")

@app.post("/api/v1/agent-sandbox-run")
async def run_agent_sandbox_pipeline(payload: Dict[str, Any]):
  country_code = payload.get("country_code", "US")
  proposed_action = payload.get("proposed_action", "")
  active_crises = payload.get("active_crises", [])
  
  if not proposed_action:
    raise HTTPException(status_code=400, detail="proposed_action is required")
    
  # Run LangGraph Orchestrator Flow
  res = await run_langgraph_sandbox_flow(country_code, proposed_action, active_crises)
  return res

@app.post("/api/v1/autogen-debate")
async def run_autogen_agent_debate(payload: Dict[str, Any]):
  country_code = payload.get("country_code", "US")
  policy_proposal = payload.get("policy_proposal", "")
  
  if not policy_proposal:
    raise HTTPException(status_code=400, detail="policy_proposal is required")
    
  res = await autogen_workflow.run_constitutional_debate(country_code, policy_proposal)
  return res


@app.post("/api/v1/emergency-contract")
async def run_emergency_contract_autopilot(payload: Dict[str, Any]):
  country_code = payload.get("country_code", "US")
  item_needed = payload.get("item_needed", "")
  quantity = payload.get("quantity", 1)
  reason = payload.get("reason", "")
  
  if not item_needed:
    raise HTTPException(status_code=400, detail="item_needed is required")
    
  res = await crew_workflow_manager.run_emergency_contract_crew(country_code, item_needed, quantity, reason)
  return res

@app.post("/api/v1/optimize-prompt")
async def run_prompt_optimization(payload: Dict[str, Any]):
  agent_id = payload.get("agent_id", "Adjudicator")
  task = payload.get("task_description", "")
  prompt = payload.get("system_prompt", "")
  
  if not task or not prompt:
    raise HTTPException(status_code=400, detail="task_description and system_prompt are required")
    
  res = await prompt_optimizer.optimize_prompt(agent_id, task, prompt)
  return res

# --- Celery Worker API Endpoints ---

@app.post("/api/v1/celery/audit")
async def queue_celery_audit(payload: Dict[str, Any]):
  country = payload.get("country_code", "US")
  action = payload.get("proposed_action", "")
  context = payload.get("context", "")
  
  if not action:
    raise HTTPException(status_code=400, detail="proposed_action is required")
    
  # Dispatch to Celery background task queue!
  async_constitutional_audit.delay(country, action, context)
  return {"status": "AUDIT_QUEUED_IN_CELERY_DAEMON", "country": country}

@app.post("/api/v1/celery/procurement")
async def queue_celery_procurement(payload: Dict[str, Any]):
  item = payload.get("item_needed", "")
  qty = payload.get("quantity", 1)
  reason = payload.get("reason", "")
  
  if not item:
    raise HTTPException(status_code=400, detail="item_needed is required")
    
  # Dispatch to Celery background task queue!
  async_emergency_procurement.delay(item, qty, reason)
  return {"status": "PROCUREMENT_QUEUED_IN_CELERY_DAEMON", "item": item}

@app.post("/api/v1/celery/simulate")
async def queue_celery_simulation(payload: Dict[str, Any]):
  country = payload.get("country_code", "US")
  epochs = payload.get("epochs", 10)
  crises = payload.get("active_crises", [])
  
  # Dispatch to Celery background task queue!
  async_sandbox_run.delay(country, epochs, crises)
  return {"status": "SANDBOX_SIMULATION_QUEUED_IN_CELERY_DAEMON", "country": country}

@app.post("/api/v1/train-models")
async def run_model_training_pipeline(payload: Dict[str, Any]):
  epochs = payload.get("epochs", 50)
  lr = payload.get("learning_rate", 0.01)
  res = await model_training_engine.train_stability_model(epochs, lr)
  return res

# --- Model Context Protocol (MCP) JSON-RPC Endpoints ---

@app.post("/mcp")
async def handle_mcp_protocol_call(payload: Dict[str, Any]):
  method = payload.get("method")
  params = payload.get("params", {})
  
  if not method:
    raise HTTPException(status_code=400, detail="JSON-RPC 'method' is required")
    
  # Delegate to our custom MCP server!
  res = mcp_server.handle_mcp_request(method, params)
  return res

if __name__ == "__main__":
  # Run FastAPI Server on PORT 8000
  print("🚀 Starting FastAPI Web API gateway on http://localhost:8000")
  uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
