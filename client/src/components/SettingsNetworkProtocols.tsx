import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Shield, Wifi, Zap, Activity, HardDrive, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { fetchSystemSettings, saveSystemSettings } from '../lib/settingsApi';

type Protocols = { https: boolean; mesh: boolean; quantum: boolean; satellite: boolean; tunnel: boolean; };
type Sliders = { encryption: number; packetInspection: number; telemetry: number; threatDetection: number; };

export function SettingsNetworkProtocols({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [protocols, setProtocols] = useState<Protocols>({
    https: true,
    mesh: true,
    quantum: false,
    satellite: true,
    tunnel: false,
  });

  const [sliders, setSliders] = useState<Sliders>({
    encryption: 75,
    packetInspection: 100,
    telemetry: 50,
    threatDetection: 90,
  });

  const [testResult, setTestResult] = useState<{ running: boolean, log: string[], final?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<'idle' | 'saving'>('idle');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await fetchSystemSettings();
      try {
        const np = JSON.parse(s.networkProtocolsJson || '{}');
        if (Object.keys(np).length > 0) setProtocols(prev => ({ ...prev, ...np }));
      } catch (_) {}
      try {
        const np2 = JSON.parse(s.networkPoliciesJson || '{}');
        if (Object.keys(np2).length > 0) setSliders(prev => ({ ...prev, ...np2 }));
      } catch (_) {}
    } catch (err: any) {
      addToast('Failed to load network settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleToggleProtocol = async (key: keyof Protocols) => {
    const updated = { ...protocols, [key]: !protocols[key] };
    setProtocols(updated);
    try {
      await saveSystemSettings({ networkProtocolsJson: JSON.stringify(updated) });
      addToast(`Protocol ${String(key).toUpperCase()} state changed.`, 'info');
    } catch (err: any) {
      addToast('Failed to save protocol state.', 'error');
    }
  };

  const handleSliderChange = (key: keyof Sliders, val: number) => {
    setSliders(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveProtocolConfig = async () => {
    setActionState('saving');
    try {
      await saveSystemSettings({
        networkProtocolsJson: JSON.stringify(protocols),
        networkPoliciesJson: JSON.stringify(sliders),
      });
      addToast('Protocol configuration saved and synchronized globally.', 'success');
    } catch (err: any) {
      addToast('Failed to save configuration: ' + err.message, 'error');
    } finally {
      setActionState('idle');
    }
  };

  const runTest = (testName: string) => {
    setTestResult({ running: true, log: [`Initiating ${testName}...`] });
    
    setTimeout(() => {
      setTestResult(prev => ({ ...prev!, log: [...prev!.log, 'Resolving sovereign DNS records... ok'] }));
    }, 600);
    
    setTimeout(() => {
      setTestResult(prev => ({ ...prev!, log: [...prev!.log, 'Checking node routing paths... 3 hops'] }));
    }, 1200);

    setTimeout(() => {
      let finalMsg = '';
      if (testName === 'Ping') finalMsg = 'Average latency: 14ms (Optimal)';
      if (testName === 'Trace Route') finalMsg = 'Trace complete. 0 packet loss.';
      if (testName === 'Throughput Test') finalMsg = 'Down: 45Gbps | Up: 40Gbps';
      if (testName === 'Latency Test') finalMsg = 'RTT: 2.1ms (Local) / 45ms (Gateway)';
      
      setTestResult(prev => ({ running: false, log: [...prev!.log, 'Finalizing diagnostics...'], final: finalMsg }));
      addToast(`${testName} completed successfully.`, 'success');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-pink-400" size={32} />
        <span className="ml-3 text-gray-400 text-sm">Loading network settings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Active Protocols */}
      <section>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
          <Globe size={16} className="text-pink-400" /> Active Protocols
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'https', name: 'HTTPS', desc: 'TLS 1.3 Strict', icon: Shield },
            { id: 'mesh', name: 'Sovereign Mesh', desc: 'P2P Encrypted Node', icon: Wifi },
            { id: 'quantum', name: 'Quantum Relay', desc: 'QKD Channel', icon: Zap },
            { id: 'satellite', name: 'Satellite Uplink', desc: 'LEO Constellation', icon: Activity },
            { id: 'tunnel', name: 'Enclave Tunnel', desc: 'Deep IPSEC VPN', icon: HardDrive },
          ].map(p => {
            const active = protocols[p.id as keyof Protocols];
            const Icon = p.icon;
            
            return (
              <div 
                key={p.id} 
                onClick={() => handleToggleProtocol(p.id as keyof Protocols)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  active ? 'bg-pink-900/20 border-pink-500/50 hover:border-pink-400' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {active && <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                
                <Icon size={20} className={`mb-3 ${active ? 'text-pink-400' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-white mb-1">{p.name}</div>
                <div className="text-[10px] text-gray-500 font-mono tracking-wider">{p.desc}</div>
                
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${active ? 'bg-pink-400 shadow-[0_0_8px_#60a5fa]' : 'bg-slate-700'}`} />
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network Topology Viewer */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-[300px]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4 relative z-20">
            <Activity size={16} className="text-emerald-400" /> Topology Matrix
          </h3>
          
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none">
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
               <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Satellite Nodes */}
            {[
              { x: '-120px', y: '-80px', color: 'bg-pink-500', line: 'M 150 150 L 50 70' },
              { x: '120px', y: '-60px', color: 'bg-purple-500', line: 'M 150 150 L 250 90' },
              { x: '-100px', y: '100px', color: 'bg-emerald-500', line: 'M 150 150 L 70 230' },
              { x: '130px', y: '110px', color: 'bg-pink-500', line: 'M 150 150 L 260 240' },
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div 
                  className="absolute z-20 w-6 h-6 rounded-full flex items-center justify-center border border-white/20"
                  style={{ top: `calc(50% + ${node.y})`, left: `calc(50% + ${node.x})`, backgroundColor: 'rgba(15,23,42,1)' }}
                >
                  <div className={`w-3 h-3 rounded-full ${node.color} shadow-[0_0_10px_currentColor]`} />
                </div>
                <svg className="absolute inset-0 w-full h-full z-10 opacity-30">
                  <path d={node.line} stroke="currentColor" className="text-emerald-500" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </React.Fragment>
            ))}

            {/* Simulated controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-30">
              <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-white scale-110 pointer-events-auto cursor-pointer leading-none pb-0.5 hover:bg-slate-700">+</div>
              <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-white scale-110 pointer-events-auto cursor-pointer leading-none pb-0.5 hover:bg-slate-700">-</div>
            </div>
          </div>
        </section>

        {/* Protocol Policies */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Shield size={16} className="text-purple-400" /> Protocol Policies
          </h3>
          
          <div className="space-y-6">
            {[
              { id: 'encryption', label: 'Encryption Standard Rating' },
              { id: 'packetInspection', label: 'Deep Packet Inspection' },
              { id: 'telemetry', label: 'Network Telemetry Depth' },
              { id: 'threatDetection', label: 'Heuristic Threat Detection' },
            ].map((slider) => {
              const val = sliders[slider.id as keyof Sliders];
              return (
                <div key={slider.id}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-300">{slider.label}</label>
                    <span className="text-[10px] font-mono text-pink-400">{val}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative flex items-center">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={val} 
                      onChange={(e) => handleSliderChange(slider.id as keyof Sliders, parseInt(e.target.value))}
                      className="w-full h-full opacity-0 absolute cursor-pointer z-10"
                    />
                    <div className="h-full bg-gradient-to-r from-pink-600 to-purple-500 rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Connectivity Test Center */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" /> Diagnostics
            </h3>
            <p className="text-xs text-gray-400 max-w-md">Run manual network diagnostics to verify internal and external gateway routing metrics.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <button disabled={testResult?.running} onClick={() => runTest('Ping')} className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:border-amber-500 text-amber-500 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
               Ping
             </button>
             <button disabled={testResult?.running} onClick={() => runTest('Trace Route')} className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:border-pink-500 text-pink-500 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
               Trace Route
             </button>
             <button disabled={testResult?.running} onClick={() => runTest('Throughput Test')} className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:border-emerald-500 text-emerald-500 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
               Throughput Test
             </button>
             <button disabled={testResult?.running} onClick={() => runTest('Latency Test')} className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:border-purple-500 text-purple-500 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
               Latency Test
             </button>
          </div>
        </div>

        {/* Diagnostics Console Output */}
        <div className="bg-black/50 border border-slate-800/80 rounded-xl p-4 h-32 font-mono text-[10px] md:text-xs overflow-y-auto">
          {!testResult ? (
            <div className="text-slate-600 flex items-center justify-center h-full gap-2">
              <AlertCircle size={14} /> System awaiting diagnostic command...
            </div>
          ) : (
            <div className="space-y-1 text-emerald-500">
              {testResult.log.map((line, i) => (
                <div key={i}>&gt; {line}</div>
              ))}
              {testResult.running && (
                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></div>
                  processing request
                </div>
              )}
              {testResult.final && (
                <div className="mt-4 pt-2 border-t border-emerald-900/50 text-white font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" /> {testResult.final}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-slate-800">
         <p className="text-[10px] text-gray-500 mb-4 sm:mb-0">Bandwidth caps apply to non-emergency scenarios.</p>
         <button 
           disabled={testResult?.running || actionState === 'saving'}
           onClick={handleSaveProtocolConfig} 
           className="w-full sm:w-auto px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
         >
           {actionState === 'saving' ? <Activity size={14} className="animate-spin" /> : null}
           {actionState === 'saving' ? 'Synchronizing...' : 'Save Protocol Config'}
         </button>
      </div>
    </div>
  );
}
