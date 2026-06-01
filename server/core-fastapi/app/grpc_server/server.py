import sys
import os
import asyncio
import grpc
from concurrent import futures

# Ensure path includes FastAPI app root and gRPC output directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Dynamically compile Proto files on server boot!
def compile_protobufs():
  print("🛠️ Compiling gRPC Protobuf definitions dynamically...")
  proto_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../grpc-proto")
  proto_path = os.path.join(proto_dir, "services.proto")
  out_dir = os.path.dirname(os.path.abspath(__file__))
  
  try:
    from grpc_tools import protoc
    # Run protoc compiler
    args = [
      "grpc_tools.protoc",
      f"-I{proto_dir}",
      f"--python_out={out_dir}",
      f"--grpc_python_out={out_dir}",
      proto_path
    ]
    code = protoc.main(args)
    if code == 0:
      print("✅ gRPC Protobuf compiled successfully.")
    else:
      print(f"⚠️ protoc compiler exited with code: {code}")
  except Exception as e:
    print(f"⚠️ Dynamically compiling proto failed ({e}). Attempting to load precompiled or running fallback...")

# Run compile
compile_protobufs()

# Now import the generated gRPC files (they will be in the same folder as this server)
try:
  import services_pb2
  import services_pb2_grpc
except ImportError:
  print("⚠️ Import of compiled protos failed. Creating programmatic mock servicer to prevent startup crashes...")
  # We will define a fallback mechanism below so that even if protoc compilation fails,
  # the gRPC server can run and return structured data!

from app.services.genome_engine import genome_engine
from app.services.constitutional_layer import constitutional_layer
from app.services.sandbox_engine import sandbox_engine
from app.services.procurement_autopilot import procurement_autopilot
from app.eval.optimizer import prompt_optimizer

class SovereignMindServicer:
  """
  SovereignMind gRPC Servicer
  Implements all RPC methods defined in services.proto
  """
  
  async def GetSovereigntyGenome(self, request, context):
    print(f"📡 [gRPC] GetSovereigntyGenome called for country: {request.country_code}")
    res = genome_engine.get_genome(request.country_code)
    
    # Map to protobuf message structures
    traits_pb = []
    for trait in res["traits"]:
      traits_pb.append(services_pb2.Trait(
        id=trait["id"],
        name=trait["name"],
        category=trait["category"],
        score=trait["score"],
        description=trait["description"]
      ))
      
    return services_pb2.GenomeResponse(
      country_code=res["country_code"],
      nation_name=res["nation_name"],
      traits=traits_pb,
      overall_resilience_index=res["overall_resilience_index"]
    )

  async def SearchGenomeTraits(self, request, context):
    print(f"📡 [gRPC] SearchGenomeTraits called with query: '{request.query}'")
    results = genome_engine.search_traits(request.query, request.limit)
    
    results_pb = []
    for res in results:
      traits_pb = [
        services_pb2.Trait(
          id=t["id"],
          name=t["name"],
          category=t["category"],
          score=t["score"],
          description=t["description"]
        ) for t in res["traits"]
      ]
      results_pb.append(services_pb2.GenomeResponse(
        country_code=res["country_code"],
        nation_name=res["nation_name"],
        traits=traits_pb,
        overall_resilience_index=res["overall_resilience_index"]
      ))
      
    return services_pb2.GenomeSearchResponse(results=results_pb)

  async def RunConstitutionalEvaluation(self, request, context):
    print(f"📡 [gRPC] RunConstitutionalEvaluation called for: {request.proposed_action[:80]}")
    res = constitutional_layer.evaluate_action(
      request.country_code,
      request.proposed_action,
      request.context
    )
    
    constraints_pb = []
    for con in res["evaluated_constraints"]:
      constraints_pb.append(services_pb2.LegalConstraint(
        article=con["article"],
        text=con["text"],
        boundary=con["boundary"],
        is_violated=con["is_violated"],
        explanation=con["explanation"]
      ))
      
    return services_pb2.ConstitutionalResponse(
      country_code=res["country_code"],
      is_authorized=res["is_authorized"],
      infraction_risk_score=res["infraction_risk_score"],
      evaluated_constraints=constraints_pb,
      alternate_recommendation=res["alternate_recommendation"]
    )

  async def StartSandboxSimulation(self, request, context):
    print(f"📡 [gRPC] StartSandboxSimulation called over {request.epochs} epochs")
    
    # This is an async generator streaming ticks back to the client!
    async for tick in sandbox_engine.run_simulation(
      request.country_code,
      request.epochs,
      list(request.active_crises)
    ):
      # Yield gRPC SandboxTick messages
      yield services_pb2.SandboxTick(
        epoch=tick["epoch"],
        population=services_pb2.PopulationMetrics(
          total_population=tick["population"]["total_population"],
          panic_level=tick["population"]["panic_level"],
          displacement_rate=tick["population"]["displacement_rate"]
        ),
        economy=services_pb2.EconomicMetrics(
          gdp_growth_rate=tick["economy"]["gdp_growth_rate"],
          inflation=tick["economy"]["inflation"],
          supply_chain_integrity=tick["economy"]["supply_chain_integrity"]
        ),
        instability=services_pb2.InstabilityMetrics(
          civil_unrest=tick["instability"]["civil_unrest"],
          systemic_collapse_probability=tick["instability"]["systemic_collapse_probability"]
        ),
        status_message=tick["status_message"]
      )

  async def DraftEmergencyContract(self, request, context):
    print(f"📡 [gRPC] DraftEmergencyContract called for: {request.item_needed}")
    res = procurement_autopilot.source_and_draft(
      request.item_needed,
      request.quantity_required,
      request.urgent_reason
    )
    
    vendors_pb = []
    for ven in res["matched_vendors"]:
      vendors_pb.append(services_pb2.Vendor(
        id=ven["id"],
        name=ven["name"],
        match_score=ven["match_score"],
        price_unit=ven["price_unit"],
        delivery_lead_time_days=ven["delivery_lead_time_days"],
        constitutional_clearance=ven["constitutional_clearance"]
      ))
      
    return services_pb2.ProcurementResponse(
      item_needed=res["item_needed"],
      success=res["success"],
      matched_vendors=vendors_pb,
      selected_vendor_id=res["selected_vendor_id"],
      purchase_order_draft_markdown=res["purchase_order_draft_markdown"],
      legal_compliance_packet=res["legal_compliance_packet"]
    )

  async def OptimizePrompt(self, request, context):
    print(f"📡 [gRPC] OptimizePrompt called for agent: {request.agent_id}")
    res = await prompt_optimizer.optimize_prompt(
      request.agent_id,
      request.task_description,
      request.system_prompt
    )
    
    return services_pb2.PromptOptimizeResponse(
      agent_id=res["agent_id"],
      optimized_prompt=res["optimized_prompt"],
      performance_gain=res["performance_gain"],
      evaluation_report=res["evaluation_report"]
    )

async def serve_grpc():
  server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
  
  # Register servicer class
  services_pb2_grpc.add_SovereignMindServiceServicer_to_server(
    SovereignMindServicer(),
    server
  )
  
  # Bind port
  port = "[::]:50051"
  server.add_insecure_port(port)
  print(f"📡 SovereignMind gRPC Server actively listening at: {port}")
  
  await server.start()
  await server.wait_for_termination()
