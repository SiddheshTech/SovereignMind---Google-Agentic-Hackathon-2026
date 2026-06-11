import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, FileSignature, Box, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, Factory, Archive, Download, Building, ArrowUpRight, ShieldAlert, Cpu } from 'lucide-react';

async function graphqlRequest(query: string, variables: any = {}) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data;
}

const GQL_GET_PROCUREMENT = `
  query {
    getProcurementData {
      vendors { name id category tier status reliability distance capacity }
      contracts { id entity type date status }
      mapNodes { id x y type statusText }
      mapPaths { path stroke animated }
      riskVectors { label val trend color detail }
      defcon
      activeScanAgents
    }
  }
`;

const GQL_SIMULATE_PROCUREMENT = `
  mutation {
    simulateProcurementUpdate {
      defcon
    }
  }
`;

const PALETTE = {
  blue: '#3B82F6',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#0F172A',
  uiBorder: '#1E293B',
};

interface ProcurementDashboardProps {
  key?: string;
  initialTab?: 'vendors' | 'contracts' | 'supply-chains';
}

export function ProcurementDashboard({ initialTab = 'vendors' }: ProcurementDashboardProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let ws: WebSocket;
    const connect = () => {
      ws = new WebSocket(`ws://${window.location.host}/ws/procurement`);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PROCUREMENT_DATA_UPDATED') {
            setData(msg.data);
          }
        } catch(e) {}
      };
      ws.onclose = () => setTimeout(connect, 3000);
    };

    graphqlRequest(GQL_GET_PROCUREMENT).then(res => {
      if (res?.getProcurementData) setData(res.getProcurementData);
      connect();
    }).catch(console.error);

    return () => { if (ws) ws.close(); };
  }, []);

  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success', message?: string}>( { id: '', status: 'idle' } );

  const handleAction = async (id: string, customMessage?: string) => {
    setActionState({ id, status: 'loading', message: customMessage });
    try {
      await graphqlRequest(GQL_SIMULATE_PROCUREMENT);
      setActionState({ id, status: 'success', message: customMessage });
      setTimeout(() => setActionState({ id: '', status: 'idle', message: undefined }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle', message: undefined });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 p-3 px-6 rounded-xl bg-pink-600 shadow-[0_0_30px_rgba(59,130,246,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-pink-400">
           {actionState.message || 'ACTION COMPLETED'}
        </div>
      )}

      {/* Sub-header controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => handleAction('filter', 'Filter configuration saved')} className="flex items-center gap-2 px-3 py-1.5 bg-[#030712] border border-slate-800 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer hover:bg-white/5 disabled:opacity-50" disabled={actionState.status === 'loading'}>
            <Filter size={14} /> Refine View
          </button>
          <button onClick={() => handleAction('new-req', 'New Requisition Initiated')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50" disabled={actionState.status === 'loading'}>
            <Package size={14} /> {actionState.status === 'loading' && actionState.id === 'new-req' ? 'Initiating...' : 'New Requisition'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'vendors' && (
          <motion.div
            key="vendors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <VendorsView handleAction={handleAction} actionState={actionState} data={data} />
          </motion.div>
        )}
        {activeTab === 'contracts' && (
          <motion.div
            key="contracts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ContractsView handleAction={handleAction} actionState={actionState} data={data} />
          </motion.div>
        )}
        {activeTab === 'supply-chains' && (
          <motion.div
            key="supply-chains"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <SupplyChainsView handleAction={handleAction} actionState={actionState} data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VendorsView({ handleAction, actionState, data }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const VENDORS = data?.vendors || [];

  const filtered = VENDORS.filter((v: any) => 
    (activeFilter === 'All' || v.category === activeFilter) && 
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Vendor Discovery Engine */}
      <div className="lg:col-span-2 bg-[#030712] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Search className="text-emerald-400" size={20} /> Vendor Discovery Engine
          </h3>
          <div className="relative w-64">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Hospitals, Food, Shelter..." className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs text-white pl-9 pr-3 py-2 outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-2">
           {['All', 'Hospitals', 'Food Suppliers', 'Shelter Providers', 'Logistics Partners', 'Emergency Equipment'].map(f => (
             <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer ${f === activeFilter ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-gray-400 border-slate-700 hover:text-white'}`}>
               {f}
             </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-none">
          {filtered.map((v: any) => (
            <VendorRow 
              key={v.id}
              name={v.name} 
              id={v.id} 
              category={v.category} 
              tier={v.tier} 
              status={v.status} 
              reliability={v.reliability} 
              distance={v.distance}
              capacity={v.capacity}
            />
          ))}
        </div>
      </div>

      {/* Crisis Procurement Marketplace intelligence */}
      <div className="lg:col-span-1 space-y-6 flex flex-col h-[600px]">
        <div className="bg-[#030712] border border-emerald-500/20 rounded-3xl p-6 flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Package size={14}/> Crisis Procurement Marketplace</h4>
          
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-400">Available Stock</span>
               <span className="font-mono font-bold text-white">Live Data Feed</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-400">Avg Delivery Time</span>
               <span className="font-mono text-amber-400">4.2 Hrs (High Priority)</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-400">Geographic Proximity</span>
               <span className="font-mono text-emerald-400">Optimized</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-400">Capacity Estimates</span>
               <span className="font-mono text-sky-400">Current Load 65%</span>
             </div>
          </div>
        </div>

        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center mb-4">
               <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2 tracking-tight">Onboard New Vendor</h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Initiate background scan, secure clearance protocol, and establish integration bounds.
            </p>
            <button onClick={() => handleAction('diligence', 'Due Diligence Initiated')} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-white text-black font-semibold rounded-xl text-xs hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer">
              {actionState.status === 'loading' && actionState.id === 'diligence' ? 'Initiating Scan...' : 'Begin Due Diligence'}
            </button>
        </div>
      </div>

    </div>
  );
}

function VendorRow({ name, id, category, tier, status, reliability, distance, capacity }: any) {
  return (
    <div className="bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-4 transition-colors cursor-pointer flex justify-between items-center group">
       <div className="flex items-center gap-4">
         <div className="w-10 h-10 bg-black border border-slate-700 rounded-lg flex items-center justify-center text-gray-400">
           <Building size={16} />
         </div>
         <div>
           <div className="flex items-center gap-2 mb-1">
             <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{name}</h4>
             <span className="text-[9px] font-mono border border-slate-700 text-gray-500 px-1 rounded">{id}</span>
           </div>
           <span className="text-[11px] text-gray-400">{category} • {distance}</span>
         </div>
       </div>

       <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-slate-700 bg-slate-800 text-gray-300`}>
              {capacity}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-slate-700 bg-slate-800 text-gray-300`}>
              {tier}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border 
              ${status === 'Active' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 
                status === 'Review' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 
                'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono">
            <span className="text-gray-500">R-INDEX</span>
            <span className={reliability > 90 ? 'text-emerald-400' : reliability > 80 ? 'text-amber-400' : 'text-rose-400'}>
               {reliability}%
            </span>
          </div>
       </div>
    </div>
  )
}

function ContractsView({ handleAction, actionState, data }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Contract Generator / Document builder */}
      <div className="lg:col-span-3 bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col relative overflow-hidden">
        <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
          <FileSignature className="text-pink-400" size={20}/> Contract Generator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <button onClick={() => handleAction('emg-contract', 'Emergency Contract Generated')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 transition-colors text-pink-400 cursor-pointer">
             <FileSignature size={24} />
             <span className="text-[10px] font-bold uppercase tracking-wider text-center">Emergency<br/>Contract</span>
           </button>
           <button onClick={() => handleAction('proc-contract', 'Procurement Request Formatted')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors text-gray-300 cursor-pointer">
             <Box size={24} />
             <span className="text-[10px] font-bold uppercase tracking-wider text-center">Procurement<br/>Request</span>
           </button>
           <button onClick={() => handleAction('rfq-contract', 'RFQ Document Generated')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors text-gray-300 cursor-pointer">
             <Search size={24} />
             <span className="text-[10px] font-bold uppercase tracking-wider text-center">RFQ<br/>Generation</span>
           </button>
           <button onClick={() => handleAction('eval-contract', 'Vendor Evaluation Initialized')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors text-gray-300 cursor-pointer">
             <ShieldCheck size={24} />
             <span className="text-[10px] font-bold uppercase tracking-wider text-center">Vendor<br/>Evaluation</span>
           </button>
        </div>

        <h4 className="text-sm font-semibold tracking-wide text-gray-300 mb-4">Recent AI-Generated Contracts</h4>
        
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030712] border-b border-slate-800 text-gray-400 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-semibold">Document ID</th>
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Generated</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(data?.contracts || []).map((c: any) => (
                <ContractTableRow key={c.id} id={c.id} entity={c.entity} type={c.type} date={c.date} status={c.status} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generator settings / Summary */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#030712] border border-pink-500/20 rounded-3xl p-5">
           <h4 className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-4">AI Copilot Status</h4>
           <div className="flex items-center gap-3 mb-4">
             <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
             <span className="text-sm font-mono text-white">Generator Active</span>
           </div>
           <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">System is ready to autogenerate legally-binding templates mapped to current jurisdictional state.</p>
           
           <div className="space-y-2 mb-4">
               <div className="flex justify-between text-[10px] font-mono"><span className="text-gray-400">Clause Accuracy</span><span className="text-emerald-400">99.8%</span></div>
               <div className="flex justify-between text-[10px] font-mono"><span className="text-gray-400">Avg Generation</span><span className="text-sky-400">1.2s</span></div>
           </div>
        </div>

        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5">
           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Compliance Scanners</h4>
           <div className="space-y-3">
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-300">Liability Limits</span>
               <CheckCircle2 size={14} className="text-emerald-400"/>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-300">Force Majeure Flags</span>
               <CheckCircle2 size={14} className="text-emerald-400"/>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
}

function ContractTableRow({ id, entity, type, date, status }: any) {
  const getColors = () => {
    switch(status) {
      case 'Active': return 'text-emerald-400';
      case 'Approved': return 'text-sky-400';
      case 'Completed': return 'text-emerald-400';
      case 'Pending Signature': return 'text-amber-400';
      case 'Dispatched': return 'text-pink-400';
      default: return 'text-white';
    }
  }

  return (
    <tr className="hover:bg-slate-800/30 transition-colors group cursor-pointer">
      <td className="px-4 py-3 font-mono text-gray-500 group-hover:text-pink-400 transition-colors">{id}</td>
      <td className="px-4 py-3 text-gray-300 font-medium">{entity}</td>
      <td className="px-4 py-3 font-mono text-gray-400">{type}</td>
      <td className="px-4 py-3 font-mono text-gray-500">{date}</td>
      <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${getColors()}`}>{status}</td>
    </tr>
  )
}

function SupplyChainsView({ handleAction, actionState, data }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Supply Chain Risk Scanner Map */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[500px] flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cpu className="text-cyan-400" size={20} /> Supply Chain Risk Scanner
            </h3>
            <div className="text-[10px] text-gray-500 font-mono mt-1">REAL-TIME GLOBAL TELEMETRY</div>
          </div>
          <button onClick={() => handleAction('run-scan', 'Full Telemetry Scan Completed')} disabled={actionState.status === 'loading'} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-gray-300 text-xs hover:text-white transition-colors disabled:opacity-50 cursor-pointer">
             {actionState.status === 'loading' && actionState.id === 'run-scan' ? 'Scanning...' : 'Run Full Scan'}
          </button>
        </div>

        {/* Abstract Map Nodes */}
        <div className="absolute inset-0 top-20 flex items-center justify-center opacity-80 z-0">
          <div className="relative w-full h-[300px]">
             {(data?.mapNodes || []).map((n: any) => {
               const Icon = n.type.toLowerCase() === 'factory' ? Factory : n.type.toLowerCase() === 'distribution' ? Archive : n.type.toLowerCase() === 'endpoint' ? Building : ShieldAlert;
               const borderColor = n.type.toLowerCase() === 'factory' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 
                                   n.type.toLowerCase() === 'distribution' ? 'border-pink-500/50 bg-pink-500/10 text-pink-400' : 
                                   n.type.toLowerCase() === 'disruption' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 animate-pulse' : 
                                   'border-slate-600 bg-slate-800 text-gray-400';
               const textColor = n.type.toLowerCase() === 'factory' ? 'text-emerald-400 border-emerald-500/30' : 
                                 n.type.toLowerCase() === 'distribution' ? 'text-pink-400 border-pink-500/30' : 
                                 n.type.toLowerCase() === 'disruption' ? 'text-rose-400 border-rose-500/30' : '';
               return (
                 <div key={n.id} className="absolute flex flex-col items-center gap-2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                    <div className={`w-10 h-10 border rounded-full flex items-center justify-center z-10 ${borderColor}`}>
                      <Icon size={16} />
                    </div>
                    {n.statusText && <span className={`text-[9px] font-mono whitespace-nowrap bg-black/60 px-1 rounded shadow-md border ${textColor}`}>{n.statusText}</span>}
                 </div>
               );
             })}

             {/* Connecting Flow lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
               {(data?.mapPaths || []).map((p: any, i: number) => (
                 <path key={i} d={p.path} fill="none" stroke={p.stroke} strokeWidth="0.5" strokeDasharray={p.animated ? "2 2" : "none"} className={p.animated ? "animate-pulse" : ""} />
               ))}
             </svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6">
           <h4 className="text-sm font-semibold tracking-wide text-gray-300 mb-6 flex items-center gap-2">
             <AlertTriangle size={16} className="text-amber-500" /> Monitored Risk Vectors
           </h4>
           
           <div className="space-y-4">
              {(data?.riskVectors || []).map((r: any, i: number) => (
                <RiskMonitorItem key={i} label={r.label} val={r.val} trend={r.trend} color={r.color} detail={r.detail} />
              ))}
           </div>
        </div>
        
        <div className="flex gap-4">
           <div className="flex-1 bg-[#030712] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
             <span className="text-[10px] text-gray-500 font-mono uppercase font-semibold">Global Threat Level</span>
             <div className="text-2xl font-bold text-amber-500 mt-2 tracking-tight">DEFCON {data?.defcon || '3'}</div>
           </div>
           <div className="flex-1 bg-[#030712] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
             <span className="text-[10px] text-gray-500 font-mono uppercase font-semibold">Active Scan Agents</span>
             <div className="text-2xl font-bold text-white mt-2 tracking-tight">{data?.activeScanAgents?.toLocaleString() || '0'}<span className="text-sm font-normal text-emerald-500 ml-2">Online</span></div>
           </div>
        </div>
      </div>

    </div>
  );
}

function RiskMonitorItem({ label, val, trend, color, detail }: any) {
  const getStyle = () => {
    switch (color) {
      case 'emerald': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'amber': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'rose': return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
      default: return 'text-gray-400 border-gray-700 bg-gray-800';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl border ${getStyle()} flex flex-col gap-2`}>
       <div className="flex justify-between items-start">
         <span className="text-xs font-bold">{label}</span>
         <span className="text-sm font-mono font-bold tracking-tight">{val}</span>
       </div>
       <p className="text-[10px] opacity-80 font-sans leading-relaxed">{detail}</p>
    </div>
  )
}
