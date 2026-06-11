import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Plus, ChevronDown, Filter, Info, Download, 
  Settings, Clock, Sparkles, Users, X, Activity, FileText, Globe, Key, AlertTriangle, CheckCircle2, Terminal, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommandCenter } from './CommandCenter';
import { SovereigntyGenomeEngine } from './SovereigntyGenomeEngine';
import { ConstitutionalIntelligence } from './ConstitutionalIntelligence';
import { SyntheticCivilizationSandbox } from './SyntheticCivilizationSandbox';
import { ForesightDashboard } from './ForesightDashboard';
import { DigitalTwinDashboard } from './DigitalTwinDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CrisisDashboard } from './CrisisDashboard';
import { ProcurementDashboard } from './ProcurementDashboard';
import { IntelligenceGraphDashboard } from './IntelligenceGraphDashboard';
import { AICopilotDashboard } from './AICopilotDashboard';
import { CollaborationDashboard } from './CollaborationDashboard';
import { SettingsDashboard } from './SettingsDashboard';
import { ExecutiveBriefing } from './ExecutiveBriefing';
import { MetricDetailDashboard } from './MetricDetailDashboard';
import { ViewFullIntelligence } from './ViewFullIntelligence';
import { AIStrategicBriefing } from './AIStrategicBriefing';
import { ScenarioMode } from './ScenarioMode';
import { fetchOperatorDashboardData } from '../lib/dashboardApi';
import { useGenericWS } from '../lib/useGenericWS';

interface OperatorDashboardProps {
  user?: {
    name: string;
    institution: string;
    clearanceLevel: string;
    enclaveRegion: string;
  } | null;
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

// Precise Hex Color Map representing the exact requested palette
const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  darkBrown: '#56280B',  // Shadow offsets, rich border inserts
  sky: '#00B8DB',        // Strategic indicators, safe state labels
  deepTeal: '#073F4D',    // Deep framing lines, background panels
};

export function OperatorDashboard({ user, activeItem = 'dashboard', onNavigate }: OperatorDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showDirectiveModal, setShowDirectiveModal] = useState(false);
  const [showGlobalParamsModal, setShowGlobalParamsModal] = useState(false);
  
  const defaultParams = { volatility: 5.2, threatSense: 80, econResilience: 40, cyberDefense: 90 };
  const [globalParams, setGlobalParams] = useState(defaultParams);

  useEffect(() => {
    const saved = localStorage.getItem('sovereign_global_params');
    if (saved) setGlobalParams(JSON.parse(saved));
  }, []);

  const updateParam = (key: string, val: string) => {
    const newParams = { ...globalParams, [key]: parseFloat(val) };
    setGlobalParams(newParams);
    localStorage.setItem('sovereign_global_params', JSON.stringify(newParams));
  }
  const resetParams = () => {
    setGlobalParams(defaultParams);
    localStorage.removeItem('sovereign_global_params');
  }
  
  const [directiveForm, setDirectiveForm] = useState({ title: '', executionType: 'Strategic', target: '', priority: 'Standard' });
  const [directiveState, setDirectiveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchOperatorDashboardData().then(data => {
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    });
  }, []);

  useGenericWS('ws://localhost:4000/ws/operator-dashboard', (event: any) => {
    if (event.type === 'OPERATOR_DASHBOARD_DATA_UPDATED') {
      if (event.data && event.data.notifications) {
        setNotifications(event.data.notifications);
      }
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveForm.title.trim()) return;
    setDirectiveState('saving');
    setTimeout(() => {
      setDirectiveState('saved');
      setTimeout(() => {
        setShowDirectiveModal(false);
        setDirectiveState('idle');
        setDirectiveForm({ title: '', executionType: 'Strategic', target: '', priority: 'Standard' });
      }, 1500);
    }, 1500);
  };

  const [searchHistory, setSearchHistory] = useState<string[]>(['Q3 Resiliency Forecast', 'Vendor: CyberTech', 'Energy Directive Alpha']);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const allData = [
    { title: "Indo-Pacific Strategic Brief", type: "Reports", match: "Briefing document from 0400Z" },
    { title: "National Grid Resilience Model", type: "Simulations", match: "Simulation parameters for Q4" },
    { title: "Project Omega Contract", type: "Contracts", match: "Defense vendor compliance file" },
    { title: "Water Crisis Level 4", type: "Threats", match: "Critical water shortage in capital" },
    { title: "Operation Sovereign Shield", type: "Directives", match: "Active protective measures" },
    { title: "Q3 Resiliency Forecast", type: "Forecasts", match: "Projected stability indices" },
    { title: "Global Vendor Network DB", type: "Networks", match: "Mapped supply chain routes" },
    { title: "Vendor: CyberTech", type: "Vendors", match: "Top tier IT infrastructure provider" },
  ];

  const suggestions = ["Threats", "Reports", "Directives", "Simulations", "Forecasts", "Networks", "Vendors", "Contracts"];
  
  const searchResults = debouncedQuery.trim() ? allData.filter(r => 
    r.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    r.type.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    r.match.toLowerCase().includes(debouncedQuery.toLowerCase())
  ) : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelectSearch(searchResults[selectedIndex].title);
      } else if (searchQuery.trim()) {
        handleSelectSearch(searchQuery.trim());
      }
    }
  };

  const handleSelectSearch = (term: string) => {
    if (term && !searchHistory.includes(term)) {
        setSearchHistory(prev => [term, ...prev].slice(0, 5));
    }
    setSearchQuery(term);
    setShowSearchDropdown(false);
  };

  return (
    <div className="flex-1 md:ml-[260px] flex flex-col h-screen overflow-hidden w-full bg-[#02040a] text-white font-sans">
      {/* Top Header Bar */}
      <header className="h-20 border-b flex items-center justify-between px-8 shrink-0 bg-[#02040a]/90 z-25" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {activeItem !== 'dashboard' && (
              <button onClick={() => {
                  if (window.history.length > 2) {
                     window.history.back(); // Standard browser back behavior mapped if desired OR fallback 
                     onNavigate('dashboard');
                  } else {
                     onNavigate('dashboard');
                  }
              }} className="p-1.5 rounded-lg border bg-slate-950 hover:bg-white/5 transition-colors cursor-pointer mr-2 flex items-center text-gray-300 shadow-xl" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                  <ChevronLeft size={16} />
                  <span className="ml-1 text-xs font-bold mr-1">Back</span>
              </button>
          )}
          <span className="p-1.5 rounded-lg border bg-slate-950" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
            <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: PALETTE.purple }} />
          </span>
          <span className="text-gray-300 font-medium font-mono text-[11px] tracking-wider uppercase hidden sm:inline-block">Sovereign OS Hub</span>
          
          {/* Breadcrumbs */}
          {activeItem !== 'dashboard' && (
             <div className="hidden lg:flex items-center gap-2 ml-4">
               <ChevronRight size={14} className="text-gray-600" />
               <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => onNavigate('dashboard')}>Dashboard</span>
               {(() => {
                 const map: Record<string, string[]> = {
                   'dna-explorer': ['Sovereignty Engine', 'DNA Explorer'],
                   'resilience-genes': ['Sovereignty Engine', 'Resilience Genes'],
                   'collapse-atlas': ['Sovereignty Engine', 'Collapse Atlas'],
                   'authority-maps': ['Constitutional Intel', 'Authority Maps'],
                   'emergency-powers': ['Constitutional Intel', 'Emergency Powers'],
                   'treaty-intelligence': ['Constitutional Intel', 'Treaty Intelligence'],
                   'scenario-builder': ['Synthetic Sandbox', 'Scenario Builder'],
                   'launch-simulation': ['Synthetic Sandbox', 'Launch Simulation'],
                   'simulations': ['Synthetic Sandbox', 'Simulations'],
                   'recovery-explorer': ['Synthetic Sandbox', 'Recovery Explorer'],
                   'risk-radar': ['Foresight Engine', 'Risk Radar'],
                   'forecasting': ['Foresight Engine', 'Forecasting'],
                   'black-swan': ['Foresight Engine', 'Black Swan Event'],
                   'nation-model': ['Digital Twin', 'Nation Model'],
                   'dependencies': ['Digital Twin', 'Dependencies'],
                   'infrastructure': ['Digital Twin', 'Infrastructure'],
                   'metrics': ['Metrics & Reports', 'Metrics Overview'],
                   'scoring': ['Metrics & Reports', 'Risk Scoring'],
                   'reports': ['Metrics & Reports', 'Analysis Reports'],
                   'intel-reports': ['Metrics & Reports', 'Intel Reports'],
                   'active-incidents': ['Crisis Center', 'Active Incidents'],
                   'ops-center': ['Crisis Center', 'Operations Center'],
                   'live-alerts': ['Crisis Center', 'Live Alerts'],
                   'decision-room': ['Crisis Center', 'Decision Room'],
                   'cabinet-room': ['Crisis Center', 'Cabinet Room'],
                   'vendors': ['Procurement & Auth', 'Vendors'],
                   'contracts': ['Procurement & Auth', 'Contracts'],
                   'supply-chains': ['Procurement & Auth', 'Supply Chains'],
                   'networks': ['Intelligence Graph', 'Networks'],
                   'cascades': ['Intelligence Graph', 'Cascades'],
                   'ai-copilot': ['Command Tools', 'AI Copilot'],
                   'collaboration': ['Command Tools', 'Collaboration'],
                   'settings': ['Command Tools', 'Settings']
                 };
                 const crumbs = map[activeItem] || [activeItem.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')];
                 return crumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight size={14} className="text-gray-600" />
                      <span className={`text-[11px] font-mono tracking-wider uppercase ${idx === crumbs.length - 1 ? 'text-white font-bold' : 'text-gray-400'}`}>
                        {crumb}
                      </span>
                    </React.Fragment>
                 ));
               })()}
             </div>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {/* Search Box */}
          <div className="relative hidden md:flex items-center w-72">
            <div className="absolute left-3 flex items-center justify-center">
              <Search size={14} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Query intelligence network..." 
              value={searchQuery}
              onFocus={() => { setShowSearchDropdown(true); setSelectedIndex(-1); }}
              onBlur={() => setTimeout(() => { setShowSearchDropdown(false); setSelectedIndex(-1); }, 200)}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(-1); }}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-slate-950/80 border rounded-full py-2 pl-9 pr-14 text-xs text-white focus:outline-none transition-colors placeholder:text-gray-650"
              style={{ borderColor: `${PALETTE.deepTeal}40` }}
            />
            <div className="absolute right-1.5 flex items-center">
               <button 
                 className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono font-semibold border transition-all cursor-pointer"
                 style={{ 
                   backgroundColor: `${PALETTE.purple}15`, 
                   textColor: '#ece0ff',
                   borderColor: `${PALETTE.purple}40`
                 }}
               >
                 <Sparkles size={9} style={{ color: PALETTE.sky }} /> AI FEED
               </button>
            </div>
            
            <AnimatePresence>
              {showSearchDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  <div className="p-2 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{debouncedQuery.trim() ? 'Semantic Search Active' : 'Search Modules'}</span>
                  </div>
                  {debouncedQuery.trim() ? (
                    searchResults.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto p-2">
                        {searchResults.map((res, i) => (
                          <div key={i} onMouseEnter={() => setSelectedIndex(i)} onClick={() => handleSelectSearch(res.title)} className={`p-2 rounded-lg cursor-pointer transition flex items-start gap-3 ${selectedIndex === i ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
                            <FileText size={14} className="text-gray-500 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-white">{res.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-slate-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">{res.type}</span>
                                <span className="text-xs text-gray-500 truncate w-40">{res.match}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-xs">
                        No matching records found for "{debouncedQuery}".
                      </div>
                    )
                  ) : (
                    <div className="p-3 text-xs">
                      <div className="text-[10px] text-gray-500 font-mono uppercase mb-2">Recent Searches</div>
                      {searchHistory.map(h => (
                         <div key={h} onClick={() => handleSelectSearch(h)} className="py-1.5 px-2 hover:bg-slate-800 rounded text-gray-300 cursor-pointer flex items-center gap-2"><Clock size={12}/>{h}</div>
                      ))}
                      <div className="text-[10px] text-gray-500 font-mono uppercase mb-2 mt-4">Suggested Modules</div>
                      <div className="flex flex-wrap gap-2">
                         {suggestions.map(s => (
                           <div key={s} onClick={() => handleSelectSearch(s)} className="bg-slate-800 hover:bg-slate-700 text-gray-400 px-2 py-1 rounded cursor-pointer">{s}</div>
                         ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setShowGlobalParamsModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-purple-400 transition-colors cursor-pointer border border-purple-500/30 bg-purple-500/10"><Layers size={16} /></button>
          <button onClick={() => setShowTimelineModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors cursor-pointer"><Clock size={16} /></button>
          <button onClick={() => setShowNotificationsModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors relative cursor-pointer">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border border-slate-900" style={{ backgroundColor: PALETTE.orange }} />
            )}
          </button>
          
          <button 
            onClick={() => setShowDirectiveModal(true)}
            className="flex items-center gap-2 px-5 py-2 hover:opacity-90 text-white text-xs font-semibold rounded-full transition-colors ml-2 cursor-pointer"
            style={{ backgroundColor: PALETTE.purple }}
          >
            <Plus size={15} />
            Initialize Directive
          </button>
        </div>
      </header>

      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-none relative bg-[#02040a]">
        <div className={activeItem === 'dashboard' ? 'block' : 'hidden'}>
          <CommandCenter user={user} onNavigate={onNavigate} />
        </div>
        <div className={['dna-explorer', 'resilience-genes', 'collapse-atlas'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <SovereigntyGenomeEngine initialTab={activeItem} />
        </div>
        <div className={['authority-maps', 'emergency-powers', 'treaty-intelligence'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <ConstitutionalIntelligence initialSubTab={activeItem === 'authority-maps' ? 'maps' : activeItem === 'emergency-powers' ? 'emergency' : 'treaty'} />
        </div>
        <div className={['scenario-builder', 'launch-simulation', 'simulations', 'recovery-explorer'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <SyntheticCivilizationSandbox initialTab={activeItem as any} />
        </div>
        <div className={['risk-radar', 'forecasting', 'black-swan'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <ForesightDashboard initialTab={activeItem as any} />
        </div>
        <div className={['nation-model', 'dependencies', 'infrastructure'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <DigitalTwinDashboard initialTab={activeItem as any} />
        </div>
        <div className={['metrics', 'scoring', 'reports', 'intel-reports'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <AnalyticsDashboard initialTab={activeItem === 'intel-reports' ? 'reports' : activeItem as any} />
        </div>
        <div className={['active-incidents', 'ops-center', 'live-alerts', 'decision-room', 'cabinet-room'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <CrisisDashboard initialTab={activeItem === 'live-alerts' ? 'active-incidents' : activeItem as any} />
        </div>
        <div className={['vendors', 'contracts', 'supply-chains'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <ProcurementDashboard initialTab={activeItem as any} />
        </div>
        <div className={['networks', 'cascades'].includes(activeItem || '') ? 'block' : 'hidden'}>
          <IntelligenceGraphDashboard initialTab={activeItem as any} />
        </div>
        <div className={activeItem === 'ai-copilot' ? 'block' : 'hidden'}>
          <AICopilotDashboard />
        </div>
        <div className={activeItem === 'collaboration' ? 'block' : 'hidden'}>
          <CollaborationDashboard />
        </div>
        <div className={activeItem === 'settings' ? 'block' : 'hidden'}>
          <SettingsDashboard />
        </div>
        <div className={activeItem === 'view-full-intelligence' ? 'block' : 'hidden'}>
          <ViewFullIntelligence onNavigate={onNavigate} />
        </div>
        <div className={activeItem === 'ai-strategic-briefing' ? 'block' : 'hidden'}>
          <AIStrategicBriefing onNavigate={onNavigate} />
        </div>
        <div className={activeItem === 'scenario-mode' ? 'block' : 'hidden'}>
          <ScenarioMode onNavigate={onNavigate} />
        </div>
        <div className={activeItem === 'executive-briefing' ? 'block' : 'hidden'}>
          <ExecutiveBriefing />
        </div>
        <div className={activeItem?.startsWith('metric-') ? 'block' : 'hidden'}>
          <MetricDetailDashboard metricId={activeItem?.split('-')[1]} onNavigate={onNavigate} />
        </div>

        {/* Fallback for completely unknown modules */}
        {!['dashboard', 'dna-explorer', 'resilience-genes', 'collapse-atlas', 'authority-maps', 'emergency-powers', 'treaty-intelligence', 'scenario-builder', 'launch-simulation', 'simulations', 'recovery-explorer', 'risk-radar', 'forecasting', 'black-swan', 'nation-model', 'dependencies', 'infrastructure', 'metrics', 'scoring', 'reports', 'intel-reports', 'active-incidents', 'ops-center', 'live-alerts', 'decision-room', 'cabinet-room', 'vendors', 'contracts', 'supply-chains', 'networks', 'cascades', 'ai-copilot', 'collaboration', 'settings', 'view-full-intelligence', 'ai-strategic-briefing', 'scenario-mode', 'executive-briefing'].includes(activeItem || '') && !activeItem?.startsWith('metric-') && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-mono space-y-4 pt-20">
            <Sparkles size={32} className="text-purple-500/50" />
            <p>Module "{activeItem}" is currently offline or unlinked.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showGlobalParamsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#030712] border border-purple-500/30 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950">
                <h3 className="text-white font-bold text-[13px] uppercase font-mono tracking-widest flex items-center gap-2"><Layers size={16} className="text-purple-400" /> Global Parameter Engine</h3>
                <button onClick={() => setShowGlobalParamsModal(false)} className="text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Baseline Volatility Index</label>
                    <span className="text-xs font-mono text-purple-400 font-bold">{globalParams.volatility.toFixed(1)}</span>
                  </div>
                  <input type="range" min="0" max="20" step="0.1" value={globalParams.volatility} onChange={e => updateParam('volatility', e.target.value)} className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Threat Sensitivity Threshold</label>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{globalParams.threatSense}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={globalParams.threatSense} onChange={e => updateParam('threatSense', e.target.value)} className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Economic Resilience Factor</label>
                    <span className="text-xs font-mono text-pink-400 font-bold">{globalParams.econResilience}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={globalParams.econResilience} onChange={e => updateParam('econResilience', e.target.value)} className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Global Cyber Defense Posture</label>
                    <span className="text-xs font-mono text-gray-300 font-bold">{globalParams.cyberDefense}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={globalParams.cyberDefense} onChange={e => updateParam('cyberDefense', e.target.value)} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                 <button onClick={resetParams} className="text-xs font-mono font-bold text-gray-500 hover:text-white transition-colors cursor-pointer px-4 py-2 border border-slate-700 bg-slate-900 rounded-lg hover:bg-slate-800">RESET TO IMPRINT</button>
                 <button onClick={() => setShowGlobalParamsModal(false)} className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold px-6 py-2.5 cursor-pointer shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 active:scale-95">APPLY GLOBALLY</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Timeline Modal */}
        {showTimelineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><Clock size={18} className="text-gray-400" /> Activity Timeline</h3>
                <button onClick={() => setShowTimelineModal(false)} className="text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                {[
                  { time: '10:45 AM', event: 'Directive "Operation Omega" instantiated.', type: 'critical' },
                  { time: '09:12 AM', event: 'Security Level elevated to Level 4 Overseer.', type: 'sys' },
                  { time: 'YESTERDAY', event: 'New Intelligence Brief generated for Indo-Pacific.', type: 'info' },
                  { time: '04 JAN', event: 'Sovereign OS Hub interface initialized.', type: 'sys' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 shrink-0 text-right text-[10px] text-gray-500 font-mono mt-0.5">{item.time}</div>
                    <div className="relative pb-6 last:pb-0">
                      <div className={`absolute top-0 left-[-21px] w-2 h-2 rounded-full border border-slate-900 ${item.type === 'critical' ? 'bg-rose-500' : item.type === 'sys' ? 'bg-purple-500' : 'bg-pink-500'}`}></div>
                      {i !== 3 && <div className="absolute top-2 left-[-18px] w-px h-full bg-slate-800"></div>}
                      <div className="text-sm text-gray-300 bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Notifications Modal */}
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><Bell size={18} className="text-gray-400" /> Notifications</h3>
                <div className="flex items-center gap-3">
                  <button onClick={markAllRead} className="text-xs text-gray-400 hover:text-white transition cursor-pointer">Mark all read</button>
                  <button onClick={() => setShowNotificationsModal(false)} className="text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
                </div>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-800">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 flex gap-4 ${notif.read ? 'bg-slate-900' : 'bg-slate-800/30'}`}>
                    <div className="shrink-0 mt-0.5">
                      <Activity size={16} className={notif.read ? "text-gray-600" : "text-sky-400"} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${notif.read ? 'text-gray-400' : 'text-white font-medium'}`}>{notif.text}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-1">{notif.time}</div>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PALETTE.orange }}></div>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Initialize Directive Modal */}
        {showDirectiveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><Terminal size={18} style={{ color: PALETTE.purple }} /> Initialize Directive</h3>
                <button onClick={() => setShowDirectiveModal(false)} disabled={directiveState !== 'idle'} className="text-gray-500 hover:text-white transition disabled:opacity-50 cursor-pointer"><X size={16} /></button>
              </div>
              
              <div className="p-6">
                {directiveState === 'saved' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                       <CheckCircle2 size={32} />
                    </motion.div>
                    <h4 className="text-white font-bold text-xl">Directive Instantiated</h4>
                    <p className="text-gray-400 text-sm">Task assigned to active engines for immediate execution.</p>
                  </div>
                ) : (
                  <form onSubmit={handleDirectiveSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Directive Title</label>
                      <input required type="text" value={directiveForm.title} onChange={e => setDirectiveForm({...directiveForm, title: e.target.value})} placeholder="e.g. Operation Sovereign Shield" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Execution Type</label>
                        <select value={directiveForm.executionType} onChange={e => setDirectiveForm({...directiveForm, executionType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none">
                           <option>Strategic</option>
                           <option>Tactical</option>
                           <option>Simulation</option>
                           <option>Audit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Priority</label>
                        <select value={directiveForm.priority} onChange={e => setDirectiveForm({...directiveForm, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none">
                           <option>Background</option>
                           <option>Standard</option>
                           <option>High</option>
                           <option>CRITICAL (Flash override)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Target Systems</label>
                      <input type="text" value={directiveForm.target} onChange={e => setDirectiveForm({...directiveForm, target: e.target.value})} placeholder="e.g. Global Vendor Network, Constitutional DB" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500" />
                    </div>

                    <div className="pt-6 flex gap-3">
                      <button type="button" onClick={() => setShowDirectiveModal(false)} className="px-4 py-2.5 rounded-lg border border-slate-700 bg-transparent text-gray-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition flex-1 cursor-pointer">Cancel</button>
                      <button type="submit" disabled={directiveState === 'saving' || !directiveForm.title.trim()} className="px-4 py-2.5 rounded-lg text-white text-xs font-bold transition flex-1 flex justify-center items-center cursor-pointer disabled:opacity-50" style={{ backgroundColor: PALETTE.purple }}>
                        {directiveState === 'saving' ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : 'Launch Directive'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeDesc: string;
  type: 'new' | 'neutral';
  accent?: string;
}

function StatCard({ title, value, change, changeDesc, type, accent = PALETTE.purple }: StatCardProps) {
  return (
    <div className="bg-[#030712] border rounded-3xl p-5 flex flex-col hover:border-white/10 transition-colors group relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      {/* Tiny corner highlight using accent */}
      <div className="absolute -top-12 -right-12 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ backgroundColor: accent }} />
      
      <div className="flex justify-between items-start mb-4 z-10">
        <h3 className="text-xs font-semibold text-gray-300 font-mono tracking-wide uppercase">{title}</h3>
        <Info size={14} className="text-gray-650 group-hover:text-gray-400 transition-colors" />
      </div>
      
      <div className="mt-auto z-10">
        <div className="text-4xl font-light text-white tracking-tight mb-3">{value}</div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span 
            className="px-2 py-0.5 rounded font-mono font-bold border"
            style={{
              backgroundColor: `${accent}10`,
              borderColor: `${accent}25`,
              color: accent
            }}
          >
            {change} {type === 'new' ? '(new)' : '(no change)'}
          </span>
          <span className="text-gray-500 font-mono text-[9px]">{changeDesc}</span>
        </div>
      </div>
    </div>
  );
}
