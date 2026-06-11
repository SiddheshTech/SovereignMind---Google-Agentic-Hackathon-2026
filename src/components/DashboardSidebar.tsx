import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart2, FileText, CheckSquare, Clock, GitBranch,
  ChevronDown, ChevronRight, Sun, Calendar, Video, Users, Settings, ExternalLink, Activity,
  LayoutDashboard, FileSpreadsheet, Bell, Compass, ShieldCheck, Map, AlertTriangle, Globe, Cpu, Eye, TrendingUp, Sparkles, Layers, ShieldAlert, Package, Network, Brain, LogOut
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  {
    title: '🏛 COMMAND',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
      { name: 'Executive Briefing', icon: FileSpreadsheet, id: 'executive-briefing' },
      { name: 'Live Alerts', icon: Bell, id: 'live-alerts', badge: 'Active' },
    ]
  },
  {
    title: '🧬 GENOME',
    items: [
      { name: 'DNA Explorer', icon: Compass, id: 'dna-explorer' },
      { name: 'Resilience Genes', icon: ShieldCheck, id: 'resilience-genes' },
      { name: 'Collapse Atlas', icon: GitBranch, id: 'collapse-atlas' },
    ]
  },
  {
    title: '⚖️ CONSTITUTION',
    items: [
      { name: 'Authority Maps', icon: Map, id: 'authority-maps' },
      { name: 'Emergency Powers', icon: AlertTriangle, id: 'emergency-powers' },
      { name: 'Treaty Intelligence', icon: FileText, id: 'treaty-intelligence' },
    ]
  },
  {
    title: '🌍 SANDBOX',
    items: [
      { name: 'Launch Center', icon: Globe, id: 'launch-simulation' },
      { name: 'Scenario Builder', icon: Cpu, id: 'scenario-builder' },
      { name: 'Simulations', icon: Layers, id: 'simulations' },
      { name: 'Recovery Explorer', icon: Clock, id: 'recovery-explorer' },
    ]
  },
  {
    title: '🔮 FORESIGHT',
    items: [
      { name: 'Risk Radar', icon: Eye, id: 'risk-radar' },
      { name: 'Forecasting', icon: TrendingUp, id: 'forecasting' },
      { name: 'Black Swan Detection', icon: Sparkles, id: 'black-swan' },
    ]
  },
  {
    title: '🏗 DIGITAL TWIN',
    items: [
      { name: 'Nation Model', icon: Layers, id: 'nation-model' },
      { name: 'Dependencies', icon: GitBranch, id: 'dependencies' },
      { name: 'Infrastructure', icon: Cpu, id: 'infrastructure' },
    ]
  },
  {
    title: '📊 ANALYTICS',
    items: [
      { name: 'Metrics', icon: BarChart2, id: 'metrics' },
      { name: 'Scoring', icon: CheckSquare, id: 'scoring' },
      { name: 'Intelligence Reports', icon: FileText, id: 'intel-reports' },
    ]
  },
  {
    title: '🚨 CRISIS',
    items: [
      { name: 'Active Incidents', icon: ShieldAlert, id: 'active-incidents' },
      { name: 'Operations Center', icon: Activity, id: 'ops-center' },
      { name: 'Decision Room', icon: Eye, id: 'decision-room' },
      { name: 'Cabinet Room', icon: Users, id: 'cabinet-room' },
    ]
  },
  {
    title: '📦 PROCUREMENT',
    items: [
      { name: 'Vendors', icon: Users, id: 'vendors' },
      { name: 'Contracts', icon: FileSpreadsheet, id: 'contracts' },
      { name: 'Supply Chains', icon: Package, id: 'supply-chains' },
    ]
  },
  {
    title: '🌐 INTELLIGENCE GRAPH',
    items: [
      { name: 'Networks', icon: Network, id: 'networks' },
      { name: 'Cascades', icon: GitBranch, id: 'cascades' },
    ]
  },
  {
    title: '🤖 AI COPILOT',
    id: 'ai-copilot',
    icon: Brain,
    items: []
  },
  {
    title: '👥 COLLABORATION',
    id: 'collaboration',
    icon: Users,
    items: []
  },
  {
    title: '📑 REPORTS',
    id: 'reports',
    icon: FileText,
    items: []
  },
  {
    title: '⚙️ SETTINGS',
    id: 'settings',
    icon: Settings,
    items: []
  }
];

interface DashboardSidebarProps {
  onLogout?: () => void;
  onUpgrade?: () => void;
  activeItem?: string;
  setActiveItem?: (id: string) => void;
  user?: {
    name: string;
    institution: string;
    clearanceLevel: string;
    enclaveRegion: string;
  } | null;
}

export function DashboardSidebar({ onLogout, onUpgrade, activeItem: propActiveItem, setActiveItem: propSetActiveItem, user }: DashboardSidebarProps) {
  const [localActiveItem, setLocalActiveItem] = useState('dashboard');
  const activeItem = propActiveItem !== undefined ? propActiveItem : localActiveItem;
  const setActiveItem = propSetActiveItem !== undefined ? propSetActiveItem : setLocalActiveItem;
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success'}>( { id: '', status: 'idle' } );

  const handleAction = async (id: string) => {
    setActionState({ id, status: 'loading' });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionState({ id, status: 'success' });
      setTimeout(() => setActionState({ id: '', status: 'idle' }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle' });
    }
  };

  const displayName = user?.name || "Clara Oswald";
  const displayClearance = user?.clearanceLevel || "Quantum Level 4 Overseer";
  const displayInst = user?.institution || "Sovereign Logistics Core";

  return (
    <div className="hidden md:flex w-[260px] h-screen fixed top-0 left-0 bg-[#020617] border-r border-white/5 flex-col text-white transform transition-transform duration-300 z-50 overflow-y-auto scrollbar-none font-sans">
      
      {/* Brand */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-pink-400 bg-pink-500/10 p-1.5 rounded-lg border border-pink-500/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
            <ShieldCheck size={18} className="text-pink-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-white uppercase font-sans">Sovereign Mind</span>
        </div>
      </div>

      {/* User Profile Hook */}
      <div className="px-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-900 to-violet-900 border border-pink-500/30 flex items-center justify-center overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=14b8a6&color=fff`} alt={displayName} className="w-full h-full object-cover" />
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-semibold text-white truncate">{displayName}</div>
            <div className="text-[10px] text-pink-400 font-mono tracking-wide truncate">{displayInst}</div>
            <div className="text-[9px] text-gray-500 truncate">{displayClearance}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6">
        {SIDEBAR_ITEMS.map((group) => {
          const hasItems = group.items && group.items.length > 0;
          
          if (!hasItems) {
            const isActive = activeItem === group.id;
            const GroupIcon = group.icon;
            
            return (
              <div key={group.title} className="space-y-1">
                <button
                  onClick={() => setActiveItem(group.id || '')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] font-semibold' 
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                  } cursor-pointer group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      {GroupIcon && <GroupIcon size={18} strokeWidth={isActive ? 2.5 : 2} />}
                    </div>
                    <span className="font-semibold tracking-wide text-xs">{group.title}</span>
                  </div>
                </button>
              </div>
            );
          }

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                {group.title}
              </div>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeItem === item.id;
                  const ItemIcon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                        isActive 
                          ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30 font-semibold shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                          : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
                      } cursor-pointer group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                          <ItemIcon size={14} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="tracking-wide text-[11px] font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded font-mono font-bold">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 mb-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-900/20 to-purple-900/10 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col gap-2">
            <ul className="space-y-2 mb-2">
              <li className="flex items-center gap-2 text-xs text-gray-300">
                <CheckSquare size={12} className="text-violet-400" /> All premium features
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-300">
                <CheckSquare size={12} className="text-violet-400" /> Unlimited Events
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-300">
                <CheckSquare size={12} className="text-violet-400" /> Cancel Anytime
              </li>
            </ul>
            <button 
               onClick={() => {
                 handleAction('upgrade');
                 setTimeout(() => onUpgrade?.(), 1000);
               }}
               disabled={actionState.status === 'loading'}
               className="w-full py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {actionState.status === 'loading' && actionState.id === 'upgrade' ? (
                 <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
              ) : actionState.status === 'success' && actionState.id === 'upgrade' ? (
                 'Upgrade Initiated'
              ) : 'Upgrade Now'}
            </button>
          </div>
        </div>
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full mt-4 py-2 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 text-red-300 hover:text-red-200 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={12} /> Sign Out Session
          </button>
        )}
      </div>
    </div>
  );
}
