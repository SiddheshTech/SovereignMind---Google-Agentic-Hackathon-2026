import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Bell, Database, HardDrive, Monitor, Lock, User, Globe, Activity, RotateCcw, Save, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { SettingsOperatorProfile } from './SettingsOperatorProfile';
import { SettingsSecurityClearances } from './SettingsSecurityClearances';
import { SettingsAccessTokens } from './SettingsAccessTokens';
import { SettingsDataSovereignty } from './SettingsDataSovereignty';
import { SettingsUITelemetry } from './SettingsUITelemetry';
import { SettingsAlertRouting } from './SettingsAlertRouting';
import { SettingsNetworkProtocols } from './SettingsNetworkProtocols';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: string, msg: string, type: ToastType }[]>([]);

  // Simple global toast add function passed to children
  const addToast = React.useCallback((msg: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, msg, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Keyboard Shortcuts global listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    addToast('Persisting configuration to Sovereign Cloud...', 'info');
    
    setTimeout(() => {
      setIsSaving(false);
      addToast('All changes saved successfully.', 'success');
      // Simulate audit log write backing
      console.log(`[AUDIT] Action: Config Save. User: OP_CLARA. Timestamp: ${new Date().toISOString()}`);
    }, 1200);
  };

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    addToast('Restoring operational defaults...', 'warning');
    setTimeout(() => {
      setResetKey(prev => prev + 1);
      addToast('Defaults restored effectively.', 'success');
    }, 800);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <div key={resetKey} className="w-full h-full"><SettingsOperatorProfile addToast={addToast} /></div>;
      case 'clearances': return <div key={resetKey} className="w-full h-full"><SettingsSecurityClearances addToast={addToast} /></div>;
      case 'tokens': return <div key={resetKey} className="w-full h-full"><SettingsAccessTokens addToast={addToast} /></div>;
      case 'sovereignty': return <div key={resetKey} className="w-full h-full"><SettingsDataSovereignty addToast={addToast} /></div>;
      case 'telemetry': return <div key={resetKey} className="w-full h-full"><SettingsUITelemetry addToast={addToast} /></div>;
      case 'routing': return <div key={resetKey} className="w-full h-full"><SettingsAlertRouting addToast={addToast} /></div>;
      case 'protocols': return <div key={resetKey} className="w-full h-full"><SettingsNetworkProtocols addToast={addToast} /></div>;
      default: return <div key={resetKey} className="w-full h-full"><SettingsOperatorProfile addToast={addToast} /></div>;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 md:space-y-6 flex flex-col h-[calc(100vh-120px)] md:h-[800px] relative">
      
      {/* Toast Container */}
      <div className="absolute top-0 right-0 z-50 flex flex-col gap-2 pointer-events-none w-[320px]">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              layout
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded-xl border backdrop-blur-md flex items-start gap-3 shadow-2xl ${
                t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                t.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                t.type === 'error' ? 'bg-rose-500/10 border-rose-500/30' :
                'bg-pink-500/10 border-pink-500/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
                {t.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                {t.type === 'error' && <AlertCircle size={16} className="text-rose-400" />}
                {t.type === 'info' && <Info size={16} className="text-pink-400" />}
              </div>
              <p className={`text-xs font-medium leading-relaxed ${
                t.type === 'success' ? 'text-emerald-300' :
                t.type === 'warning' ? 'text-amber-300' :
                t.type === 'error' ? 'text-rose-300' :
                'text-pink-300'
              }`}>{t.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl">
            <Settings size={20} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">System Configuration</h2>
            <div className="text-[10px] uppercase font-mono text-gray-500 tracking-widest mt-1">SOVEREIGN ENCLAVE PARAMETERS</div>
          </div>
        </div>
        <div className="flex w-full md:w-auto justify-end gap-3 relative z-10">
           <button 
             onClick={handleReset}
             className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
           >
             <RotateCcw size={14} /> Reset Changes
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/20"
           >
             {isSaving ? <Activity size={14} className="animate-spin" /> : <Save size={14} />}
             {isSaving ? 'Synchronizing...' : 'Apply Changes'}
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6 min-h-0 relative z-0">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 bg-[#030712] border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none gap-2 md:gap-0 md:space-y-1">
           <NavItem icon={User} id="profile" label="Operator Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
           <NavItem icon={Shield} id="clearances" label="Security Clearances" active={activeTab === 'clearances'} onClick={() => setActiveTab('clearances')} />
           <NavItem icon={Key} id="tokens" label="Access Tokens" active={activeTab === 'tokens'} onClick={() => setActiveTab('tokens')} />
           <NavItem icon={Database} id="sovereignty" label="Data Sovereignty" active={activeTab === 'sovereignty'} onClick={() => setActiveTab('sovereignty')} />
           <NavItem icon={Monitor} id="telemetry" label="UI & Telemetry" active={activeTab === 'telemetry'} onClick={() => setActiveTab('telemetry')} />
           <NavItem icon={Bell} id="routing" label="Alert Routing" active={activeTab === 'routing'} onClick={() => setActiveTab('routing')} />
           <NavItem icon={Globe} id="protocols" label="Network Protocols" active={activeTab === 'protocols'} onClick={() => setActiveTab('protocols')} />
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-[#030712] border border-slate-800 rounded-3xl p-8 overflow-y-auto scrollbar-none relative">
           
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="min-h-full"
             >
               {renderContent()}
             </motion.div>
           </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`md:w-full whitespace-nowrap shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm transition-colors relative group ${active ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-slate-900/50'}`}>
      <Icon size={16} className={`w-3 h-3 md:w-4 md:h-4 ${active ? 'text-pink-400' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`} />
      {label}
    </button>
  )
}

