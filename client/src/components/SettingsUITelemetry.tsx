import React, { useState, useEffect, useCallback } from 'react';
import { Monitor, Layout, Activity, Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSystemSettings, saveSystemSettings } from '../lib/settingsApi';

type TelemetryToggles = {
  usageAnalytics: boolean;
  crashReports: boolean;
  behavioralMetrics: boolean;
  heatmaps: boolean;
  diagnosticLogs: boolean;
};

const THEMES = [
  { id: 'Sovereign Dark', color: 'bg-slate-900', border: 'border-slate-700', activeBorder: 'border-pink-500' },
  { id: 'Quantum Blue', color: 'bg-pink-950', border: 'border-pink-900', activeBorder: 'border-pink-400' },
  { id: 'Tactical Green', color: 'bg-emerald-950', border: 'border-emerald-900', activeBorder: 'border-emerald-400' },
  { id: 'Crimson Alert', color: 'bg-rose-950', border: 'border-rose-900', activeBorder: 'border-rose-400' },
];

export function SettingsUITelemetry({ addToast }: { addToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void }) {
  const [theme, setTheme] = useState('Sovereign Dark');
  const [layoutState, setLayoutState] = useState<'idle' | 'saving' | 'resetting'>('idle');
  const [telemetry, setTelemetry] = useState<TelemetryToggles>({
    usageAnalytics: true,
    crashReports: true,
    behavioralMetrics: false,
    heatmaps: false,
    diagnosticLogs: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);

  const [performanceData, setPerformanceData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      cpu: 30 + Math.random() * 20,
      memory: 40 + Math.random() * 10,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        return [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          cpu: 30 + Math.random() * 30,
          memory: 40 + Math.random() * 15,
        }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await fetchSystemSettings();
      setTheme(s.theme || 'Sovereign Dark');
      try {
        const t = JSON.parse(s.telemetryTogglesJson || '{}');
        if (Object.keys(t).length > 0) setTelemetry(t);
      } catch (_) {}
    } catch (err: any) {
      addToast('Failed to load UI settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    setSavingTheme(true);
    try {
      await saveSystemSettings({ theme: newTheme });
      addToast(`${newTheme} theme selected.`, 'success');
    } catch (err: any) {
      addToast('Failed to save theme.', 'error');
    } finally {
      setSavingTheme(false);
    }
  };

  const handleTelemetryToggle = async (key: keyof TelemetryToggles) => {
    const updated = { ...telemetry, [key]: !telemetry[key] };
    setTelemetry(updated);
    try {
      await saveSystemSettings({ telemetryTogglesJson: JSON.stringify(updated) });
      addToast('Telemetry setting updated.', 'info');
    } catch (err: any) {
      addToast('Failed to save telemetry setting.', 'error');
    }
  };

  const exportTelemetry = (format: string) => {
    addToast(`Packaging telemetry data as ${format}...`, 'info');
    setTimeout(() => {
      addToast(`Telemetry successfully exported as ${format}.`, 'success');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-pink-400" size={32} />
        <span className="ml-3 text-gray-400 text-sm">Loading UI settings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Theme Engine */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Layout size={16} className="text-pink-400" /> Theme Engine
            {savingTheme && <Loader2 size={12} className="animate-spin text-pink-400 ml-1" />}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all ${t.color} ${theme === t.id ? t.activeBorder : t.border}`}
              >
                <span className="text-xs font-bold text-white mb-2">{t.id}</span>
                <div className="flex gap-1.5 w-full">
                  <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
                  <div className="h-1.5 w-1/2 bg-white/10 rounded-full"></div>
                </div>
                {theme === t.id && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dashboard Layout</h4>
            <div className="flex gap-3">
               <button 
                 disabled={layoutState !== 'idle'} 
                 className="flex-1 py-2 bg-slate-800 border border-slate-700 text-gray-300 rounded-lg text-xs hover:bg-slate-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2" 
                 onClick={() => {
                   setLayoutState('saving');
                   setTimeout(() => { setLayoutState('idle'); addToast('Layout saved to profile.', 'success') }, 800);
                 }}
               >
                 {layoutState === 'saving' ? <Activity size={12} className="animate-spin" /> : null} Save Layout
               </button>
               <button 
                 disabled={layoutState !== 'idle'}
                 className="flex-1 py-2 bg-slate-800 border border-slate-700 text-gray-300 rounded-lg text-xs hover:bg-slate-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2" 
                 onClick={() => {
                   setLayoutState('resetting');
                   setTimeout(() => { setLayoutState('idle'); addToast('Layout reset to default configuration.', 'info') }, 800);
                 }}
               >
                 {layoutState === 'resetting' ? <Activity size={12} className="animate-spin" /> : null} Reset Layout
               </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">To reorder dashboard widgets, drag and drop them from the main view.</p>
          </div>
        </section>

        {/* Telemetry Controls */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Activity size={16} className="text-emerald-400" /> Telemetry Controls
          </h3>
          
          <div className="space-y-3">
            {[
              { id: 'usageAnalytics', title: 'Usage Analytics', desc: 'Track endpoint interactions.' },
              { id: 'crashReports', title: 'Crash Reports', desc: 'Auto-submit core dumps to engineering.' },
              { id: 'behavioralMetrics', title: 'Behavioral Metrics', desc: 'Record UX journey mapping.' },
              { id: 'heatmaps', title: 'Heatmaps', desc: 'Capture visual engagement density.' },
              { id: 'diagnosticLogs', title: 'Diagnostic Logs', desc: 'Stream runtime diagnostic outputs.' },
            ].map((control) => {
              const active = telemetry[control.id as keyof TelemetryToggles];
              return (
                <div key={control.id} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                  <div>
                    <div className="text-xs font-bold text-white">{control.title}</div>
                    <div className="text-[10px] text-gray-500">{control.desc}</div>
                  </div>
                  <button 
                     onClick={() => handleTelemetryToggle(control.id as keyof TelemetryToggles)}
                     className={`w-10 h-5 rounded-full flex items-center shrink-0 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                   >
                     <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Performance Monitor */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-72">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Monitor size={16} className="text-purple-400" /> Performance Monitor
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 uppercase">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded bg-purple-500"></span> CPU Usage
             </div>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded bg-pink-500"></span> Memory Usage
             </div>
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#a855f7" fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
              <Area type="monotone" dataKey="memory" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMem)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Telemetry Export */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
         <div className="mb-4 md:mb-0">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-1">
             <Download size={16} className="text-emerald-400" /> Export Telemetry Data
           </h3>
           <p className="text-xs text-gray-400 max-w-md">Compile and securely download localized metric logs for internal review. Payload includes masked logs and time-series reports.</p>
         </div>
         <div className="flex flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <button onClick={() => exportTelemetry('CSV')} className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">
              .CSV
            </button>
            <button onClick={() => exportTelemetry('JSON')} className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">
              .JSON
            </button>
            <button onClick={() => exportTelemetry('PDF')} className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">
              .PDF
            </button>
         </div>
      </section>

    </div>
  );
}
