import React, { useState } from 'react';
import { Shield, Database, Lock, User, AlertTriangle, AlertCircle } from 'lucide-react';

export function SettingsOperatorProfile({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [operator, setOperator] = useState({
    name: 'Clara Oswald',
    id: 'OPR-9481-B',
    institution: 'Sovereign Logistics Core',
    role: 'Quantum Level 4 Overseer'
  });

  const [toggles, setToggles] = useState({
    tfa: true,
    e2e: true,
    geo: false,
    antigravity: false,
    telemetry: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [dangerModal, setDangerModal] = useState<string | null>(null);
  const [dangerConfirming, setDangerConfirming] = useState(false);

  const confirmDangerAction = () => {
    setDangerConfirming(true);
    setTimeout(() => {
      setDangerConfirming(false);
      const action = dangerModal === 'tokens' ? 'All active session tokens have been revoked.' : 'Scorched Earth protocol engaged. Wipe initiated.';
      addToast(action, 'success');
      setDangerModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <section>
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
          <User size={16} className="text-pink-400" /> Identity & Clearance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InputGroup label="Operator Name" value={operator.name} onChange={(v: string) => setOperator({...operator, name: v})} />
          <InputGroup label="Service ID Number" value={operator.id} onChange={v => setOperator({...operator, id: v})} />
          <InputGroup label="Institution" value={operator.institution} onChange={v => setOperator({...operator, institution: v})} />
          <InputGroup label="Role Classification" value={operator.role} onChange={v => setOperator({...operator, role: v})} />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2 mt-8">
          <Shield size={16} className="text-emerald-400" /> Security Posture
        </h3>
        
        <div className="space-y-4">
          <ToggleRow title="Two-Factor Enclave Auth" desc="Require biometric verification for major configuration changes." active={toggles.tfa} onClick={() => handleToggle('tfa')} />
          <ToggleRow title="End-to-End Encryption" desc="Force quantum-resistant encryption on all peer-to-peer data streams." active={toggles.e2e} onClick={() => handleToggle('e2e')} />
          <ToggleRow title="Strict Geo-Fencing" desc="Drop incoming connections outside verified national grid boundaries." active={toggles.geo} onClick={() => handleToggle('geo')} />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2 mt-8">
          <Database size={16} className="text-purple-400" /> AI & Telemetry
        </h3>
        
        <div className="space-y-4">
          <ToggleRow title="Antigravity Copilot Execution" desc="Allow autonomous execution of containment protocols without human verification." active={toggles.antigravity} onClick={() => handleToggle('antigravity')} />
          <ToggleRow title="Aggregated Telemetry Sharing" desc="Share anonymized disruption data with allied central command." active={toggles.telemetry} onClick={() => handleToggle('telemetry')} />
          
          <div className="pt-4 space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model Processing Bound</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500">
              <option>Strictly Local (Isolated Enclave)</option>
              <option>Hybrid Secure Cloud (Default)</option>
              <option>Full External Processing</option>
            </select>
          </div>
        </div>
      </section>

      <section className="pt-8 mb-4">
        <div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded-2xl">
           <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-2"><Lock size={16} /> Danger Zone</h4>
           <p className="text-xs text-rose-200/70 mb-4">Irreversible actions that could compromise operational capacity.</p>
           <div className="flex flex-col md:flex-row gap-3 md:gap-4">
             <button onClick={() => setDangerModal('tokens')} className="w-full md:w-auto px-4 py-2 bg-slate-900 border border-rose-500/50 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">
               Revoke All Active Tokens
             </button>
             <button onClick={() => setDangerModal('wipe')} className="w-full md:w-auto px-4 py-2 bg-slate-900 border border-rose-500/50 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">
               Initiate 'Scorched Earth' Protocol
             </button>
           </div>
        </div>
      </section>

      {dangerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b0404] border border-rose-600/50 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(225,29,72,0.3)] animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-rose-500/10 rounded-full mb-4 mx-auto border border-rose-500/20">
                <AlertTriangle className="text-rose-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {dangerModal === 'tokens' ? 'Revoke All Tokens?' : 'Initialize Scorched Earth?'}
              </h3>
              <p className="text-sm text-rose-200/70 text-center mb-8 px-2">
                {dangerModal === 'tokens' 
                  ? 'This will immediately disconnect all external API consumers and require re-authentication. This action cannot be undone.'
                  : 'CRITICAL WARNING: This will permanently wipe all operational logs, drop external links, and salt local DB storage.'}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDangerModal(null)}
                  disabled={dangerConfirming}
                  className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDangerAction}
                  disabled={dangerConfirming}
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.6)] cursor-pointer disabled:opacity-50"
                >
                  {dangerConfirming ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Confirm Action'}
                </button>
              </div>
            </div>
            <div className="bg-rose-950/30 p-3 text-center border-t border-rose-900/50 rounded-b-2xl">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <AlertCircle size={10} /> Requires Level 5 Authorization
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{label}</label>
       <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500" />
    </div>
  )
}

function ToggleRow({ title, desc, active, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 border border-slate-800 hover:border-slate-700 bg-slate-900/30 rounded-xl transition-colors cursor-pointer">
       <div className="pr-8 pointer-events-none">
         <h5 className="text-sm font-bold text-white mb-1">{title}</h5>
         <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
       </div>
       <div className={`w-12 h-6 rounded-full flex items-center shrink-0 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}>
         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-7' : 'translate-x-1'}`} />
       </div>
    </div>
  )
}
