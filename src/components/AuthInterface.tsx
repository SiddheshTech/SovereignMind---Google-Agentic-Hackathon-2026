import React, { useState } from 'react';
import { Mail, Lock, Key, CheckCircle2, Shield, AlertOctagon, Fingerprint, Activity, Hexagon } from 'lucide-react';

export function AuthInterface({ onLogin, onNavigateToSignup }: { onLogin: (user: any) => void, onNavigateToSignup: () => void }) {
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin({
        name: 'Clara Oswald',
        institution: 'Schwyz Logistics Depots',
        clearanceLevel: 'Quantum Level 4 Overseer (Admin)',
        enclaveRegion: 'Alpine Sector-12 Tactical Enclave'
      });
    }, 1200);
  };

  return (
    <div id="signin-view" className="w-full pt-32 pb-24 bg-[#030303] min-h-[90vh] flex items-center">
      <section className="px-6 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* LEFT COLUMN: THE LOGIN TERMINAL */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="liquid-glass border border-white/10 p-8 md:p-10 rounded-3xl relative flex-grow flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Interactive glow effects */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] bg-sky-950/60 border border-sky-500/30 text-sky-400 font-mono py-1 px-2.5 rounded-full uppercase tracking-wider">
                      Secure Authentication
                    </span>
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">Sign In to Sovereign Mind</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Verify your identity to access the global intelligence network and review operational dashboards.
                  </p>
                </div>

                {/* Quick Preset Login Simulator Options */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-semibold">
                      DEMO TEMPLATES (ONE-CLICK LOGIN)
                    </span>
                    <span className="text-[9px] font-mono text-sky-400 uppercase">Quick Fill Form</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthEmail('a.pendelton@solar-cooperative.ch');
                        setAuthPassword('zurich-solar-grid-990');
                        setAuthError('');
                      }}
                      className="bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-400/40 rounded-lg p-2.5 transition-all text-left group cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-sky-300 group-hover:text-sky-200">Arthur Pendelton</div>
                      <div className="text-[9px] font-mono text-gray-500">Solar Cooperative Lead</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthEmail('c.oswald@schwyz-logistique.ch');
                        setAuthPassword('secure-silo-cleared-32');
                        setAuthError('');
                      }}
                      className="bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-400/40 rounded-lg p-2.5 transition-all text-left group cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">Clara Oswald</div>
                      <div className="text-[9px] font-mono text-gray-500">Logistics Administrator</div>
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2.5 animate-pulse">
                    <AlertOctagon size={14} className="flex-shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-600"
                          placeholder="e.g. e.vance@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-600"
                          placeholder="••••••••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 pb-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="remember-device"
                        type="checkbox"
                        className="accent-pink-400 w-4 h-4 cursor-pointer rounded"
                      />
                      <label htmlFor="remember-device" className="text-[11px] text-gray-400 select-none cursor-pointer font-sans">
                        Remember this device
                      </label>
                    </div>
                    <button type="button" className="text-[11px] text-pink-400 hover:text-pink-300 font-mono transition-colors font-semibold">
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-white text-black py-3.5 hover:bg-gray-200 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        <span className="font-mono text-[11px] uppercase">Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        <span>Initialize Secure Session</span>
                        <Key size={12} className="text-pink-500" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-6 border-t border-white/5 mt-5">
                  <p className="text-xs text-gray-400 font-sans">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError('');
                        onNavigateToSignup();
                      }}
                      className="text-pink-400 hover:text-pink-300 hover:underline cursor-pointer font-semibold font-mono"
                    >
                      SIGN UP
                    </button>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: LOGIN SAFEGUARDS SECURE DATA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="liquid-glass border border-white/10 p-6 md:p-8 rounded-3xl space-y-5 relative overflow-hidden flex-grow flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4">
                <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase block border-b border-white/5 pb-2">ACTIVE SESSION PROTOCOLS</span>
                
                <div className="space-y-3">
                  <h4 className="text-base font-light text-white leading-snug">
                    Zero-Knowledge Architecture
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Access localized data indicators, path routing simulations, and community organization tools designed with next-generation privacy and Swiss confidentiality practices.
                  </p>
                </div>
              </div>

              {/* Interactive security block */}
              <div className="space-y-3 font-mono text-[10.5px] text-gray-400">
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-pink-400" size={16} />
                  <span>Biometric multi-factor protocols active</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-pink-400" size={16} />
                  <span>End-to-end encrypted session stream</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="text-pink-400" size={16} />
                  <span>Continuous live threat assessment online</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-xs text-gray-500 font-sans">
                Sovereign Mind guarantees zero-knowledge configuration infrastructure. All metrics reside with industry-standard security and strict data protection keys.
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
