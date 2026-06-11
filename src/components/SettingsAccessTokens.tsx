import React, { useState } from 'react';
import { Key, Plus, Trash2, Copy, RefreshCw, StopCircle, Check, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function SettingsAccessTokens({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [tokens, setTokens] = useState([
    { id: 'tok_9x8f', owner: 'Core Systems API', type: 'API Key', created: '2025-10-12', lastUsed: '2 mins ago', status: 'Active' },
    { id: 'tok_3k2a', owner: 'Logistics Service', type: 'JWT', created: '2026-01-05', lastUsed: '1 hr ago', status: 'Active' },
    { id: 'tok_5m4n', owner: 'Operator Portal', type: 'OAuth', created: '2026-03-22', lastUsed: '5 days ago', status: 'Suspended' },
    { id: 'tok_7p1q', owner: 'Quantum Relay Node', type: 'Machine ID', created: '2026-04-10', lastUsed: '10 secs ago', status: 'Active' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const exportTokens = () => {
    addToast('Compiling secure token payload...', 'info');
    setTimeout(() => {
       addToast('Tokens exported as CSV successfully.', 'success');
    }, 1500);
  };

  const [form, setForm] = useState({
    type: 'API Key',
    expiry: '30 Days',
    environment: 'Production',
    permissions: 'Read-Only'
  });

  const chartData = [
    { name: 'Mon', active: 400, failed: 24 },
    { name: 'Tue', active: 300, failed: 13 },
    { name: 'Wed', active: 550, failed: 48 },
    { name: 'Thu', active: 450, failed: 8 },
    { name: 'Fri', active: 600, failed: 100 },
    { name: 'Sat', active: 700, failed: 12 },
    { name: 'Sun', active: 850, failed: 5 },
  ];

  const handleAction = (id: string, action: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === id) {
        if (action === 'Revoke') return { ...t, status: 'Revoked' };
        if (action === 'Suspend') return { ...t, status: 'Suspended' };
        if (action === 'Regenerate') return { ...t, status: 'Active', lastUsed: 'Never' };
      }
      return t;
    }));
    addToast(`Token ${action.toLowerCase()} successful.`, action === 'Revoke' ? 'error' : 'success');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    addToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const generateToken = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const newTokenStr = `sm_${form.type.toLowerCase().replace(' ', '')}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setGeneratedToken(newTokenStr);
      setIsGenerating(false);
      
      const newEntry = {
        id: `tok_${Math.random().toString(36).substring(2, 6)}`,
        owner: 'New Identity',
        type: form.type,
        created: 'Just now',
        lastUsed: 'Never',
        status: 'Active'
      };
      setTokens([newEntry, ...tokens]);
      addToast('New credentials generated', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Analytics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Tokens', val: '142', icon: Key, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Expired Tokens', val: '86', icon: StopCircle, color: 'text-slate-400', bg: 'bg-slate-500/10' },
          { label: 'Failed Auth Attempts', val: '1,024', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Compromised Tokens', val: '0', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </section>

      {/* Chart */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-64">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Auth Request Volume</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip 
              cursor={{ fill: '#1e293b' }}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Generator */}
        <section className="col-span-1 border border-slate-800 bg-slate-900/50 rounded-2xl p-6 h-fit shrink-0">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Plus size={16} className="text-pink-400" /> New Token
          </h3>
          
          <form onSubmit={generateToken} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Token Type</label>
               <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500">
                 <option>API Key</option>
                 <option>JWT</option>
                 <option>OAuth Token</option>
                 <option>Machine Identity</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Environment</label>
               <select value={form.environment} onChange={e => setForm({...form, environment: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500">
                 <option>Production</option>
                 <option>Staging</option>
                 <option>Development</option>
                 <option>Sandbox</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Permissions</label>
               <select value={form.permissions} onChange={e => setForm({...form, permissions: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500">
                 <option>Read-Only</option>
                 <option>Write</option>
                 <option>Full Access</option>
                 <option>Root</option>
               </select>
            </div>
            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full mt-4 px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Key size={14} />}
              {isGenerating ? 'Generating...' : 'Generate Token'}
            </button>
          </form>

          {generatedToken && (
            <div className="mt-6 p-4 bg-slate-950 border border-emerald-500/30 rounded-xl relative group">
              <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-2">Credentials Created</div>
              <div className="font-mono text-xs text-gray-300 break-all pr-8">
                {generatedToken}
              </div>
              <button 
                onClick={() => handleCopy(generatedToken, 'new')}
                className="absolute right-3 top-1/2 mt-2 -translate-y-1/2 p-2 hover:bg-slate-800 rounded-lg text-gray-400 transition-colors"
                title="Copy to clipboard"
              >
                {copiedToken === 'new' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </section>

        {/* Tokens List */}
        <section className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Key size={16} className="text-pink-400" /> Active Credentials
            </h3>
            <div className="flex gap-3">
               <input
                 type="text"
                 placeholder="Search tokens..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-full sm:w-48"
               />
               <button onClick={exportTokens} className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
                 Export
               </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-800/20 text-gray-400 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Token / Owner</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Last Used</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-gray-300">
                {tokens.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.owner.toLowerCase().includes(search.toLowerCase())).map(token => (
                  <tr key={token.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-emerald-400/90 mb-1 flex items-center gap-2">
                        {token.id}
                        <button onClick={() => handleCopy(token.id, token.id)} className="text-gray-500 hover:text-gray-300">
                          {copiedToken === token.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="font-medium text-white">{token.owner}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] uppercase font-bold tracking-wider">{token.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-400">{token.lastUsed}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{token.status}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button onClick={() => handleAction(token.id, 'Regenerate')} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-400 rounded transition-colors" title="Regenerate">
                           <RefreshCw size={14} />
                         </button>
                         <button onClick={() => handleAction(token.id, 'Suspend')} className="p-1.5 bg-slate-800 hover:bg-amber-900/50 text-amber-500 rounded transition-colors" title="Suspend">
                           <StopCircle size={14} />
                         </button>
                         <button onClick={() => handleAction(token.id, 'Revoke')} className="p-1.5 bg-slate-800 hover:bg-rose-900/50 text-rose-500 rounded transition-colors" title="Revoke">
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
