import { Shield, Twitter, Linkedin, Github, Mail, ArrowRight, Activity, Asterisk, Hexagon, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';

export function Footer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'platform', label: 'Platform' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'company', label: 'Company' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="w-full bg-[#010101] border-t border-white/5 pt-32 pb-10 px-6 md:px-12 lg:px-16 mt-auto relative overflow-hidden text-white rounded-t-[3rem]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent blur-sm" />
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Newsletter & Manifesto Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-950/20 border border-pink-500/20 text-pink-400 text-[10px] font-mono tracking-widest uppercase rounded-full">
                <Asterisk size={12} className="animate-spin-slow" /> Stay Secure
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 text-gray-400 text-[10px] font-mono tracking-widest uppercase rounded-full">
                <Clock size={12} /> {time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
              A peaceful future <br />
              <span className="font-semibold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent italic">
                starts with preparation.
              </span>
            </h2>
            <p className="text-sm font-sans text-gray-400 max-w-md leading-relaxed">
              Join our global intelligence briefing. Delivered bi-weekly with zero telemetry, zero-knowledge storage, and completely encrypted delivery.
            </p>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div className="liquid-glass border border-white/5 p-6 rounded-3xl bg-[#030303] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest pl-1 font-semibold block">Secure Comms Channel</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 hover:border-white/20 focus:border-pink-500/50 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className={`w-full py-3 rounded-xl text-xs font-semibold tracking-widest font-mono uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubscribed 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isSubscribed ? (
                    <>Encrypted & Received</>
                  ) : (
                    <>
                      Initialize Uplink <ArrowRight size={14} />
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 justify-center text-[9px] font-mono text-gray-500 uppercase tracking-widest pt-2">
                  <Shield size={10} className="text-pink-400" /> End-to-end encrypted protocol
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/5 mb-16" />

        {/* Main Footer Links & Branding */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="col-span-1 md:col-span-4 lg:col-span-3 space-y-8">
            <div 
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-2xl md:text-3xl font-semibold tracking-tight text-white cursor-pointer hover:opacity-90 inline-flex items-center gap-3 transition-opacity group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="text-pink-400" size={20} />
              </div>
              Sovereign Mind
            </div>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              We design offline-first continuity systems. 
              Beautiful, resilient, and completely self-sufficient architecture for families, institutions, and the builders of tomorrow.
            </p>
            
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-5 text-left">
            <h4 className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold mb-6">Capabilities</h4>
            <ul className="space-y-3">
              {[
                { label: 'Water Security', url: '#' },
                { label: 'Energy Buffers', url: '#' },
                { label: 'Physical Defenses', url: '#' },
                { label: 'Digital Privacy', url: '#' },
                { label: 'Health Reserves', url: '#' }
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.url} className="text-sm font-sans text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-pink-500/0 hover:bg-pink-500/50 transition-colors block" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2 text-left">
            <h4 className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold mb-6">Exploration</h4>
            <ul className="space-y-3">
              {tabs.slice(0, 3).map(tab => (
                <li key={tab.id}>
                  <button 
                    onClick={() => {
                      onNavigate(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm font-sans text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-pink-500/0 hover:bg-pink-500/50 transition-colors block" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2 text-left">
            <h4 className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold mb-6">Organization</h4>
            <ul className="space-y-3">
              {tabs.slice(3).map(tab => (
                <li key={tab.id}>
                  <button 
                    onClick={() => {
                      onNavigate(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm font-sans text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-pink-500/0 hover:bg-pink-500/50 transition-colors block" />
                    {tab.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onNavigate('signin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm font-sans text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-pink-500/0 hover:bg-pink-500/50 transition-colors block" />
                  Operator Sign In
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-left">
            <h4 className="text-[11px] font-mono text-white uppercase tracking-widest font-semibold mb-6">Operations Hub</h4>
            <ul className="space-y-5">
              <li>
                <span className="text-sm font-sans text-gray-400 flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <Hexagon size={18} className="text-indigo-400 mt-1 shrink-0" />
                  <span>
                    <strong className="text-white block font-medium">Sector 4 Node</strong>
                    Geneva, Switzerland<br/>CH-1200 Global Grid
                  </span>
                </span>
              </li>
              <li>
                <span className="text-sm font-sans text-gray-400 flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <span className="flex items-center gap-3">
                    <Activity size={16} className="text-pink-400 shrink-0" />
                    <span>System Status:</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-pink-400 bg-pink-950/40 px-2 py-1 border border-pink-500/30 rounded-md">100% SECURE</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Live Network Stream */}
        <div className="w-full mt-16 mb-8 py-4 border-y border-white/5 bg-white/[0.01] overflow-hidden flex relative select-none">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#010101] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#010101] to-transparent z-10" />
          
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="flex items-center gap-12 whitespace-nowrap text-[10px] font-mono text-gray-600 uppercase tracking-widest"
          >
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> GENEVA HUB: SECURE </span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> TOKYO BACKUP: IDLE </span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> NEW YORK RELAY: ACTIVE </span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> BERLIN NODE: ENCRYPTED </span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> SYDNEY GATEWAY: SECURE </span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Decorative Giant Text */}
        <div className="w-full mt-24 mb-6 select-none overflow-hidden flex justify-center pointer-events-none">
          <h1 className="text-[15vw] leading-none font-bold tracking-tighter text-white uppercase">
            Resilience
          </h1>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
           <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p className="flex items-center gap-2 opacity-80 text-white">
               <span className="text-pink-500 text-sm">&copy;</span> 2026 Sovereign Mind Ecosystem
             </p>
             <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20" />
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 opacity-60"><Shield size={10} /> Swiss Data Protection Act Compliant</span>
             </div>
           </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="hover:text-pink-300 hover:underline transition-all">Privacy Protocol</a>
            <a href="#" className="hover:text-pink-300 hover:underline transition-all">Terms of Service</a>
            <a href="#" className="hover:text-pink-300 hover:underline transition-all">Data Sovereignty</a>
            <a href="#" className="hover:text-pink-300 hover:underline transition-all hidden md:inline-block">Cookie Config</a>
            <a href="#" className="hover:text-pink-300 hover:underline transition-all hidden md:inline-block">Certifications</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
