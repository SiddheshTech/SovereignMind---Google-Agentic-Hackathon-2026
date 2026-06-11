import re

with open("client/src/components/DigitalTwinDashboard.tsx", "r") as f:
    content = f.read()

# Add GraphQL definitions
gql_infra = """
const GQL_GET_INFRASTRUCTURE = `
  query {
    getInfrastructureData {
      nodes { id title icon status statusColor load metrics { label val } }
    }
  }
`;

const GQL_SIMULATE_INFRASTRUCTURE_UPDATE = `
  mutation {
    simulateInfrastructureUpdate {
      id
    }
  }
`;
"""
if "GQL_GET_INFRASTRUCTURE" not in content:
    content = content.replace("async function graphqlRequest(", gql_infra + "\nasync function graphqlRequest(")

# Replace InfrastructureView
infra_view_code = """function InfrastructureView({ handleAction, actionState }: any) {
  const [data, setData] = React.useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchData = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_INFRASTRUCTURE);
      if (res.getInfrastructureData) setData(res.getInfrastructureData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/infrastructure`
      : `ws://localhost:4000/ws/infrastructure`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INFRASTRUCTURE_DATA_UPDATED') {
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

  const onSimulate = async () => {
    handleAction('infra', async () => {
      await graphqlRequest(GQL_SIMULATE_INFRASTRUCTURE_UPDATE);
    });
  };

  const nodes = data?.nodes || [];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Real-Time Infrastructure</h3>
          <p className="text-xs text-gray-400 mt-1">Live telemetry from critical national nodes.</p>
        </div>
        <button onClick={onSimulate} disabled={actionState.status === 'loading'} className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700 text-xs disabled:opacity-50">
          {actionState.status === 'loading' && actionState.id === 'infra' ? 'Updating...' : 'Simulate Live Update'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {nodes.map((n: any) => (
          <InfrastructureCard 
            key={n.id}
            id={n.id}
            title={n.title} 
            icon={iconMap[n.icon] || <Server size={20} className="text-indigo-400" />}
            status={n.status}
            statusColor={n.statusColor}
            load={n.load}
            metrics={n.metrics}
          />
        ))}
      </div>
    </div>
  );
}"""

old_infra_view = content[content.find("function InfrastructureView() {"):content.find("function InfrastructureCard({")]
content = content.replace(old_infra_view, infra_view_code + "\n\n")

# Update DigitalTwinDashboard logic to pass handleAction and actionState to InfrastructureView
content = content.replace(
    "{activeTab === 'infrastructure' && <InfrastructureView />}",
    "{activeTab === 'infrastructure' && <InfrastructureView handleAction={handleAction} actionState={actionState} />}"
)

# Update InfrastructureCard to use ID
content = content.replace("function InfrastructureCard({ title, icon, status, statusColor, load, metrics }: any) {", "function InfrastructureCard({ id, title, icon, status, statusColor, load, metrics }: any) {")
content = content.replace("NODE_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}", "NODE_ID: {id}")

with open("client/src/components/DigitalTwinDashboard.tsx", "w") as f:
    f.write(content)
