import re

with open("client/src/components/DigitalTwinDashboard.tsx", "r") as f:
    content = f.read()

# 1. handleAction signature
content = content.replace("const handleAction = async (id: string) => {", "const handleAction = async (id: string, promiseCb?: () => Promise<void>) => {")
content = content.replace("await new Promise(resolve => setTimeout(resolve, 800));", "if (promiseCb) { await promiseCb(); } else { await new Promise(resolve => setTimeout(resolve, 800)); }")

# 2. Add GraphQL Constants before NationModelView
gql_code = """
const GQL_GET_NATION_MODEL = `
  query {
    getNationModelData {
      economyVal economyTrend societyVal societySubtitle
      governanceVal governanceSubtitle infrastructureVal infrastructureTrend
      securityVal securitySubtitle taxationVelocity borderFriction
      cohesionIndex supplyIntegration volatilityIndex integrityPercentage
    }
  }
`;

const GQL_EXECUTE_SHOCK = `
  mutation ExecuteShock($shockName: String!) {
    executeShockScenario(shockName: $shockName) {
      id
    }
  }
`;

const GQL_GET_DEPENDENCIES = `
  query {
    getDependenciesData {
      nodes { id title status icon }
      edges { fromId toId status }
    }
  }
`;

const GQL_GENERATE_DEPENDENCIES = `
  mutation {
    generateDependenciesData {
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
content = content.replace("function NationModelView({ handleAction, actionState }: any) {", gql_code + "function NationModelView({ handleAction, actionState }: any) {")

# 3. Replace NationModelView body
old_nm_view = """function NationModelView({ handleAction, actionState }: any) {
  const [globalParams, setGlobalParams] = React.useState<any>(null);

  React.useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('sovereign_global_params');
      if (saved) setGlobalParams(JSON.parse(saved));
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    const intv = setInterval(handleStorage, 1000);
    return () => {
       window.removeEventListener('storage', handleStorage);
       clearInterval(intv);
    }
  }, []);

  const econLevel = globalParams ? globalParams.econResilience : 45;
  const threatLevel = globalParams ? globalParams.threatSense : 60;
  const trustLevel = globalParams ? 100 - (globalParams.volatility * 5) : 82;"""

new_nm_view = """function NationModelView({ handleAction, actionState }: any) {
  const [model, setModel] = React.useState<any>(null);
  const [selectedShock, setSelectedShock] = React.useState("Kinetic Impact: Grid Substation");
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchModel = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_NATION_MODEL);
      if (res.getNationModelData) {
        setModel(res.getNationModelData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchModel();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/nation-model`
      : `ws://localhost:4000/ws/nation-model`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NATION_MODEL_UPDATED') {
            setModel(msg.data);
          }
        } catch (err) {
          console.error('WS parsing error', err);
        }
      };
    } catch (err) {
      console.error('WS Connection error', err);
    }
    
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const econLevel = model ? model.taxationVelocity : 45;
  const threatLevel = model ? (model.borderFriction === 'High' ? 80 : 60) : 60;
  const trustLevel = model ? model.cohesionIndex : 82;

  const onExecuteShock = async () => {
    handleAction('shock', async () => {
      await graphqlRequest(GQL_EXECUTE_SHOCK, { shockName: selectedShock });
    });
  };"""
content = content.replace(old_nm_view, new_nm_view)

content = content.replace(
    "Integrity: {globalParams ? Math.max(0, 100 - (globalParams.volatility * 2.5)).toFixed(1) : 94.2}%",
    "Integrity: {model ? model.integrityPercentage.toFixed(1) : '94.2'}%"
)
content = content.replace("""<NationStat icon={<Activity size={18} />} title="Economy" val="1.42x" trend="+0.04" />
          <NationStat icon={<Users size={18} />} title="Society" val="Nominal" subtitle={`Cohesion ${Math.round(trustLevel)}%`} />
          <NationStat icon={<Shield size={18} />} title="Governance" val="Stable" subtitle="Approval 54%" />
          <NationStat icon={<Factory size={18} />} title="Infrastructure" val="88%" trend="-2%" />
          <NationStat icon={<ShieldCheck size={18} />} title="Security" val={`DEFCON ${globalParams ? (globalParams.threatSense > 80 ? '2' : '4') : '4'}`} subtitle={`Active Threats: ${globalParams ? Math.round(globalParams.volatility) : 2}`} />""",
          """<NationStat icon={<Activity size={18} />} title="Economy" val={model ? model.economyVal : "1.42x"} trend={model ? model.economyTrend : "+0.04"} />
          <NationStat icon={<Users size={18} />} title="Society" val={model ? model.societyVal : "Nominal"} subtitle={model ? model.societySubtitle : `Cohesion 82%`} />
          <NationStat icon={<Shield size={18} />} title="Governance" val={model ? model.governanceVal : "Stable"} subtitle={model ? model.governanceSubtitle : "Approval 54%"} />
          <NationStat icon={<Factory size={18} />} title="Infrastructure" val={model ? model.infrastructureVal : "88%"} trend={model ? model.infrastructureTrend : "-2%"} />
          <NationStat icon={<ShieldCheck size={18} />} title="Security" val={model ? model.securityVal : "DEFCON 4"} subtitle={model ? model.securitySubtitle : "Active Threats: 2"} />""")

content = content.replace(
    """<ParameterSlider label="Border Friction" val={threatLevel > 60 ? "High" : "Medium"} level={threatLevel} />
            <ParameterSlider label="Social Cohesion Index" val={`${Math.round(trustLevel)}`} level={trustLevel} />
            <ParameterSlider label="Supply Integration" val="Optimal" level={90} />""",
    """<ParameterSlider label="Border Friction" val={model ? model.borderFriction : "Medium"} level={threatLevel} />
            <ParameterSlider label="Social Cohesion Index" val={`${Math.round(trustLevel)}`} level={trustLevel} />
            <ParameterSlider label="Supply Integration" val={model ? model.supplyIntegration : "Optimal"} level={model && model.supplyIntegration === 'Critical' ? 30 : 90} />"""
)

content = content.replace(
    """<select className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500">""",
    """<select 
              value={selectedShock} 
              onChange={(e) => setSelectedShock(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            >"""
)
content = content.replace(
    """<button onClick={() => handleAction('shock')} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer text-sm disabled:opacity-50">""",
    """<button onClick={onExecuteShock} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer text-sm disabled:opacity-50">"""
)

content = content.replace(
    """<span className="text-lg font-bold text-white">{globalParams ? Math.round(globalParams.volatility) : 18}%</span>""",
    """<span className="text-lg font-bold text-white">{model ? model.volatilityIndex : 18}%</span>"""
)
content = content.replace(
    """style={{ width: `${globalParams ? globalParams.volatility : 18}%` }}""",
    """style={{ width: `${model ? model.volatilityIndex : 18}%` }}"""
)

# 4. DependenciesView
deps_code = """
const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={16} />,
  droplets: <Droplets size={16} />,
  database: <Database size={16} />,
  factory: <Factory size={16} />,
  users: <Users size={16} />,
  shield: <Shield size={16} />,
  activity: <Activity size={16} />
};

function DependenciesView({ handleAction, actionState }: any) {
  const [data, setData] = React.useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchData = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_DEPENDENCIES);
      if (res.getDependenciesData) setData(res.getDependenciesData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/dependencies`
      : `ws://localhost:4000/ws/dependencies`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'DEPENDENCIES_DATA_UPDATED') {
            setData(msg.data);
          }
        } catch (err) {
          console.error('WS parsing error', err);
        }
      };
    } catch (err) {
      console.error('WS Connection error', err);
    }
    
    return () => wsRef.current?.close();
  }, []);

  const onGenerate = async () => {
    handleAction('deps', async () => {
      await graphqlRequest(GQL_GENERATE_DEPENDENCIES);
    });
  };

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[700px] flex flex-col relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 max-w-sm">
        <h3 className="text-xl font-bold text-white tracking-tight mb-2 flex items-center justify-between">
          System Dependency Graph
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Mapping critical cascading nodes. Highlighted paths indicate high vulnerability to chained failures where one disruption's cascading effects become visible instantly.
        </p>
        <button onClick={onGenerate} disabled={actionState.status === 'loading'} className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700 text-xs disabled:opacity-50">
          {actionState.status === 'loading' && actionState.id === 'deps' ? 'Simulating...' : 'Simulate New Cascade'}
        </button>
      </div>

      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Node Status Legend</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-amber-500" /> Strained</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-rose-500" /> High Vulnerability</div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-80 mt-12">
        <div className="relative w-full max-w-4xl h-full ml-20 mt-10">
          
          {nodes.map((n: any, idx: number) => {
             const yPercent = nodes.length > 1 ? 15 + (idx * (80 / (nodes.length - 1))) : 50;
             const color = n.status === 'high_vulnerability' ? 'rose' : (n.status === 'strained' ? 'amber' : 'emerald');
             return (
               <DependencyNode 
                 key={n.id} 
                 x="50%" 
                 y={`${yPercent}%`} 
                 color={color as 'emerald'|'amber'|'rose'} 
                 icon={iconMap[n.icon] || <Zap size={16} />} 
                 title={n.title} 
               />
             )
          })}

          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
             {edges.map((e: any, idx: number) => {
                const fromIdx = nodes.findIndex((n: any) => n.id === e.fromId);
                const toIdx = nodes.findIndex((n: any) => n.id === e.toId);
                if (fromIdx === -1 || toIdx === -1) return null;

                const y1 = nodes.length > 1 ? 15 + (fromIdx * (80 / (nodes.length - 1))) : 50;
                const y2 = nodes.length > 1 ? 15 + (toIdx * (80 / (nodes.length - 1))) : 50;
                
                let strokeColor = PALETTE.emerald;
                let strokeWidth = "2";
                let classes = "opacity-80";
                
                if (e.status === 'high_vulnerability') {
                   strokeColor = PALETTE.rose;
                   strokeWidth = "3";
                   classes = "opacity-80 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse";
                } else if (e.status === 'strained') {
                   strokeColor = PALETTE.amber;
                   classes = "opacity-50";
                }

                return (
                  <path key={idx} d={`M 50% ${y1}% L 50% ${y2}%`} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={e.status === 'high_vulnerability' ? "none" : "4 2"} fill="none" className={classes} />
                )
             })}
          </svg>
        </div>
      </div>
    </div>
  );
}
"""

old_deps_view = content[content.find("function DependenciesView() {"):content.find("function DependencyNode({")]

content = content.replace(old_deps_view, deps_code)

content = content.replace(
    "{activeTab === 'dependencies' && <DependenciesView />}",
    "{activeTab === 'dependencies' && <DependenciesView handleAction={handleAction} actionState={actionState} />}"
)

with open("client/src/components/DigitalTwinDashboard.tsx", "w") as f:
    f.write(content)
