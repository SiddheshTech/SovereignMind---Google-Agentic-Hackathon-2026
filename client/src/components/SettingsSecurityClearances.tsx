import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Search, ShieldAlert, Lock, Fingerprint, AlertTriangle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSecurityClearances, updateSecurityClearance as apiUpdateClearance, fetchSystemSettings, saveSystemSettings } from '../lib/settingsApi';

type Clearance = {
  id: string;
  name: string;
  serviceId: string;
  level: string;
  status: string;
  expiry: string;
};

const LEVELS = ['Public', 'Confidential', 'Secret', 'Top Secret', 'Quantum Level 1', 'Quantum Level 2', 'Quantum Level 3', 'Quantum Level 4'];
const departments = ['Intelligence', 'Procurement', 'Operations', 'Cyber', 'Logistics', 'Research'];
const permissions = ['Read', 'Write', 'Execute', 'Override', 'Nuclear Access'];

const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  Intelligence: { Read: true, Write: true, Execute: false, Override: false, 'Nuclear Access': false },
  Procurement: { Read: true, Write: true, Execute: true, Override: false, 'Nuclear Access': false },
  Operations: { Read: true, Write: true, Execute: true, Override: true, 'Nuclear Access': false },
  Cyber: { Read: true, Write: true, Execute: true, Override: true, 'Nuclear Access': false },
  Logistics: { Read: true, Write: false, Execute: false, Override: false, 'Nuclear Access': false },
  Research: { Read: true, Write: true, Execute: false, Override: false, 'Nuclear Access': false },
};

export function SettingsSecurityClearances({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [clearances, setClearances] = useState<Clearance[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(DEFAULT_MATRIX);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState<false | 'freeze' | 'revoke' | 'audit'>(false);
  const [biometricStep, setBiometricStep] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cls, settings] = await Promise.all([
        fetchSecurityClearances(),
        fetchSystemSettings(),
      ]);
      setClearances(cls || []);
      try {
        const mx = JSON.parse(settings.clearanceMatrixJson || '{}');
        if (Object.keys(mx).length > 0) setMatrix(mx);
      } catch (_) {}
    } catch (err: any) {
      addToast('Failed to load security clearances.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id + action);
    try {
      const levelIdx = LEVELS.indexOf(clearances.find(c => c.id === id)?.level || '');
      let newLevel: string | undefined;
      let newStatus: string | undefined;

      if (action === 'Suspend') newStatus = 'Suspended';
      else if (action === 'Revoke') newStatus = 'Revoked';
      else if (action === 'Promote') newLevel = LEVELS[Math.min(LEVELS.length - 1, levelIdx + 1)];
      else if (action === 'Demote') newLevel = LEVELS[Math.max(0, levelIdx - 1)];

      const updated = await apiUpdateClearance(id, newLevel, newStatus);
      setClearances(prev => prev.map(c => c.id === id ? { ...c, level: updated.level, status: updated.status } : c));
      addToast(`Operator ${action.toLowerCase()} action successful.`, 'success');
    } catch (err: any) {
      addToast('Action failed: ' + err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMatrixChange = async (dept: string, perm: string) => {
    const updated = {
      ...matrix,
      [dept]: { ...matrix[dept], [perm]: !matrix[dept][perm] }
    };
    setMatrix(updated);
    try {
      await saveSystemSettings({ clearanceMatrixJson: JSON.stringify(updated) });
    } catch (err: any) {
      addToast('Matrix save failed.', 'error');
    }
  };

  const triggerEmergency = (type: 'freeze' | 'revoke' | 'audit') => {
    setShowModal(type);
    setBiometricStep(0);
  };

  const confirmEmergency = async () => {
    setBiometricStep(1);
    setTimeout(async () => {
      setBiometricStep(2);
      setTimeout(async () => {
        try {
          if (showModal === 'freeze') {
            // Update all to Suspended
            for (const c of clearances) {
              if (c.status === 'Active') await apiUpdateClearance(c.id, undefined, 'Suspended');
            }
            setClearances(prev => prev.map(c => ({ ...c, status: 'Suspended' })));
            addToast('All clearances frozen.', 'error');
          } else if (showModal === 'revoke') {
            for (const c of clearances) {
              await apiUpdateClearance(c.id, undefined, 'Revoked');
            }
            setClearances(prev => prev.map(c => ({ ...c, status: 'Revoked' })));
            addToast('All temporary access revoked.', 'error');
          } else {
            addToast('Global access audit initiated.', 'info');
          }
        } catch (err: any) {
          addToast('Emergency action failed.', 'error');
        }
        setShowModal(false);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Clearances Table */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-emerald-400" /> Active Clearances
            {loading && <Loader2 size={14} className="animate-spin text-gray-400" />}
          </h3>
          <div className="relative w-full md:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search operators..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
            />
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-800/50 border-b border-slate-800 text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Operator</th>
                <th className="px-6 py-4 font-semibold">Service ID</th>
                <th className="px-6 py-4 font-semibold">Clearance</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Expiry</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-gray-300">
              {clearances.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.serviceId.toLowerCase().includes(search.toLowerCase())).map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400/70">{c.serviceId}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] uppercase font-bold tracking-wider">{c.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${c.status === 'Active' ? 'text-emerald-400' : c.status === 'Suspended' ? 'text-amber-400' : 'text-rose-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-400' : c.status === 'Suspended' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">{c.expiry}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                       <button disabled={!!actionLoading} onClick={() => handleAction(c.id, 'Promote')} className="px-2 py-1 bg-slate-800 hover:bg-emerald-900/50 text-gray-400 hover:text-emerald-400 rounded text-[10px] uppercase font-bold transition-colors disabled:opacity-50">Promote</button>
                       <button disabled={!!actionLoading} onClick={() => handleAction(c.id, 'Demote')} className="px-2 py-1 bg-slate-800 hover:bg-amber-900/50 text-gray-400 hover:text-amber-400 rounded text-[10px] uppercase font-bold transition-colors disabled:opacity-50">Demote</button>
                       <button disabled={!!actionLoading} onClick={() => handleAction(c.id, 'Suspend')} className="px-2 py-1 bg-slate-800 hover:bg-amber-900/50 text-gray-400 hover:text-amber-400 rounded text-[10px] uppercase font-bold transition-colors disabled:opacity-50">Suspend</button>
                       <button disabled={!!actionLoading} onClick={() => handleAction(c.id, 'Revoke')} className="px-2 py-1 bg-slate-800 hover:bg-rose-900/50 text-gray-400 hover:text-rose-400 rounded text-[10px] uppercase font-bold transition-colors disabled:opacity-50">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && clearances.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No clearances on record.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Clearance Matrix */}
      <section>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
          <ShieldAlert size={16} className="text-pink-400" /> Clearance Matrix
        </h3>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-800/50 border-b border-slate-800 text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Department</th>
                {permissions.map(p => (
                  <th key={p} className="px-4 py-4 text-center font-semibold">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-gray-300">
              {departments.map(dept => (
                <tr key={dept} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{dept}</td>
                  {permissions.map(perm => (
                    <td key={perm} className="px-4 py-4 text-center">
                      <button 
                        onClick={() => handleMatrixChange(dept, perm)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors border mx-auto ${
                          matrix[dept]?.[perm] 
                            ? perm === 'Nuclear Access' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                            : 'bg-slate-800 border-slate-700 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={12} className={matrix[dept]?.[perm] ? 'opacity-100' : 'opacity-0'} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Emergency Lockdown */}
      <section>
        <div className="p-6 border border-rose-500/30 bg-rose-500/5 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-2 relative z-10"><Lock size={18} /> Emergency Lockdown</h4>
          <p className="text-xs text-rose-200/70 mb-6 max-w-2xl relative z-10">Initiate global containment protocols. These actions require dual authorization and biometric validation.</p>
          
          <div className="flex flex-col md:flex-row gap-3 relative z-10">
            <button onClick={() => triggerEmergency('freeze')} className="w-full md:w-auto px-5 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/25 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> Freeze All Clearances
            </button>
            <button onClick={() => triggerEmergency('revoke')} className="w-full md:w-auto px-5 py-3 bg-slate-900 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <X size={14} /> Revoke Temporary Access
            </button>
            <button onClick={() => triggerEmergency('audit')} className="w-full md:w-auto px-5 py-3 bg-slate-900 border border-slate-700 text-gray-300 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2">
              <Search size={14} /> Global Access Audit
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl shadow-rose-900/20 overflow-hidden relative"
            >
              {biometricStep === 0 ? (
                <>
                  <h3 className="text-lg font-bold text-rose-400 mb-2">Authorization Required</h3>
                  <p className="text-sm text-gray-400 mb-8">
                    You are about to execute a Level 1 command: <span className="text-white font-mono">{showModal.toUpperCase()}</span>. 
                    This action will be logged globally.
                  </p>
                  
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-gray-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">Cancel</button>
                    <button onClick={confirmEmergency} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2">
                      <Fingerprint size={16} /> Authenticate
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    {biometricStep === 1 && (
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-rose-500 opacity-50"
                      />
                    )}
                    <Fingerprint size={48} className={biometricStep === 2 ? 'text-emerald-500' : 'text-rose-500 animate-pulse'} />
                  </div>
                  <h3 className={`text-lg font-bold ${biometricStep === 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {biometricStep === 1 ? 'Scanning Biometrics...' : 'Identity Verified'}
                  </h3>
                  <p className="text-sm font-mono text-gray-500 mt-2">
                    {biometricStep === 1 ? 'Awaiting cryptographic signature' : 'Executing command sequence'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
