import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, AlertTriangle, FileText, Scale, CheckCircle2, XCircle, HelpCircle, 
  Map, Activity, Lock, Users, Sparkles, Send, RefreshCw, Cpu, Compass, Globe
} from 'lucide-react';

// Unified futuristic palette
const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  darkBrown: '#56280B',  // Shadow offsets, rich border inserts
  sky: '#00B8DB',        // Strategic indicators, safe state labels
  deepTeal: '#073F4D',    // Deep framing lines, background panels
  green: '#818cf8',      // Constitution-Valid green
  yellow: '#FBBF24',     // Uncertain Yellow
  red: '#EF4444',        // Violation Risk Red
};

interface ConstitutionalIntelligenceProps {
  key?: string;
  initialSubTab?: 'maps' | 'emergency' | 'treaty';
}

export function ConstitutionalIntelligence({ initialSubTab = 'maps' }: ConstitutionalIntelligenceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'maps' | 'emergency' | 'treaty'>(initialSubTab);

  // Proposal Validator State
  const [proposalInput, setProposalInput] = useState('National Internet Shutdown');
  const [isValLoading, setIsValLoading] = useState(false);
  const [valResult, setValResult] = useState<any>({
    safetyScore: 14,
    riskScore: 86,
    civilLibertyImpact: "High",
    recommendation: "Rejected",
    zone: "Red",
    constitutionalPoints: [
      "Secures electronic communication systems temporarily during a state-sponsored active cyber engagement.",
      "Requires explicit, certified authorization from a multi-chamber judicial review panel."
    ],
    violations: [
      "Directly breaches Article 19 regarding freedom of text and basic communication transmission.",
      "Imposes systematic non-targeted civilian containment, violating constitutional proportional action tests.",
      "Collapses crucial local municipal medical and coordinate support routing indices."
    ],
    explanation: "Dynamic state-wide network shuts are constitutionally disproportionate under standard emergency criteria. Localized, defense-screen filter loops must cover compromised nodes instead."
  });

  const [allProposals, setAllProposals] = useState<any[]>([]);

  // Emergency Powers state
  const [selectedEmergency, setSelectedEmergency] = useState<'pandemic' | 'war' | 'natural disaster' | 'economic collapse'>('pandemic');
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState<any>({
    scenario: "Pandemic Exception Mode",
    allowedActions: [
      "Establish targeted quarantine zones in high-infection regional vectors.",
      "Enforce vaccine distribution schedules to critical service workers.",
      "Mandate tele-work structures across civil governance units."
    ],
    restrictedActions: [
      "Indefinite closure of primary regional courts or civilian dispute tribunals.",
      "Arbitrary freeze on digital asset distribution or financial accounts.",
      "Restriction of basic medical access to non-registered or unverified citizens."
    ],
    judicialRisk: { level: "Medium", description: "Courts will scrutinize length of lockdowns, requiring continuous bi-weekly scientific re-evaluations." },
    politicalRisk: { level: "Low", description: "Public support is generally high if restrictions are distributed fairly and public support packages are sustained." },
    treatyImpact: "Suspends standard cross-border tourist entry codes, causing friction with neighboring transit pact partners."
  });

  // Treaty State
  const [treatyProposal, setTreatyProposal] = useState('National Internet Shutdown');
  const [isTreatyLoading, setIsTreatyLoading] = useState(false);
  const [treatyResult, setTreatyResult] = useState<any>({
    proposal: "National Internet Shutdown",
    agreements: [
      {
        category: "International Agreements",
        status: "Strained",
        impact: "Sovereign communications remain subject to UN Human Rights charters protecting access to information. Direct shut down triggers formal UN warnings."
      },
      {
        category: "Defense Treaties",
        status: "Stable",
        impact: "Automated kinetic operations conflict with cooperative NATO/regional rules demanding human accountability and clear command chain integration."
      },
      {
        category: "Trade Agreements",
        status: "Stable",
        impact: "Resource requisition rules may infringe on bilateral trade dispute treaties unless classified strictly as essential life security preservation."
      },
      {
        category: "Climate Commitments",
        status: "Stable",
        impact: "Environmental covenants contain express bypass triggers during crisis situations, preventing legal claims from impeding immediate local survival programs."
      }
    ]
  });

  // Keep state synced with props tab selection triggers
  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Load existing evaluated proposals from MongoDB on boot
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                getAuthorityProposals {
                  id
                  title
                  safetyScore
                  riskScore
                  civilLibertyImpact
                  recommendation
                  zone
                  constitutionalPoints
                  violations
                  explanation
                  createdAt
                }
              }
            `
          })
        });
        const json = await res.json();
        if (json.data && json.data.getAuthorityProposals) {
          const proposals = json.data.getAuthorityProposals;
          setAllProposals(proposals);
          if (proposals.length > 0) {
            setValResult(proposals[0]);
            setProposalInput(proposals[0].title);
          }
        }
      } catch (err) {
        console.error('Failed to fetch authority proposals:', err);
      }
    };

    fetchExisting();
  }, []);

  // Connect to live WebSocket stream to sync new validation runs in real time
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws/authority-maps');
    
    ws.onopen = () => {
      console.log('Connected to Authority Maps WebSocket');
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'AUTHORITY_PROPOSAL_ADDED' && message.data) {
          setAllProposals(prev => {
            if (prev.some(p => p.id === message.data.id)) return prev;
            return [message.data, ...prev];
          });
          setValResult(message.data);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from Authority Maps WebSocket');
    };
    
    return () => ws.close();
  }, []);

  // Call dynamic validate AI endpoint using GraphQL Mutation
  const handleValidateProposal = async (customProposal?: string) => {
    const queryStr = customProposal || proposalInput;
    if (!queryStr.trim()) return;
    setIsValLoading(true);
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation Validate($title: String!) {
              validateAuthorityProposal(title: $title) {
                id
                title
                safetyScore
                riskScore
                civilLibertyImpact
                recommendation
                zone
                constitutionalPoints
                violations
                explanation
                createdAt
              }
            }
          `,
          variables: { title: queryStr }
        })
      });
      const json = await res.json();
      if (json.data && json.data.validateAuthorityProposal) {
        const result = json.data.validateAuthorityProposal;
        setValResult(result);
        setProposalInput(result.title);
        setAllProposals(prev => {
          if (prev.some(p => p.id === result.id)) return prev;
          return [result, ...prev];
        });
        // Sync treaty analysis if user validates a proposal
        handleAnalyzeTreaties(queryStr);
      }
    } catch (e) {
      console.error('Failed to validate authority proposal:', e);
    } finally {
      setIsValLoading(false);
    }
  };

  // Call dynamic emergency powers simulator AI endpoint
  const handleSimulateEmergency = async (scenario: 'pandemic' | 'war' | 'natural disaster' | 'economic collapse') => {
    setSelectedEmergency(scenario);
    setIsEmergencyLoading(true);
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation SimulateEmergency($scenario: String!) {
              simulateEmergencyPowers(scenario: $scenario) {
                scenario
                allowedActions
                restrictedActions
                judicialRisk {
                  level
                  description
                }
                politicalRisk {
                  level
                  description
                }
                treatyImpact
              }
            }
          `,
          variables: { scenario }
        })
      });
      const json = await res.json();
      if (json.data && json.data.simulateEmergencyPowers) {
        setEmergencyResult(json.data.simulateEmergencyPowers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  // Call treaty constraint analyzer AI endpoint
  const handleAnalyzeTreaties = async (proposalStr: string) => {
    setTreatyProposal(proposalStr);
    setIsTreatyLoading(true);
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation AnalyzeTreaty($proposal: String!) {
              analyzeTreatyConstraints(proposal: $proposal) {
                proposal
                agreements {
                  category
                  status
                  impact
                }
              }
            }
          `,
          variables: { proposal: proposalStr }
        })
      });
      const json = await res.json();
      if (json.data && json.data.analyzeTreatyConstraints) {
        setTreatyResult(json.data.analyzeTreatyConstraints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTreatyLoading(false);
    }
  };

  // Preset Proposals for instant testing
  const presets = [
    "National Internet Shutdown",
    "Water Exception Declaration",
    "Automated Drone Defense Deployment"
  ];

  return (
    <div id="constitutional-intelligence-center" className="max-w-[1240px] mx-auto space-y-8 pb-16 font-sans">
      
      {/* Dynamic Module Header Card */}
      <div className="relative overflow-hidden rounded-3xl border p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-[#030616] shadow-[0_4px_30px_rgba(0,0,0,0.4)]" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-purple-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#7F22FE]/15 border border-[#7F22FE]/30 text-xs font-mono font-semibold tracking-wider text-[#9d55ff] uppercase">
                Module 03
              </span>
              <span className="flex items-center gap-1.5 text-xs text-pink-400 font-mono">
                <ShieldCheck size={12} /> Autonomous Safeguard Loop
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              Constitutional Intelligence Center <Scale className="text-[#00B8DB] shrink-0" size={24} />
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Real-time Sovereign Governance Boundary Engine. Assess administrative proposals against structural constitutional bounds, evaluate emergency authority thresholds, and cross-reference international commitments under treaty strains with zero human delay.
            </p>
          </div>
          
        </div>
      </div>

      {/* Main Panel Content with Tab switching */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* SUB-TAB 1: Authority maps & validation */}
          {activeSubTab === 'maps' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Validator Input & Presets */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mb-4 flex items-center justify-between">
                    <span>Validate Proposal</span>
                    <Sparkles size={14} className="text-[#00B8DB]" />
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Draft any national administrative policy proposal below to audit it through the Constitutional safety scoring matrix.
                  </p>
                  
                  {/* Preset Quick Selection Buttons */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500">Preset Scenarios</span>
                    <div className="flex flex-col gap-2">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setProposalInput(preset);
                            handleValidateProposal(preset);
                          }}
                          className="w-full text-left px-3.5 py-2 rounded-xl text-xs border bg-slate-950 hover:bg-white/[0.03] transition-colors flex items-center justify-between text-gray-300 hover:text-white cursor-pointer"
                          style={{ borderColor: `${PALETTE.deepTeal}20` }}
                        >
                          <span className="truncate">{preset}</span>
                          <span className="text-[9px] text-[#00B8DB] font-mono">Test Presets →</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual input */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500">Custom Policy Proposal Formulation</span>
                    <div className="relative">
                      <textarea
                        value={proposalInput}
                        onChange={(e) => setProposalInput(e.target.value)}
                        placeholder="e.g. Mandatory identification for all civilian message routing units..."
                        rows={4}
                        className="w-full text-xs text-white bg-slate-950 border rounded-2xl p-3 pr-10 focus:outline-none transition-colors max-h-40 placeholder:text-gray-650"
                        style={{ borderColor: `${PALETTE.deepTeal}40` }}
                      />
                      <button
                        onClick={() => handleValidateProposal()}
                        disabled={isValLoading || !proposalInput.trim()}
                        className="absolute bottom-3 right-3 p-2 rounded-lg bg-[#7F22FE] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isValLoading ? <RefreshCw className="animate-spin" size={12} /> : <Send size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub Card: Quick boundary references */}
                <div className="bg-[#030712]/50 border rounded-2xl p-5" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">Legal Boundary Index</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Under the Sovereign OS constitutional charter, emergency interventions must obey strict proportional limit tests. Requisitions, internet containment, and tactical aerospace shielding cannot proceed without legislative oversight.
                  </p>
                </div>
              </div>

              {/* Middle Column: Visual map plot (requested) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Visual Map Zone Map Plotting */}
                <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                  <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">Governance Boundary coordinates</h3>
                      <p className="text-xs text-gray-400">Policy placement visualizer relative to civil liberties and sovereign authority thresholds</p>
                    </div>
                    
                    {/* Zones indicator map */}
                    <div className="flex gap-4 text-[10px] font-mono">
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Valid Zone
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Uncertain Zone
                      </span>
                      <span className="flex items-center gap-1.5 text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> Violation Risk
                      </span>
                    </div>
                  </div>

                  {/* Glowing 2D Coordinate Grid Representing Zones */}
                  <div className="relative h-80 w-full overflow-hidden border rounded-2xl bg-[#010206] flex flex-col justify-between p-4" style={{ borderColor: `${PALETTE.deepTeal}20` }}>
                    
                    {/* Background Grids & Coordinate Lines */}
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border-b border-r border-[#00B8DB]" />
                      ))}
                    </div>

                    {/* Gradient Quadrants Overlay */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      <div className="w-1/3 h-full bg-indigo-500/5" /> {/* Green left quadrant */}
                      <div className="w-1/3 h-full bg-amber-500/5 border-l border-dashed border-amber-500/10" /> {/* Yellow middle */}
                      <div className="w-1/3 h-full bg-red-500/5 border-l border-dashed border-red-500/10" /> {/* Red right */}
                    </div>

                    {/* Left/Right Y-Axis Titles */}
                    <div className="absolute top-2 left-3 text-[9px] font-mono text-gray-650 uppercase tracking-widest pointer-events-none">Constitutional compliance Index (Y)</div>
                    <div className="absolute bottom-2 right-3 text-[9px] font-mono text-gray-650 uppercase tracking-widest pointer-events-none text-right">Civil liberty impact Index (X)</div>

                    {/* Coordinate Indicator Bars */}
                    <div className="absolute bottom-1/2 left-0 right-0 border-t border-white/5 pointer-events-none" />
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/5 pointer-events-none" />
                    {/* Dynamic Policy Coordinate Points Plotted on Map */}
                    <AnimatePresence>
                      {(allProposals.length > 0 ? allProposals : [valResult]).map((p: any, index: number) => {
                        const isActive = p.title === valResult.title;
                        const pointColor = p.zone === 'Green' ? PALETTE.green : p.zone === 'Yellow' ? PALETTE.yellow : PALETTE.red;
                        return (
                          <motion.div 
                            key={p.id || p.title || index}
                            className="absolute z-10"
                            style={{
                              left: `${Math.max(5, Math.min(95, p.riskScore))}%`,
                              bottom: `${Math.max(5, Math.min(95, p.safetyScore))}%`,
                              transform: 'translate(-50%, 50%)'
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                          >
                            {isActive ? (
                              /* Glowing focal cursor for active proposal */
                              <div className="relative flex items-center justify-center">
                                <div 
                                  className="absolute rounded-full w-12 h-12 opacity-30 animate-ping"
                                  style={{ backgroundColor: pointColor }} 
                                />
                                <div 
                                  className="absolute rounded-full w-4 h-4 shadow-[0_0_20px_rgba(255,255,255,0.7)] border-2 border-white cursor-pointer"
                                  style={{ backgroundColor: pointColor }}
                                />
                                <div className="absolute top-6 flex flex-col items-center bg-slate-900 border border-white/10 p-2.5 rounded-xl w-48 text-left shadow-2xl backdrop-blur-md">
                                  <span className="text-[10px] font-bold text-white truncate max-w-full">
                                    {p.title}
                                  </span>
                                  <div className="flex justify-between items-center w-full mt-1">
                                    <span className="text-[9px] text-gray-400 font-mono">Score: {p.safetyScore}%</span>
                                    <span 
                                      className="text-[8px] px-1.5 py-0.5 rounded uppercase font-mono font-bold"
                                      style={{
                                        backgroundColor: `${pointColor}15`,
                                        color: pointColor
                                      }}
                                    >
                                      {p.zone} Zone
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Small dot for other proposals */
                              <div 
                                onClick={() => {
                                  setValResult(p);
                                  setProposalInput(p.title);
                                  handleAnalyzeTreaties(p.title);
                                }}
                                className="relative group flex items-center justify-center cursor-pointer"
                              >
                                <div 
                                  className="rounded-full w-3.5 h-3.5 border border-white/40 opacity-70 group-hover:scale-125 group-hover:opacity-100 transition-all duration-150"
                                  style={{ backgroundColor: pointColor }} 
                                />
                                {/* Tiny tooltip on hover */}
                                <div className="absolute top-5 hidden group-hover:flex flex-col items-center bg-slate-900 border border-white/10 p-1.5 rounded-lg w-32 text-center shadow-xl pointer-events-none z-20">
                                  <span className="text-[9px] font-medium text-white truncate max-w-full">
                                    {p.title}
                                  </span>
                                  <span className="text-[8px] text-gray-400 font-mono mt-0.5">{p.safetyScore}% Compliance</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Zone Labeling text overlay */}
                    <div className="absolute top-4 left-4 text-indigo-400/30 text-xs font-bold font-mono tracking-widest uppercase pointer-events-none">Green Zone: Valid</div>
                    <div className="absolute top-4 left-1/3 ml-4 text-amber-500/30 text-xs font-bold font-mono tracking-widest uppercase pointer-events-none">Yellow Zone: Uncertain</div>
                    <div className="absolute top-4 right-4 text-red-500/30 text-xs font-bold font-mono tracking-widest uppercase pointer-events-none text-right">Red Zone: Violation Risk</div>

                    <div className="w-full flex justify-between absolute bottom-4 px-4 text-[9px] font-mono text-gray-500 uppercase pointer-events-none">
                      <span>X: 0% Civil Liability</span>
                      <span>X: 100% Core Risk Strain</span>
                    </div>
                  </div>

                  {/* Constitutional Recommendation & Validator Report Card */}
                  <div className="mt-6 border-t pt-6" style={{ borderColor: `${PALETTE.deepTeal}20` }}>
                    
                    {isValLoading ? (
                      <div className="h-40 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="animate-spin text-[#7F22FE]" size={28} />
                        <span className="text-xs text-gray-400 font-mono">Running Constitutional Safeguard Algorithms...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Score and Verdict metrics block */}
                        <div className="md:col-span-4 space-y-4">
                          <div className="bg-[#01030a] rounded-2xl p-4.5 border text-center" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Validation Safety Score</span>
                            <div className="my-2 flex items-baseline justify-center gap-1">
                              <span 
                                className="text-4xl font-black font-mono tracking-tighter"
                                style={{
                                  color: 
                                    valResult.zone === 'Green' ? PALETTE.green : 
                                    valResult.zone === 'Yellow' ? PALETTE.yellow : PALETTE.red
                                }}
                              >
                                {valResult.safetyScore}%
                              </span>
                              <span className="text-xs text-gray-550">/ 100</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block font-mono">
                              Risk evaluation index: <strong className="text-gray-300 font-bold">{valResult.riskScore}%</strong>
                            </span>
                          </div>

                          <div className="bg-[#01030a] rounded-2xl p-4 border flex items-center gap-3" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                            <div className="p-2.5 rounded-xl bg-slate-900 border" style={{ borderColor: `${PALETTE.deepTeal}20` }}>
                              <Scale className="text-[#00B8DB]" size={16} />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500 block">Civic Liberty Impact</span>
                              <span className={`text-xs font-bold ${valResult.civilLibertyImpact === 'High' ? 'text-red-400' : valResult.civilLibertyImpact === 'Medium' ? 'text-amber-400' : 'text-indigo-400'}`}>{valResult.civilLibertyImpact} Impact</span>
                            </div>
                          </div>

                          <div className="bg-[#01030a] rounded-2xl p-4 border flex items-center gap-3" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                            <div className="p-2.5 rounded-xl bg-slate-900 border" style={{ borderColor: `${PALETTE.deepTeal}20` }}>
                              {valResult.recommendation === 'Rejected' ? <XCircle className="text-red-400" size={16} /> : <CheckCircle2 className="text-indigo-400" size={16} />}
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500 block">Recommendation</span>
                              <span className={`text-xs font-bold uppercase ${valResult.recommendation === 'Rejected' ? 'text-red-400' : valResult.recommendation.includes('Amendments') ? 'text-amber-400' : 'text-indigo-400'}`}>{valResult.recommendation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Analysis list report points */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="bg-[#01030a]/40 p-4.5 rounded-2xl border" style={{ borderColor: `${PALETTE.deepTeal}10` }}>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-2">Formal Boundary Analysis</span>
                            <p className="text-xs text-gray-300 leading-relaxed font-sans">{valResult.explanation}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Validation elements */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 font-bold">
                                <CheckCircle2 size={12} /> Compliance Support Points
                              </span>
                              <ul className="space-y-2">
                                {valResult.constitutionalPoints.map((point: string, idx: number) => (
                                  <li key={idx} className="text-[11px] text-gray-400 bg-indigo-500/5 p-2 rounded-xl border border-indigo-500/10 leading-relaxed flex items-start gap-2">
                                    <span className="text-indigo-400 shrink-0 font-bold">&#8226;</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Violation element warnings */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-red-400 flex items-center gap-1.5 font-bold">
                                <AlertTriangle size={12} /> Legal Challenge Warnings
                              </span>
                              <ul className="space-y-2">
                                {valResult.violations.map((warn: string, idx: number) => (
                                  <li key={idx} className="text-[11px] text-gray-400 bg-red-500/5 p-2 rounded-xl border border-red-500/10 leading-relaxed flex items-start gap-2">
                                    <span className="text-red-400 shrink-0 font-bold">&#8226;</span>
                                    <span>{warn}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* SUB-TAB 2: Emergency Powers Exception Simulator */}
          {activeSubTab === 'emergency' && (
            <div className="space-y-6">
              
              {/* Simulator scenario cards */}
              <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mb-1">Emergency Powers Exception Simulator</h3>
                  <p className="text-xs text-gray-400">Determine allowable vs restricted state actions during highly volatile global systemic bottlenecks.</p>
                </div>

                {/* Scenario selection grid (Pandemic, War, Natural Disaster, Economic Collapse) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { id: 'pandemic', label: 'Pandemic Exception', icon: Activity, desc: 'Public hygiene threats' },
                    { id: 'war', label: 'War & Defense State', icon: Lock, desc: 'Aerospace & kinetic siege' },
                    { id: 'natural disaster', label: 'Natural Disaster State', icon: Globe, desc: 'Biosphere disruption' },
                    { id: 'economic collapse', label: 'Economic Collapse', icon: Cpu, desc: 'Hyper-inflation & debt' },
                  ].map((scenarioItem) => {
                    const isActive = selectedEmergency === scenarioItem.id;
                    const ScenarioIcon = scenarioItem.icon;
                    return (
                      <button
                        key={scenarioItem.id}
                        onClick={() => handleSimulateEmergency(scenarioItem.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? 'bg-[#7F22FE]/15 text-white border-[#7F22FE] shadow-[0_0_15px_rgba(127,34,254,0.15)]' 
                            : 'bg-slate-950 border-[#073F4D]/25 text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-[#7F22FE] text-white border-none' : 'bg-slate-900 text-gray-400'}`}>
                            <ScenarioIcon size={14} />
                          </div>
                          <span className="text-xs font-bold tracking-wide">{scenarioItem.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-550 truncate">{scenarioItem.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Simulated result render block */}
                {isEmergencyLoading ? (
                  <div className="h-60 flex flex-col items-center justify-center gap-3 border border-dashed rounded-2xl" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                    <RefreshCw className="animate-spin text-[#7F22FE]" size={32} />
                    <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Calculating Sovereign Power limits...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left block Allowed vs Restricted */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Allowed items */}
                      <div className="bg-[#01030a] rounded-2xl p-5 border" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                          <h4 className="text-xs font-bold font-mono tracking-widest text-indigo-400 uppercase">constitutionally Valid Powers</h4>
                        </div>
                        <ul className="space-y-3">
                          {emergencyResult.allowedActions.map((action: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-300 bg-slate-950/50 p-3 rounded-xl border border-indigo-500/10 leading-relaxed flex items-start gap-2">
                              <span className="text-indigo-400 shrink-0 font-bold">&#10003;</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Forbidden actions */}
                      <div className="bg-[#01030a] rounded-2xl p-5 border" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-6 bg-red-500 rounded-full" />
                          <h4 className="text-xs font-bold font-mono tracking-widest text-red-400 uppercase">restricted Boundaries (vitals)</h4>
                        </div>
                        <ul className="space-y-3">
                          {emergencyResult.restrictedActions.map((action: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-300 bg-slate-950/50 p-3 rounded-xl border border-red-500/10 leading-relaxed flex items-start gap-2">
                              <span className="text-red-400 shrink-0 font-bold">&#215;</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Right block: Associated Risks indicators */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Risk Scores card layout */}
                      <div className="bg-[#01030a] rounded-2xl p-5 border space-y-4" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                        <h4 className="text-xs font-bold font-mono tracking-widest text-[#00B8DB] uppercase mb-2">Simulated Boundary Risks</h4>
                        
                        {/* Judicial court intervention risk */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-gray-400 uppercase tracking-wider">Judicial Retaliation Risk</span>
                            <span className={`font-bold ${emergencyResult.judicialRisk.level === 'High' ? 'text-red-400' : emergencyResult.judicialRisk.level === 'Medium' ? 'text-amber-400' : 'text-indigo-400'}`}>{emergencyResult.judicialRisk.level} Risk</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: emergencyResult.judicialRisk.level === 'High' ? '90%' : emergencyResult.judicialRisk.level === 'Medium' ? '50%' : '20%',
                                backgroundColor: emergencyResult.judicialRisk.level === 'High' ? PALETTE.red : emergencyResult.judicialRisk.level === 'Medium' ? PALETTE.yellow : PALETTE.green
                              }} 
                            />
                          </div>
                          <p className="text-[10px] text-gray-450 leading-relaxed italic">{emergencyResult.judicialRisk.description}</p>
                        </div>

                        {/* Democratic / Public backlash Risk */}
                        <div className="space-y-1 pt-2 border-t" style={{ borderColor: `${PALETTE.deepTeal}10` }}>
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-gray-400 uppercase tracking-wider">Political & Civil Trust strain</span>
                            <span className={`font-bold ${emergencyResult.politicalRisk.level === 'High' ? 'text-red-400' : emergencyResult.politicalRisk.level === 'Medium' ? 'text-amber-400' : 'text-indigo-400'}`}>{emergencyResult.politicalRisk.level} Strain</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: emergencyResult.politicalRisk.level === 'High' ? '85%' : emergencyResult.politicalRisk.level === 'Medium' ? '55%' : '15%',
                                backgroundColor: emergencyResult.politicalRisk.level === 'High' ? PALETTE.red : emergencyResult.politicalRisk.level === 'Medium' ? PALETTE.yellow : PALETTE.green
                              }} 
                            />
                          </div>
                          <p className="text-[10px] text-gray-450 leading-relaxed italic">{emergencyResult.politicalRisk.description}</p>
                        </div>

                      </div>

                      {/* Treaty strain indicator warning */}
                      <div className="bg-gradient-to-tr from-[#56280B]/15 to-transparent border rounded-2xl p-4.5" style={{ borderColor: `${PALETTE.orange}20` }}>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#FF6900] uppercase tracking-wider font-mono mb-2">
                          <AlertTriangle size={14} /> International Treaty Strain
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans mt-1">
                          {emergencyResult.treatyImpact}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* SUB-TAB 3: International Treaty Constraints */}
          {activeSubTab === 'treaty' && (
            <div className="space-y-6">
              
              <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mb-1">Treaty Constraint Analyzer</h3>
                    <p className="text-xs text-gray-400">Verifying external friction markers against climate pledges, global trade barriers, and defenses.</p>
                  </div>
                  
                  {/* Small top-up query formulation */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={treatyProposal}
                      onChange={(e) => setTreatyProposal(e.target.value)}
                      placeholder="Enter policy proposal..."
                      className="bg-slate-950 border rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none"
                      style={{ borderColor: `${PALETTE.deepTeal}30` }}
                    />
                    <button 
                      onClick={() => handleAnalyzeTreaties(treatyProposal)}
                      disabled={isTreatyLoading || !treatyProposal.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7F22FE] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      {isTreatyLoading ? <RefreshCw className="animate-spin" size={12} /> : "Analyze"}
                    </button>
                  </div>
                </div>

                {/* Grid listing the treaties, trade pacts, defense treaties and climate pledges code */}
                {isTreatyLoading ? (
                  <div className="h-60 flex flex-col items-center justify-center gap-3 border border-dashed rounded-2xl" style={{ borderColor: `${PALETTE.deepTeal}15` }}>
                    <RefreshCw className="animate-spin text-[#7F22FE]" size={32} />
                    <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Benchmarking global covenants...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {treatyResult.agreements.map((agreement: any, idx: number) => {
                      const isStrained = agreement.status === 'Strained';
                      const isViolated = agreement.status === 'Violated';
                      return (
                        <div 
                          key={idx} 
                          className="bg-[#01030a] rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between hover:border-white/5 transition-colors"
                          style={{ borderColor: `${PALETTE.deepTeal}15` }}
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <span className="text-[9px] font-mono uppercase tracking-widest text-[#00B8DB] bg-[#00B8DB]/5 border border-[#00B8DB]/10 px-2 py-0.5 rounded">Category {idx + 1}</span>
                              <h4 className="text-xs font-bold text-white tracking-tight mt-1.5">{agreement.category}</h4>
                            </div>
                            
                            {/* Legal compliance label indicator */}
                            <span 
                              className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded"
                              style={{
                                backgroundColor: isViolated ? `${PALETTE.red}15` : isStrained ? `${PALETTE.yellow}15` : `${PALETTE.green}15`,
                                color: isViolated ? PALETTE.red : isStrained ? PALETTE.yellow : PALETTE.green,
                              }}
                            >
                              {agreement.status}
                            </span>
                          </div>

                          {/* Dynamic detailed explanation regarding treaty effect on sovereign power decisions */}
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">{agreement.impact}</p>

                          {/* Decorative trace dots on the baseline frame border */}
                          <div className="mt-4 flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isViolated ? PALETTE.red : isStrained ? PALETTE.yellow : PALETTE.green }} />
                            <span className="text-[9px] text-gray-600 font-mono">Bound under sovereign tracking code AI-{idx+10}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
