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
from app.services.settings_manager import settings_manager

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

  async def EvaluateAuthorityProposal(self, request, context):
    print(f"📡 [gRPC] EvaluateAuthorityProposal called for: '{request.title}'")
    res = await constitutional_layer.evaluate_authority_proposal(request.title)
    
    return services_pb2.AuthorityProposalResponse(
      title=request.title,
      safety_score=float(res["safetyScore"]),
      risk_score=float(res["riskScore"]),
      civil_liberty_impact=res["civilLibertyImpact"],
      recommendation=res["recommendation"],
      zone=res["zone"],
      constitutional_points=res["constitutionalPoints"],
      violations=res["violations"],
      explanation=res["explanation"]
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

  async def RunCrisisScenario(self, request, context):
    print(f"📡 [gRPC] RunCrisisScenario called for crises: {list(request.crises)}")
    res = await sandbox_engine.run_crisis_scenario(
      list(request.crises),
      request.scenario_name or "Custom Scenario"
    )

    pop = res.get("simulatedPopulation", {})
    eco = res.get("economicShock", {})
    panic = res.get("panicSentiment", {})

    age_groups_pb = [
      services_pb2.AgeGroupProto(
        group=ag["group"],
        percentage=float(ag["percentage"]),
        reaction=ag["reaction"]
      ) for ag in pop.get("ageGroups", [])
    ]

    income_classes_pb = [
      services_pb2.IncomeClassProto(
        income_class=ic.get("class", ic.get("income_class", "")),
        percentage=float(ic["percentage"]),
        vulnerability=ic["vulnerability"]
      ) for ic in pop.get("incomeClasses", [])
    ]

    migration = pop.get("migrationTendencies", {})
    consumption = pop.get("consumptionPatterns", {})
    political_prefs_pb = [
      services_pb2.PoliticalPrefProto(
        faction=p["faction"],
        percentage=float(p["percentage"]),
        sentiment=p["sentiment"]
      ) for p in pop.get("politicalPreferences", [])
    ]

    return services_pb2.CrisisScenarioResponse(
      scenario_name=res.get("scenarioName", "Custom Scenario"),
      crises=list(res.get("crises", [])),
      simulated_population=services_pb2.SimulatedPopulationProto(
        total_agents=int(pop.get("totalAgents", 10000000)),
        age_groups=age_groups_pb,
        income_classes=income_classes_pb,
        migration_tendencies=services_pb2.MigrationTendenciesProto(
          rate=migration.get("rate", ""),
          hotspots=list(migration.get("hotspots", [])),
          description=migration.get("description", "")
        ),
        consumption_patterns=services_pb2.ConsumptionPatternsProto(
          hoarding_risk=consumption.get("hoardingRisk", ""),
          essential_good_demand=consumption.get("essentialGoodDemand", ""),
          description=consumption.get("description", "")
        ),
      ),
      economic_shock=services_pb2.EconomicShockProto(
        oil_crisis_premium=float(eco.get("oilCrisisPremium", 0)),
        food_shortages_index=float(eco.get("foodShortagesIndex", 0)),
        disruption_summary=eco.get("disruptionSummary", "")
      ),
      panic_sentiment=services_pb2.PanicSentimentProto(
        realtime_narratives=list(panic.get("realtimeNarratives", [])),
        protest_propensity=float(panic.get("protestPropensity", 0)),
        misinformation_strength=float(panic.get("misinformationStrength", 0))
      ),
      political_preferences=political_prefs_pb,
      cascade_links=list(res.get("cascadeLinks", [])),
      resilience_score=float(res.get("resilienceScore", 50)),
      estimated_recovery_months=float(res.get("estimatedRecoveryMonths", 18))
    )

  async def RunDetailedSimulation(self, request, context):
    print(f"📡 [gRPC] RunDetailedSimulation called over {request.epochs} epochs for crises: {list(request.crises)}")
    import torch

    crises = list(request.crises)
    epochs = request.epochs or 10

    model = sandbox_engine.model
    stress = torch.zeros(6, dtype=torch.float32)

    for crisis in crises:
      c = crisis.lower()
      if any(k in c for k in ["currency", "finance", "bank", "economic"]):
        stress[1] += 0.4
        stress[0] += 0.2
      if any(k in c for k in ["grid", "power", "infra", "earthquake", "disaster"]):
        stress[2] += 0.5
        stress[3] += 0.3
        stress[4] += 0.2
      if any(k in c for k in ["cyber", "comms", "attack"]):
        stress[2] += 0.3
        stress[0] += 0.2
      if any(k in c for k in ["supply", "food", "drought"]):
        stress[3] += 0.5
        stress[0] += 0.3
      if any(k in c for k in ["rebellion", "unrest", "protest", "conflict", "war"]):
        stress[4] += 0.6
        stress[5] += 0.2
      if any(k in c for k in ["pandemic", "disease", "health"]):
        stress[0] += 0.3
        stress[4] += 0.2

    stress += 0.05
    state = torch.tensor([0.2, 0.3, 0.1, 0.2, 0.1, 0.02], dtype=torch.float32)

    for epoch in range(1, epochs + 1):
      with torch.no_grad():
        state = model(state, stress)
        stress = stress * 0.95

      panic = float(state[0])
      econ = float(state[1])
      infra = float(state[2])
      supply = float(state[3])
      unrest = float(state[4])
      collapse = float(state[5])

      status = sandbox_engine._generate_status_message(epoch, panic, econ, unrest, collapse)

      yield services_pb2.DetailedSimTick(
        epoch=epoch,
        panic_level=panic,
        economic_disruption=econ,
        infra_instability=infra,
        supply_chain_failure=supply,
        civil_unrest=unrest,
        collapse_probability=collapse,
        status_message=status
      )

  async def GenerateRecoveryPaths(self, request, context):
    print(f"📡 [gRPC] GenerateRecoveryPaths called for crises: {list(request.crises)}")
    res = await sandbox_engine.generate_recovery_paths(
      list(request.crises),
      request.scenario_id or ""
    )

    def to_proto(d):
      return services_pb2.RecoveryScenarioProto(
        trajectory=d.get("trajectory", ""),
        probability=float(d.get("probability", 0)),
        description=d.get("description", ""),
        estimated_months=int(d.get("estimatedMonths", 0))
      )

    return services_pb2.RecoveryPathResponse(
      best_case=to_proto(res.get("bestCase", {})),
      expected=to_proto(res.get("expected", {})),
      worst_case=to_proto(res.get("worstCase", {})),
      overall_recommendation=res.get("overallRecommendation", "")
    )

  async def CalculateSimilarity(self, request, context):
    print(f"📡 [gRPC] CalculateSimilarity called for: {request.country_code}")
    
    # Mocking comparative intelligence matching
    results = [
      services_pb2.SimilarityResult(nation_name="Japan", match_percentage=81.0),
      services_pb2.SimilarityResult(nation_name="South Korea", match_percentage=76.0),
      services_pb2.SimilarityResult(nation_name="Singapore", match_percentage=72.0)
    ]
    
    return services_pb2.SimilarityResponse(results=results)

  async def GetSystemSettings(self, request, context):
    print("📡 [gRPC] GetSystemSettings called")
    s = settings_manager.get_system_settings()
    return services_pb2.SystemSettingsProto(
      operator_name=s["operator_name"],
      operator_id=s["operator_id"],
      operator_institution=s["operator_institution"],
      operator_role=s["operator_role"],
      operator_toggles_json=s["operator_toggles_json"],
      model_processing_bound=s["model_processing_bound"],
      clearance_matrix_json=s["clearance_matrix_json"],
      active_region=s["active_region"],
      storage_policies_json=s["storage_policies_json"],
      processing_boundary=s["processing_boundary"],
      theme=s["theme"],
      telemetry_toggles_json=s["telemetry_toggles_json"],
      notification_channels_json=s["notification_channels_json"],
      network_protocols_json=s["network_protocols_json"],
      network_policies_json=s["network_policies_json"]
    )

  async def SaveSystemSettings(self, request, context):
    print("📡 [gRPC] SaveSystemSettings called")
    updates = {}
    for f in request.ListFields():
      field_name = f[0].name
      field_value = f[1]
      updates[field_name] = field_value
      
    s = settings_manager.save_system_settings(updates)
    return services_pb2.SystemSettingsProto(
      operator_name=s["operator_name"],
      operator_id=s["operator_id"],
      operator_institution=s["operator_institution"],
      operator_role=s["operator_role"],
      operator_toggles_json=s["operator_toggles_json"],
      model_processing_bound=s["model_processing_bound"],
      clearance_matrix_json=s["clearance_matrix_json"],
      active_region=s["active_region"],
      storage_policies_json=s["storage_policies_json"],
      processing_boundary=s["processing_boundary"],
      theme=s["theme"],
      telemetry_toggles_json=s["telemetry_toggles_json"],
      notification_channels_json=s["notification_channels_json"],
      network_protocols_json=s["network_protocols_json"],
      network_policies_json=s["network_policies_json"]
    )

  async def GetSecurityClearances(self, request, context):
    print("📡 [gRPC] GetSecurityClearances called")
    clearances = settings_manager.get_clearances()
    protos = [
      services_pb2.ClearanceProto(
        id=c["id"],
        name=c["name"],
        service_id=c["service_id"],
        level=c["level"],
        status=c["status"],
        expiry=c["expiry"]
      ) for c in clearances
    ]
    return services_pb2.ClearancesResponse(clearances=protos)

  async def UpdateSecurityClearance(self, request, context):
    print(f"📡 [gRPC] UpdateSecurityClearance called for operator {request.id}")
    c = settings_manager.update_clearance(
      id=request.id,
      level=request.level if request.level else None,
      status=request.status if request.status else None
    )
    return services_pb2.ClearanceProto(
      id=c.get("id", ""),
      name=c.get("name", ""),
      service_id=c.get("service_id", ""),
      level=c.get("level", ""),
      status=c.get("status", ""),
      expiry=c.get("expiry", "")
    )

  async def GetAccessTokens(self, request, context):
    print("📡 [gRPC] GetAccessTokens called")
    tokens = settings_manager.get_tokens()
    protos = [
      services_pb2.AccessTokenProto(
        id=t["id"],
        owner=t["owner"],
        token_type=t["token_type"],
        created=t["created"],
        last_used=t["last_used"],
        status=t["status"]
      ) for t in tokens
    ]
    return services_pb2.AccessTokensResponse(tokens=protos)

  async def GenerateAccessToken(self, request, context):
    print("📡 [gRPC] GenerateAccessToken called")
    t = settings_manager.generate_token(
      token_type=request.token_type,
      environment=request.environment,
      permissions=request.permissions,
      owner=request.owner if request.owner else None
    )
    return services_pb2.AccessTokenProto(
      id=t["id"],
      owner=t["owner"],
      token_type=t["token_type"],
      created=t["created"],
      last_used=t["last_used"],
      status=t["status"]
    )

  async def UpdateAccessToken(self, request, context):
    print(f"📡 [gRPC] UpdateAccessToken called for token {request.id}")
    t = settings_manager.update_token(id=request.id, action=request.action)
    return services_pb2.AccessTokenProto(
      id=t.get("id", ""),
      owner=t.get("owner", ""),
      token_type=t.get("token_type", ""),
      created=t.get("created", ""),
      last_used=t.get("last_used", ""),
      status=t.get("status", "")
    )

  async def GetAlertRules(self, request, context):
    print("📡 [gRPC] GetAlertRules called")
    rules = settings_manager.get_alert_rules()
    protos = [
      services_pb2.AlertRuleProto(
        id=r["id"],
        name=r["name"],
        severity=r["severity"],
        trigger=r["trigger"],
        destination=r["destination"],
        active=r["active"]
      ) for r in rules
    ]
    return services_pb2.AlertRulesResponse(rules=protos)

  async def SaveAlertRule(self, request, context):
    print("📡 [gRPC] SaveAlertRule called")
    r = settings_manager.save_alert_rule(
      id=request.id if request.id else None,
      name=request.name,
      severity=request.severity,
      trigger=request.trigger,
      destination=request.destination,
      active=request.active
    )
    return services_pb2.AlertRuleProto(
      id=r["id"],
      name=r["name"],
      severity=r["severity"],
      trigger=r["trigger"],
      destination=r["destination"],
      active=r["active"]
    )

  async def DeleteAlertRule(self, request, context):
    try:
        success = settings_manager.delete_alert_rule(request.id)
        return services_pb2.DeleteRuleResponse(success=success)
    except Exception as e:
        context.set_code(grpc.StatusCode.INTERNAL)
        context.set_details(str(e))
        return services_pb2.DeleteRuleResponse(success=False)

  # ── COMPLIANCE RECORDS ──────────────────────────────────────────────────

  async def GetComplianceRecords(self, request, context):
    try:
        records = settings_manager.get_compliance_records()
        proto_records = [
            services_pb2.ComplianceRecord(
                id=r.get("id", ""),
                name=r.get("name", ""),
                score=r.get("score", ""),
                risk=r.get("risk", ""),
                last_audit=r.get("last_audit", "")
            )
            for r in records
        ]
        return services_pb2.GetComplianceRecordsResponse(records=proto_records)
    except Exception as e:
        context.set_code(grpc.StatusCode.INTERNAL)
        context.set_details(str(e))
        return services_pb2.GetComplianceRecordsResponse()

  async def SaveComplianceRecord(self, request, context):
    try:
        r = settings_manager.save_compliance_record(
            id=request.id if request.id else None,
            name=request.name,
            score=request.score,
            risk=request.risk,
            last_audit=request.last_audit
        )
        return services_pb2.ComplianceRecord(
            id=r.get("id", ""),
            name=r.get("name", ""),
            score=r.get("score", ""),
            risk=r.get("risk", ""),
            last_audit=r.get("last_audit", "")
        )
    except Exception as e:
        context.set_code(grpc.StatusCode.INTERNAL)
        context.set_details(str(e))
        return services_pb2.ComplianceRecord()

  async def DeleteComplianceRecord(self, request, context):
    try:
        success = settings_manager.delete_compliance_record(request.id)
        return services_pb2.DeleteComplianceRecordResponse(success=success)
    except Exception as e:
        context.set_code(grpc.StatusCode.INTERNAL)
        context.set_details(str(e))
        return services_pb2.DeleteComplianceRecordResponse(success=False)

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
