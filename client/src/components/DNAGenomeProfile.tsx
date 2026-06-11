import React, { useState } from 'react';
import { 
  Dna, Shield, TrendingUp, Users, Cpu, Sparkles, BookOpen, Clock, 
  AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, ChevronRight, Play, Info,
  TrendingDown, Globe, Landmark, ShieldAlert, Zap, Search, Send, Activity, HelpCircle
} from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  sky: '#00B8DB',        // Strategic indicators
  deepTeal: '#073F4D',   // Deep framing lines
};

export function DNAGenomeProfile() {
  const [activeTab, setActiveTab] = useState<'dna-viewer' | 'genome-score' | 'similarity' | 'collapse-library' | 'collapse-risk' | 'recovery' | 'genetics-lab' | 'historical-genomes' | 'copilot' | 'advanced'>('dna-viewer');
  const [selectedCountry, setSelectedCountry] = useState('IN');

  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳', score: 84, rank: 7, composition: { governance: 22, economic: 20, social: 18, infra: 16, security: 12, env: 7, innov: 5 } },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', score: 95, rank: 2, composition: { governance: 24, economic: 21, social: 19, infra: 17, security: 10, env: 6, innov: 3 } },
    { code: 'US', name: 'United States', flag: '🇺🇸', score: 88, rank: 4, composition: { governance: 21, economic: 22, social: 15, infra: 18, security: 13, env: 6, innov: 5 } },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', score: 91, rank: 3, composition: { governance: 23, economic: 19, social: 19, infra: 19, security: 9, env: 5, innov: 6 } },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', score: 93, rank: 1, composition: { governance: 25, economic: 22, social: 13, infra: 18, security: 10, env: 4, innov: 8 } }
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <div className="max-w-[1360px] mx-auto pb-16 text-gray-200 font-sans animate-in fade-in duration-300">
      
      {/* Sovereignty Genome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b mb-6" style={{ borderColor: `${PALETTE.deepTeal}25` }}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-900/15 text-purple-300 border border-purple-500/20">
              <Dna size={10} className="inline mr-1 align-middle text-[#00B8DB] animate-spin" style={{ animationDuration: '3s' }} /> Flagship Intelligence Grid
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-light text-white tracking-tight flex items-baseline gap-2">
            Sovereignty Genome Engine <span className="text-xs text-purple-400 font-mono">"Mapping the DNA of Civilization Survival"</span>
          </h2>
          <p className="text-xs text-gray-400 max-w-3xl">
            A real-time civilization genetics sandbox. Decipher historical failures, stress-test sovereign systems, model cascade mechanics, and construct adaptation directives interactively.
          </p>
        </div>

        {/* Global country focusing selection */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
          {countries.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelectedCountry(c.code)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCountry === c.code 
                ? 'bg-purple-950/40 text-white font-bold border-purple-500/30 shadow-lg shadow-purple-500/10' 
                : 'bg-transparent text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control Bar Navbar */}
        <div className="lg:col-span-3 space-y-1.5 bg-[#02050E]/80 border rounded-3xl p-3.5 sticky top-6" style={{ borderColor: `${PALETTE.deepTeal}20` }}>
          <div className="text-[10px] font-mono text-gray-500 uppercase px-2.5 mb-2.5 tracking-widest font-bold">GRID CONTROLS</div>
          
          <button 
            type="button"
            onClick={() => setActiveTab('dna-viewer')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'dna-viewer' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Dna size={14} className={activeTab === 'dna-viewer' ? 'text-purple-400' : 'text-gray-550'} />
              <span>1. Civilization DNA Viewer</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('genome-score')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'genome-score' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Landmark size={14} className={activeTab === 'genome-score' ? 'text-purple-400' : 'text-gray-555'} />
              <span>2. Genome Profile</span>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded font-bold">{currentCountry.score}%</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('similarity')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'similarity' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Globe size={14} className={activeTab === 'similarity' ? 'text-purple-400' : 'text-gray-555'} />
              <span>3. Similarity Engine</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('collapse-library')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'collapse-library' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen size={14} className={activeTab === 'collapse-library' ? 'text-purple-400' : 'text-gray-555'} />
              <span>4. Collapse Pattern Library</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('collapse-risk')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'collapse-risk' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={14} className={activeTab === 'collapse-risk' ? 'text-purple-400' : 'text-gray-555'} />
              <span>5. Collapse Risk Engine</span>
            </div>
            <span className="text-[9px] font-mono text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded font-bold">Simulative</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('recovery')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'recovery' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw size={14} className={activeTab === 'recovery' ? 'text-purple-400' : 'text-gray-555'} />
              <span>6. Recovery Potential</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('genetics-lab')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'genetics-lab' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Zap size={14} className={activeTab === 'genetics-lab' ? 'text-purple-400' : 'text-gray-555'} />
              <span>7. Genetics Lab Room</span>
            </div>
            <span className="text-[9px] font-mono text-purple-400 border border-purple-400/30 px-1 rounded bg-purple-400/5">LAB</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('historical-genomes')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'historical-genomes' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Clock size={14} className={activeTab === 'historical-genomes' ? 'text-purple-400' : 'text-gray-555'} />
              <span>8. Historical Library</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'copilot' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={14} className={activeTab === 'copilot' ? 'text-purple-400' : 'text-gray-555'} />
              <span>9. AI Genome Copilot</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${activeTab === 'advanced' ? 'bg-purple-950/30 border-purple-500/30 text-white font-bold' : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu size={14} className={activeTab === 'advanced' ? 'text-purple-400' : 'text-gray-555'} />
              <span>10. Hidden Advanced</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>
        </div>

        {/* Right Adaptive Main Workspaces */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. CIVILIZATION DNA VIEWER SECTION */}
          {activeTab === 'dna-viewer' && (
            <DNAPairViewerSection currentCountryName={currentCountry.name} />
          )}

          {/* 2. CIVILIZATION GENOME PROFILE SECTION */}
          {activeTab === 'genome-score' && (
            <GenomeProfileSection currentCountry={currentCountry} />
          )}

          {/* 3. SIMILARITY ENGINE SECTION */}
          {activeTab === 'similarity' && (
            <SimilarityEngineSection currentCountry={currentCountry} />
          )}

          {/* 4. COLLAPSE PATTERN LIBRARY SECTION */}
          {activeTab === 'collapse-library' && (
            <CollapsePatternLibrarySection currentCountry={currentCountry} />
          )}

          {/* 5. COLLAPSE RISK ENGINE SECTION */}
          {activeTab === 'collapse-risk' && (
            <CollapseRiskEngineSection currentCountry={currentCountry} />
          )}

          {/* 6. RECOVERY POTENTIAL SECTION */}
          {activeTab === 'recovery' && (
            <RecoveryPotentialSection currentCountry={currentCountry} />
          )}

          {/* 7. CIVILIZATION GENETICS LAB SECTION */}
          {activeTab === 'genetics-lab' && (
            <GeneticsLabRoomSection currentCountry={currentCountry} />
          )}

          {/* 8. HISTORICAL GENOME LIBRARY SECTION */}
          {activeTab === 'historical-genomes' && (
            <HistoricalGenomeLibrarySection />
          )}

          {/* 9. AI GENOME COPILOT SECTION */}
          {activeTab === 'copilot' && (
            <AIGenomeCopilotSection currentCountry={currentCountry} />
          )}

          {/* 10. HIDDEN ADVANCED FEATURES SECTION */}
          {activeTab === 'advanced' && (
            <AdvancedControlsSection currentCountry={currentCountry} />
          )}

        </div>

      </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: CIVILIZATION DNA VIEWER
// =============================================================
interface GeneNode {
  key: string;
  name: string;
  score: number;
  color: string;
  subGenes: { name: string; score: number }[];
}

function DNAPairViewerSection({ currentCountryName }: { currentCountryName: string }) {
  const [activeGeneKey, setActiveGeneKey] = useState<string>('gov');
  const [governanceComparisonOpen, setGovernanceComparisonOpen] = useState(false);
  const [predTime, setPredTime] = useState<string | null>(null);
  const [simulatedMutation, setSimulatedMutation] = useState<string | null>(null);

  // Economic Mutation States
  const [tradeDiversitySlider, setTradeDiversitySlider] = useState(82);
  const [ecoStressEvent, setEcoStressEvent] = useState<string | null>(null);

  // Social Gen States
  const [socialTimeFrame, setSocialTimeFrame] = useState<'current' | 'reconstruction' | 'tension'>('current');

  // Infrastructure states
  const [powerGridCascadeActive, setPowerGridCascadeActive] = useState(false);

  const traits: { [key: string]: GeneNode } = {
    gov: {
      key: 'gov',
      name: 'Governance Gene',
      score: 88,
      color: '#7F22FE',
      subGenes: [
        { name: 'Leadership Continuity', score: 85 },
        { name: 'Institutional Strength', score: 90 },
        { name: 'Policy Stability', score: 88 },
        { name: 'Bureaucratic Efficiency', score: 78 },
        { name: 'Strategic Planning', score: 82 },
        { name: 'Emergency Decision Capacity', score: 92 },
        { name: 'Anti-Corruption Capacity', score: 80 },
        { name: 'Judicial Stability', score: 84 }
      ]
    },
    eco: {
      key: 'eco',
      name: 'Economic Gene',
      score: 82,
      color: '#FF6900',
      subGenes: [
        { name: 'Fiscal Resilience', score: 80 },
        { name: 'Trade Diversity', score: 86 },
        { name: 'Inflation Resistance', score: 72 },
        { name: 'Labor Adaptability', score: 75 },
        { name: 'Industrial Capacity', score: 88 },
        { name: 'Innovation Strength', score: 91 },
        { name: 'Currency Stability', score: 84 },
        { name: 'Investment Attractiveness', score: 85 },
        { name: 'Supply Chain Independence', score: 68 }
      ]
    },
    soc: {
      key: 'soc',
      name: 'Social Gene',
      score: 74,
      color: '#818cf8',
      subGenes: [
        { name: 'Social Trust', score: 68 },
        { name: 'Community Resilience', score: 76 },
        { name: 'Education Quality', score: 82 },
        { name: 'Cultural Cohesion', score: 70 },
        { name: 'Civic Participation', score: 74 },
        { name: 'Demographic Stability', score: 60 },
        { name: 'Intergroup Harmony', score: 65 },
        { name: 'Media Reliability', score: 61 }
      ]
    },
    inf: {
      key: 'inf',
      name: 'Infrastructure Gene',
      score: 80,
      color: '#00B8DB',
      subGenes: [
        { name: 'Energy Security', score: 82 },
        { name: 'Transport Reliability', score: 78 },
        { name: 'Digital Connectivity', score: 90 },
        { name: 'Healthcare Capacity', score: 74 },
        { name: 'Water Security', score: 65 },
        { name: 'Housing Resilience', score: 70 },
        { name: 'Telecommunications', score: 86 },
        { name: 'Logistics Efficiency', score: 80 }
      ]
    }
  };

  const activeNode = traits[activeGeneKey] || traits['gov'];

  return (
    <div className="space-y-6">
      
      {/* Helix Viewer */}
      <div className="bg-[#030712] border rounded-3xl p-6 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7F22FE]/10 blur-3xl pointer-events-none rounded-full" />
        
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-2">
          <Dna size={18} className="text-[#00B8DB]" /> Civilization DNA Modeling Strand
        </h3>
        <p className="text-xs text-gray-450 max-w-2xl">
          Click any prime helix gene sequence block below to dissect core administrative, financial, societal or hardware modules.
        </p>

        {/* Triple-helix visual component drawing */}
        <div className="h-44 w-full flex items-center justify-center relative bg-black/60 rounded-2xl border border-white/5 my-6 overflow-hidden">
          <svg className="w-full h-full max-w-[550px] overflow-visible" viewBox="0 0 500 100">
            {/* Horizontal Helix base pairs */}
            {[...Array(16)].map((_, i) => {
              const x = 30 + i * 30;
              const angle = (i * Math.PI) / 4;
              const y1 = 50 + Math.sin(angle) * 30;
              const y2 = 50 - Math.sin(angle) * 30;
              
              // Distribute colors to traits dynamically
              let geneKey = 'gov';
              if (i >= 4 && i < 8) geneKey = 'eco';
              if (i >= 8 && i < 12) geneKey = 'soc';
              if (i >= 12) geneKey = 'inf';

              const trait = traits[geneKey];
              const isSelected = activeGeneKey === geneKey;

              return (
                <g 
                  key={i} 
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveGeneKey(geneKey)}
                  style={{ opacity: isSelected ? 1 : 0.4 }}
                >
                  <line x1={x} y1={y1} x2={x} y2={y2} stroke={trait.color || '#fff'} strokeWidth={isSelected ? 2 : 1} strokeDasharray="2 3" />
                  <circle cx={x} cy={y1} r={isSelected ? 6 : 4} fill={trait.color || '#fff'} />
                  <circle cx={x} cy={y2} r={isSelected ? 6 : 4} fill={trait.color || '#fff'} />
                </g>
              );
            })}
          </svg>

          {/* Quick links to categories click */}
          <div className="absolute top-3 left-4 text-[9px] font-mono text-gray-550 uppercase tracking-widest">DNA Helix interactive nodes</div>
          <div className="absolute bottom-3 right-4 flex gap-4 text-[10px] font-mono">
            {Object.values(traits).map(t => (
              <button 
                key={t.key}
                onClick={() => setActiveGeneKey(t.key)}
                className={`flex items-center gap-1.5 transition-colors ${activeGeneKey === t.key ? 'text-white font-bold' : 'text-gray-500'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color || '#fff' }} />
                <span>{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RACK PANEL: GOVERNANCE GENE SECTION */}
      {activeGeneKey === 'gov' && (
        <div className="bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#7F22FE] tracking-widest font-bold">DNA LEVEL 01 • RESILIENCE INTERPRETATION</div>
              <h4 className="text-xl font-bold text-white tracking-tight mt-1">Governance Gene Analytics</h4>
              <p className="text-xs text-gray-400 mt-1">Measures core capabilities surrounding leadership durability, judicial buffers, and state planning efficiency.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-4 shrink-0">
               <div className="text-right">
                  <span className="text-[9px] font-mono text-gray-550 block uppercase">Overall Governance score</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">Baseline Stability Index</span>
               </div>
               <span className="text-2xl font-mono text-[#7F22FE] font-bold">{simulatedMutation ? '94%' : `${activeNode.score}%`}</span>
            </div>
          </div>

          {/* Grid representation: Sub Genes & Gene Strength Graph */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Sub Genes Slider Progress Bars */}
            <div className="md:col-span-6 space-y-3">
               <h5 className="text-[10px] uppercase font-mono font-bold text-gray-500 tracking-wider">Active sub-resilience factors</h5>
               
               <div className="space-y-2.5">
                  {activeNode.subGenes.map((sg, i) => {
                    let finalScore = sg.score;
                    if (simulatedMutation && sg.name === 'Institutional Strength') finalScore = 100; // Increased
                    return (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5 hover:border-[#7F22FE]/20 transition-all">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-300 font-medium">{sg.name}</span>
                          <span className="text-white font-bold">{finalScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${finalScore}%`, backgroundColor: '#7F22FE' }} />
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Gene Strength Graph (Current, 5yr ago, 10yr ago, future) */}
            <div className="md:col-span-6 space-y-4">
              <h5 className="text-[10px] uppercase font-mono font-bold text-gray-500 tracking-wider">Genetic integrity temporal Strength Path</h5>

              {/* Graphical representation mock */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
                <div className="h-28 flex items-end justify-between px-4 pb-2 border-b border-white/10">
                   {[
                     { l: '10 Yrs Ago', val: 78 },
                     { l: '5 Yrs Ago', val: 82 },
                     { l: 'Current', val: simulatedMutation ? 94 : 88 },
                     { l: 'Projected Future', val: 91 }
                   ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                         <span className="text-[10px] font-mono text-white font-bold">{item.val}%</span>
                         <div className="w-4 bg-[#7F22FE] rounded-t transition-all duration-300" style={{ height: `${item.val * 0.7}px`, opacity: idx === 2 ? 1 : 0.4 }} />
                         <span className="text-[8px] uppercase text-gray-500 text-center select-none font-mono tracking-tight leading-none h-4">{item.l}</span>
                      </div>
                   ))}
                </div>

                <div className="text-xs leading-normal text-gray-450 italic">
                  <b>AI Structural Diagnostics:</b> Governance resilience remains strong due to stable institutions and policy continuity. Risk factors include bureaucratic complexity and regional implementation gaps.
                </div>
              </div>

              {/* Action controller Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                 <div className="flex flex-wrap gap-2">
                   <button 
                     type="button"
                     onClick={() => setGovernanceComparisonOpen(!governanceComparisonOpen)}
                     className="px-3.5 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-all hover:border-[#7F22FE]/40"
                   >
                     Compare Governance Gene
                   </button>
                   <button 
                     type="button"
                     onClick={() => setPredTime(predTime ? null : '2040')}
                     className="px-3.5 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-all hover:border-purple-500/40"
                   >
                     Predict Evolution
                   </button>
                   <button 
                     type="button"
                     onClick={() => setSimulatedMutation(simulatedMutation ? null : 'active')}
                     className="px-3.5 py-2 bg-[#7F22FE]/15 border border-[#7F22FE]/30 text-purple-200 hover:bg-[#7F22FE]/30 rounded-xl text-xs font-mono font-bold transition-all"
                   >
                     Simulate Governance Mutation (+15%)
                   </button>
                 </div>

                 {/* Expansion: Governance Matrix */}
                 {governanceComparisonOpen && (
                   <div className="p-3 bg-slate-950 rounded-xl border border-white/10 text-xs font-mono space-y-2 mt-2 leading-relaxed">
                     <div className="text-white font-bold border-b border-white/5 pb-1 uppercase text-[10px] tracking-wider text-purple-400">Governance Comparison Index Matrix</div>
                     <div className="grid grid-cols-5 gap-2 text-center text-[10.5px]">
                       <div className="text-left font-bold text-slate-400">Node</div>
                       <div className="font-bold">India</div>
                       <div className="font-bold">Singapore</div>
                       <div className="font-bold">Germany</div>
                       <div className="font-bold">Japan</div>
                       
                       <div className="text-left">Inst. Stability</div>
                       <div className="text-indigo-400 font-bold">88%</div>
                       <div className="text-indigo-400 font-bold">96%</div>
                       <div className="text-indigo-400 font-bold">92%</div>
                       <div className="text-indigo-400 font-bold">94%</div>

                       <div className="text-left">Decision Buffer</div>
                       <div className="text-[#00B8DB] font-bold">92%</div>
                       <div className="text-indigo-400 font-bold">95%</div>
                       <div className="text-orange-400 font-bold">78%</div>
                       <div className="text-[#00B8DB] font-bold">88%</div>
                     </div>
                   </div>
                 )}

                 {/* Predict Outcomes display */}
                 {predTime && (
                   <div className="p-3.5 bg-slate-950 rounded-xl border border-[#00B8DB]/20 text-xs font-mono space-y-1 my-1 leading-relaxed">
                     <span className="text-[#00B8DB] font-bold uppercase text-[9px] block">PROGNOSIS EVOLUTION MATRIX (2030 – 2050)</span>
                     <p className="text-gray-300">By **2030**, institutional stability yields buffer decentralized stress levels successfully (+8% survival factor). By **2050**, secondary demographic trends trigger regional administrative locks unless automated consensus tracks are deployed natively.</p>
                   </div>
                 )}

                 {/* Simulated Mutation Recalculation Notification */}
                 {simulatedMutation && (
                   <div className="p-3.5 bg-indigo-950/10 rounded-xl border border-indigo-500/20 text-xs font-mono space-y-1 my-1 leading-relaxed animate-pulse">
                     <span className="text-indigo-400 font-bold uppercase text-[9px] block">MUTATION SYSTEM COMPILATION SUCCESS</span>
                     <p className="text-gray-300">Adding **Institutional Strength +15%** has recalculated future stability thresholds. Structural failure probability decreased from 4.2% to **1.1% globally**.</p>
                   </div>
                 )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RACK PANEL: ECONOMIC GENE SECTION */}
      {activeGeneKey === 'eco' && (
        <div className="bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#FF6900] tracking-widest font-bold">DNA LEVEL 02 • SYSTEMIC PORTFOLIO RESILIENCE</div>
              <h4 className="text-xl font-bold text-white tracking-tight mt-1">Economic Genome Laboratory</h4>
              <p className="text-xs text-gray-450 mt-1">Simulate trade diversity reductions, currency volatility thresholds, and run real-time geopolitical stress testing.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-4 shrink-0">
               <div className="text-right">
                  <span className="text-[9px] font-mono text-gray-550 block uppercase">Economic stability vector</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">Fiscal adaptive index</span>
               </div>
               <span className="text-2xl font-mono text-[#FF6900] font-bold">{tradeDiversitySlider < 50 ? '64%' : '82%'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
             
             {/* Economic Gene Maps */}
             <div className="md:col-span-6 space-y-3">
               <h5 className="text-[10px] uppercase font-mono font-bold text-gray-505 tracking-wider">Fiscal Adaptive Spectrum Map</h5>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {traits.eco.subGenes.map((sg, i) => {
                    let scoreVal = sg.score;
                    if (sg.name === 'Trade Diversity') scoreVal = tradeDiversitySlider;
                    return (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-white/5 hover:border-[#FF6900]/25 transition-colors">
                        <span className="text-gray-400 text-[11px] block">{sg.name}</span>
                        <span className="text-white font-bold text-sm block mt-1">{scoreVal}%</span>
                      </div>
                    );
                  })}
                </div>
             </div>

             {/* Economic Mutation simulator core logic */}
             <div className="md:col-span-6 space-y-4 bg-slate-950 p-5 rounded-2xl border border-white/5 relative">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider block">Economic Mutation Sandbox</span>
                
                {/* Sliders to increase trade diversity */}
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-xs font-mono">
                     <span>Modify Trade Diversity</span>
                     <span className="text-white font-bold">{tradeDiversitySlider}%</span>
                   </div>
                   <input 
                     type="range"
                     min="10"
                     max="100"
                     value={tradeDiversitySlider}
                     onChange={(e) => setTradeDiversitySlider(parseInt(e.target.value))}
                     className="w-full accent-[#FF6900] h-1.5 bg-slate-900 rounded appearance-none cursor-pointer"
                   />
                </div>

                {tradeDiversitySlider < 50 ? (
                  <div className="p-3.5 bg-red-950/15 border border-red-500/25 rounded-xl text-xs font-mono text-gray-300 space-y-1.5 leading-relaxed">
                     <span className="text-red-400 font-bold block uppercase text-[10px] tracking-wider">⚠️ RECALCULATED SYSTEM MARGIN ERROR</span>
                     <div>**GDP growth yield:** -2.4% contraction offset</div>
                     <div>**Structural unemployment:** +1.8% offset risk</div>
                     <div>**Recovery speed:** +1.2 Years lagging burden</div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed pt-2">
                     Decrease trade diversity (under 50%) to see simulated GDP contraction patterns and unemployment risk corridors automatically calculated.
                  </p>
                )}

                {/* Economic Stress Testing Buttons */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <span className="text-[9px] uppercase font-mono text-gray-500 font-bold tracking-wider">Apply black swan stress loops</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Trade War', 'Global Recession', 'Currency Collapse', 'Debt Crisis', 'Oil Shock'].map(ev => (
                       <button
                         key={ev}
                         onClick={() => setEcoStressEvent(ecoStressEvent === ev ? null : ev)}
                         className={`px-3 py-1.5 text-[10.5px] font-mono border rounded-lg transition-all cursor-pointer ${ecoStressEvent === ev ? 'bg-orange-500/20 border-orange-500/40 text-orange-200' : 'bg-transparent border-white/5 text-gray-400 hover:text-white'}`}
                       >
                         ⚡ {ev}
                       </button>
                    ))}
                  </div>

                  {ecoStressEvent && (
                    <div className="p-3 bg-[#56280B]/10 rounded-xl border border-amber-500/20 text-xs font-mono text-gray-305 leading-relaxed mt-2">
                       <span className="text-amber-500 font-bold block uppercase text-[9px]">STRESS TEST: {ecoStressEvent.toUpperCase()} INTERCEPT</span>
                       Currency resilience remains healthy, but imports depend strongly on shipping lanes. Mitigation mandates decentralized reserves strategy inside 6 months to bypass a 14% systemic failure risk.
                    </div>
                  )}
                </div>
             </div>

          </div>
        </div>
      )}

      {/* RACK PANEL: SOCIAL GENE SECTION */}
      {activeGeneKey === 'soc' && (
        <div className="bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
           
           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#818cf8] tracking-widest font-bold">DNA LEVEL 03 • SOCIAL CONGRUENCE MATRIX</span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-1">Social Genome Center</h4>
                <p className="text-xs text-gray-450 mt-1">Analyze localized community cohesiveness, social trust patterns, and demographic pressure channels.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-4 shrink-0 font-mono">
                 <div className="text-right">
                    <span className="text-[9px] text-gray-550 block uppercase">Social trust average</span>
                    <span className="text-xs font-bold text-slate-400">Generational coherence</span>
                 </div>
                 <span className="text-2xl text-[#818cf8] font-bold">74%</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
             
              {/* Heatmap region distribution panel mock */}
              <div className="md:col-span-6 space-y-4">
                 <h5 className="text-[10px] uppercase font-mono font-bold text-gray-500 tracking-wider">Social trust heatmap distribution matrix</h5>
                 
                 <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-gray-450 text-[10.5px]">
                      <span>Region / Sector Cohort</span>
                      <span>Polarization index</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { r: 'Metropolitan Area', score: 'LOW RISK', c: 'text-indigo-400' },
                        { r: 'Northern Hub', score: 'DEPREK COHORT SECURED', c: 'text-[#00B8DB]' },
                        { r: 'Industrial Belt', score: 'EMERGING POLARIZATION', c: 'text-amber-500 font-bold' },
                        { r: 'Rural Zone Districts', score: 'OPTIMAL COHESION', c: 'text-indigo-400' }
                      ].map((reg, idx) => (
                         <div key={idx} className="flex justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                           <span className="text-gray-300">{reg.r}</span>
                           <span className={reg.c}>{reg.score}</span>
                         </div>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Dynamic simulation tabs for fracture & recovery */}
              <div className="md:col-span-6 space-y-4 bg-slate-950 p-5 rounded-2xl border border-white/5 relative">
                 <div className="flex bg-black/60 rounded-xl p-1 border border-white/5">
                   {['current', 'tension', 'reconstruction'].map(tm => (
                      <button
                        key={tm}
                        onClick={() => setSocialTimeFrame(tm as any)}
                        className={`flex-1 py-1 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${socialTimeFrame === tm ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-white'}`}
                      >
                        {tm} State
                      </button>
                   ))}
                 </div>

                 {socialTimeFrame === 'current' && (
                   <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-mono text-indigo-400 block font-bold">Societal baseline indexes</span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                         Social trust parameters record stable structures. Secondary educational vectors cushion rural transition stressors. Media trust indices require monitoring.
                      </p>
                   </div>
                 )}

                 {socialTimeFrame === 'tension' && (
                   <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-mono text-red-400 block font-bold">Fracture detector telemetry</span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                         **ALERT:** Structural media reliability fractures detected inside metropolitan quadrants. Polarization indices indicate risk triggers may arise if inflation remains above 6% globally over 18 months.
                      </p>
                   </div>
                 )}

                 {socialTimeFrame === 'reconstruction' && (
                   <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-mono text-[#00B8DB] block font-bold">Recovery potential estimation metrics</span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                         **Stabilization latency speed:** After a major black swan shock (floods, conflict, financial crisis), societal cohesion parameters are projected to reach pre-crisis equilibrium in **90 days** due to high municipal trust loops.
                      </p>
                   </div>
                 )}
              </div>

           </div>
        </div>
      )}

      {/* RACK PANEL: INFRASTRUCTURE GENE SECTION */}
      {activeGeneKey === 'inf' && (
        <div className="bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
           
           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00B8DB] tracking-widest font-bold">DNA LEVEL 04 • HARDWARE ASSURANCES & GRID PATHWAYS</span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-1">Infrastructure Genetics Lab</h4>
                <p className="text-xs text-gray-450 mt-1">Sovereign power grid guarantees, digital redundant gateways, and municipal asset buffers.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-4 shrink-0 font-mono">
                 <div className="text-right">
                    <span className="text-[9px] text-[#00B8DB] block uppercase">Network density average</span>
                    <span className="text-xs font-bold text-slate-400">Total buffer safety</span>
                 </div>
                 <span className="text-2xl text-[#00B8DB] font-bold">80%</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Dependency Networks Tree Map */}
              <div className="md:col-span-6 space-y-3">
                 <h5 className="text-[10px] uppercase font-mono font-bold text-gray-500 tracking-wider">Systemic Hardware Interdependency Map</h5>
                 
                 <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span>PRIMARY GRID CELL PATHWAYS</span>
                    </div>

                    {/* Simple flowchart nodes rendering */}
                    <div className="space-y-2 mt-2">
                      {[
                        { title: '⚡ Energy Production Sources', link: '⇩ feeds water filtration centers' },
                        { title: '💧 Municipal Water reservoirs', link: '⇩ delivers agricultural field systems' },
                        { title: '🌾 Sovereign grain storage depots', link: '⇩ allocates food to public nodes' },
                        { title: '🛒 Retail & Logistics Distribution', link: '⇩ buffers overall societal stability status' }
                      ].map((nodeVal, idx) => (
                         <div key={idx} className="p-2 bg-black/40 border border-white/5 rounded-lg space-y-1">
                           <div className="text-gray-200 font-bold">{nodeVal.title}</div>
                           <div className="text-slate-500 text-[10px]">{nodeVal.link}</div>
                         </div>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Cascade Failure Simulator */}
              <div className="md:col-span-6 space-y-4 bg-slate-950 p-5 rounded-2xl border border-white/5 relative">
                 <span className="text-[10px] uppercase font-mono font-bold text-red-400 tracking-wider block">Cascade Failure Simulator</span>
                 
                 <p className="text-xs text-gray-300 leading-relaxed">
                   Launch experimental failure simulation on state assets to identify dynamic bottlenecks before cascading collapses occur.
                 </p>

                 <div className="pt-2">
                   <button
                     type="button"
                     onClick={() => {
                       setPowerGridCascadeActive(true);
                       setTimeout(() => {
                         setPowerGridCascadeActive(false);
                       }, 2000);
                     }}
                     className="px-4 py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 text-red-200 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                   >
                     {powerGridCascadeActive ? '⚡ Initiating power cascade simulation loops...' : 'Trigger Power Grid Cascade failure'}
                   </button>
                 </div>

                 {powerGridCascadeActive ? (
                   <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl font-mono text-[10.5px] text-gray-300 mt-2 space-y-1 animate-pulse">
                      <div>**STEP 1:** Core grid transformer failure detected</div>
                      <div>**STEP 2:** Water pressure filters shut down immediately</div>
                      <div>**STEP 3:** Regional supply grain conveyor lock triggered</div>
                      <div className="text-red-400 font-bold">**RESULT:** Public unrest parameters offset upwards inside 18 hours.</div>
                   </div>
                 ) : (
                   <p className="text-[11px] text-gray-550 pt-2 italic">
                     Simulation tracks downstream impacts through nested transport logistics nodes, modeling recovery times interactively.
                   </p>
                 )}
              </div>

           </div>
        </div>
      )}

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: CIVILIZATION GENOME PROFILE
// =============================================================
function GenomeProfileSection({ currentCountry }: { currentCountry: any }) {
  const spectrums = [
    { label: 'Governance Strength Weight', val: currentCountry.composition.governance, c: PALETTE.purple },
    { label: 'Economic buffers', val: currentCountry.composition.economic, c: PALETTE.orange },
    { label: 'Social local trust', val: currentCountry.composition.social, c: '#818cf8' },
    { label: 'Physical Grid redundancy', val: currentCountry.composition.infra, c: PALETTE.sky },
    { label: 'Security capabilities assets', val: currentCountry.composition.security, c: '#EC4899' },
    { label: 'Environmental Climate buffers', val: currentCountry.composition.env, c: '#EAB308' },
    { label: 'Innovation Coefficient', val: currentCountry.composition.innov, c: '#84CC16' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-[#030712] border rounded-3xl p-6 relative" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
        <h3 className="text-lg font-bold text-white tracking-tight flex items-baseline gap-2 mb-2">
          <span>Sovereign Genome Profile Assessment</span>
        </h3>
        <p className="text-xs text-gray-400">Total analytical breakdown across the seven core indices of civilizational survival.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
          
          {/* Circular dial meter indicator */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl bg-slate-950">
             <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase block mb-1">Civilization Genome Health</span>
             <div className="text-6xl font-light font-sans text-white mt-1">{currentCountry.score}<span className="text-lg text-gray-650">/100</span></div>
             <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold mt-3">GLOBAL RANK #{currentCountry.rank}</span>
          </div>

          {/* Composition distribution chart details list */}
          <div className="md:col-span-8 space-y-4">
             <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Comparative baseline Weight (%)</span>

             <div className="space-y-2.5">
               {spectrums.map((sp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-300 font-medium">{sp.label}</span>
                      <span className="text-white font-bold">{sp.val}% spectral weight</span>
                    </div>
                    {/* Visual custom bar layout */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sp.val * 4}%`, backgroundColor: sp.c }} />
                    </div>
                  </div>
               ))}
             </div>
          </div>

        </div>
      </div>

      {/* Narrative AI details section */}
      <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
        <h4 className="text-xs font-bold font-mono text-[#00B8DB] uppercase tracking-widest pb-3 border-b border-white/5">AI Genome Analytical Narrative</h4>
        
        <p className="text-xs text-gray-300 leading-relaxed mt-4">
          The sovereign genome mapping of <b className="text-white">{currentCountry.name}</b> possesses strong governance and infrastructure genes, but displays emerging vulnerabilities in demographic stability and climate resilience. Expanding physical buffer stocks mitigates critical shipping bottlenecks successfully.
        </p>

        {/* Buttons rack */}
        <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-white/5">
          <button className="px-4 py-2 bg-[#7F22FE] hover:opacity-90 text-white font-bold text-xs rounded-xl cursor-pointer">
            View Full Genome Report
          </button>
          <button className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
            Export Genome Matrix
          </button>
          <button className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
            Compare Cohorts
          </button>
          <button className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
            Forecast System Mutation Trails
          </button>
        </div>
      </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: SIMILARITY ENGINE
// =============================================================
function SimilarityEngineSection({ currentCountry }: { currentCountry: any }) {
  const [selectedCompanion, setSelectedCompanion] = useState<string>('JP');

  const comparisonDatabase: { [key: string]: any } = {
    JP: {
      name: 'Japan',
      pct: 78,
      similar: ['Institutional Stability', 'Infrastructure Quality', 'Education Strength'],
      different: ['Population Density', 'Governance Structure', 'Resource Dependency'],
      lessons: ' Decouple energy buffers into localized micro-grid clusters to insulate domestic machinery loops (drawn from Japans grid decentralization experience).',
      paths: 'Japan achieved rapid technology evolution stages paired with high-quality educational stamina blocks. India can adopt comparable red-tape filtering protocols.',
      policies: 'Decentralized municipal food storage reserves, multi-trust local security, state-backed technology research hubs.'
    },
    SG: {
      name: 'Singapore',
      pct: 75,
      similar: ['Bureaucratic Redundancy', 'Emergency Power Decision-making', 'Investment Attractiveness'],
      different: ['Territorial Mass', 'Water Sovereignty', 'Resource buffers'],
      lessons: 'Construct vertical modular water treatment centers inside critical industrial nodes to hedge imported resource blockades.',
      paths: 'Singapore leveraged high maritime port shipping dominance and strict policy consistency index scores to bypass land limitations.',
      policies: 'Autonomous water recycling loops, real-time cargo logistics monitoring algorithms.'
    },
    KR: {
      name: 'South Korea',
      pct: 73,
      similar: ['Industrial Redundancy', 'Digital Connectivity Infrastructure', 'Innovation Yield'],
      different: ['Demographic Continuity', 'Strategic geographic buffering limits'],
      lessons: 'Deploy generational child education and localized pension trusts to address long-term labor adaptability shortfalls.',
      paths: 'South Korea capitalized heavily on state-backed global conglomerate research models to establish technology export dominance.',
      policies: 'Unified corporate-state technology labs, regional younger cohort tax benefits.'
    },
    DE: {
      name: 'Germany',
      pct: 68,
      similar: ['Federal Administrative Cohesion', 'Supply Logistics efficiency', 'Judicial limits continuity'],
      different: ['Energy Import safety margins', 'Digital Network density'],
      lessons: 'Accelerate domestic renewable energy asset deployments to decouple baseline production from foreign pipelines.',
      paths: 'Germany stabilized post-reconstruction European commerce by constructing robust intermediate manufacturing output chains.',
      policies: 'Decoupled manufacturing pipeline subsidies, federal energy grid buffer acts.'
    }
  };

  const currentMatch = comparisonDatabase[selectedCompanion] || comparisonDatabase['JP'];

  return (
    <div className="space-y-6 animate-in fade-in">
       
       {/* Finder panel */}
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 mb-1">
             <Globe size={18} className="text-[#00B8DB]" /> Civilization Genetics Similarity Finder
          </h3>
          <p className="text-xs text-gray-400">Discover comparable cohorts sharing structural integrity profile characteristics.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {Object.keys(comparisonDatabase).map((keyVal) => {
              const comp = comparisonDatabase[keyVal];
              return (
                <button
                  key={keyVal}
                  type="button"
                  onClick={() => setSelectedCompanion(keyVal)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${selectedCompanion === keyVal ? 'bg-purple-950/40 border-purple-500/40 text-white font-bold' : 'bg-slate-950/80 border-white/5 text-gray-405 hover:bg-slate-900 hover:text-white'}`}
                >
                   <div className="text-sm font-bold block">{comp.name}</div>
                   <div className="text-[10px] font-mono text-purple-400 tracking-wider block mt-1">{comp.pct}% Systemic Overlap</div>
                </button>
              );
            })}
          </div>
       </div>

       {/* Matrix comparison results cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
         
         <div className="bg-[#030712] border rounded-3xl p-6 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold block pb-3 border-b border-white/5">Genetic Similarity Attributes Mapping</span>
            
            <div className="space-y-3">
               <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Shared Traits Spectrum</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentMatch.similar.map((smItm: string, i: number) => (
                      <span key={i} className="text-[10.5px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{smItm}</span>
                    ))}
                  </div>
               </div>

               <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Differing Traits Overhang</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentMatch.different.map((dfItm: string, i: number) => (
                      <span key={i} className="text-[10.5px] font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">{dfItm}</span>
                    ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Advice lessons */}
         <div className="bg-[#030712] border rounded-3xl p-6 space-y-4 flex flex-col justify-between" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block pb-3 border-b border-white/5">Transferable Lessons & Evolution Paths</span>
            
            <div className="space-y-3 text-xs leading-relaxed text-gray-300">
               <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Transferable Policies</span>
                  <p className="text-white font-medium mt-1">
                     "{currentMatch.policies}"
                  </p>
               </div>
               <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Historical Evolution Pathway Lessons</span>
                  <p className="text-white font-medium mt-1">
                     "{currentMatch.paths}"
                  </p>
               </div>
            </div>
         </div>

       </div>

       {/* Section 3 Cluster explorer */}
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider mb-3">Civilization Cluster Explorer Groupings Array</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
             {[
               { label: 'Resilient Democracies', stats: 'Optimal policy consistency and municipal cohesion channels.' },
               { label: 'Resource Economies', stats: 'Elevated material reserves export margins and trade loops.' },
               { label: 'Rapid Growth Nations', stats: 'Accelerating education yield benchmarks and grid setups.' },
               { label: 'Fragile States', stats: 'Sub-optimal institutional stability margins requiring re-engineering.' },
               { label: 'Innovation Leaders', stats: 'Max-tier corporate state research and technology density.' }
             ].map((clust, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between cursor-pointer hover:border-purple-500/20 transition-all">
                  <span className="text-xs font-bold text-white tracking-tight">{clust.label}</span>
                  <p className="text-[10px] text-gray-500 leading-tight mt-2">{clust.stats}</p>
                </div>
             ))}
          </div>
       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: COLLAPSE PATTERN LIBRARY
// =============================================================
function CollapsePatternLibrarySection({ currentCountry }: { currentCountry: any }) {
  const [activeCollapseKey, setActiveCollapseKey] = useState<string>('soviet');

  const collapses: { [key: string]: any } = {
    soviet: {
      name: 'Soviet Union',
      timeline: ['1950: Production peak', '1960: Grain supply drops', '1970: Oil export dependencies', '1980: Bureaucratic deadlock', '1991: Final fragmentation'],
      genes: { rigidity: 'Command economy pricing locks', decay: 'Party state policy stagnation', fragmentation: 'Erosion of centralized consensus', censorship: 'Total information isolation loops' },
      indicators: ['Technological yield stagnation', 'Erosion of physical material reserve bases', 'Administrative red-tape gridlocks', 'Currency debasement'],
      earlyWarning: 'Erosion of internal agricultural resource chains paired with administrative paralysis.',
      similarity: 12,
      warningLevel: 'Low',
      recoveryLessons: 'Allow local economic units to rebalance pricing dynamics before resource blockages lock physical transport segments.'
    },
    roman: {
      name: 'Roman Empire',
      timeline: ['200 AD: Border pressure', '300 AD: Currency debasement', '400 AD: Division of administration', '476 AD: Fracture of Rome'],
      genes: { rigidity: 'Over-diversified transport buffers', decay: 'Tax revenue collection decay', fragmentation: 'Regional military fractures', censorship: 'Citizen coordination blocks' },
      indicators: ['Continuous currency silver dilution', 'Over-extended logistical supply buffers', 'Plague transmission cycles', 'Border vanguard depletion'],
      earlyWarning: 'Debasement of sovereign coin currency coupled with structural military overhead increases.',
      similarity: 8,
      warningLevel: 'Minimal',
      recoveryLessons: 'Reinforce physical metallurgy or standard coin backing integrity while dividing local defense chains.'
    },
    weimar: {
      name: 'Weimar Germany',
      timeline: ['1919: Post-war treaties', '1923: Hyperinflation peak', '1929: Global credit block', '1933: Total transition'],
      genes: { rigidity: 'Gold reparation debt bonds', decay: 'Coalition parliament deadlock', fragmentation: 'Paramilitary neighborhood friction', censorship: 'Ideology polarization escalation' },
      indicators: ['Sovereign mark hyperinflation', 'Severe localized corporate loan defaults', 'Working class food riots', 'Judicial stability failure'],
      earlyWarning: 'Hyper-inflationary supply blockages combined with societal local polarization escalation.',
      similarity: 16,
      warningLevel: 'Moderate Warning',
      recoveryLessons: 'Hedge foreign credit dependencies through early sovereign bond restructuring actions.'
    }
  };

  const focusCollapse = collapses[activeCollapseKey] || collapses['soviet'];

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 mb-1">
             <BookOpen size={18} className="text-orange-500" /> Historical Collapse Pattern Library
          </h3>
          <p className="text-xs text-gray-400">Examine genetic failure modes from history to design preventative administrative guardrails.</p>

          <div className="flex flex-wrap gap-2 mt-4">
             {Object.keys(collapses).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveCollapseKey(key)}
                  className={`px-4 py-2 font-mono text-xs rounded-xl border transition-all cursor-pointer ${activeCollapseKey === key ? 'bg-orange-500/20 text-white border-orange-500/40 font-bold' : 'bg-slate-950 text-gray-405 border-white/5 hover:text-white'}`}
                >
                  🏛️ {collapses[key].name} Mode
                </button>
             ))}
          </div>
       </div>

       {/* Detailed Collapse Analysis Grid */}
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
         
         {/* Left Side: Timeline and Similarity Alert */}
         <div className="md:col-span-4 bg-[#030712] border rounded-3xl p-5 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold block">Temporal Decay timeline</span>
            
            <div className="space-y-2 border-l border-white/10 pl-3">
               {focusCollapse.timeline.map((line: string, i: number) => (
                  <div key={i} className="text-[11px] font-mono relative">
                    <span className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-gray-300 font-semibold">{line}</span>
                  </div>
               ))}
            </div>

            {/* Similarity Alert block */}
            <div className="pt-4 border-t border-white/5 space-y-2 font-mono">
               <span className="text-[9px] text-gray-500 uppercase block">Comparative Similarity Detector</span>
               <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-white/5 text-xs">
                  <span className="text-slate-400">Overlap index</span>
                  <span className="text-orange-400 font-bold">{focusCollapse.similarity}% Similarity</span>
               </div>
               <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-white/5 text-xs">
                  <span className="text-slate-400">Warning Level</span>
                  <span className="text-indigo-400 font-bold">{focusCollapse.warningLevel}</span>
               </div>
            </div>
         </div>

         {/* Right Side: Failure genes analysis */}
         <div className="md:col-span-8 space-y-6">
            
            {/* Decay Genes Analysis Card */}
            <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
               <span className="text-[10px] font-mono text-[#00B8DB] uppercase tracking-widest font-bold block pb-3 border-b border-white/5">Decay Genes Breakdown</span>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono text-xs">
                  <div className="p-3 bg-slate-950/70 border border-white/5 rounded-xl">
                     <span className="text-slate-500 uppercase text-[9px] block">Economic Rigidity</span>
                     <span className="text-white font-bold block mt-1">{focusCollapse.genes.rigidity}</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-white/5 rounded-xl">
                     <span className="text-slate-500 uppercase text-[9px] block">Institutional Decay</span>
                     <span className="text-white font-bold block mt-1">{focusCollapse.genes.decay}</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-white/5 rounded-xl">
                     <span className="text-slate-500 uppercase text-[9px] block">Political Fragmentation</span>
                     <span className="text-white font-bold block mt-1">{focusCollapse.genes.fragmentation}</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-white/5 rounded-xl">
                     <span className="text-slate-500 uppercase text-[9px] block">Information Suppression</span>
                     <span className="text-white font-bold block mt-1">{focusCollapse.genes.censorship}</span>
                  </div>
               </div>
            </div>

            {/* Warning Signals and Recommendations */}
            <div className="bg-[#030712] border rounded-3xl p-6 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
               <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Early Warning Signals & Prevention recommendations</span>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 italic">
                     "WARNING: {focusCollapse.earlyWarning}"
                  </p>
               </div>

               <div className="p-4 bg-slate-950 border border-white/5 rounded-xl text-xs text-gray-450 leading-relaxed">
                  <b className="text-white block uppercase text-[10px] mb-1 font-mono tracking-wider">AI Prevention recommendation directive:</b>
                  {focusCollapse.recoveryLessons}
               </div>
            </div>

         </div>

       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: COLLAPSE RISK ENGINE
// =============================================================
function CollapseRiskEngineSection({ currentCountry }: { currentCountry: any }) {
  const [activeStressors, setActiveStressors] = useState<{ [key: string]: boolean }>({
     conflict: false,
     pandemic: false,
     cyber: false,
     water: false,
     inflation: false
  });

  const [simActive, setSimActive] = useState(false);
  const [riskPercent, setRiskPercent] = useState<number>(3.2);

  const toggleStressor = (key: string) => {
     setActiveStressors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerChaosAssessment = () => {
     setSimActive(true);
     let mult = 3.2;
     if (activeStressors.conflict) mult += 12.5;
     if (activeStressors.pandemic) mult += 8.2;
     if (activeStressors.cyber) mult += 14.0;
     if (activeStressors.water) mult += 18.1;
     if (activeStressors.inflation) mult += 7.4;

     setTimeout(() => {
        setRiskPercent(parseFloat(mult.toFixed(1)));
        setSimActive(false);
     }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <div className="absolute top-0 right-0 w-84 h-84 bg-red-950/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
             <div>
                <span className="text-[10px] uppercase font-mono text-gray-550 tracking-widest block mb-1">LIVE PREDICTOR GAUGING MODULE</span>
                <h3 className="text-xl font-bold text-white tracking-tight">Collapse Probability Risk Engine</h3>
                <p className="text-xs text-gray-400 mt-1">Computes intermediate structural failure risks based on stress-multiplier criteria.</p>
             </div>

             <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center gap-4 shrink-0">
                <div className="text-right">
                   <span className="text-[9px] font-mono text-red-400 tracking-widest block uppercase">CRITICAL PATH PROBABILITY</span>
                   <span className="text-xs font-mono text-slate-400">Sovereign fracture warning</span>
                </div>
                <div className="w-14 h-14 rounded-full border border-red-500/20 flex flex-col items-center justify-center font-mono font-bold text-sm bg-red-500/5">
                   <span className="text-red-400 font-extrabold text-base leading-none">{riskPercent}%</span>
                </div>
             </div>
          </div>
       </div>

       {/* Contributing factors matrix */}
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
         
          <div className="md:col-span-5 bg-[#030712] border rounded-3xl p-5 space-y-4 font-mono text-xs" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
             <span className="text-[10px] uppercase text-gray-500 font-bold block pb-2 border-b border-white/5">Primary Contributing Factors</span>
             <div className="space-y-3 pt-1">
                {[
                  { title: 'Governance Continuity Buffer', weight: 'MINIMAL RISK - 22% Weight', c: 'text-indigo-400' },
                  { title: 'Debt Reparation Dependencies', weight: 'ELEVATED CORRIDOR - 20% Weight', c: 'text-amber-500' },
                  { title: 'Climate Migration Pressure', weight: 'MODERATE SHIELDS ACTIVE - 11% Weight', c: 'text-[#00B8DB]' },
                  { title: 'Sovereign Food Security reserves', weight: 'SAFE RESILIENT INDEX - 12% Weight', c: 'text-indigo-400' }
                ].map((item, idx) => (
                   <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-white/5 flex flex-col justify-between">
                      <span className="text-gray-300 font-bold">{item.title}</span>
                      <span className={`text-[10px] mt-1 ${item.c}`}>{item.weight}</span>
                   </div>
                ))}
             </div>
          </div>

          <div className="md:col-span-7 bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
             <div>
                <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase block font-bold">Civilization Chaos Stress Chamber</span>
                <p className="text-xs text-gray-400 mt-2">Combine multiple structural stressors. Observe the calculated stability outcomes dynamically after launching the algorithm.</p>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { key: 'conflict', label: 'Border War Escalation (+12.5%)' },
                  { key: 'pandemic', label: 'Resource Pandemic (+8.2%)' },
                  { key: 'cyber', label: 'Mass Grid Cyberattack (+14%)' },
                  { key: 'water', label: 'Severe Water Shortage (+18.1%)' },
                  { key: 'inflation', label: 'Reparation Hyperinflation (+7.4%)' }
                ].map((item) => (
                   <button
                     key={item.key}
                     onClick={() => toggleStressor(item.key)}
                     className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${activeStressors[item.key] ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-slate-950 border-white/5 text-gray-400'}`}
                   >
                     <span>{item.label}</span>
                   </button>
                ))}
             </div>

             <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={simActive}
                  onClick={triggerChaosAssessment}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-650 to-orange-550 bg-orange-650 hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: PALETTE.orange }}
                >
                  {simActive ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Simulating failure chains...
                    </>
                  ) : (
                    <>
                      <Play size={13} /> Initiate Stress Assessment
                    </>
                  )}
                </button>

                <span className="text-[10px] font-mono text-slate-500 uppercase">
                   Dynamic Digital-Twin Grid Assessment
                </span>
             </div>
          </div>

       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: RECOVERY POTENTIAL
// =============================================================
function RecoveryPotentialSection({ currentCountry }: { currentCountry: any }) {
  const [recoveryPlan, setRecoveryPlan] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const constructRecoveryManual = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
       setRecoveryPlan(`
Sovereign Repair Pathways Manual:

* PHASE 1 [1 YEAR HORIZON]: Establish modular local micro-grids to insulate metropolitan quarters from shipping lane blockades.
* PHASE 2 [5 YEAR HORIZON]: Deploy vertical agricultural technologies to buffer regional crop-loss cycles.
* PHASE 3 [10 YEAR HORIZON]: Decentralize administrative consensus checkpoints to guarantee public infrastructure stability.
       `);
       setIsSynthesizing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
             Recovery Potential Assessment Strategy
             <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-0.5 rounded font-bold">RECOVERY DEEPLINK LEVEL: 87/100</span>
          </h3>
          <p className="text-xs text-gray-405 mt-1">Measures speed and structural adaptability coefficients to stabilize machinery loops after disasters.</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
             {[
               { l: 'Major Food Deficit Shocks', d: '90 Days to Equilibrium', c: '#818cf8' },
               { l: 'Infrastructure Cyberattack', d: '8 Hours to Restoration', c: PALETTE.sky },
               { l: 'Border conflict blockade', d: '2.4 Years to Stabilized Growth', c: PALETTE.purple },
               { l: 'Regional Pandemic Spreads', d: '60 Days to Safety Norm', c: PALETTE.orange }
             ].map((itm, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                   <span className="text-[10px] font-mono text-gray-500 uppercase block">{itm.l}</span>
                   <span className="text-xs font-bold text-white block mt-1" style={{ color: itm.c }}>{itm.d}</span>
                </div>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
         
         <div className="md:col-span-5 bg-[#030712] border rounded-3xl p-5 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-[#00B8DB] uppercase tracking-widest block font-bold pb-2 border-b border-white/5">Primary Resilience Drivers</span>
            
            <div className="space-y-2 font-mono text-xs">
               {[
                 { t: 'Emergency Administrative Capacities', r: 'ELEVATED - SECURE' },
                 { t: 'Sovereign Institutional Flexibility', r: 'EXCELLENT STABILITY' },
                 { t: 'Decentralized Crop reserves', r: 'ADEQUATE BUFFER RESILIENT' }
               ].map((itm, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-white/5 flex justify-between items-center">
                    <span className="text-gray-300 font-bold">{itm.t}</span>
                    <span className="text-indigo-400 font-bold text-[10px]">{itm.r}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="md:col-span-7 bg-[#030712] border rounded-3xl p-6 space-y-4 flex flex-col justify-between min-h-[290px]" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <div>
               <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase block font-bold">Recovery Directive Strategy Generator</span>
               
               {recoveryPlan ? (
                 <div className="p-4 rounded-xl bg-slate-950 border border-white/5 text-gray-300 text-xs font-mono leading-relaxed whitespace-pre-line mt-3">
                   {recoveryPlan}
                 </div>
               ) : (
                 <p className="text-xs text-gray-450 leading-relaxed mt-3 italic">
                    Synthesize 1-year, 5-year, and 10-year administrative recovery solutions tailored to address regional grid failures.
                 </p>
               )}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
               <button
                 type="button"
                 onClick={constructRecoveryManual}
                 disabled={isSynthesizing}
                 className="px-4 py-2 bg-purple-900 border border-purple-500/30 hover:bg-purple-800 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
               >
                 {isSynthesizing ? 'Calculating optimal solutions...' : 'Generate AI Reconstruction Plan'}
               </button>
            </div>
         </div>

       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: CIVILIZATION GENETICS LAB
// =============================================================
function GeneticsLabRoomSection({ currentCountry }: { currentCountry: any }) {
  const [eduSlider, setEduSlider] = useState(82);
  const [infraSlider, setInfraSlider] = useState(76);
  const [trustSlider, setTrustSlider] = useState(70);

  // Compute alternative future forecast variables
  const computedProduct = Math.round((eduSlider * 0.45) + (infraSlider * 0.3) + (trustSlider * 0.25));

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-1">
             <Zap size={18} className="text-[#00B8DB]" /> Civilization Genetics Laboratory Room
          </h3>
          <p className="text-xs text-gray-400">Manipulate core policy variables to run forecasted alternatives out to 2100.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-in fade-in">
         
         {/* Live policy editor sliders */}
         <div className="md:col-span-6 bg-[#030712] border rounded-3xl p-6 space-y-5" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Systemic Policy Gene sliders</span>
            
            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">Municipal Education standards</span>
                    <span className="text-indigo-400 font-bold">{eduSlider}%</span>
                  </div>
                  <input 
                    type="range"
                    min="30"
                    max="100"
                    value={eduSlider}
                    onChange={(e) => setEduSlider(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded appearance-none cursor-pointer"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">Physical Grid redundant buffers</span>
                    <span className="text-purple-400 font-bold">{infraSlider}%</span>
                  </div>
                  <input 
                    type="range"
                    min="30"
                    max="100"
                    value={infraSlider}
                    onChange={(e) => setInfraSlider(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded appearance-none cursor-pointer"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">Sovereign Social Multi-Trust index</span>
                    <span className="text-orange-400 font-bold">{trustSlider}%</span>
                  </div>
                  <input 
                    type="range"
                    min="30"
                    max="100"
                    value={trustSlider}
                    onChange={(e) => setTrustSlider(parseInt(e.target.value))}
                    className="w-full accent-orange-500 h-1.5 bg-slate-900 rounded appearance-none cursor-pointer"
                  />
               </div>
            </div>
         </div>

         {/* Advanced Yield graphs rendering */}
         <div className="md:col-span-6 bg-[#030712] border rounded-3xl p-6 space-y-5 flex flex-col justify-between" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <div>
               <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase block font-bold">Forecast Alternative status Yield curves</span>
               <h4 className="text-sm font-bold text-white tracking-tight mt-1 font-mono">Sovereign Projections Timeline (2030 – 2100)</h4>
               
               <div className="mt-4 space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-gray-400">Year 2030 Expected Threshold</span>
                     <span className="text-indigo-400 font-bold">+{Math.round((computedProduct - 70) * 0.2)}% overall yield</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-gray-400">Year 2050 Adaptation Status</span>
                     <span className="text-indigo-400 font-bold">+{Math.round((computedProduct - 70) * 0.55)}% overall yield</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-gray-400">Year 2100 Sovereign Autonomy</span>
                     <span className="text-[#00B8DB] font-bold">+{Math.round((computedProduct - 70) * 1.15)}% overall yield</span>
                  </div>
               </div>
            </div>

            <p className="text-[10.5px] leading-relaxed text-gray-500 font-mono mt-4 italic">
               Alternative futures show positive divergence options based on early structural asset rebalancing.
            </p>
         </div>

       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: HISTORICAL GENOME LIBRARY
// =============================================================
function HistoricalGenomeLibrarySection() {
  const [selectedHistoricalKey, setSelectedHistoricalKey] = useState<string>('rome');

  const database: { [key: string]: any } = {
    rome: {
      name: 'Byzantine Empire / Ancient Rome',
      period: 'Division of Empire - Decline peak',
      genes: { governance: '91%', economy: '84%', social: '88%' },
      phases: {
        growth: 'Achieved continental expansion by building highly reliable physical transport stone highways.',
        peak: 'Sustained continuous trade sovereignty via complex bureaucracy coupled with robust maritime security networks near critical bottlenecks.',
        decline: 'Imperial decentralization crisis resulted in tax stagnation and currency silver dilution failures.',
        recovery: 'Reconstitution of local units under regional defense leaders.'
      },
      lessons: 'Prioritize bottleneck maritime safety reserves during active geopolitical changes.'
    },
    egypt: {
      name: 'Ancient Egypt System',
      period: 'New Kingdom peak Era',
      genes: { governance: '82%', economy: '80%', social: '78%' },
      phases: {
        growth: 'Leveraged rich agrarian alluvial Nile flooding zones to establish massive granary surplus deposits.',
        peak: 'Sustained high stability indicators despite lack of foreign alloy imports.',
        decline: 'Severe prolonged droughts damaged agricultural outputs resulting in civil food supply blockades.',
        recovery: 'Silo distribution programs stabilized domestic commerce indexes.'
      },
      lessons: 'Establish regional food buffer silos early to hedge crop deficits.'
    }
  };

  const currentGen = database[selectedHistoricalKey] || database['rome'];

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5 mb-1">
             <Clock size={18} className="text-purple-400 animate-pulse" /> Historical Civilization Genome Library
          </h3>
          <p className="text-xs text-gray-400">Examine deep historical timelines to synthesize high-durability administrative programs.</p>

          <div className="flex flex-wrap gap-2 mt-4">
             {Object.keys(database).map(key => (
               <button
                 key={key}
                 onClick={() => setSelectedHistoricalKey(key)}
                 className={`px-4 py-2 font-mono text-xs rounded-xl border transition-all cursor-pointer ${selectedHistoricalKey === key ? 'bg-purple-900/40 text-white border-purple-500/40 font-bold' : 'bg-slate-950 text-gray-400 border-white/5 hover:text-white'}`}
               >
                 👑 {database[key].name} Timeline
               </button>
             ))}
          </div>
       </div>

       {/* Detailed history phases */}
       <div className="bg-[#030712] border rounded-3xl p-6 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
             <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">GENE MOCK ANALYSIS STRAND</span>
                <h4 className="text-lg font-bold text-white tracking-tight mt-1">{currentGen.name}</h4>
                <p className="text-xs text-gray-450 mt-1">Timeline era peak attributes: {currentGen.period}</p>
             </div>

             <div className="flex gap-3 text-xs font-mono font-bold">
                <span className="px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">Gov {currentGen.genes.governance}</span>
                <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">Eco {currentGen.genes.economy}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
             <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5">
               <span className="text-[#00B8DB] font-bold block uppercase text-[10px] mb-1">Growth Phase Evolution</span>
               <p className="text-gray-300 leading-relaxed">{currentGen.phases.growth}</p>
             </div>
             <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5">
               <span className="text-indigo-400 font-bold block uppercase text-[10px] mb-1">Peak Preservation Phase</span>
               <p className="text-gray-300 leading-relaxed">{currentGen.phases.peak}</p>
             </div>
             <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5">
               <span className="text-[#FF6900] font-bold block uppercase text-[10px] mb-1">Decline Trigger Mechanics</span>
               <p className="text-gray-300 leading-relaxed">{currentGen.phases.decline}</p>
             </div>
             <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5">
               <span className="text-purple-400 font-bold block uppercase text-[10px] mb-1">Decisive Coping Lessons</span>
               <p className="text-gray-305 italic leading-relaxed">"{currentGen.lessons}"</p>
             </div>
          </div>
       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: AI GENOME COPILOT
// =============================================================
function AIGenomeCopilotSection({ currentCountry }: { currentCountry: any }) {
  const [queryText, setQueryText] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([
    { role: 'assistant', text: `Access initialized. I have indexed ${currentCountry.name}'s administrative, trade, and social stability indicators. Ask me anything or select quick queries below to construct analytical recommendations.` }
  ]);

  const copilotDirectives = [
    "Why is Singapore resilient?",
    "Which genes most affect stability?",
    "Compare India and Japan.",
    "Simulate governance improvements."
  ];

  const handleSelectDirective = (itm: string) => {
    setChatLog(prev => [...prev, { role: 'user', text: itm }]);
    
    let simulatedResponse = `Generating core predictive model for focus cohort...`;
    if (itm.includes("Singapore")) {
       simulatedResponse = `Singapore scores 93/100 on our civilization health index. Key resilience factors include extreme policy consistency, a highly diverse maritime trading interface, and a robust physical cargo tracking grid. Despite missing agricultural sovereignty, Singapore’s automated financial buffer systems cushion shipping anomalies successfully.`;
    } else if (itm.includes("Compare India and Japan")) {
       simulatedResponse = `Civilization Comparison: India scores highest on social cohesion, community resilience and agricultural local safety corridors. Japan scores highest on physical infrastructure redundant pathways and judicial reliability. Applying Japan’s micro-celled backup grid programs inside India’s urban hubs reduces black swan failure risk indexes by 18%.`;
    } else if (itm.includes("governance")) {
       simulatedResponse = `Recalculated Mutation Outcomes: Simulating an administrative policy consistency rebalancing of +15% yields a 2.4% higher commercial growth curve over 5 fiscal cycles. Simultaneously, the forecast models a 14% drop in potential rural demographic friction.`;
    } else if (itm.includes("genes most affect stability")) {
       simulatedResponse = `Stability Indicators: Across our digital twins, Governance Stability and Supply Chain Autonomy represent the two highest weighted core genes. When supply chain independence scores dip below 50%, downstream infrastructure triggers cascade gridlocks regardless of other social trust safety cushions.`;
    }

    setTimeout(() => {
       setChatLog(prev => [...prev, { role: 'assistant', text: simulatedResponse }]);
    }, 600);
  };

  const handleManualChatSubmit = () => {
    if (!queryText.trim()) return;
    setChatLog(prev => [...prev, { role: 'user', text: queryText }]);
    setQueryText('');

    setTimeout(() => {
       setChatLog(prev => [...prev, { role: 'assistant', text: "Calculations loaded. Regional Digital-Twin nodes record optimal stability values. Expanding intermediate manufacturing corridors improves the current forecast by +6.2% autonomously." }]);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
         
         {/* Central Terminal Pane */}
         <div className="md:col-span-8 bg-[#030712] border rounded-3xl p-6 flex flex-col h-[490px] justify-between" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            
            {/* Upper bar status */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5"><Sparkles size={13} className="text-purple-400" /> Bio-Engine AI Command Terminal</span>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 border border-indigo-400/20 rounded">INTELLIGENCE NETWORK LIVE</span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
               {chatLog.map((cMsg, idx) => (
                  <div key={idx} className={`flex ${cMsg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed ${cMsg.role === 'user' ? 'bg-[#7F22FE]/20 border border-[#7F22FE]/30 text-white font-medium' : 'bg-slate-950 border border-white/5 text-gray-300'}`}>
                       {cMsg.text}
                     </div>
                  </div>
               ))}
            </div>

            {/* Input bar */}
            <div className="flex gap-2 items-center">
               <input 
                 type="text"
                 placeholder="Formulate query to Civilizational Genome AI..."
                 value={queryText}
                 onChange={(e) => setQueryText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleManualChatSubmit()}
                 className="flex-1 bg-slate-950 border border-white/5 text-white text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
               />
               <button 
                 type="button"
                 onClick={handleManualChatSubmit}
                 className="p-3 bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors cursor-pointer shrink-0"
               >
                 <Send size={14} className="text-white" />
               </button>
            </div>

         </div>

         {/* Suggested Questions directives selection */}
         <div className="md:col-span-4 bg-[#030712] border rounded-3xl p-4 space-y-4" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-gray-550 uppercase tracking-widest font-bold block">Preset analytical triggers</span>
            <div className="space-y-2">
              {copilotDirectives.map((cmd, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleSelectDirective(cmd)}
                   className="w-full text-left p-3 rounded-xl bg-slate-950/80 border border-white/5 hover:border-purple-550/30 transition-all text-xs font-semibold text-gray-300 flex items-center justify-between group cursor-pointer"
                 >
                   <span>{cmd}</span>
                   <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
              ))}
            </div>
         </div>

       </div>

    </div>
  );
}

// =============================================================
// SUB-COMPONENT: ADVANCED CONTROLS
// =============================================================
function AdvancedControlsSection({ currentCountry }: { currentCountry: any }) {
  const [currentAdvancedTab, setCurrentAdvancedTab] = useState<'tracker' | 'impact' | 'twin' | 'network'>('tracker');

  return (
    <div className="space-y-6 animate-in fade-in">
       
       <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                   <Cpu size={18} className="text-purple-400" /> Advanced Diagnostic & Simulation Engine Control Rack
                </h3>
                <p className="text-xs text-gray-450 mt-1">Execute high-fidelity digital twins and map policy impacts synchronously.</p>
             </div>
          </div>

          <div className="flex flex-wrap gap-2">
             {[
               { key: 'tracker', label: '🧬 Genome Mutation Tracker' },
               { key: 'impact', label: '⚡ Policy Gene Impact Engine' },
               { key: 'twin', label: '🌎 Civilization Twin Generator' },
               { key: 'network', label: '🛡️ Gene Dependency Network' },
             ].map((avTab) => (
                <button
                  key={avTab.key}
                  onClick={() => setCurrentAdvancedTab(avTab.key as any)}
                  className={`px-4 py-2 font-mono text-xs rounded-xl border transition-all cursor-pointer ${currentAdvancedTab === avTab.key ? 'bg-purple-900/40 border-purple-500/40 text-purple-200 font-bold' : 'bg-slate-950 text-gray-400 border-white/5 hover:text-white'}`}
                >
                  {avTab.label}
                </button>
             ))}
          </div>
       </div>

       {/* DIAGNOSTIC TABS DISPLAY */}
       {currentAdvancedTab === 'tracker' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in">
           <div className="bg-[#030712] border rounded-3xl p-6 space-y-3" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block font-bold">MUTATION MONITOR</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Real-Time Gene Mutation Tracker</h4>
              <p className="text-xs text-gray-450 leading-relaxed">
                 Tracks policy adjustment deviations over chronological periods to prevent administrative or physical drift.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 text-xs border border-white/5 text-gray-300 font-mono">
                 Mutation monitoring reports: ALL baseline values matching verified regional targets perfectly. Zero-drift detected.
              </div>
           </div>

           <div className="bg-[#030712] border rounded-3xl p-6 space-y-3" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">GENOME ANOMALY FEED</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Systemic Anomaly Detector</h4>
              <p className="text-xs text-gray-450 leading-relaxed">
                 Scans structural grids, trade buffers, and credit liquidity thresholds synchronously twice daily.
              </p>
              <div className="p-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-mono text-indigo-400 flex items-center gap-2">
                 <CheckCircle2 size={14} /> All indicators compliant across primary grid parameters.
              </div>
           </div>
         </div>
       )}

       {currentAdvancedTab === 'impact' && (
         <div className="bg-[#030712] border rounded-3xl p-6 space-y-4 animate-in fade-in" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Impact Modeling</span>
            <h4 className="text-sm font-bold text-white tracking-tight">Policy Gene Impact Engine Matrix</h4>
            <p className="text-xs text-gray-400">Maps legislative reforms to genetic resilience variables directly before launching simulations on live machinery grids.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
               {[
                 { title: 'Decentralized Grid Bill', target: '⚡ Infrastructure Security', multiplier: '+18% Redundancy' },
                 { title: 'Emergency Food Stock Reserve Act', target: '🌾 Economic Resiliency', multiplier: '+12% Adaptability' },
                 { title: 'Generational Cohesion Trust Pact', target: '🤝 Institutional Public Trust', multiplier: '+15% Social Cohesion' }
               ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
                     <span className="text-gray-305 font-bold leading-tight">{item.title}</span>
                     <div className="mt-3 text-[10px] text-purple-400">Target: {item.target}</div>
                     <span className="text-indigo-400 font-bold block text-[11px] mt-1">{item.multiplier}</span>
                  </div>
               ))}
            </div>
         </div>
       )}

       {currentAdvancedTab === 'twin' && (
         <div className="bg-[#030712] border rounded-3xl p-6 space-y-4 animate-in fade-in" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                 <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Digital-Twin Mirror</span>
                 <h4 className="text-sm font-bold text-white tracking-tight mt-1">Civilization Twin Generator Matrix</h4>
                 <p className="text-xs text-gray-440 mt-1">Synchronize extreme black-swan simulations across mirroring target grids before deploying live updates.</p>
               </div>
               <button className="px-4 py-2 bg-[#7F22FE] hover:opacity-95 text-white font-bold text-xs rounded-xl cursor-pointer">
                  Activate Twin Mirroring
               </button>
            </div>
            <div className="h-20 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-xs font-mono text-gray-550">
               Awaiting initialization sequence trigger... Synchronous twin ready.
            </div>
         </div>
       )}

       {currentAdvancedTab === 'network' && (
         <div className="bg-[#030712] border rounded-3xl p-6 space-y-4 animate-in fade-in" style={{ borderColor: `${PALETTE.deepTeal}35` }}>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Interdependency Network Map</span>
            <h4 className="text-sm font-bold text-white tracking-tight">Gene Dependency Network Graph</h4>
            <p className="text-xs text-gray-440">Tracks multi-nested dependancies to isolate collapse routes early.</p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-[11px] text-gray-300">
               {[
                 { source: 'Leadership Durability', target: '⇨ Rules Law Enforcement' },
                 { source: 'Sovereign Currency', target: '⇨ Intermediate Trade Reserves' },
                 { source: 'Decentralized Energy sources', target: '⇨ Agricultural conveyor tools' },
                 { source: 'Eldercare Infrastructure', target: '⇨ Generational trust factors' }
               ].map((dep, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-white/5">
                     <span className="text-[#00B8DB] font-bold block">{dep.source}</span>
                     <span className="text-slate-500 block mt-1">{dep.target}</span>
                  </div>
               ))}
            </div>
         </div>
       )}

    </div>
  );
}
