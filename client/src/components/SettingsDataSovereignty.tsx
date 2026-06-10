import React, { useState } from 'react';
import { Database, MapPin, ShieldCheck, FileText, Globe, Server, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsDataSovereignty({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [activeRegion, setActiveRegion] = useState('EU');
  const [policies, setPolicies] = useState({
    localization: true,
    replication: false,
    sovereignBackups: true,
    immutableArchives: true,
  });
  const [processingBound, setProcessingBound] = useState('Trusted Regions');

  const regions = [
    { id: 'USA', name: 'US East (N. Virginia)', status: 'Active', latency: '42ms', x: '25%', y: '40%' },
    { id: 'EU', name: 'Europe (Frankfurt)', status: 'Primary', latency: '12ms', x: '52%', y: '25%' },
    { id: 'India', name: 'Asia South (Mumbai)', status: 'Active', latency: '68ms', x: '70%', y: '45%' },
    { id: 'Singapore', name: 'Asia SE (Singapore)', status: 'Standby', latency: '85ms', x: '75%', y: '55%' },
    { id: 'Japan', name: 'Asia NE (Tokyo)', status: 'Active', latency: '58ms', x: '85%', y: '35%' },
    { id: 'Australia', name: 'Oceania (Sydney)', status: 'Standby', latency: '110ms', x: '88%', y: '75%' },
  ];

  const compliance = [
    { name: 'GDPR', score: '99%', risk: 'Low', lastAudit: '2026-05-12' },
    { name: 'DPDP (India)', score: '100%', risk: 'None', lastAudit: '2026-05-14' },
    { name: 'HIPAA', score: '95%', risk: 'Low', lastAudit: '2026-04-30' },
    { name: 'SOC2 Type II', score: '100%', risk: 'None', lastAudit: '2026-01-15' },
    { name: 'ISO 27001', score: '98%', risk: 'Low', lastAudit: '2025-11-20' },
  ];

  const handlePolicyChange = (key: keyof typeof policies) => {
    setPolicies(prev => ({ ...prev, [key]: !prev[key] }));
    addToast(`Storage policy updated.`, 'success');
  };

  const handleRegionClick = (regionId: string) => {
    setActiveRegion(regionId);
    addToast(`Focus shifted to ${regionId} node.`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Upper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Interactive Map */}
        <section className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-[350px] md:h-80">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Globe size={16} className="text-pink-400" /> Data Regions
            </h3>
            <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              6 Active Nodes
            </span>
          </div>
          
          {/* Mock Map Background */}
          <div className="absolute inset-0 top-16 bottom-4 w-[90%] left-[5%] opacity-20 pointer-events-none">
             <svg viewBox="0 0 1000 500" className="w-full h-full fill-slate-700 stroke-slate-600">
               {/* Very rough shapes just to look like landmass abstractly */}
               <path d="M150,100 Q200,80 250,150 T150,250 T100,150 Z" />
               <path d="M450,50 Q600,60 650,200 T450,250 Z" />
               <path d="M700,100 Q800,150 900,100 T850,250 T700,200 Z" />
             </svg>
          </div>

          {regions.map(r => (
            <motion.div 
              key={r.id}
              className="absolute group z-10 cursor-pointer"
              style={{ left: r.x, top: r.y }}
              onClick={() => handleRegionClick(r.id)}
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${activeRegion === r.id ? 'bg-pink-400' : r.status === 'Standby' ? 'bg-slate-500' : 'bg-emerald-400'} shadow-[0_0_15px_currentColor]`}></div>
                {activeRegion === r.id && (
                  <motion.div 
                    animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-pink-400 rounded-full"
                  />
                )}
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20 flex flex-col items-center">
                  <span className="text-xs font-bold text-white mb-0.5">{r.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{r.latency} ping</span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Active Region Detail */}
          <div className="absolute bottom-6 left-6 p-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl max-w-[200px]">
             {regions.filter(r => r.id === activeRegion).map(r => (
               <div key={r.id}>
                 <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Selected Region</div>
                 <div className="font-bold text-white text-sm mb-2 truncate">{r.name}</div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Status</span>
                   <span className={r.status === 'Primary' ? 'text-pink-400' : r.status === 'Standby' ? 'text-slate-400' : 'text-emerald-400'}>{r.status}</span>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* Processing Boundaries */}
        <section className="col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6 shrink-0">
            <Server size={16} className="text-purple-400" /> Boundaries
          </h3>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Data Processing Zone</label>
               <select 
                 value={processingBound} 
                 onChange={e => {
                   setProcessingBound(e.target.value);
                   addToast(`Processing boundary set to: ${e.target.value}`, 'success');
                 }} 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
               >
                 <option>Local Only (Isolated)</option>
                 <option>Trusted Regions</option>
                 <option>Allied Network</option>
                 <option>Global Processing</option>
               </select>
            </div>
            
            <div className="pt-4 border-t border-slate-800 mt-4">
              <p className="text-[10px] text-purple-400/80 leading-relaxed font-mono">
                NOTICE: Selecting 'Global Processing' will route computation through secondary nodes to optimize speed, potentially violating local sovereignty requirements.
              </p>
            </div>
          </div>
        </section>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Storage Policies */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Database size={16} className="text-emerald-400" /> Storage Policies
          </h3>
          
          <div className="space-y-3">
            {[
              { id: 'localization', title: 'Data Localization', desc: 'Force all records to be stored in the country of origin.' },
              { id: 'replication', title: 'Cross-Border Replication', desc: 'Allow background sync to international disaster recovery zones.' },
              { id: 'sovereignBackups', title: 'Sovereign Backups', desc: 'Use only state-owned infrastructure for cold storage.' },
              { id: 'immutableArchives', title: 'Immutable Archives', desc: 'Prevent deletion or modification of audit logs.' },
            ].map((policy) => {
              const active = policies[policy.id as keyof typeof policies];
              return (
                <div key={policy.id} className="flex items-center justify-between p-3 border border-slate-800 hover:border-slate-700 bg-slate-800/30 rounded-xl transition-colors">
                   <div className="pr-4">
                     <h5 className="text-xs font-bold text-white mb-0.5">{policy.title}</h5>
                     <p className="text-[10px] text-gray-400">{policy.desc}</p>
                   </div>
                   <button 
                     onClick={() => handlePolicyChange(policy.id as keyof typeof policies)}
                     className={`w-10 h-5 md:w-12 md:h-6 rounded-full flex items-center shrink-0 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                   >
                     <div className={`w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'}`} />
                   </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Compliance Center */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <ShieldCheck size={16} className="text-emerald-400" /> Compliance Center
          </h3>
          
          <div className="overflow-auto max-h-60 pr-2 pb-4">
            <div className="space-y-3">
              {compliance.map((item, idx) => (
                <div key={idx} className="flex flex-col bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${item.risk === 'None' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {item.risk} Risk
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <div>Score: <span className="text-white ml-1">{item.score}</span></div>
                    <div>Audit: <span className="text-white ml-1">{item.lastAudit}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
