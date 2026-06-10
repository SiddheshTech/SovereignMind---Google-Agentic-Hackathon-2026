import React, { useState, useEffect, useRef } from 'react';
import { Users, FileText, Video, MessageSquare, Plus, Search, Shield, Pin, ExternalLink, Calendar, CheckCircle2, X, Download, Share2, Link, Mic, MicOff, Hand, Send, LayoutList, History, CornerDownLeft, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ARTIFACT_DB = [
  { id: '1', title: 'Threat Assessment 1A', date: 'Today, 14:00', type: 'report', metadata: 'Sector 4, Risk Lvl 5', history: [{ v: '1.2', d: 'Today 13:00' }] },
  { id: '2', title: 'Logistics Reroute Plan', date: 'Yesterday', type: 'pdf', metadata: 'Supply routes 3 & 4', history: [{ v: '1.0', d: 'Yesterday 09:00' }] },
  { id: '3', title: 'Energy Output Projections', date: 'Oct 12', type: 'sheet', metadata: 'Q4 Projections', history: [{ v: '2.4', d: 'Oct 11' }] },
  { id: '4', title: 'Treaty Violation Evidence', date: 'Oct 10', type: 'image', metadata: 'Visual data pack', history: [{ v: '1.0', d: 'Oct 10' }] },
];

export function CollaborationDashboard() {
  const [rooms, setRooms] = useState([
    { id: 'r1', name: 'Global Threat Triage', type: 'video', category: 'pinned', ping: true, unread: 0 },
    { id: 'r2', name: 'Sector 4 Logistics', type: 'chat', category: 'pinned', ping: false, unread: 0 },
    { id: 'o1', name: 'Grid Collapse Sigma', type: 'chat', category: 'operation', ping: false, unread: 4 },
    { id: 'o2', name: 'Naval Embargo Comms', type: 'video', category: 'operation', ping: false, unread: 0 },
    { id: 'o3', name: 'Supply Chain Alpha', type: 'chat', category: 'operation', ping: false, unread: 0 },
  ]);

  const [users, setUsers] = useState([
    { id: 'u1', name: 'Cmdr. J. Vance', status: 'online' },
    { id: 'u2', name: 'Operative K. Thorne', status: 'busy' },
    { id: 'u3', name: 'SysAdmin 04', status: 'offline' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['Sector 4', 'Sigma']);

  const [activeRoomId, setActiveRoomId] = useState('r1');
  const [isJoinStreamLoad, setIsJoinStreamLoad] = useState(false);
  const [isStreamJoined, setIsStreamJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({ name: '', description: '', class: 'Internal', participants: '' });

  const [showArtifactModal, setShowArtifactModal] = useState<{ open: boolean; artifact: any }>({ open: false, artifact: null });
  const [showAllArtifacts, setShowAllArtifacts] = useState(false);

  const [chatMessages, setChatMessages] = useState<{ [key: string]: { sender: string; text: string; time: string }[] }>({
    'r1': [{ sender: 'System', text: 'Channel established.', time: '09:00' }],
    'o1': [{ sender: 'Cmdr. J. Vance', text: 'Status update on collapse?', time: '11:15' }]
  });
  const [chatInput, setChatInput] = useState('');

  const [notifications, setNotifications] = useState<any[]>([]);

  // Simulation of Presence and Real-time Updates
  useEffect(() => {
    const presenceTimer = setInterval(() => {
      setUsers(prev => prev.map(u => {
        if (Math.random() > 0.8) {
          const statuses = ['online', 'busy', 'away', 'offline'];
          const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...u, status: nextStatus };
        }
        return u;
      }));
    }, 15000);

    const messageTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setChatMessages(prev => {
          const updated = { ...prev };
          if (!updated['r1']) updated['r1'] = [];
          updated['r1'] = [...updated['r1'], { sender: 'System Monitor', text: 'Ping received at Sector 4.', time: new Date().toLocaleTimeString() }];
          return updated;
        });
        addNotification('New activity in Global Threat Triage', 'r1');
      }
    }, 20000);

    return () => { clearInterval(presenceTimer); clearInterval(messageTimer); };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const addNotification = (msg: string, roomId?: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), text: msg, read: false, roomId }, ...prev]);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomForm.name) return;
    const newRoom = { id: `nr_${Date.now()}`, name: newRoomForm.name, type: 'chat', category: 'operation', ping: true, unread: 0 };
    setRooms(prev => [newRoom, ...prev]);
    setShowNewRoomModal(false);
    setActiveRoomId(newRoom.id);
    addNotification(`Room "${newRoomForm.name}" created.`);
    setNewRoomForm({ name: '', description: '', class: 'Internal', participants: '' });
  };

  const handleJoinStream = () => {
    setIsJoinStreamLoad(true);
    setTimeout(() => {
      setIsJoinStreamLoad(false);
      setIsStreamJoined(true);
      addNotification(`Joined stream in ${activeRoom?.name}`);
    }, 1200);
  };

  const handleLeaveStream = () => {
    setIsStreamJoined(false);
    setIsMuted(false);
    setIsHandRaised(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => {
      const updated = { ...prev };
      if (!updated[activeRoomId]) updated[activeRoomId] = [];
      updated[activeRoomId] = [...updated[activeRoomId], { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      return updated;
    });
    setChatInput('');
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId) || users.find(u => u.id === activeRoomId) as any;
  const isDirectLink = !!users.find(u => u.id === activeRoomId);

  const performSearch = (query: string) => {
    setSearchQuery(query);
    setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 5));
    setIsSearchFocused(false);
  };

  const filteredItems = [...rooms, ...users, ...ARTIFACT_DB].filter(item => 
    (item as any).name?.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    (item as any).title?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 h-[800px] flex flex-col relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <Users size={20} className="text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Joint Operations</h2>
            <div className="text-[10px] uppercase font-mono text-gray-500 tracking-widest mt-1">SECURE COLLABORATION HUB</div>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowNewRoomModal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-pink-500/20 cursor-pointer"
           >
              <Plus size={14} /> New Room
           </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Rooms Sidebar */}
        <div className="w-72 bg-[#030712] border border-slate-800 rounded-3xl p-5 flex flex-col shrink-0">
           <div className="relative mb-6">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <input 
               type="text" 
               placeholder="Search rooms or peers..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onFocus={() => setIsSearchFocused(true)}
               onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
               className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs text-white pl-9 pr-3 py-2 outline-none focus:border-pink-500" 
             />
             <AnimatePresence>
                {isSearchFocused && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                     {debouncedQuery ? (
                        <div className="max-h-60 overflow-y-auto">
                          {filteredItems.length ? (
                            filteredItems.map((item: any) => (
                              <button key={item.id} onClick={() => performSearch(item.name || item.title)} className="w-full text-left px-3 py-2 hover:bg-slate-800 text-xs text-gray-300 border-b border-slate-800/50 last:border-0 cursor-pointer">
                                {item.name || item.title}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-xs text-center text-gray-500">No results found</div>
                          )}
                        </div>
                     ) : (
                       <div className="p-2">
                         <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest px-2 mb-1">Recent Searches</div>
                         {searchHistory.map(sh => (
                           <button key={sh} onMouseDown={() => performSearch(sh)} className="w-full text-left px-2 py-1.5 hover:bg-slate-800 text-xs text-gray-300 rounded cursor-pointer flex items-center gap-2">
                             <History size={12} className="text-gray-500" /> {sh}
                           </button>
                         ))}
                       </div>
                     )}
                  </motion.div>
                )}
             </AnimatePresence>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-none">
              <div>
                <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3 flex items-center gap-1"><Pin size={10} /> Pinned</h4>
                <div className="space-y-2">
                  {rooms.filter(r => r.category === 'pinned').map(r => (
                     <RoomItem key={r.id} name={r.name} type={r.type} active={activeRoomId === r.id} ping={r.ping} unread={r.unread} onClick={() => setActiveRoomId(r.id)} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">Active Operations</h4>
                <div className="space-y-2">
                  {rooms.filter(r => r.category === 'operation').map(r => (
                     <RoomItem key={r.id} name={r.name} type={r.type} active={activeRoomId === r.id} ping={r.ping} unread={r.unread} onClick={() => {
                        setActiveRoomId(r.id);
                        setRooms(prev => prev.map(room => room.id === r.id ? { ...room, unread: 0, ping: false } : room));
                     }} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">Direct Links</h4>
                <div className="space-y-2">
                  {users.map(u => (
                     <UserItem key={u.id} name={u.name} status={u.status} active={activeRoomId === u.id} onClick={() => setActiveRoomId(u.id)} />
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
           {/* Top Active Room */}
           <div className="flex-1 bg-[#030712] border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative min-h-0">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center z-10 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 ${isDirectLink ? 'bg-slate-700 border-slate-600' : 'bg-rose-500/10 border-rose-500/20'} rounded-xl flex items-center justify-center font-bold text-xl`}>
                     {isDirectLink ? activeRoom?.name?.charAt(0) : <Video size={18} className="text-rose-400" />}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white">{activeRoom?.name}</h3>
                     <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                       <Shield size={10} className="text-emerald-400" /> E2E Encrypted • {isDirectLink ? 'Direct Channel' : '4 Participants'}
                     </span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                    {!isDirectLink && activeRoom?.type === 'video' && !isStreamJoined && (
                       <button 
                         onClick={handleJoinStream}
                         disabled={isJoinStreamLoad} 
                         className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2 cursor-pointer"
                       >
                         {isJoinStreamLoad ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Join Stream'}
                       </button>
                    )}
                    {isStreamJoined && (
                       <div className="flex gap-2">
                         <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-lg ${isMuted ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-gray-300'} cursor-pointer transition-colors`}>{isMuted ? <MicOff size={14} /> : <Mic size={14} />}</button>
                         <button onClick={() => setIsHandRaised(!isHandRaised)} className={`p-2 rounded-lg ${isHandRaised ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-gray-300'} cursor-pointer transition-colors`}><Hand size={14} /></button>
                         <button onClick={handleLeaveStream} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">Leave</button>
                       </div>
                    )}
                    {isDirectLink && (
                       <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">Start Call</button>
                    )}
                 </div>
              </div>

              {/* Feed Placeholder / Workspace Area */}
              <div className="flex-1 overflow-y-auto bg-slate-900/50 relative flex flex-col min-h-0">
                 {activeRoom?.type === 'video' && !isDirectLink ? (
                   isStreamJoined ? (
                     <div className="flex-1 flex flex-col">
                       <div className="flex-1 relative bg-black/50">
                         {/* Mock Stream */}
                         <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-32 h-32 rounded-full border border-rose-500/30 flex items-center justify-center relative">
                             <div className="w-full h-full bg-rose-500/10 rounded-full animate-ping absolute inset-0"></div>
                             <Video size={32} className="text-rose-500" />
                           </div>
                         </div>
                         <div className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">Secured Live Feed</div>
                       </div>
                       {/* Stream Chat side */}
                       <div className="h-48 border-t border-slate-800 bg-slate-950 p-4 flex flex-col">
                           <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-2">
                             {chatMessages[activeRoomId]?.map((m, i) => (
                               <div key={i} className="text-xs">
                                 <span className="text-gray-500 font-mono text-[10px] mr-2">{m.time}</span>
                                 <span className="font-bold text-pink-400 mr-2">{m.sender}:</span>
                                 <span className="text-gray-300">{m.text}</span>
                               </div>
                             ))}
                           </div>
                           <form onSubmit={handleSendChat} className="flex gap-2 shrink-0">
                             <input value={chatInput} onChange={e => setChatInput(e.target.value)} type="text" placeholder="Send brief message..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500" />
                             <button type="submit" className="px-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"><Send size={14}/></button>
                           </form>
                       </div>
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                       <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #3B82F6 0%, transparent 60%)' }} />
                       <div className="relative z-10 flex -space-x-4 mb-6">
                          <div className="w-16 h-16 rounded-full border-4 border-[#030712] bg-slate-700 flex items-center justify-center text-xl font-bold">V</div>
                          <div className="w-16 h-16 rounded-full border-4 border-[#030712] bg-indigo-700 flex items-center justify-center text-xl font-bold">K</div>
                          <div className="w-16 h-16 rounded-full border-4 border-[#030712] bg-emerald-700 flex items-center justify-center text-xl font-bold">S</div>
                       </div>
                       <h4 className="text-lg font-bold text-white mb-2">Live Briefing in Progress</h4>
                       <p className="text-sm text-gray-400 max-w-sm">Commander Vance is presenting the updated kinetic topology for Sector 4.</p>
                     </div>
                   )
                 ) : (
                    // Chat / Text Workspace Area
                    <div className="flex-1 flex flex-col relative h-full">
                       <div className="flex-1 overflow-y-auto p-6 space-y-4">
                         {chatMessages[activeRoomId]?.length ? (
                           chatMessages[activeRoomId].map((msg, i) => (
                             <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] text-gray-500 font-mono">{msg.time}</span>
                                 <span className="text-xs font-bold text-gray-400">{msg.sender}</span>
                               </div>
                               <div className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${msg.sender === 'You' ? 'bg-pink-600/20 border border-pink-500/30 text-white' : 'bg-slate-800 border border-slate-700 text-gray-300'}`}>
                                 {msg.text}
                               </div>
                             </div>
                           ))
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-gray-600 h-full">
                             <MessageSquare size={32} className="mb-4 opacity-50" />
                             <p className="text-sm">Initiate intelligence exchange.</p>
                           </div>
                         )}
                       </div>
                       <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
                         <form onSubmit={handleSendChat} className="relative">
                           <input 
                             value={chatInput}
                             onChange={e => setChatInput(e.target.value)}
                             type="text" 
                             placeholder="Transmit intelligence..." 
                             className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-white pr-12 focus:outline-none transition-colors" 
                           />
                           <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"><CornerDownLeft size={16} /></button>
                         </form>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Shared Intelligence / Docs */}
           <div className="h-64 bg-[#030712] border border-slate-800 rounded-3xl p-5 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-widest"><FileText size={14} /> Shared Artifacts</h4>
                 <button onClick={() => setShowAllArtifacts(true)} className="text-[10px] font-mono text-pink-400 hover:text-pink-300 cursor-pointer">VIEW ALL</button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                 {ARTIFACT_DB.map(doc => (
                   <DocCard key={doc.id} title={doc.title} date={doc.date} type={doc.type} onClick={() => setShowArtifactModal({ open: true, artifact: doc })} />
                 ))}
               </div>
           </div>

        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
         {showNewRoomModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
               <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950">
                 <h3 className="text-white font-bold text-sm tracking-widest flex items-center gap-2"><LayoutList size={16} className="text-pink-400" /> NEW WORKSPACE</h3>
                 <button onClick={() => setShowNewRoomModal(false)} className="text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
               </div>
               <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
                 <div>
                   <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Workspace Name</label>
                   <input required type="text" value={newRoomForm.name} onChange={e => setNewRoomForm({...newRoomForm, name: e.target.value})} placeholder="e.g. Tactical Review Alpha" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-pink-500" />
                 </div>
                 <div>
                   <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Classification</label>
                   <select value={newRoomForm.class} onChange={e => setNewRoomForm({...newRoomForm, class: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-pink-500 appearance-none">
                      <option>Unclassified</option>
                      <option>Internal Use Only</option>
                      <option>Confidential</option>
                      <option>Top Secret / restricted</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1.5">Participants (Comma Separated)</label>
                   <input type="text" value={newRoomForm.participants} onChange={e => setNewRoomForm({...newRoomForm, participants: e.target.value})} placeholder="e.g. Cmdr. Vance, Operative K." className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-pink-500" />
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setShowNewRoomModal(false)} className="px-4 py-2.5 rounded-lg border border-slate-700 text-gray-300 hover:bg-slate-800 text-xs font-bold transition flex-1 cursor-pointer">Cancel</button>
                   <button type="submit" disabled={!newRoomForm.name} className="px-4 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition flex-1 flex justify-center items-center cursor-pointer disabled:opacity-50">Create Room</button>
                 </div>
               </form>
             </motion.div>
           </div>
         )}

         {showArtifactModal.open && showArtifactModal.artifact && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                 <div className="flex items-center gap-3">
                   <FileText size={20} className="text-gray-400" />
                   <div>
                     <h3 className="text-white font-bold text-sm">{showArtifactModal.artifact.title}</h3>
                     <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{showArtifactModal.artifact.type} • {showArtifactModal.artifact.date}</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button onClick={() => addNotification(`Downloaded ${showArtifactModal.artifact.title}`)} className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors cursor-pointer"><Download size={14} /></button>
                   <button onClick={() => addNotification(`Shared ${showArtifactModal.artifact.title}`)} className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors cursor-pointer"><Share2 size={14} /></button>
                   <button onClick={() => setShowArtifactModal({ open: false, artifact: null })} className="p-2 text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
                 </div>
               </div>
               <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[400px]">
                 <div className="flex-1 bg-black/50 p-8 flex items-center justify-center overflow-y-auto border-r border-slate-800">
                    <div className="max-w-md w-full aspect-video bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center flex-col text-gray-500">
                       <FileText size={48} className="mb-4 opacity-50" />
                       <span className="font-bold text-sm">Secure Preview Encrypted</span>
                       <span className="text-xs font-mono mt-2">Requires clearance Level 2</span>
                    </div>
                 </div>
                 <div className="w-full md:w-64 bg-slate-900 overflow-y-auto p-4 space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-b border-slate-800 pb-2">Metadata</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-gray-500 font-mono">Location</span><span className="text-gray-300 font-medium">Secured Vault 03</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 font-mono">Tags</span><span className="text-pink-400 font-medium">{showArtifactModal.artifact.metadata}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 font-mono">Owner</span><span className="text-gray-300 font-medium">SYS_ADMIN</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-b border-slate-800 pb-2">Version History</h4>
                      <div className="space-y-3">
                         {showArtifactModal.artifact.history.map((h: any, i: number) => (
                           <div key={i} className="flex gap-3">
                             <div className="w-2 h-2 rounded-full border border-pink-500 mt-1 bg-pink-500/20" />
                             <div>
                               <div className="text-xs text-white font-bold">Version {h.v}</div>
                               <div className="text-[10px] font-mono text-gray-500">{h.d}</div>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
               </div>
             </motion.div>
           </div>
         )}
         
         {showAllArtifacts && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
               <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                 <h3 className="text-white font-bold text-lg tracking-widest flex items-center gap-2"><FileText size={20} className="text-pink-400" /> ARTIFACT LIBRARY</h3>
                 <button onClick={() => setShowAllArtifacts(false)} className="text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 bg-[#030712]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {ARTIFACT_DB.map(doc => (
                       <DocCard key={`lib-${doc.id}`} title={doc.title} date={doc.date} type={doc.type} onClick={() => {
                          setShowAllArtifacts(false);
                          setShowArtifactModal({ open: true, artifact: doc });
                       }} />
                     ))}
                     {ARTIFACT_DB.map(doc => (
                       <DocCard key={`lib-dup-${doc.id}`} title={`Archive: ${doc.title}`} date="Older" type={doc.type} onClick={() => {
                          setShowAllArtifacts(false);
                          setShowArtifactModal({ open: true, artifact: { ...doc, title: `Archive: ${doc.title}` } });
                       }} />
                     ))}
                  </div>
               </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function RoomItem({ name, type, active, ping, unread, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-colors ${active ? 'bg-pink-500/10 border-pink-500/30' : 'bg-transparent border-slate-800 hover:border-slate-700'}`}>
       <div className="flex items-center gap-3">
          {type === 'video' ? <Video size={14} className={active ? 'text-rose-400' : 'text-gray-500'} /> : <MessageSquare size={14} className={active ? 'text-pink-400' : 'text-gray-500'} />}
          <span className={`text-xs font-medium truncate w-32 ${active ? 'text-white' : 'text-gray-300'}`}>{name}</span>
       </div>
       {ping && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_theme(colors.rose.500)]" />}
       {unread > 0 && <span className="px-1.5 py-0.5 bg-pink-500 text-white font-bold text-[9px] rounded">{unread}</span>}
    </div>
  )
}

function UserItem({ name, status, active, onClick }: any) {
  const getStatusColor = () => {
    switch(status) {
      case 'online': return 'bg-emerald-500';
      case 'busy': return 'bg-rose-500';
      case 'away': return 'bg-amber-500';
      default: return 'bg-gray-600';
    }
  }

  return (
    <div onClick={onClick} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${active ? 'bg-pink-500/10' : 'hover:bg-slate-900'}`}>
       <div className="flex items-center gap-3">
         <div className="relative">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${active ? 'bg-pink-900 border-pink-700 text-pink-200' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>
             {name.charAt(0)}
           </div>
           <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#030712] rounded-full transition-colors ${getStatusColor()}`} />
         </div>
         <span className={`text-xs font-medium transition-colors ${active ? 'text-pink-300' : 'text-gray-300 group-hover:text-white'}`}>{name}</span>
       </div>
    </div>
  )
}

function DocCard({ title, date, type, onClick }: any) {
  return (
    <div onClick={onClick} className="min-w-[200px] w-48 p-4 bg-[#030712] border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer group transition-colors flex flex-col justify-between shrink-0 h-[100px]">
      <div className="flex justify-between items-start mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0
          ${type === 'report' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 
            type === 'sheet' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
            type === 'pdf' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
            'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
          <FileText size={14} />
        </div>
        <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
      <div className="overflow-hidden">
        <h5 className="text-sm font-bold text-white truncate leading-tight">{title}</h5>
        <span className="text-[10px] font-mono text-gray-500">{date}</span>
      </div>
    </div>
  )
}

