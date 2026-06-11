import re

with open("client/src/components/AnalyticsDashboard.tsx", "r") as f:
    content = f.read()

# 1. Add GraphQL definitions at the top
gql_analytics = """
const GQL_GET_ANALYTICS = `
  query {
    getAnalyticsData {
      keyMetrics { title value trend trendDir statusColor }
      vectorData { value isAnomaly }
      scoring { label score baseline color }
      reports { id title desc date confidence category isCritical }
    }
  }
`;

const GQL_SIMULATE_ANALYTICS = `
  mutation {
    simulateAnalyticsUpdate {
      id
    }
  }
`;

const GQL_GENERATE_SYNTHESIS = `
  mutation GenerateSynthesis($domain: String!, $horizon: String!) {
    generateSynthesisReport(domain: $domain, horizon: $horizon) {
      id
    }
  }
`;

async function graphqlRequest(query: string, variables: any = {}) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}
"""
if "GQL_GET_ANALYTICS" not in content:
    content = content.replace("export function AnalyticsDashboard({ initialTab = 'metrics' }: AnalyticsDashboardProps) {", gql_analytics + "\nexport function AnalyticsDashboard({ initialTab = 'metrics' }: AnalyticsDashboardProps) {")

# 2. Add data state and WebSocket to AnalyticsDashboard
hook_code = """
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_ANALYTICS);
      if (res.getAnalyticsData) setAnalyticsData(res.getAnalyticsData);
    } catch (e) { console.error(e); }
  };

  React.useEffect(() => {
    fetchAnalytics();
    const wsUrl = window.location.protocol === 'https:' ? `wss://${window.location.host}/ws/analytics` : `ws://localhost:4000/ws/analytics`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ANALYTICS_DATA_UPDATED') {
            setAnalyticsData(msg.data);
          }
        } catch (err) {}
      };
    } catch (err) {}
    return () => wsRef.current?.close();
  }, []);
"""
content = content.replace("const [filters, setFilters] = useState({ dateRange: '30d', region: 'Global', category: 'All' });", "const [filters, setFilters] = useState({ dateRange: '30d', region: 'Global', category: 'All' });\n" + hook_code)

# 3. Update handleAction
content = content.replace(
"""    if (id === 'export') {
      setActionState({ id, status: 'loading' });
      await new Promise(resolve => setTimeout(resolve, 800));""",
"""    if (id === 'export') {
      setActionState({ id, status: 'loading' });
      await graphqlRequest(GQL_SIMULATE_ANALYTICS); // We will hijack export to simulate update for demonstration
"""
)

# Pass data down
content = content.replace("<MetricsView />", "<MetricsView data={analyticsData} />")
content = content.replace("<ScoringView />", "<ScoringView data={analyticsData} />")
content = content.replace("<IntelligenceReportsView actionState={actionState} handleAction={handleAction} />", "<IntelligenceReportsView data={analyticsData} actionState={actionState} handleAction={handleAction} />")

# 4. Modify MetricsView
metrics_view_old = """function MetricsView() {
  const [chartType, setChartType] = useState<'line'|'bar'>('bar');"""
metrics_view_new = """function MetricsView({ data }: { data: any }) {
  const [chartType, setChartType] = useState<'line'|'bar'>('bar');
  const keyMetrics = data?.keyMetrics || [
    { title: "Global Resilience Index", value: "84.2", trend: "+1.4%", trendDir: "up", statusColor: "blue" },
    { title: "Supply Shock Delta", value: "2.8%", trend: "-0.5%", trendDir: "down", statusColor: "emerald" },
    { title: "Systemic Volatility", value: "14.1", trend: "+2.2%", trendDir: "up", statusColor: "amber" },
    { title: "Critical Node failures", value: "0", trend: "Nominal", trendDir: "neutral", statusColor: "emerald" }
  ];
  const vectorData = data?.vectorData || Array.from({length: 40}).map((_, i) => ({ value: 40 + Math.random() * 60, isAnomaly: i === 12 || i === 28 }));
"""
content = content.replace(metrics_view_old, metrics_view_new)

content = content.replace(
"""        <MetricKeyCard title="Global Resilience Index" value="84.2" trend="+1.4%" trendDir="up" statusColor="blue" />
        <MetricKeyCard title="Supply Shock Delta" value="2.8%" trend="-0.5%" trendDir="down" statusColor="emerald" />
        <MetricKeyCard title="Systemic Volatility" value="14.1" trend="+2.2%" trendDir="up" statusColor="amber" />
        <MetricKeyCard title="Critical Node failures" value="0" trend="Nominal" trendDir="neutral" statusColor="emerald" />""",
"""        {keyMetrics.map((m: any, idx: number) => (
          <MetricKeyCard key={idx} {...m} />
        ))}"""
)

content = content.replace(
"""           {Array.from({length: 40}).map((_, i) => {
             const height = 40 + Math.random() * 60;
             const isAnomaly = i === 12 || i === 28;""",
"""           {vectorData.map((dp: any, i: number) => {
             const height = dp.value;
             const isAnomaly = dp.isAnomaly;"""
)

# 5. Modify ScoringView
scoring_view_old = """function ScoringView() {"""
scoring_view_new = """function ScoringView({ data }: { data: any }) {
  const scoring = data?.scoring || [
    { label: "Institutional Viability", score: 92, baseline: 85, color: "emerald" },
    { label: "Energy Grid Resilience", score: 78, baseline: 80, color: "amber" },
    { label: "Financial Vector Stability", score: 64, baseline: 70, color: "rose" },
    { label: "Cyber Defense Posture", score: 88, baseline: 85, color: "blue" },
    { label: "Logistics & Supply Link", score: 94, baseline: 90, color: "emerald" }
  ];"""
content = content.replace(scoring_view_old, scoring_view_new)

content = content.replace(
"""           <ScoreBar label="Institutional Viability" score={92} color="emerald" baseline={85} />
           <ScoreBar label="Energy Grid Resilience" score={78} color="amber" baseline={80} />
           <ScoreBar label="Financial Vector Stability" score={64} color="rose" baseline={70} />
           <ScoreBar label="Cyber Defense Posture" score={88} color="blue" baseline={85} />
           <ScoreBar label="Logistics & Supply Link" score={94} color="emerald" baseline={90} />""",
"""           {scoring.map((s: any, idx: number) => (
             <ScoreBar key={idx} {...s} />
           ))}"""
)

# 6. Modify IntelligenceReportsView
reports_old = """function IntelligenceReportsView({ actionState, handleAction }: any) {"""
reports_new = """function IntelligenceReportsView({ data, actionState, handleAction }: any) {
  const [domain, setDomain] = useState("All Systems Overview");
  const [horizon, setHorizon] = useState("180 Days (N_STEP)");

  const onGenerate = async () => {
    handleAction('generate', async () => {
      await graphqlRequest(GQL_GENERATE_SYNTHESIS, { domain, horizon });
    });
  };

  const reports = data?.reports || [
    { id: '1', title: "Macro-Economic Stress Analysis (Q3 Projection)", desc: "Analysis of compound effects of fiat volatility...", date: "2 hours ago", confidence: 94, category: "Strategic", isCritical: false }
  ];
"""
content = content.replace(reports_old, reports_new)

# Replace the statically hardcoded reports list
reports_html_old = """        <ReportRow 
          title="Macro-Economic Stress Analysis (Q3 Projection)" 
          desc="Analysis of compound effects of fiat volatility overlapping with sector 4 supply constraint over next 180 days."
          date="2 hours ago"
          confidence={94}
          category="Strategic"
        />
        <ReportRow 
          title="Grid Vulnerability Audit - Nordic Sector" 
          desc="Automated review of dependency cascades arising from winter anomaly baseline."
          date="14 hours ago"
          confidence={88}
          category="Infrastructure"
          isCritical
        />
        <ReportRow 
          title="Socio-Political Cohesion Index Update" 
          desc="Sentiment aggregation across public/private channels indicating a 1.2% dip in localized trust metrics."
          date="1 day ago"
          confidence={96}
          category="Intelligence"
        />
        <ReportRow 
          title="Water Reservoir Predictive Model Variance" 
          desc="Discrepancy detected between forecasted inflow and projected consumption in Zone C."
          date="2 days ago"
          confidence={82}
          category="Environmental"
        />"""
content = content.replace(reports_html_old, """        {reports.map((r: any) => (
          <ReportRow key={r.id} {...r} />
        ))}""")

content = content.replace(
"""<select className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option>All Systems Overview</option>
                 <option>Supply Chain Integrity</option>
                 <option>Geopolitical Kinetic Risks</option>
               </select>""",
"""<select value={domain} onChange={e => setDomain(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option value="All Systems Overview">All Systems Overview</option>
                 <option value="Supply Chain Integrity">Supply Chain Integrity</option>
                 <option value="Geopolitical Kinetic Risks">Geopolitical Kinetic Risks</option>
               </select>"""
)

content = content.replace(
"""<select className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option>180 Days (N_STEP)</option>
                 <option>30 Days (Tactical)</option>
                 <option>3 Years (Strategic)</option>
               </select>""",
"""<select value={horizon} onChange={e => setHorizon(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option value="180 Days (N_STEP)">180 Days (N_STEP)</option>
                 <option value="30 Days (Tactical)">30 Days (Tactical)</option>
                 <option value="3 Years (Strategic)">3 Years (Strategic)</option>
               </select>"""
)

content = content.replace("""onClick={() => handleAction('generate')}""", """onClick={onGenerate}""")

# 7. Update handleAction signature to accept a callback
content = content.replace("const handleAction = async (id: string) => {", "const handleAction = async (id: string, cb?: () => Promise<void>) => {")
content = content.replace("await new Promise(resolve => setTimeout(resolve, 800));\n      setActionState({ id, status: 'success' });", "if (cb) { await cb(); } else { await new Promise(resolve => setTimeout(resolve, 800)); }\n      setActionState({ id, status: 'success' });")

# Fix syntax on export button
content = content.replace(
"""    if (id === 'export') {
      setActionState({ id, status: 'loading' });
      await graphqlRequest(GQL_SIMULATE_ANALYTICS); // We will hijack export to simulate update for demonstration
      
      const csvContent = "Date,Metric,Value\\n2026-06-01,Global Resilience Index,84.2\\n2026-06-01,Supply Shock Delta,2.8\\n2026-06-01,Systemic Volatility,14.1\\n";""",
"""    if (id === 'export') {
      setActionState({ id, status: 'loading' });
      await graphqlRequest(GQL_SIMULATE_ANALYTICS); // We will hijack export to simulate update for demonstration
      
      const csvContent = "Date,Metric,Value\\n2026-06-01,Global Resilience Index,84.2\\n2026-06-01,Supply Shock Delta,2.8\\n2026-06-01,Systemic Volatility,14.1\\n";""")

with open("client/src/components/AnalyticsDashboard.tsx", "w") as f:
    f.write(content)
