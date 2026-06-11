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

  # ── Risk Radar Types ────────────────────────────────────────────────────────────

  type RiskRadarThreat {
    id: ID!
    threatName: String!
    probability: Float!
    severity: String!
    timeToImpact: String!
  }

  type EarlyWarningSignal {
    id: ID!
    signalName: String!
    impact: String!
    probabilityTrend: String!
  }

  type RiskRadarData {
    threats: [RiskRadarThreat!]!
    signals: [EarlyWarningSignal!]!
  }

  # ── Forecasting Types ────────────────────────────────────────────────────────────

  type ForecastTimelinePoint {
    year: String!
    title: String!
    description: String!
  }

  type ForecastData {
    id: ID!
    timelinePoints: [ForecastTimelinePoint!]!
    stabilityDeviation: String!
    convergencePointDescription: String!
    createdAt: String!
  }

  # ── Black Swan Types ────────────────────────────────────────────────────────────

  type BlackSwanAnomaly {
    title: String!
    probability: String!
    severity: String!
    description: String!
  }

  type BlackSwanData {
    id: ID!
    anomalies: [BlackSwanAnomaly!]!
    permutationsRun: Int!
    createdAt: String!
  }

  # ── Nation Model Types ────────────────────────────────────────────────────────

  type NationModelData {
    id: ID!
    economyVal: String!
    economyTrend: String!
    societyVal: String!
    societySubtitle: String!
    governanceVal: String!
    governanceSubtitle: String!
    infrastructureVal: String!
    infrastructureTrend: String!
    securityVal: String!
    securitySubtitle: String!
    taxationVelocity: Int!
    borderFriction: String!
    cohesionIndex: Int!
    supplyIntegration: String!
    volatilityIndex: Int!
    integrityPercentage: Float!
    updatedAt: String!
  }

  # ── Dependencies Types ───────────────────────────────────────────────────────

  type DependencyNode {
    id: String!
    title: String!
    status: String!
    icon: String!
  }

  type DependencyEdge {
    fromId: String!
    toId: String!
    status: String!
  }

  type DependencyGraphData {
    id: ID!
    nodes: [DependencyNode!]!
    edges: [DependencyEdge!]!
    createdAt: String!
  }

  # ── Infrastructure Types ──────────────────────────────────────────────────────

  type InfrastructureMetric {
    label: String!
    val: String!
  }

  type InfrastructureNode {
    id: String!
    title: String!
    icon: String!
    status: String!
    statusColor: String!
    load: Int!
    metrics: [InfrastructureMetric!]!
  }

  type InfrastructureData {
    id: ID!
    nodes: [InfrastructureNode!]!
    createdAt: String!
  }

  # ── Analytics Dashboard Types ──────────────────────────────────────────────────

  type AnalyticsKeyMetric {
    title: String!
    value: String!
    trend: String!
    trendDir: String!
    statusColor: String!
  }

  type VectorDataPoint {
    value: Float!
    isAnomaly: Boolean!
  }

  type ScoreMatrixItem {
    label: String!
    score: Int!
    baseline: Int!
    color: String!
  }

  type IntelligenceReport {
    id: String!
    title: String!
    desc: String!
    date: String!
    confidence: Int!
    category: String!
    isCritical: Boolean!
  }

  type AnalyticsDashboardData {
    id: ID!
    keyMetrics: [AnalyticsKeyMetric!]!
    vectorData: [VectorDataPoint!]!
    scoring: [ScoreMatrixItem!]!
    reports: [IntelligenceReport!]!
    createdAt: String!
  }

  # ── Crisis Dashboard Types ─────────────────────────────────────
  
  type CrisisIncident {
    id: String!
    title: String!
    time: String!
    desc: String!
    severity: String!
    status: String!
    responders: Int!
  }

  type CrisisMapNode {
    id: String!
    x: Float!
    y: Float!
    type: String!
    status: String!
  }

  type CrisisChannel {
    name: String!
    active: Boolean!
    status: String!
  }

  type CrisisLogEntry {
    time: String!
    msg: String!
    type: String!
  }

  type CrisisPolicyOption {
    title: String!
    desc: String!
    tag: String!
  }

  type CrisisComparatorRow {
    metric: String!
    optA: String!
    optB: String!
    optC: String!
  }

  type CrisisChatMsg {
    name: String!
    msg: String!
    time: String!
    isAI: Boolean!
  }

  type CrisisDashboardData {
    id: ID!
    incidents: [CrisisIncident!]!
    mapNodes: [CrisisMapNode!]!
    channels: [CrisisChannel!]!
    logs: [CrisisLogEntry!]!
    policyOptions: [CrisisPolicyOption!]!
    comparatorRows: [CrisisComparatorRow!]!
    chatMsgs: [CrisisChatMsg!]!
    jointResolutionDraft: String!
    activeDefcon: String!
    createdAt: String!
  }

  type CrisisPolicyResponse {
    options: [CrisisPolicyOption!]!
    rows: [CrisisComparatorRow!]!
  }

  # ── COLLABORATION DASHBOARD ───────────────────────────────────────────────

  type CollaborationRoom {
    id: String!
    name: String!
    type: String!
    category: String!
    ping: Boolean!
    unread: Int!
  }

  type CollaborationUser {
    id: String!
    name: String!
    status: String!
  }

  type ArtifactHistory {
    v: String!
    d: String!
  }

  type SharedArtifact {
    id: String!
    title: String!
    date: String!
    type: String!
    metadata: String!
    history: [ArtifactHistory!]!
  }

  type CollaborationMessage {
    roomId: String!
    sender: String!
    text: String!
    time: String!
  }

  type CollaborationData {
    rooms: [CollaborationRoom!]!
    users: [CollaborationUser!]!
    artifacts: [SharedArtifact!]!
    messages: [CollaborationMessage!]!
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
    getRiskRadarData: RiskRadarData!
    getForecastData: ForecastData
    getBlackSwanData: BlackSwanData
    getNationModelData: NationModelData
    getDependenciesData: DependencyGraphData
    getInfrastructureData: InfrastructureData
    getAnalyticsData: AnalyticsDashboardData!
    getCrisisData: CrisisDashboardData!
    getProcurementData: ProcurementDashboardData!
    getIntelligenceData: IntelligenceGraphData!
    getCopilotSession(sessionId: String!): CopilotSession
    getCollaborationData: CollaborationData!
    getCommandCenterData: CommandCenterData!
    getExecutiveBriefingData: ExecutiveBriefingData!
    getMetricDetail(metricId: String!): MetricDetailData!
    getOperatorDashboardData: OperatorDashboardData!
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
    generateRiskRadarData: RiskRadarData!
    generateForecastData: ForecastData!
    generateBlackSwanData: BlackSwanData!
    executeShockScenario(shockName: String!): NationModelData!
    generateDependenciesData: DependencyGraphData!
    simulateAnalyticsUpdate: AnalyticsDashboardData!
    generateSynthesisReport(domain: String!, horizon: String!): IntelligenceReport!
    simulateInfrastructureUpdate: InfrastructureData!
    simulateCrisisUpdate: CrisisDashboardData!
    generatePolicyOptions(prompt: String!): CrisisPolicyResponse!
    simulateProcurementUpdate: ProcurementDashboardData!
    simulateIntelligenceUpdate: IntelligenceGraphData!
    sendCopilotMessage(sessionId: String!, prompt: String!): CopilotMessage!
    clearCopilotSession(sessionId: String!): Boolean!
    createCollaborationRoom(name: String!, type: String!, category: String!): CollaborationRoom!
    sendCollaborationMessage(roomId: String!, sender: String!, text: String!): CollaborationMessage!
    simulateEmergencyPowers(scenario: String!): EmergencyPowersResult!
    analyzeTreatyConstraints(proposal: String!): TreatyConstraintResult!
    refreshCommandCenterData: CommandCenterData!
    refreshExecutiveBriefingData: ExecutiveBriefingData!
  }

  # ── PROCUREMENT DASHBOARD ───────────────────────────────────────────────────

  type ProcurementVendor {
    name: String!
    id: String!
    category: String!
    tier: String!
    status: String!
    reliability: Float!
    distance: String!
    capacity: String!
  }

  type ProcurementContract {
    id: String!
    entity: String!
    type: String!
    date: String!
    status: String!
  }

  type ProcurementMapNode {
    id: String!
    x: Float!
    y: Float!
    type: String!
    statusText: String!
  }

  type ProcurementMapPath {
    path: String!
    stroke: String!
    animated: Boolean!
  }

  type ProcurementRiskVector {
    label: String!
    val: String!
    trend: String!
    color: String!
    detail: String!
  }

  type ProcurementDashboardData {
    vendors: [ProcurementVendor!]!
    contracts: [ProcurementContract!]!
    mapNodes: [ProcurementMapNode!]!
    mapPaths: [ProcurementMapPath!]!
    riskVectors: [ProcurementRiskVector!]!
    defcon: String!
    activeScanAgents: Int!
  }

  type Subscription {
    sandboxTickStream(countryCode: String!): SandboxTick!
  }

  # ── INTELLIGENCE GRAPH DASHBOARD ───────────────────────────────────────────

  type IntelligenceNode {
    id: String!
    type: String!
    baseColor: String!
    connections: Int!
    x: Float!
    y: Float!
    size: Float!
    classStr: String!
    dot: String!
    pulse: Boolean!
  }

  type IntelligenceEdge {
    source: String!
    target: String!
    color: String!
    width: Int!
    dashed: Boolean!
    opacity: Float!
    pulse: Boolean!
  }

  type TopologyStats {
    totalNodes: String!
    activeEdges: String!
    densityScore: String!
    centralityDrift: String!
  }

  type CascadeMitigation {
    label: String!
    val: String!
    pct: Int!
  }

  type CascadeStep {
    time: String!
    title: String!
    desc: String!
    color: String!
    isWarning: Boolean!
    isFinal: Boolean!
  }

  type CascadeScenario {
    id: String!
    trigger: String!
    mitigations: [CascadeMitigation!]!
    steps: [CascadeStep!]!
  }

  type CopilotMessage {
    id: Float
    role: String
    content: String
  }

  type CopilotSession {
    sessionId: String
    messages: [CopilotMessage]
  }

  type IntelligenceGraphData {
    nodes: [IntelligenceNode!]!
    edges: [IntelligenceEdge!]!
    topologyStats: TopologyStats!
    simulations: [CascadeScenario!]!
  }

  # ── COMMAND CENTER TYPES ─────────────────────────────────────────────────────

  type CommandCenterThreat {
    title: String!
    trend: String!
    color: String!
    time: String!
  }

  type CommandCenterRisk {
    year: Int!
    risk: String!
    prob: String!
  }

  type CommandCenterRanking {
    category: String!
    nation: String!
  }

  type CommandCenterRecommendation {
    text: String!
    impact: String!
    icon: String!
  }

  type CommandCenterTimelineEvent {
    year: String!
    name: String!
    type: String!
  }

  type CommandCenterMetric {
    id: String!
    label: String!
    score: String!
    status: String!
    details: String!
    color: String!
  }

  type CommandCenterMapPoint {
    id: String!
    x: String!
    y: String!
    color: String!
    pulse: Boolean!
    stability: String!
    resilience: String!
    activeRisk: String!
  }

  type CommandCenterData {
    stabilityScore: Int!
    stabilityLabel: String!
    trend30d: String!
    activeThreats: Int!
    criticalNations: Int!
    emergingRisks: Int!
    aiBriefing: String!
    threats: [CommandCenterThreat!]!
    futureRisks: [CommandCenterRisk!]!
    rankings: [CommandCenterRanking!]!
    recommendations: [CommandCenterRecommendation!]!
    timelineEvents: [CommandCenterTimelineEvent!]!
    metrics: [CommandCenterMetric!]!
    mapPoints: [CommandCenterMapPoint!]!
  }

  # ── EXECUTIVE BRIEFING TYPES ─────────────────────────────────────────────────

  type ExecutiveTask {
    id: Int!
    title: String!
    desc: String!
    status: String!
    statusColor: String!
    date: String!
    priority: String!
    owner: String!
    dep: String!
  }

  type ExecutiveMeeting {
    id: Int!
    color: String!
    title: String!
    time: String!
    participants: Int!
    priority: String!
  }

  type ExecutiveBriefingData {
    tasks: [ExecutiveTask!]!
    meetings: [ExecutiveMeeting!]!
    totalDirectives: Int!
    resolvedLoops: Int!
    recalibrationRate: String!
    interruptVectors: Int!
  }

  # ── METRIC DETAIL TYPES ──────────────────────────────────────────────────────

  type MetricIndicator {
    label: String!
    value: String!
    trend: String!
  }

  type MetricRiskFactor {
    label: String!
    percent: Int!
    color: String!
  }

  type MetricDetailData {
    id: String!
    label: String!
    score: String!
    trend: String!
    description: String!
    color: String!
    leadingIndicators: [MetricIndicator!]!
    riskFactors: [MetricRiskFactor!]!
    aiNarrative: String!
  }

  # ── EMERGENCY POWERS TYPES ──────────────────────────────────────────────────

  type EmergencyRiskAssessment {
    level: String!
    description: String!
  }

  type EmergencyPowersResult {
    scenario: String!
    allowedActions: [String!]!
    restrictedActions: [String!]!
    judicialRisk: EmergencyRiskAssessment!
    politicalRisk: EmergencyRiskAssessment!
    treatyImpact: String!
  }

  # ── TREATY CONSTRAINTS TYPES ─────────────────────────────────────────────────

  type TreatyAgreement {
    category: String!
    status: String!
    impact: String!
  }

  type TreatyConstraintResult {
    proposal: String!
    agreements: [TreatyAgreement!]!
  }

  # ── NOTIFICATION TYPES ───────────────────────────────────────────────────────

  type Notification {
    id: Int!
    text: String!
    time: String!
    read: Boolean!
  }

  type ActivityTimelineEvent {
    time: String!
    event: String!
    type: String!
  }

  type OperatorDashboardData {
    notifications: [Notification!]!
    timeline: [ActivityTimelineEvent!]!
  }
`;
