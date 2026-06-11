export const typeDefs = `#graphql
  type GeneCategory {
    LeadershipContinuity: Float
    InstitutionalStrength: Float
    PolicyStability: Float
    BureaucraticEfficiency: Float
    
    FiscalResilience: Float
    TradeDiversity: Float
    InflationResistance: Float
    LaborAdaptability: Float
    
    SocialTrust: Float
    CommunityResilience: Float
    EducationQuality: Float
    CulturalCohesion: Float
    
    EnergySecurity: Float
    TransportReliability: Float
    DigitalConnectivity: Float
    HealthcareCapacity: Float
  }

  type DetailedGenomeResponse {
    countryCode: String!
    nationName: String!
    overallResilienceIndex: Float!
    governanceGenes: GeneCategory
    economicGenes: GeneCategory
    socialGenes: GeneCategory
    infrastructureGenes: GeneCategory
  }

  type SimilarityResult {
    nationName: String!
    matchPercentage: Float!
  }

  type Trait {
    id: String!
    name: String!
    category: String!
    score: Float!
    description: String!
  }

  type GenomeResponse {
    country_code: String!
    nation_name: String!
    traits: [Trait!]!
    overall_resilience_index: Float!
  }

  type LegalConstraint {
    article: String!
    text: String!
    boundary: String!
    is_violated: Boolean!
    explanation: String!
  }

  type ConstitutionalResponse {
    country_code: String!
    is_authorized: Boolean!
    infraction_risk_score: Float!
    evaluated_constraints: [LegalConstraint!]!
    alternate_recommendation: String!
  }

  type Vendor {
    id: String!
    name: String!
    match_score: Float!
    price_unit: Float!
    delivery_lead_time_days: Int!
    constitutional_clearance: Boolean!
  }

  type ProcurementResponse {
    item_needed: String!
    success: Boolean!
    matched_vendors: [Vendor!]!
    selected_vendor_id: String
    purchase_order_draft_markdown: String
    legal_compliance_packet: String
  }

  type PromptOptimizeResponse {
    agent_id: String!
    optimized_prompt: String!
    performance_gain: Float!
    evaluation_report: String!
  }

  type SandboxStartResponse {
    country_code: String!
    epochs: Int!
    status: String!
  }

  type PopulationMetrics {
    total_population: Float!
    panic_level: Float!
    displacement_rate: Float!
  }

  type EconomicMetrics {
    gdp_growth_rate: Float!
    inflation: Float!
    supply_chain_integrity: Float!
  }

  type InstabilityMetrics {
    civil_unrest: Float!
    systemic_collapse_probability: Float!
  }

  type SandboxTick {
    epoch: Int!
    population: PopulationMetrics!
    economy: EconomicMetrics!
    instability: InstabilityMetrics!
    status_message: String!
  }

  type AuthorityProposal {
    id: ID!
    title: String!
    safetyScore: Float!
    riskScore: Float!
    civilLibertyImpact: String!
    recommendation: String!
    zone: String!
    constitutionalPoints: [String!]!
    violations: [String!]!
    explanation: String!
    createdAt: String!
  }

  # ── Sandbox: Crisis Simulation Types ────────────────────────────────────────

  type AgeGroup {
    group: String!
    percentage: Float!
    reaction: String!
  }

  type IncomeClass {
    class: String!
    percentage: Float!
    vulnerability: String!
  }

  type MigrationTendencies {
    rate: String!
    hotspots: [String!]!
    description: String!
  }

  type ConsumptionPatterns {
    hoardingRisk: String!
    essentialGoodDemand: String!
    description: String!
  }

  type PoliticalPreference {
    faction: String!
    percentage: Float!
    sentiment: String!
  }

  type SimulatedPopulation {
    totalAgents: Float!
    ageGroups: [AgeGroup!]!
    incomeClasses: [IncomeClass!]!
    migrationTendencies: MigrationTendencies!
    consumptionPatterns: ConsumptionPatterns!
    politicalPreferences: [PoliticalPreference!]!
  }

  type EconomicShock {
    oilCrisisPremium: Float!
    foodShortagesIndex: Float!
    disruptionSummary: String!
  }

  type PanicSentiment {
    realtimeNarratives: [String!]!
    protestPropensity: Float!
    misinformationStrength: Float!
  }

  type RecoveryScenario {
    trajectory: String!
    probability: Float!
    description: String!
    estimatedMonths: Int!
  }

  type RecoveryPaths {
    bestCase: RecoveryScenario!
    expected: RecoveryScenario!
    worstCase: RecoveryScenario!
    overallRecommendation: String!
  }

  type CrisisSimulation {
    id: ID!
    scenarioName: String!
    crises: [String!]!
    resilienceScore: Float!
    estimatedRecoveryMonths: Float!
    simulatedPopulation: SimulatedPopulation!
    economicShock: EconomicShock!
    panicSentiment: PanicSentiment!
    cascadeLinks: [String!]!
    recoveryPaths: RecoveryPaths
    createdAt: String!
  }

  type SimulationLaunchStatus {
    simulationId: ID!
    scenarioName: String!
    status: String!
    crises: [String!]!
    resilienceScore: Float!
    estimatedRecoveryMonths: Float!
  }

  # ── Settings Types ────────────────────────────────────────────────────────────

  type SystemSettings {
    operatorName: String!
    operatorId: String!
    operatorInstitution: String!
    operatorRole: String!
    operatorTogglesJson: String!
    modelProcessingBound: String!
    clearanceMatrixJson: String!
    activeRegion: String!
    storagePoliciesJson: String!
    processingBoundary: String!
    theme: String!
    telemetryTogglesJson: String!
    notificationChannelsJson: String!
    networkProtocolsJson: String!
    networkPoliciesJson: String!
  }

  input SystemSettingsInput {
    operatorName: String
    operatorId: String
    operatorInstitution: String
    operatorRole: String
    operatorTogglesJson: String
    modelProcessingBound: String
    clearanceMatrixJson: String
    activeRegion: String
    storagePoliciesJson: String
    processingBoundary: String
    theme: String
    telemetryTogglesJson: String
    notificationChannelsJson: String
    networkProtocolsJson: String
    networkPoliciesJson: String
  }

  type SecurityClearance {
    id: ID!
    name: String!
    serviceId: String!
    level: String!
    status: String!
    expiry: String!
  }

  type AccessToken {
    id: ID!
    owner: String!
    tokenType: String!
    created: String!
    lastUsed: String!
    status: String!
  }

  type AlertRule {
    id: ID!
    name: String!
    severity: String!
    trigger: String!
    destination: String!
    active: Boolean!
  }

  type DeleteResult {
    success: Boolean!
  }

  type ComplianceRecord {
    id: ID!
    name: String!
    score: String!
    risk: String!
    lastAudit: String!
  }

  input ComplianceRecordInput {
    id: ID
    name: String!
    score: String!
    risk: String!
    lastAudit: String!
  }

  type Query {
    getGenome(countryCode: String!): GenomeResponse
    getDetailedGenome(countryCode: String!): DetailedGenomeResponse
    getSimilarity(countryCode: String!): [SimilarityResult!]
    searchGenomes(query: String!, limit: Int): [GenomeResponse!]
    evaluateAction(countryCode: String!, proposedAction: String!, context: String!): ConstitutionalResponse
    getAuthorityProposals: [AuthorityProposal!]!
    # Sandbox queries
    getCrisisSimulations(limit: Int): [CrisisSimulation!]!
    getCrisisSimulation(id: ID!): CrisisSimulation
    # Settings queries
    getSystemSettings: SystemSettings!
    getSecurityClearances: [SecurityClearance!]!
    getAccessTokens: [AccessToken!]!
    getAlertRules: [AlertRule!]!
    getComplianceRecords: [ComplianceRecord!]!
  }

  type Mutation {
    startSandbox(countryCode: String!, epochs: Int!, activeCrises: [String!]!): SandboxStartResponse
    draftContract(itemNeeded: String!, quantityRequired: Int!, urgentReason: String!): ProcurementResponse
    optimizePrompt(agentId: String!, taskDescription: String!, systemPrompt: String!): PromptOptimizeResponse
    validateAuthorityProposal(title: String!): AuthorityProposal!
    # Sandbox mutations
    launchCrisisSimulation(crises: [String!]!, scenarioName: String): SimulationLaunchStatus!
    generateRecoveryPaths(simulationId: ID!, crises: [String!]!): RecoveryPaths!
    saveScenario(crises: [String!]!, scenarioName: String!): CrisisSimulation!
    # Settings mutations
    saveSystemSettings(input: SystemSettingsInput!): SystemSettings!
    updateSecurityClearance(id: ID!, level: String, status: String): SecurityClearance!
    generateAccessToken(tokenType: String!, environment: String!, permissions: String!, owner: String): AccessToken!
    updateAccessToken(id: ID!, action: String!): AccessToken!
    saveAlertRule(id: ID, name: String!, severity: String!, trigger: String!, destination: String!, active: Boolean!): AlertRule!
    deleteAlertRule(id: ID!): DeleteResult!
    saveComplianceRecord(input: ComplianceRecordInput!): ComplianceRecord!
    deleteComplianceRecord(id: ID!): DeleteResult!
  }

  type Subscription {
    sandboxTickStream(countryCode: String!): SandboxTick!
  }
`;
