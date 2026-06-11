import React, { useState, useRef, useEffect } from 'react';
import { Brain, MessageSquare, Terminal, Zap, Bot, Shield, ChevronRight, Settings, Maximize2, RotateCcw, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AICopilotDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<any>(null);

  const sessionId = "session-12345"; // Static session for MVP

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSession = async () => {
    try {
      const query = `
        query {
          getCopilotSession(sessionId: "${sessionId}") {
            messages { id role content }
          }
        }
      `;
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      if (json.data?.getCopilotSession) {
        setMessages(json.data.getCopilotSession.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent | React.KeyboardEvent, btnText?: string) => {
    if (e) e.preventDefault();
    const txt = btnText || inputText.trim();
    if (!txt) return;
    
    setInputText('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: txt }]);
    setIsTyping(true);

    try {
      const mutation = `
        mutation {
          sendCopilotMessage(sessionId: "${sessionId}", prompt: """${txt}""") {
            id role content
          }
        }
      `;
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation })
      });
      const json = await res.json();
      if (json.data?.sendCopilotMessage) {
        setMessages(prev => [...prev, json.data.sendCopilotMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearSession = async () => {
    try {
      const mutation = `
        mutation {
          clearCopilotSession(sessionId: "${sessionId}")
        }
      `;
      await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation })
      });
      setMessages([]);
      setShowClearConfirm(false);
      fetchSession(); // to get the initial message back
    } catch (e) {
      console.error(e);
    }
  };

  const triggerTraining = async () => {
    setIsTraining(true);
    setTrainingResult(null);
    try {
      const mutation = `
        mutation {
          triggerModelTraining {
            status
            accuracy
            weights_path
            message
          }
        }
      `;
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation })
      });
      const json = await res.json();
      if (json.data?.triggerModelTraining) {
        setTrainingResult(json.data.triggerModelTraining);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 flex flex-col h-[800px]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <Brain size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Executive AI Copilot</h2>
            <div className="text-[10px] uppercase font-mono text-gray-500 tracking-widest mt-1">Sovereign Flagship Assistant</div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowClearConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-gray-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
              <RotateCcw size={14} /> Clear Session
           </button>
           <button onClick={() => setShowSecurityModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-gray-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
              <Settings size={14} /> Security Level
           </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Main Chat Interface */}
        <div className="flex-1 bg-[#030712] border border-slate-800 rounded-3xl flex flex-col overflow-hidden relative">
           
           <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SovereignMind Core (Top Secret Enclave)
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Maximize2 size={16} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-20 text-gray-500 text-sm font-mono opacity-50">
                   Session Cleared. Ready for new input...
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id}>
                  {msg.role === 'user' && (
                    <div className="flex items-start gap-4 flex-row-reverse mt-6">
                       <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                         <span className="text-xs font-bold text-gray-300">P</span>
                       </div>
                       <div className="space-y-2 max-w-2xl">
                         <div className="flex items-baseline gap-2 justify-end">
                            <span className="text-[9px] font-mono text-gray-500">OPERATOR INPUT</span>
                            <span className="text-sm font-bold text-white">President</span>
                         </div>
                         <div className="p-4 rounded-2xl bg-pink-600 border border-pink-500 text-sm text-white leading-relaxed shadow-sm">
                           {msg.content}
                         </div>
                       </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="flex items-start gap-4 mt-6">
                       <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                         <Bot size={16} className="text-purple-400" />
                       </div>
                       <div className="space-y-2 max-w-3xl">
                         <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-purple-300">Executive Advisor</span>
                            <span className="text-[9px] font-mono text-gray-500">ANALYSIS COMPLETE</span>
                         </div>
                         <div 
                           className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-gray-300 leading-relaxed shadow-sm space-y-4"
                           dangerouslySetInnerHTML={{ __html: msg.content }}
                         />
                       </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-4 mt-6">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                     <Bot size={16} className="text-purple-400" />
                   </div>
                   <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-gray-300 flex items-center gap-2 shadow-sm">
                     <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input Area */}
           <div className="p-4 bg-slate-900 border-t border-slate-800">
             <form onSubmit={handleSendMessage} className="relative flex items-center">
               <textarea 
                 rows={1}
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSendMessage();
                   }
                 }}
                 placeholder="Ask your persistent AI advisor..." 
                 className="w-full bg-[#030712] border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500 resize-none overflow-hidden"
               />
               <button type="submit" disabled={!inputText.trim()} className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20 cursor-pointer">
                 <Zap size={16} />
               </button>
             </form>
           </div>

        </div>

        {/* Sidebar Context Grounding */}
        <div className="w-80 space-y-4 flex flex-col">
           <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5 flex flex-col flex-1">
             <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Shield size={14} className="text-emerald-400" /> Active Engines
             </h4>
             <p className="text-xs text-gray-500 mb-6 leading-relaxed">
               The copilot is instantly accessing all platform engines to synthesize executive-grade reports.
             </p>
             
             <div className="space-y-2">
                <ContextItem name="National Digital Twin" active onClick={() => setSelectedEngine('National Digital Twin')} />
                <ContextItem name="Sovereign Intelligence Graph" active onClick={() => setSelectedEngine('Sovereign Intelligence Graph')} />
                <ContextItem name="Synthetic Sandbox" active onClick={() => setSelectedEngine('Synthetic Sandbox')} />
                <ContextItem name="Constitutional DB" active onClick={() => setSelectedEngine('Constitutional DB')} />
                <ContextItem name="Global Vendor Networks" active onClick={() => setSelectedEngine('Global Vendor Networks')} />
             </div>

             <div className="mt-auto pt-6 border-t border-slate-800">
               <button onClick={() => setShowModelModal(true)} className="w-full py-2 bg-slate-900 border border-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                 Manage Model Integrations
               </button>
             </div>
           </div>
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
              <h3 className="text-white font-bold text-lg mb-2">Clear Session?</h3>
              <p className="text-gray-400 text-xs mb-6">Are you sure you want to clear this session? Context memory will be flushed.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition cursor-pointer">Cancel</button>
                <button onClick={clearSession} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 transition cursor-pointer">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}

        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowSecurityModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Shield size={18} className="text-emerald-400" /> Security Level</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Current Clearance</div>
                  <div className="text-sm font-semibold text-white">Quantum Level 4 Overseer</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Permission Scope</div>
                  <div className="text-sm font-semibold text-emerald-400">Global Read/Write, Nuclear Access</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-2">Active Access Domains</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-slate-800 border border-slate-600 text-[10px] rounded text-gray-300">Constitutional DB</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-600 text-[10px] rounded text-gray-300">Sovereign Intel</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-600 text-[10px] rounded text-gray-300">Defense Mesh</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showModelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setShowModelModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Brain size={18} className="text-purple-400" /> Integration Manager</h3>
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                {['Gemini 3.1 Pro', 'Constitutional RAG Engine', 'National Open Source LLM', 'Crisis Prediction Transformer'].map(model => (
                  <div key={model} className="p-4 bg-[#030712] rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-white">{model}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">🟢 Connected & Validated</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => model === 'Crisis Prediction Transformer' ? triggerTraining() : null}
                        disabled={isTraining && model === 'Crisis Prediction Transformer'}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition cursor-pointer disabled:opacity-50"
                      >
                        {isTraining && model === 'Crisis Prediction Transformer' ? 'Training...' : 'Test'}
                      </button>
                      <button className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-400 rounded transition cursor-pointer">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Training Results Box */}
              {trainingResult && (
                <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <h4 className="text-sm font-bold text-white mb-2">Deep Learning Engine Activated</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div><span className="text-purple-400 font-mono">Status:</span> {trainingResult.status}</div>
                    <div><span className="text-purple-400 font-mono">Calibrated Accuracy:</span> {(trainingResult.accuracy * 100).toFixed(1)}%</div>
                    <div><span className="text-purple-400 font-mono">Message:</span> {trainingResult.message}</div>
                    <div className="pt-2 text-[9px] text-gray-500 font-mono break-all">{trainingResult.weights_path}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-500 transition shadow-lg shadow-pink-500/20 w-full cursor-pointer">Add Integration</button>
                <button onClick={() => setShowModelModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition w-full cursor-pointer">Save Config</button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedEngine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
              <button onClick={() => setSelectedEngine(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"><X size={16} /></button>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-pink-400" /> {selectedEngine}</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-gray-400">Status</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-gray-400">Uptime</span>
                  <span className="text-xs text-white font-mono">99.998%</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-gray-400">Health Score</span>
                  <span className="text-xs text-white font-mono">100/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Usage Metrics</span>
                  <span className="text-xs text-white font-mono">24M Ops/s</span>
                </div>
              </div>
              <button onClick={() => setSelectedEngine(null)} className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer">Close Panel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContextItem({ name, active, onClick }: { name: string, active: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${active ? 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40' : 'bg-transparent border-slate-800 hover:border-slate-700'}`}>
       <div className="flex items-center gap-2">
         <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]' : 'bg-slate-700'}`} />
         <span className={`text-xs font-medium ${active ? 'text-indigo-200' : 'text-gray-500'}`}>{name}</span>
       </div>
       <ChevronRight size={14} className="text-gray-600" />
    </div>
  )
}
