import React, { useState } from 'react';
import { Mail, Lock, Key, Shield, AlertOctagon, Fingerprint, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:4000/api/auth';

export function AuthInterface({
  onLogin,
  onNavigateToSignup,
}: {
  onLogin: (user: any) => void;
  onNavigateToSignup: () => void;
}) {
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authEmail.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    if (!authPassword) {
      setAuthError('Please enter your password.');
      return;
    }

    setAuthError('');
    setIsAuthenticating(true);

    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail.trim(),
          password: authPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || 'Sign in failed. Please check your credentials.');
        setIsAuthenticating(false);
        return;
      }

      // Persist token in localStorage
      if (data.token) {
        localStorage.setItem('sovereignmind_token', data.token);
        localStorage.setItem('sovereignmind_user', JSON.stringify(data.user));
      }

      onLogin({
        name: data.user.fullName,
        institution: data.user.company || 'SovereignMind Operator',
        clearanceLevel: data.user.role || 'Sector Level 3 Planner',
        enclaveRegion: data.user.enclaveRegion || 'Alpine Sector-12 Tactical Enclave',
        email: data.user.email,
        id: data.user.id,
      });
    } catch (err: any) {
      console.error('Sign in network error:', err);
      setAuthError('Unable to connect to server. Please ensure the backend is running on port 4000.');
    } finally {
      setIsAuthenticating(false);
    }
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
                    Enter your registered credentials to access the intelligence network and operational dashboards.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2.5">
                    <AlertOctagon size={14} className="flex-shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="signin-email" className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          id="signin-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-600"
                          placeholder="e.g. e.vance@company.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label htmlFor="signin-password" className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          id="signin-password"
                          type="password"
                          required
                          autoComplete="current-password"
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
                    <button
                      type="button"
                      className="text-[11px] text-pink-400 hover:text-pink-300 font-mono transition-colors font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    id="btn-signin-submit"
                    disabled={isAuthenticating}
                    className="w-full bg-white text-black py-3.5 hover:bg-gray-200 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                    Your credentials are verified with bcrypt hashing and secure JWT session tokens. No plaintext passwords are ever stored or transmitted.
                  </p>
                </div>
              </div>

              {/* Interactive security block */}
              <div className="space-y-3 font-mono text-[10.5px] text-gray-400">
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-pink-400" size={16} />
                  <span>bcrypt password hashing (12 rounds)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-pink-400" size={16} />
                  <span>JWT session tokens (7-day expiry)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="text-pink-400" size={16} />
                  <span>MongoDB Atlas encrypted storage</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-xs text-gray-500 font-sans">
                SovereignMind guarantees zero-knowledge configuration infrastructure. All credentials reside in secured MongoDB Atlas with industry-standard encryption.
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
