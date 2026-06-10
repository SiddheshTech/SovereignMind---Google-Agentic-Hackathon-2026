import React, { useState } from 'react';
import { Clock, ChevronDown, Filter, Settings, Download, Info, X, CheckCircle2, ChevronRight, Play, Pause, UserPlus, RefreshCw, Copy } from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     
  orange: '#FF6900',     
  sky: '#00B8DB',        
  deepTeal: '#073F4D',   
};

export function ExecutiveBriefing() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success'}>( { id: '', status: 'idle' } );
  const [cycle, setCycle] = useState('Current Cycle');
  const [showCycleDropdown, setShowCycleDropdown] = useState(false);
  const [matrixTask, setMatrixTask] = useState<any>(null);
  
  // Admin form
  const [adminSaving, setAdminSaving] = useState(false);

  // Filters state
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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

  const tasks = [
    { id: 1, title: "Review Systemic Dependencies Model", desc: "Examine structural weaknesses in Grid Zeta-9.", status: "Pending Review", statusColor: PALETTE.orange, date: "Today", priority: "Critical", owner: "Sec. Alvarez", dep: "Core DB" },
    { id: 2, title: "Initialize Biosafety Simulation", desc: "Run contagion algorithms for sector 4 clearance.", status: "In Progress", statusColor: PALETTE.sky, date: "Tomorrow", priority: "High", owner: "Dr. Chen", dep: "Bio-Engine" },
    { id: 3, title: "Execute Treaty Parameter Refresh", desc: "Update bilateral treaty constraints in Sovereign Sandbox.", status: "Scheduled", statusColor: "gray", date: "Jun 12", priority: "Normal", owner: "Amb. Hayes", dep: "Legal AP" },
    { id: 4, title: "Audit Economic Shock Logs", desc: "Compile post-simulation analytics for the finance subsystem.", status: "Scheduled", statusColor: "gray", date: "Jun 14", priority: "Normal", owner: "Treasury", dep: "Econ-Sim" }
  ];

  const meetings = [
    { id: 1, color: PALETTE.sky, title: "Crisis Protocol Review", time: "09:00 - 10:30", participants: 4, priority: "High" },
    { id: 2, color: PALETTE.purple, title: "Synthetic Population Beta", time: "11:00 - 12:00", participants: 2, priority: "Normal" },
    { id: 3, color: PALETTE.orange, title: "Emergency Powers Brief", time: "14:00 - 15:30", participants: 6, priority: "Critical" },
  ];

  const filteredTasks = tasks.filter(t => activeFilters.length === 0 || activeFilters.includes(t.priority));
  const filteredMeetings = meetings.filter(m => activeFilters.length === 0 || activeFilters.includes(m.priority));

  const multiSelectFilters = ['Critical', 'High', 'Normal'];
  const toggleFilter = (f: string) => {
     setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const activeStatsRatio = activeFilters.length === 0 ? 1 : activeFilters.length / multiSelectFilters.length;
  const getStat = (base: number) => Math.round(base * activeStatsRatio).toString();

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 relative">
      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 p-3 px-6 rounded-xl bg-purple-600 shadow-[0_0_30px_rgba(127,34,254,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-purple-400 text-center">
           Action Processed Successfully
        </div>
      )}
      
      {/* Sub-header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
         <div className="flex items-center gap-3 relative">
           <button 
             onClick={() => setShowCycleDropdown(!showCycleDropdown)}
             className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(127,34,254,0.25)] hover:shadow-[0_0_25px_rgba(127,34,254,0.4)] cursor-pointer"
             style={{ backgroundColor: PALETTE.purple }}
           >
             <Clock size={14} />
             {cycle}
             <ChevronDown size={14} className={`ml-1 opacity-70 transition-transform ${showCycleDropdown ? 'rotate-180' : ''}`} />
           </button>
           
           {showCycleDropdown && (
             <div className="absolute top-12 left-0 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
               {['Current Cycle', 'Previous Cycle', 'Quarterly View', 'Annual View', 'Custom Range'].map(c => (
                 <div key={c} onClick={() => { setCycle(c); setShowCycleDropdown(false); setTimeout(() => handleAction('cycle-update'), 100); }} className="px-4 py-2 hover:bg-slate-800 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                   {c}
                 </div>
               ))}
             </div>
           )}

           <button 
             onClick={() => setActiveModal('filter')}
             className="flex items-center gap-2 px-4 py-2 bg-slate-950 border text-white text-sm font-medium rounded-xl transition-colors hover:bg-white/5 cursor-pointer" 
             style={{ borderColor: `${PALETTE.deepTeal}30` }}
           >
             Filter Layers
             <Filter size={14} className="ml-1 opacity-70" />
           </button>
         </div>
         <div className="flex items-center gap-3">
           <button 
             onClick={() => setActiveModal('admin')}
             className="flex items-center gap-2 px-4 py-2 bg-slate-950 border text-white text-sm font-medium rounded-xl transition-colors hover:bg-white/5 cursor-pointer" 
             style={{ borderColor: `${PALETTE.deepTeal}30` }}
           >
             <Settings size={14} className="opacity-70" style={{ color: PALETTE.sky }} />
             Admin Setup
           </button>
           <button 
             onClick={() => setActiveModal('export')}
             className="flex items-center gap-2 px-4 py-2 bg-slate-950 border text-white text-sm font-medium rounded-xl transition-colors hover:bg-white/5 cursor-pointer" 
             style={{ borderColor: `${PALETTE.deepTeal}30` }}
           >
             <Download size={14} className="opacity-70" style={{ color: PALETTE.orange }} />
             Export Data
           </button>
         </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Directives Initialized" value={getStat(cycle === 'Quarterly View' ? 128 : 41)} change="+8" changeDesc="vs prior 30 cycles" type="new" accent={PALETTE.sky} />
        <StatCard title="Resolved Stabilization loops" value={getStat(cycle === 'Quarterly View' ? 54 : 16)} change="+3" changeDesc="vs prior 30 cycles" type="new" accent={PALETTE.purple} />
        <StatCard title="Decryption Recalibration Rate" value="23%" change="+0" changeDesc="constant value" type="neutral" accent={PALETTE.orange} />
        <StatCard title="Unscheduled Interrupt Vectors" value={getStat(cycle === 'Quarterly View' ? 192 : 51)} change="+2" changeDesc="vs prior 30 cycles" type="new" accent={PALETTE.purple} />
      </div>

      {/* Row 2: Meetings & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Meetings Circle Panel */}
        <div className="lg:col-span-1 bg-[#030712] border rounded-3xl p-6 flex flex-col hover:border-white/10 transition-colors" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-semibold text-white tracking-wide">Dynamic Allocation Dial</h3>
             <Info size={14} className="text-gray-500" />
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 mt-4">
              <div className="relative w-[110px] h-[110px] flex-shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="10" strokeDasharray="3 3" />
                   <circle 
                     cx="55" cy="55" r="45" fill="none" stroke={PALETTE.purple} strokeWidth="10" 
                     strokeDasharray="282.7" strokeDashoffset={cycle === 'Annual View' ? '50' : '110'} strokeLinecap="round" 
                   />
                 </svg>
                 <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                   <span className="text-2xl font-bold text-white tracking-tighter">{cycle === 'Annual View' ? '82%' : '61%'}</span>
                 </div>
              </div>
              <div>
                 <div className="text-sm font-semibold text-white">Active Operational Phase</div>
                 <div className="text-xs text-gray-500 mt-1">29 protocols pending alignment</div>
              </div>
           </div>
           
           <div className="space-y-4 flex-1">
             {filteredMeetings.map(m => (
                <MeetingItem key={m.id} color={m.color} title={m.title} time={m.time} participants={m.participants} onClick={() => setActiveModal('schedule')} />
             ))}
             {filteredMeetings.length === 0 && <div className="text-gray-500 text-xs text-center mt-8">No scheduled alignments for this filter.</div>}
           </div>
           
           <button 
             onClick={() => setActiveModal('full-schedule')}
             className="w-full mt-6 py-2 border rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer" 
             style={{ borderColor: `${PALETTE.deepTeal}40` }}
           >
             View Full Schedule
           </button>
        </div>

        {/* Action Priority Matrix List */}
        <div className="lg:col-span-2 bg-[#030712] border rounded-3xl p-6 flex flex-col" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <h3 className="text-sm font-semibold text-white tracking-wide">Action Priority Matrix</h3>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7F22FE]/20 text-[#7F22FE] border border-[#7F22FE]/30">LIVE</span>
               {activeFilters.length > 0 && <span className="text-xs text-amber-500 ml-2">Filtered ({activeFilters.length})</span>}
             </div>
           </div>
           
           <div className="space-y-3">
              {filteredTasks.map(t => (
                <PriorityTask 
                  key={t.id}
                  title={t.title}
                  desc={t.desc}
                  status={t.status}
                  statusColor={t.statusColor}
                  date={t.date}
                  priority={t.priority}
                  onClick={() => { setMatrixTask(t); setActiveModal('matrix-detail'); }}
                />
              ))}
              {filteredTasks.length === 0 && <div className="text-gray-500 text-sm py-4">No tasks match current filters.</div>}
           </div>
        </div>
      </div>
      
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#030712] border rounded-2xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative" style={{ maxWidth: activeModal === 'full-schedule' || activeModal === 'admin' ? '800px' : '450px', borderColor: `${PALETTE.deepTeal}80` }}>
            <div className="flex items-center justify-between p-4 px-6 border-b" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
               <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeModal === 'filter' && 'Filter Dashboard Layers'}
                    {activeModal === 'admin' && 'Admin Configuration Panel'}
                    {activeModal === 'export' && 'Export Dashboard Data'}
                    {activeModal === 'schedule' && 'Schedule Notification'}
                    {activeModal === 'full-schedule' && 'Complete Schedule Module'}
                    {activeModal === 'matrix-detail' && 'Task Detail Panel'}
                  </h4>
               </div>
               <button onClick={() => { setActiveModal(null); setMatrixTask(null); }} className="text-gray-500 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               {activeModal === 'filter' && (
                 <div className="space-y-6">
                   <div className="space-y-3">
                     <label className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Severity / Priority Filter</label>
                     <div className="flex flex-wrap gap-2">
                       {multiSelectFilters.map(f => (
                         <div key={f} onClick={() => toggleFilter(f)} className={`px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeFilters.includes(f) ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-700 text-gray-300 hover:bg-slate-800'}`}>
                           {f}
                         </div>
                       ))}
                     </div>
                   </div>
                   <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button onClick={() => { setActiveModal(null); handleAction('filter-applied'); }} className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all text-xs cursor-pointer">Apply Filters</button>
                      <button onClick={() => { setActiveFilters([]); setActiveModal(null); }} className="flex-1 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs cursor-pointer">Reset Filters</button>
                   </div>
                 </div>
               )}

               {activeModal === 'admin' && (
                 <div className="space-y-6 text-sm text-gray-300 px-2 lg:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <h3 className="font-bold text-white border-b border-white/10 pb-2">User Management & Roles</h3>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-800">
                             <span>Sys Administrator</span>
                             <select className="bg-slate-900 rounded p-1 text-xs outline-none border border-slate-700"><option>Full Access</option><option>Read Only</option></select>
                           </div>
                           <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-800">
                             <span>Operator Level 2</span>
                             <select className="bg-slate-900 rounded p-1 text-xs outline-none border border-slate-700"><option>Restricted</option><option>Full Access</option></select>
                           </div>
                         </div>
                       </div>
                       <div className="space-y-4">
                         <h3 className="font-bold text-white border-b border-white/10 pb-2">Security, API & Environment</h3>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-800">
                             <span>Audit Logging</span>
                             <input type="checkbox" defaultChecked className="accent-pink-500" />
                           </div>
                           <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-800">
                             <span>API Key Horizon</span>
                             <button className="text-xs bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 border border-slate-700">Rotate Keys</button>
                           </div>
                         </div>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-6 border-t border-white/10 mt-6 justify-end">
                       <button onClick={() => { 
                         setAdminSaving(true); 
                         setTimeout(() => { setAdminSaving(false); setActiveModal(null); }, 1000); 
                       }} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center">
                         {adminSaving ? <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> : 'Save Setup'}
                       </button>
                    </div>
                 </div>
               )}

               {activeModal === 'export' && (
                 <div className="space-y-5">
                   <p className="text-xs text-gray-400 mb-4">Select format to export current dashboard state, filters, and selected records.</p>
                   {['CSV Structure', 'XLSX Spreadsheet', 'JSON Payload', 'PDF Briefing'].map(format => (
                     <button key={format} onClick={() => {
                        handleAction('export-done');
                        setActiveModal(null);
                     }} className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-900/20 text-gray-200 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-between px-4">
                       <span>{format}</span>
                       <Download size={14} className="text-sky-500" />
                     </button>
                   ))}
                 </div>
               )}

               {activeModal === 'schedule' && (
                 <div className="space-y-6">
                   <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-sm text-gray-300">
                     There is an upcoming meeting. Ensure strategic context is pre-loaded before entry.
                   </div>
                   <button 
                     onClick={() => {
                        handleAction('acknowledged');
                        setActiveModal(null);
                     }}
                     className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                   >
                     <CheckCircle2 size={16} /> Acknowledge
                   </button>
                 </div>
               )}

               {activeModal === 'full-schedule' && (
                 <ScheduleModule onAction={handleAction} />
               )}

               {activeModal === 'matrix-detail' && matrixTask && (
                 <div className="space-y-6">
                   <div className="flex items-center gap-3 mb-6">
                      <div className={`w-3 h-3 rounded-full border-2 bg-transparent`} style={{ borderColor: matrixTask.statusColor }} />
                      <h2 className="text-xl font-bold text-white">{matrixTask.title}</h2>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 text-xs">
                     <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                       <span className="text-gray-500 block mb-1">Status</span>
                       <span className="font-mono text-white tracking-widest">{matrixTask.status}</span>
                     </div>
                     <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                       <span className="text-gray-500 block mb-1">Due Date</span>
                       <span className="font-mono text-white tracking-widest">{matrixTask.date}</span>
                     </div>
                     <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                       <span className="text-gray-500 block mb-1">Owner</span>
                       <span className="font-semibold text-sky-400">{matrixTask.owner}</span>
                     </div>
                     <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                       <span className="text-gray-500 block mb-1">Dependency</span>
                       <span className="font-semibold text-orange-400">{matrixTask.dep}</span>
                     </div>
                   </div>

                   <p className="text-sm text-gray-300 leading-relaxed bg-[#02040a] p-4 rounded-xl border border-slate-800">
                     {matrixTask.desc} Additional strategic context required before operational clearance.
                   </p>

                   <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                     <button onClick={() => { handleAction('task-start'); setActiveModal(null); }} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold transition-all text-xs flex items-center gap-2 cursor-pointer shadow-lg"><Play size={12}/> Start</button>
                     <button onClick={() => { handleAction('task-pause'); setActiveModal(null); }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded font-bold transition-all text-xs flex items-center gap-2 cursor-pointer"><Pause size={12}/> Pause</button>
                     <button onClick={() => { handleAction('task-complete'); setActiveModal(null); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition-all text-xs flex items-center gap-2 cursor-pointer shadow-lg"><CheckCircle2 size={12}/> Complete</button>
                     <button onClick={() => { handleAction('task-reassign'); setActiveModal(null); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded font-bold transition-all text-xs flex items-center gap-2 cursor-pointer"><UserPlus size={12}/> Reassign</button>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, changeDesc, type, accent }: any) {
  return (
    <div className="bg-[#030712] border rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-colors" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
       <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br opacity-20 rounded-bl-3xl" style={{ from: accent, to: 'transparent' }} />
       <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h4>
       <div className="text-3xl font-bold text-white tracking-tight mt-3 transition-all duration-500">{value}</div>
       <div className="flex items-center gap-2 mt-3">
         <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm bg-opacity-20`} style={{ color: accent, backgroundColor: `${accent}30` }}>
           {change}
         </span>
         <span className="text-[10px] text-gray-500 font-mono uppercase">{changeDesc}</span>
       </div>
    </div>
  );
}

function MeetingItem({ color, title, time, participants, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer group">
      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-white group-hover:text-gray-200">{title}</h4>
        <div className="text-[10px] text-gray-400 font-mono mt-1">{time} • {participants} Attendees</div>
      </div>
    </div>
  );
}

function PriorityTask({ title, desc, status, statusColor, date, priority, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#02040a] hover:bg-slate-900 transition-colors cursor-pointer group">
       <div className="flex items-start gap-4">
         <div className={`mt-0.5 flex-shrink-0 w-3 h-3 rounded-full border-2 border-slate-700 bg-transparent group-hover:border-[${statusColor}]`} style={{ borderColor: statusColor }} />
         <div>
           <h4 className="text-sm font-semibold text-white mb-0.5 group-hover:text-gray-200 transition-colors">{title}</h4>
           <div className="text-xs text-gray-500 line-clamp-1">{desc}</div>
         </div>
       </div>
       <div className="flex items-center gap-4 mt-4 sm:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor === 'gray' ? '#475569' : statusColor }} />
           <span className="text-[10px] font-mono font-bold uppercase text-gray-400">{status}</span>
         </div>
         <div className="text-[10px] font-mono font-bold uppercase text-gray-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded w-16 text-center">
           {date}
         </div>
       </div>
    </div>
  );
}

function ScheduleModule({ onAction }: { onAction: (id: string, customMessage?: string) => void }) {
  const [tab, setTab] = React.useState<'calendar' | 'timeline' | 'agenda'>('calendar');
  const [search, setSearch] = React.useState('');
  
  const events = [
    { id: 1, title: 'Ops Coordination Brief 1', room: 'Zeta-Core', time: '14:00Z - 15:00Z', date: '2026-06-15' },
    { id: 2, title: 'Network Security Audit', room: 'Alpha-Hub', time: '09:00Z - 11:00Z', date: '2026-06-16' },
  ];

  const handleExport = (format: string) => {
    let content = '';
    let mimeType = 'text/plain';
    
    if (format === 'CSV') {
        content = 'Title,Room,Time,Date\n' + events.map(e => `${e.title},${e.room},${e.time},${e.date}`).join('\n');
        mimeType = 'text/csv';
    } else if (format === 'JSON') {
        content = JSON.stringify(events, null, 2);
        mimeType = 'application/json';
    } else if (format === 'ICS') {
        content = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Global Platform//EN\n`;
        events.forEach(e => {
            content += `BEGIN:VEVENT\nSUMMARY:${e.title}\nLOCATION:${e.room}\nDTSTART:${e.date.replace(/-/g, '')}T000000Z\nEND:VEVENT\n`;
        });
        content += `END:VCALENDAR`;
        mimeType = 'text/calendar';
    } else {
        content = `Report: ${format}\n\n` + events.map(e => `${e.title} - ${e.room} - ${e.time} - ${e.date}`).join('\n');
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-export.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onAction('schedule-exported', `Exported to ${format}`);
  };

  return (
    <div className="h-[500px] flex flex-col pt-0">
       <div className="flex justify-between items-center bg-slate-900 border-b border-slate-800 p-4 -mx-6 -mt-6 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setTab('calendar')} className={`px-3 py-1 text-xs font-bold rounded ${tab === 'calendar' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}`}>Calendar</button>
            <button onClick={() => setTab('timeline')} className={`px-3 py-1 text-xs font-bold rounded ${tab === 'timeline' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}`}>Timeline</button>
            <button onClick={() => setTab('agenda')} className={`px-3 py-1 text-xs font-bold rounded ${tab === 'agenda' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}`}>Agenda</button>
          </div>
          <div className="flex gap-2">
            {['CSV', 'JSON', 'ICS'].map(f => (
              <button key={f} onClick={() => handleExport(f)} className="px-3 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold rounded flex items-center gap-2 cursor-pointer">
                <Download size={12} /> {f}
              </button>
            ))}
          </div>
       </div>
       <div className="flex-1 overflow-y-auto space-y-3 p-2 text-sm text-gray-300">
          {tab === 'calendar' && (
              <div className="grid grid-cols-7 gap-1">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center font-bold text-xs text-gray-500 py-2">{d}</div>)}
                  {Array.from({length: 30}).map((_, i) => (
                      <div key={i} className="aspect-square border border-slate-800 bg-slate-900/30 rounded p-1 hover:bg-slate-800 transition-colors">
                          <div className="text-[10px] text-gray-500">{i+1}</div>
                          {events.filter(e => parseInt(e.date.split('-')[2]) === i+1).map(e => (
                              <div key={e.id} className="text-[8px] bg-sky-500/20 text-sky-400 rounded px-1 truncate mb-1">{e.title}</div>
                          ))}
                      </div>
                  ))}
              </div>
          )}
          {tab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-4">
               {events.map((e, index) => (
                 <div key={e.id} className="relative">
                   <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-slate-950"></div>
                   <div className="text-xs text-sky-400 mb-1">{e.date} • {e.time}</div>
                   <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                     <div className="font-bold text-white">{e.title}</div>
                     <div className="text-xs text-gray-500">Location: {e.room}</div>
                   </div>
                 </div>
               ))}
            </div>
          )}
          {tab === 'agenda' && (
            <div>
               <div className="mb-4">
                  <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none" />
               </div>
               {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.room.toLowerCase().includes(search.toLowerCase())).map(e => (
                  <div key={e.id} className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer mb-2">
                     <div>
                       <div className="font-bold text-white">{e.title}</div>
                       <div className="text-xs text-gray-500 mt-1">Date: {e.date} • Room: {e.room}</div>
                     </div>
                     <div className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-sky-400">{e.time}</div>
                  </div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}
