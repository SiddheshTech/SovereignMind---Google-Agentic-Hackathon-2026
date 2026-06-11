import React, { useState } from 'react';
import { Bell, Plus, Radio, ShieldAlert, Zap, Send, Phone, Activity, X, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsAlertRouting({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [rules, setRules] = useState([
    { id: 1, name: 'Critical Breach', severity: 'High', trigger: 'Unauthorized Access', destination: 'Director', active: true },
    { id: 2, name: 'Node Failure', severity: 'Medium', trigger: 'Ping > 500ms', destination: 'Supervisor', active: true },
    { id: 3, name: 'Data Extrusion Vol', severity: 'Medium', trigger: 'Bandwidth Spike', destination: 'Operator', active: false },
    { id: 4, name: 'AI Containment', severity: 'Critical', trigger: 'Parameter Break', destination: 'Command Authority', active: true },
  ]);

  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    signal: true,
    secureRadio: false,
    internalMessenger: true,
  });

  const [simulating, setSimulating] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);

  const [newRule, setNewRule] = useState({
    name: '',
    severity: 'Medium',
    trigger: 'System Anomaly',
    destination: 'Operator'
  });

  const handleToggleRule = (id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    addToast('Routing rule state updated.', 'success');
  };

  const handleToggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
    addToast(`${String(key).toUpperCase()} channel configuration updated.`, 'success');
  };

  const testChannel = (channelName: string) => {
    addToast(`Testing connection to ${channelName}...`, 'info');
    setTimeout(() => {
      addToast(`Ping to ${channelName} successful. Link stabilized.`, 'success');
    }, 1500);
  };

  const runSimulation = (type: string) => {
    setSimulating(type);
    addToast(`Simulating ${type} alert. Initiating cascade protocol...`, 'warning');
    setTimeout(() => {
      setSimulating(null);
      addToast(`Simulation ${type} resolved. Metrics captured.`, 'success');
    }, 4000);
  };

  const handleDeleteRule = (id: number) => {
    setRules(prev => prev.filter(r => r.id !== id));
    addToast('Routing rule deleted.', 'info');
  };

  const handleEditRule = (rule: typeof rules[0]) => {
    setEditingRuleId(rule.id);
    setNewRule({ name: rule.name, severity: rule.severity, trigger: rule.trigger, destination: rule.destination });
    setShowCreateModal(true);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name) return;
    
    if (editingRuleId) {
      setRules(prev => prev.map(r => r.id === editingRuleId ? { ...r, ...newRule } : r));
      addToast('Routing rule updated.', 'success');
    } else {
      setRules([...rules, { ...newRule, id: Date.now(), active: true }]);
      addToast('New routing rule configured.', 'success');
    }
    
    setShowCreateModal(false);
    setEditingRuleId(null);
    setNewRule({ name: '', severity: 'Medium', trigger: 'System Anomaly', destination: 'Operator' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Routing Rules */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Routing Rules
            </h3>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white rounded border border-pink-500/50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${rule.active ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{rule.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      rule.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                      rule.severity === 'High' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>{rule.severity}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-2">
                    <span className="text-gray-500">Trigger:</span> <span className="font-mono text-pink-300">{rule.trigger}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-gray-500">Target:</span> <span className="font-medium text-white">{rule.destination}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEditRule(rule)} className="p-1.5 text-gray-500 hover:text-pink-400 hover:bg-slate-800 rounded transition-colors" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteRule(rule.id)} className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleToggleRule(rule.id)}
                    className={`w-10 h-5 rounded-full flex items-center shrink-0 transition-colors ml-2 ${rule.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${rule.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notification Channels */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Radio size={16} className="text-emerald-400" /> Channels
          </h3>
          
          <div className="space-y-4">
            {[
              { id: 'email', name: 'Encrypted Email', icon: Send },
              { id: 'sms', name: 'Tactical SMS', icon: Phone },
              { id: 'signal', name: 'Signal Protocol DB', icon: ShieldAlert },
              { id: 'secureRadio', name: 'VLF Secure Radio', icon: Radio },
              { id: 'internalMessenger', name: 'Sovereign Messenger', icon: Bell },
            ].map((ch) => {
              const active = channels[ch.id as keyof typeof channels];
              const Icon = ch.icon;
              return (
                <div key={ch.id} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                       <Icon size={14} />
                     </div>
                     <span className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{ch.name}</span>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => testChannel(ch.name)}
                       disabled={!active}
                       className="text-[10px] uppercase font-bold text-pink-400 disabled:opacity-30 hover:text-pink-300 transition-colors"
                     >
                       Test Ping
                     </button>
                     <button 
                       onClick={() => handleToggleChannel(ch.id as keyof typeof channels)}
                       className={`w-8 h-4 rounded-full flex items-center shrink-0 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                     >
                       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                     </button>
                   </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Incident Simulator */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        {simulating && (
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div 
               animate={{ scale: [1, 2, 3], opacity: [0.8, 0, 0] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-32 h-32 rounded-full border-2 border-rose-500 absolute"
            />
            <motion.div 
               animate={{ scale: [1, 2, 3], opacity: [0.8, 0, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
               className="w-32 h-32 rounded-full border-2 border-rose-500 absolute"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
              <Activity size={16} className={simulating ? 'text-rose-400 animate-pulse' : 'text-purple-400'} /> 
              Incident Simulator
            </h3>
            <p className="text-xs text-gray-400 max-w-sm">Trigger synthetic emergencies to test routing flows, channel latency, and operator acknowledgment.</p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-3">
             <button disabled={!!simulating} onClick={() => runSimulation('Breach')} className="w-full md:w-auto px-4 py-2 border border-slate-700 bg-slate-800 hover:border-emerald-500 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-50">
               Network Breach
             </button>
             <button disabled={!!simulating} onClick={() => runSimulation('Leak')} className="px-4 py-2 border border-slate-700 bg-slate-800 hover:border-pink-500 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-50">
               Data Leak
             </button>
             <button disabled={!!simulating} onClick={() => runSimulation('AI Malfunction')} className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-rose-500 hover:border-rose-400 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-50">
               AI Cascade
             </button>
          </div>
        </div>
      </section>

      {/* Create Rule Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => { setShowCreateModal(false); setEditingRuleId(null); }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                title="Press Esc to close"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">{editingRuleId ? 'Edit' : 'Create'} Routing Rule</h3>
              
              <form onSubmit={handleCreateRule} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1.5">Rule Name</label>
                  <input required autoFocus placeholder="e.g. Core Meltdown" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1.5">Severity</label>
                    <select value={newRule.severity} onChange={e => setNewRule({...newRule, severity: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1.5">Trigger</label>
                    <input required placeholder="Regex/Event Hook" value={newRule.trigger} onChange={e => setNewRule({...newRule, trigger: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-pink-300 focus:outline-none focus:border-pink-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1.5">Target Destination</label>
                  <select value={newRule.destination} onChange={e => setNewRule({...newRule, destination: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500">
                    <option>Operator Pool</option>
                    <option>Supervisor</option>
                    <option>Director</option>
                    <option>Command Authority</option>
                  </select>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowCreateModal(false); setEditingRuleId(null); }} className="px-4 py-2 bg-slate-800 text-gray-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-pink-500/20">
                    {editingRuleId ? 'Save Changes' : 'Deploy Rule'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
