import re

with open("client/src/components/CrisisDashboard.tsx", "r") as f:
    content = f.read()

# 1. Add GraphQL & WS imports
gql_import = """import { graphqlRequest } from '../lib/graphql';
const GQL_GET_CRISIS = `
  query {
    getCrisisData {
      incidents { id title time desc severity status responders }
      mapNodes { id x y type status }
      channels { name active status }
      logs { time msg type }
      policyOptions { title desc tag }
      comparatorRows { metric optA optB optC }
      chatMsgs { name msg time isAI }
      jointResolutionDraft activeDefcon
    }
  }
`;
const GQL_SIMULATE_CRISIS = `
  mutation {
    simulateCrisisUpdate {
      id
    }
  }
`;
const GQL_GENERATE_POLICY = `
  mutation($prompt: String!) {
    generatePolicyOptions(prompt: $prompt) {
      options { title }
    }
  }
`;
"""

content = content.replace("import { ShieldAlert", gql_import + "\nimport { ShieldAlert")

# 2. Add State to CrisisDashboard
state_init = """  const [crisisData, setCrisisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await graphqlRequest(GQL_GET_CRISIS);
        if (res.getCrisisData) setCrisisData(res.getCrisisData);
      } catch (err) { console.error(err); }
    };
    fetchData();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/crisis`
      : `ws://localhost:4000/ws/crisis`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'CRISIS_DATA_UPDATED') {
            setCrisisData(msg.data);
          }
        } catch (err) {}
      };
    } catch (err) {}
    
    return () => { wsRef.current?.close(); };
  }, []);

  const handleAlertBroadcast = async () => {
    handleAction('alert');
    try {
      await graphqlRequest(GQL_SIMULATE_CRISIS);
    } catch (e) { console.error(e); }
  };
"""

content = content.replace("const [actionState, setActionState] = useState", state_init + "\n  const [actionState, setActionState] = useState")

# 3. Pass data to views
content = content.replace("<ActiveIncidentsView handleAction={handleAction} actionState={actionState} />", "<ActiveIncidentsView handleAction={handleAction} actionState={actionState} data={crisisData} />")
content = content.replace("<OperationsCenterView handleAction={handleAction} actionState={actionState} />", "<OperationsCenterView handleAction={handleAction} actionState={actionState} data={crisisData} />")
content = content.replace("<DecisionRoomView handleAction={handleAction} />", "<DecisionRoomView handleAction={handleAction} data={crisisData} />")
content = content.replace("<CabinetRoomView />", "<CabinetRoomView data={crisisData} />")

# 4. Modify Defcon
content = re.sub(r'Defcon: 3</span>', 'Defcon: {crisisData ? crisisData.activeDefcon : 3}</span>', content)

# 5. Modify Alert Button
content = content.replace("onClick={() => handleAction('alert')}", "onClick={handleAlertBroadcast}")

# 6. ActiveIncidentsView
content = content.replace("function ActiveIncidentsView({ handleAction, actionState }: any) {", "function ActiveIncidentsView({ handleAction, actionState, data }: any) {")

incidents_repl = """        {data ? data.incidents.map((inc: any, idx: number) => (
          <IncidentCard key={idx} {...inc} />
        )) : (
          <p className="text-gray-500 text-sm">Loading incidents...</p>
        )}
"""

content = re.sub(r'<IncidentCard.*?id="INC-9481".*?/>\s*<IncidentCard.*?id="INC-9480".*?/>\s*<IncidentCard.*?id="INC-9479".*?/>', incidents_repl, content, flags=re.DOTALL)

# 7. OperationsCenterView
content = content.replace("function OperationsCenterView({ handleAction, actionState }: any) {", "function OperationsCenterView({ handleAction, actionState, data }: any) {")

# Map nodes
nodes_repl = """             {data?.mapNodes.map((node: any, idx: number) => (
                <div key={idx} className="absolute flex flex-col items-center" style={{ top: `${node.y}%`, left: `${node.x}%` }}>
                  {node.type === 'critical' ? (
                    <div className="text-rose-500 relative">
                      <div className="w-4 h-4 rounded-full bg-rose-500/20 animate-ping absolute" />
                      <div className="w-4 h-4 rounded-full bg-rose-500/50 absolute z-10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10" />
                      <span className="text-[10px] font-mono text-pink-300 mt-1 bg-black/50 px-1 rounded">{node.id}</span>
                    </>
                  )}
                </div>
             ))}
"""

content = re.sub(r'\{\/\* Map nodes \*\/\}.*?\{\/\* Map connection lines \*\/\}', '{/* Map nodes */}\n' + nodes_repl + '\n             {/* Map connection lines */}', content, flags=re.DOTALL)
content = re.sub(r'\{\/\* Secure node \*\/\}.*?<\/div>\n\s*<\/div>\n\s*<\/div>', '</div>\n           </div>\n        </div>', content, flags=re.DOTALL)


# Channels
channels_repl = """          <div className="space-y-2">
            {data?.channels.map((c: any, idx: number) => (
              <OpsChannel key={idx} name={c.name} active={c.active} status={c.status} />
            ))}
          </div>"""
content = re.sub(r'<div className="space-y-2">\s*<OpsChannel.*?</OpsChannel>\s*<OpsChannel.*?</OpsChannel>\s*<OpsChannel.*?</OpsChannel>\s*</div>', channels_repl, content, flags=re.DOTALL)


# Logs
logs_repl = """          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {data?.logs.map((l: any, idx: number) => (
              <LogEntry key={idx} time={l.time} msg={l.msg} type={l.type} />
            ))}
          </div>"""
content = re.sub(r'<div className="flex-1 overflow-y-auto pr-2 space-y-4">\s*<LogEntry.*?</LogEntry>\s*<LogEntry.*?</LogEntry>\s*<LogEntry.*?</LogEntry>\s*<LogEntry.*?</LogEntry>\s*</div>', logs_repl, content, flags=re.DOTALL)


# 8. DecisionRoomView
content = content.replace("function DecisionRoomView({ handleAction }: any) {", "function DecisionRoomView({ handleAction, data }: any) {\n  const [prompt, setPrompt] = useState('Reduce inflation');\n  const handleGenerate = async () => {\n    handleAction('ai-gen', 'Policies Generated Successfully');\n    try { await graphqlRequest(GQL_GENERATE_POLICY, { prompt }); } catch(e) {}\n  };\n")

content = content.replace("defaultValue=\"Reduce inflation\"", "value={prompt} onChange={e => setPrompt(e.target.value)}")
content = content.replace("onClick={() => handleAction('ai-gen', 'Policies Generated Successfully')}", "onClick={handleGenerate}")

options_repl = """        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-none">
           {data?.policyOptions.map((opt: any, idx: number) => (
             <div key={idx} className={`p-4 rounded-xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 cursor-pointer transition-colors`} onClick={() => handleAction('select-'+idx, opt.tag + ' Selected')}>
               <div className="flex items-start justify-between mb-2">
                 <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                 <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">{opt.tag}</span>
               </div>
               <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
             </div>
           ))}
        </div>"""

content = re.sub(r'<div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-none">\s*\{\/\* Option 1 \*\/\}.*?<\/div>\n\s*<\/div>', options_repl + '\n      </div>', content, flags=re.DOTALL)


comparator_repl = """            <tbody className="text-xs">
              {data?.comparatorRows.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">{row.metric}</td>
                  <td className="p-3 text-white font-mono border-b border-slate-800/50">{row.optA}</td>
                  <td className="p-3 text-white font-mono border-b border-slate-800/50">{row.optB}</td>
                  <td className="p-3 text-white font-mono border-b border-slate-800/50">{row.optC}</td>
                </tr>
              ))}
            </tbody>"""

content = re.sub(r'<tbody className="text-xs">\s*<tr.*?<\/tr>\s*<tr.*?<\/tr>\s*<tr.*?<\/tr>\s*<tr.*?<\/tr>\s*<tr.*?<\/tr>\s*<\/tbody>', comparator_repl, content, flags=re.DOTALL)

# 9. CabinetRoomView
content = content.replace("function CabinetRoomView() {", "function CabinetRoomView({ data }: any) {")

chat_repl = """             <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none">
                {data?.chatMsgs.map((msg: any, idx: number) => (
                  <ChatMsg key={idx} name={msg.name} msg={msg.msg} time={msg.time} isAI={msg.isAI} />
                ))}
             </div>"""
content = re.sub(r'<div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none">\s*<ChatMsg.*?/>\s*<ChatMsg.*?/>\s*<ChatMsg.*?/>\s*<ChatMsg.*?/>\s*</div>', chat_repl, content, flags=re.DOTALL)

draft_repl = """             <div className="flex-1 p-6 overflow-y-auto text-sm text-gray-300 font-serif leading-relaxed relative scrollbar-none">
                <p>{data?.jointResolutionDraft}</p>
                <div className="absolute top-[20%] right-[10%] flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 animate-pulse"></div>
                  <div className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded shadow-lg">Min. of Finance is typing...</div>
                </div>
             </div>"""

content = re.sub(r'<div className="flex-1 p-6 overflow-y-auto text-sm text-gray-300 font-serif leading-relaxed relative scrollbar-none">\s*<p className="mb-4">.*?</p>\s*<p className="mb-4">.*?</p>\s*<p>.*?</p>\s*<div className="absolute top-\[20%\] right-\[10%\] flex items-center gap-2">\s*<div className="w-1 h-4 bg-emerald-400 animate-pulse"><\/div>\s*<div className="px-1\.5 py-0\.5 bg-emerald-500 text-white text-\[8px\] font-bold rounded shadow-lg">Min\. of Finance is typing\.\.\.<\/div>\s*<\/div>\s*<\/div>', draft_repl, content, flags=re.DOTALL)

with open("client/src/components/CrisisDashboard.tsx", "w") as f:
    f.write(content)
