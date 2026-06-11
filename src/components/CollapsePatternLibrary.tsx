import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Search, Hourglass, ShieldAlert, CheckCircle2, 
  HelpCircle, Sparkles, TrendingUp, RefreshCw, BookOpen, Clock, AlertTriangle
} from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     
  orange: '#FF6900',     
  darkBrown: '#56280B',  
  sky: '#00B8DB',        
  deepTeal: '#073F4D',   
};

interface CollapsePattern {
  name: string;
  period: string;
  similarityScore: number;
  collapseIndicators: string[];
  recoveryIndicators: string[];
  relevanceToCurrent: string;
}

export function CollapsePatternLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<string>('roman_empire');
  const [customResult, setCustomResult] = useState<CollapsePattern | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Trigger search to the custom full-stack endpoint
  const handleAISearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/civilization/collapse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      if (data && data.result) {
        setCustomResult(data.result);
        setIsSimulated(!!data.isSimulated);
        setActiveItem('custom_search');
      }
    } catch (e) {
      console.error("Historical search failure: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper dictionary for preset details when custom is not active
  const presets: { [key: string]: { id: string; query: string; icon: string } } = {
    roman_empire: { id: 'roman_empire', query: 'Roman Empire', icon: '🏛️' },
    soviet_union: { id: 'soviet_union', query: 'Soviet Union', icon: '⚒️' },
    weimar_germany: { id: 'weimar_germany', query: 'Weimar Germany', icon: '🏦' },
    yugoslavia: { id: 'yugoslavia', query: 'Yugoslavia', icon: '⛰️' },
  };

  const [activePresetData, setActivePresetData] = useState<CollapsePattern | null>(null);

  // Sync active preset from server API
  const syncPresetData = async (id: string, queryStr: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/civilization/collapse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryStr })
      });
      const data = await res.json();
      if (data && data.result) {
        setActivePresetData(data.result);
        setIsSimulated(!!data.isSimulated);
      }
    } catch (e) {
      console.error("Sync collapse data failure: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeItem !== 'custom_search') {
      const preset = presets[activeItem];
      if (preset) {
        syncPresetData(preset.id, preset.query);
      }
    }
  }, [activeItem]);

  const displayedPattern = activeItem === 'custom_search' ? customResult : activePresetData;

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Section Badge & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b animate-in fade-in" style={{ borderColor: `${PALETTE.deepTeal}25` }}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[9px] font-mono font-bold uppercase" style={{ backgroundColor: `${PALETTE.orange}15`, color: '#ffd2ba', border: `1px solid ${PALETTE.orange}30` }}>
              <GitBranch size={10} className="inline mr-1 align-middle text-[#FF6900]" /> SYSTEMIC PATHWAY MATRIX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900] animate-pulse" />
          </div>
          <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-2.5">
            Collapse Pattern Library
          </h2>
          <p className="text-xs text-gray-450">
            Query and analyze historical social-economic system fractures, crisis indicators, and survival pathway dynamics.
          </p>
        </div>

        {/* Global search query console */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAISearch(searchQuery);
          }}
          className="flex items-center gap-2 max-w-md w-full"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Query historical event (e.g. Maya, Ottoman)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#030611] border text-xs text-white rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-[#7F22FE] focus:outline-none transition-all"
              style={{ borderColor: `${PALETTE.deepTeal}35` }}
            />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#7F22FE] to-[#FF6900] hover:opacity-90 rounded-xl text-xs font-mono text-white font-bold transition-opacity cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles size={13} className="text-[#00B8DB]" /> AI Research
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Block (Cols: 4) - Historic Preset List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#030611] border rounded-3xl p-5" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
            <h3 className="text-xs font-mono tracking-wider text-gray-400 uppercase font-bold mb-4">
              Historical Crisis Baselines
            </h3>

            <div className="space-y-2">
              {Object.values(presets).map(p => {
                const isActive = activeItem === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveItem(p.id);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#050B1A] text-white border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
                        : 'bg-transparent text-gray-400 border-white/[0.02] hover:bg-slate-950 hover:text-white'
                    }`}
                    style={{ borderColor: isActive ? PALETTE.purple : undefined }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.icon}</span>
                      <div>
                        <span className="text-xs font-bold leading-none block mb-0.5">{p.query}</span>
                        <span className="text-[10px] text-gray-550 font-mono">Macro Framework</span>
                      </div>
                    </div>
                    <GitBranch size={12} className={isActive ? 'text-[#FF6900]' : 'text-gray-600'} />
                  </button>
                );
              })}

              {/* Custom Search Category Node if searched */}
              {customResult && (
                <button
                  onClick={() => setActiveItem('custom_search')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    activeItem === 'custom_search'
                      ? 'bg-[#050B1A] text-white border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
                      : 'bg-transparent text-gray-400 border-white/[0.02] hover:bg-slate-950 hover:text-white'
                  }`}
                  style={{ borderColor: activeItem === 'custom_search' ? PALETTE.orange : undefined }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <span className="text-xs font-bold leading-none block mb-0.5 line-clamp-1">{customResult.name}</span>
                      <span className="text-[10px] text-orange-400 font-mono">Custom AI Query</span>
                    </div>
                  </div>
                  <Sparkles size={12} className="text-orange-400" />
                </button>
              )}
            </div>

            <div className="bg-[#050E24] border border-[#00B8DB]10 rounded-2xl p-4 mt-6 text-[10.5px] leading-relaxed text-gray-400 font-mono uppercase">
              <div className="text-[#00B8DB] font-bold mb-1 flex items-center gap-1.5">
                <BookOpen size={12} /> COMPARATIVE ANALYSIS PROTOCOL
              </div>
              Analyze how currency stability, supply pipelines, and policy cohesion interact during systemic stresses.
            </div>
          </div>
        </div>

        {/* Right Block (Cols: 8) - Primary Historical Analysis Content View */}
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="bg-[#030611] border rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[380px]" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
              <RefreshCw className="animate-spin text-gray-500" size={36} style={{ color: PALETTE.purple }} />
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide font-mono uppercase mb-1">Retrieving Geopolitical Core</h4>
                <p className="text-xs text-gray-450 max-w-sm mx-auto leading-relaxed">
                  Parsing collapse indices, structural debasement timelines, and survival parameters through the Gemini Reasoning Net...
                </p>
              </div>
            </div>
          ) : displayedPattern ? (
            <div className="space-y-6">
              
              {/* Main Profile Heading Ribbon */}
              <div className="bg-[#030611] border rounded-3xl p-6 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                <div className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-5 pointer-events-none" style={{ backgroundColor: PALETTE.orange }} />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#FF6900] block">
                      {isSimulated ? 'Offline Historical Synthesis Active' : 'Verified Gemini Intel'}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-white">{displayedPattern.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-gray-450 font-mono">
                      <Clock size={12} style={{ color: PALETTE.sky }} /> Timeline Range: {displayedPattern.period}
                    </div>
                  </div>

                  <div className="bg-[#050b1d] border border-white/5 rounded-2xl p-4 flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 font-mono tracking-widest block">SYSTEMIC VARIATION RISK</span>
                      <span className="text-xs text-slate-400 font-mono">Compared to selected state</span>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border font-mono font-extrabold text-base relative" style={{ borderColor: `${PALETTE.orange}30`, backgroundColor: `${PALETTE.orange}05` }}>
                      <span style={{ color: PALETTE.orange }}>{displayedPattern.similarityScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Relevance to modern challenges brief card */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#56280B]20 to-black rounded-2xl border flex gap-3 text-xs leading-relaxed text-gray-300" style={{ borderColor: `${PALETTE.orange}15` }}>
                  <AlertTriangle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" style={{ color: PALETTE.orange }} />
                  <div>
                    <span className="font-bold text-white block mb-0.5 font-mono uppercase text-[10px] tracking-wider text-orange-400">Tactical Command Takeaway</span>
                    "{displayedPattern.relevanceToCurrent}"
                  </div>
                </div>
              </div>

              {/* Grid representation of Indicators (Collapse vs. Recovery Pathways) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Collapse Indicators (Red-Orange Warning themed) */}
                <div className="bg-[#030611] border rounded-3xl p-6 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <div className="p-1 px-1.5 rounded-lg bg-orange-400/5 border border-orange-500/20 text-orange-400">
                      <ShieldAlert size={15} style={{ color: PALETTE.orange }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">System Collapse Indicators</h4>
                      <p className="text-[10px] text-slate-500 leading-none">Primary triggers of structural fracture.</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pt-1">
                    {displayedPattern.collapseIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: PALETTE.orange }} />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Recovery / Stabilization Pathways (Sky-Emerald Green themed) */}
                <div className="bg-[#030611] border rounded-3xl p-6 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <div className="p-1 px-1.5 rounded-lg bg-emerald-400/5 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Survival & Recovery Pathways</h4>
                      <p className="text-[10px] text-slate-500 leading-none">Resilience strategies utilized to stabilize.</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pt-1">
                    {displayedPattern.recoveryIndicators.map((recovery, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#10b981' }} />
                        <span>{recovery}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-60 bg-[#030611] border rounded-3xl flex items-center justify-center text-sm text-gray-400 font-mono" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
              Synthesize historic collapse data above.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
