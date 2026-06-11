import { useState, FormEvent, useRef, useEffect } from 'react';
import { Menu, X, Send, Mail, Phone, MapPin, CheckCircle2, Shield, Lock, Key, Cpu, Globe, Activity, LogOut, User, Server, Radio, Database, Bell, Sliders, Play, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { FadeIn } from './components/FadeIn';
import { AnimatedHeading } from './components/AnimatedHeading';
import { ScrollReveal } from './components/ScrollReveal';
import { RiskTimeline } from './components/RiskTimeline';
import { CoreSimulation } from './components/CoreSimulation';
import { BentoResilience } from './components/BentoResilience';
import { GlobalNetwork } from './components/GlobalNetwork';
import { ForesightCalculator } from './components/ForesightCalculator';
import { PricingPage } from './components/PricingPage';
import { ResilienceWorkflowLine } from './components/ResilienceWorkflowLine';
import { HomeNarrative } from './components/HomeNarrative';
import { CinematicPreloader } from './components/CinematicPreloader';
import { SpaceImmersionCanvas } from './components/SpaceImmersionCanvas';
import { PlatformPage } from './components/PlatformPage';
import { SolutionsPage } from './components/SolutionsPage';
import { CompanyPage } from './components/CompanyPage';
import { ContactPage } from './components/ContactPage';
import { AuthInterface } from './components/AuthInterface';
import { OperatorDashboard } from './components/OperatorDashboard';

import { DashboardSidebar } from './components/DashboardSidebar';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup'>('home');
  const [dashboardActiveTab, setDashboardActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Secure Authentication States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authInstitution, setAuthInstitution] = useState('');
  const [authClearance, setAuthClearance] = useState('Sector Level 3 Planner');
  const [authAgreement, setAuthAgreement] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    institution: string;
    clearanceLevel: string;
    enclaveRegion: string;
  } | null>(null);

  // Simulated Dashboard State Controls
  const [waterStatus, setWaterStatus] = useState<'Stable' | 'Critical' | 'Dynamic Optimization'>('Stable');
  const [cropReserveDays, setCropReserveDays] = useState(180);
  const [solarGridLoad, setSolarGridLoad] = useState(74);
  const [activeEnclaveNode, setActiveEnclaveNode] = useState('Alpine S-12 Bunker');
  const [securityLogs, setSecurityLogs] = useState<string[]>([
    'Secure communication channel established',
    'Geneva registry node ping: 4.2ms',
    'Lattice decryption certificates validated'
  ]);
  const [terminalCommand, setTerminalCommand] = useState('');

  const workflowContainerRef = useRef<HTMLDivElement>(null);
  const solutionsContainerRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress on the window for beautiful cinematic hero parallax effects
  const { scrollY } = useScroll();
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.25]);
  const bgOpacity = useTransform(scrollY, [0, 800], [1, 0.25]);
  const heroY = useTransform(scrollY, [0, 800], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0]);

  // Floating extra background elements with distinct parallax ratios
  const layerRingY = useTransform(scrollY, [0, 850], [0, -220]);
  const layerRingRotate = useTransform(scrollY, [0, 850], [0, 120]);
  const layerGridY = useTransform(scrollY, [0, 850], [0, -70]);

  // Seamlessly snap viewport to top on page switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  // Capture scrolling depth dynamically to evolve header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore user session on mount if JWT token exists
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('sovereignmind_token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            setLoggedInUser({
              name: data.user.fullName,
              institution: data.user.company || 'SovereignMind Operator',
              clearanceLevel: data.user.role || 'Sector Level 3 Planner',
              enclaveRegion: data.user.enclaveRegion || 'Alpine Sector-12 Tactical Enclave',
            });
            setActiveTab('signin');
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem('sovereignmind_token');
          localStorage.removeItem('sovereignmind_user');
        }
      } catch (err) {
        console.error('Failed to verify session with backend:', err);
        // Fallback to locally stored user info if we are offline
        const savedUserStr = localStorage.getItem('sovereignmind_user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            setLoggedInUser({
              name: savedUser.fullName || savedUser.name,
              institution: savedUser.company || savedUser.institution || 'SovereignMind Operator',
              clearanceLevel: savedUser.role || savedUser.clearanceLevel || 'Sector Level 3 Planner',
              enclaveRegion: savedUser.enclaveRegion || 'Alpine Sector-12 Tactical Enclave',
            });
            setActiveTab('signin');
          } catch (e) {
            // ignore
          }
        }
      }
    };

    verifySession();
  }, []);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (contactEmail && contactName) {
      setFormSubmitted(true);
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'platform', label: 'Platform' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'company', label: 'Company' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isPreloaderComplete && (
          <CinematicPreloader onComplete={() => setIsPreloaderComplete(true)} />
        )}
      </AnimatePresence>

      <main className="relative w-full min-h-screen text-white bg-[#030303] overflow-x-hidden select-none">
        
        {/* Header (Sticky / Fixed) Navigation */}
        {!loggedInUser && (
          <header className={`fixed top-0 left-0 right-0 px-6 md:px-12 lg:px-16 z-50 transition-all duration-500 ${
            isScrolled ? 'pt-3 pb-1' : 'pt-6 pb-2'
          }`}>
            <nav 
              id="main-navbar" 
              className={`transition-all duration-500 flex items-center justify-between border ${
                isScrolled 
                  ? 'liquid-glass backdrop-blur-xl bg-black/60 border-white/10 rounded-2xl px-5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]' 
                  : 'backdrop-blur-xl bg-black/40 border-white/10 rounded-2xl px-6 py-4'
              }`}
            >
              {/* Left - Logo */}
              <div 
                id="logo-vex" 
                onClick={() => setActiveTab('home')}
                className="text-xl md:text-2xl font-semibold tracking-tight text-white cursor-pointer hover:opacity-90 transition-opacity"
              >
                Sovereign Mind
              </div>

              {/* Center Links */}
              <div id="navbar-links" className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-wider uppercase">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`nav-link-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative py-1.5 transition-colors duration-200 cursor-pointer ${
                        isActive ? 'text-pink-400 font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-pink-400 shadow-[0_0_8px_#f472b6]"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right - Actions */}
              <div className="flex items-center gap-3">
                <div id="navbar-auth-actions" className="hidden sm:flex items-center gap-4">
                  <button
                    id="btn-navbar-signin"
                    onClick={() => setActiveTab('signin')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all duration-200 cursor-pointer border ${
                      activeTab === 'signin'
                        ? 'bg-white text-black border-white hover:bg-gray-100'
                        : 'bg-black text-white border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="btn-navbar-signup"
                    onClick={() => setActiveTab('signup')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all duration-200 cursor-pointer border ${
                      activeTab === 'signup'
                        ? 'bg-white text-black border-white hover:bg-gray-100'
                        : 'bg-black text-white border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-gray-300 focus:outline-none cursor-pointer p-1"
              aria-label="Toggle Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer Panel */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-[#0A0A0A] border-l border-white/10 p-6 flex flex-col gap-5 z-[70] animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
              <span className="font-semibold text-lg text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 focus:outline-none"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`mobile-nav-link-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-base py-2 border-b border-white/5 transition-colors cursor-pointer ${
                      isActive ? 'text-pink-400 font-medium' : 'text-white hover:text-gray-350'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/10">
              <button
                id="mobile-btn-signin"
                onClick={() => {
                  setActiveTab('signin');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition-all cursor-pointer border ${
                  activeTab === 'signin'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white/10 hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                id="mobile-btn-signup"
                onClick={() => {
                  setActiveTab('signup');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition-all cursor-pointer border ${
                  activeTab === 'signup'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white/10 hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>
        )}

      {/* Pages Content Switching with Elegant Motion crossfall transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="w-full"
        >
          {activeTab === 'home' && (
            <div id="home-view" className="w-full">
              {/* Home Majestic Hero Frame with dynamic scroll background scaling */}
              <section className="relative w-full h-screen flex flex-col justify-end pb-12 lg:pb-16 px-6 md:px-12 lg:px-16 overflow-hidden isolate">
                <motion.video
                  id="bg-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ scale: bgScale, opacity: bgOpacity }}
                  className="absolute inset-0 w-full h-full object-cover -z-10 origin-center"
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
                />
                
                {/* 1. Deep Parallax Grid Background Layer (moving sluggishly with scroll) */}
                <motion.div 
                  style={{ y: layerGridY, opacity: heroOpacity }}
                  className="absolute inset-0 bg-gradient-to-t from-[#030303] via-black/40 to-black/60 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] -z-10 pointer-events-none"
                />

                {/* 2. Floating rotating glowing vector SVG ring layer (moving and rotating at different speed) */}
                <motion.div
                  style={{ y: layerRingY, rotate: layerRingRotate, opacity: heroOpacity }}
                  className="absolute top-[10%] right-[8%] w-[400px] h-[400px] text-pink-400/[0.04] pointer-events-none -z-10 hidden lg:block"
                >
                  <svg className="w-full h-full animate-pulse" style={{ animationDuration: '8s' }} viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.8" strokeDasharray="16 12" />
                    <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                    <polygon points="100,20 180,140 20,140" stroke="currentColor" strokeWidth="0.3" />
                  </svg>
                </motion.div>

                <SpaceImmersionCanvas />

                <motion.div 
                  style={{ y: heroY, opacity: heroOpacity }}
                  className="w-full lg:grid lg:grid-cols-12 lg:items-end gap-8 relative z-20"
                >
                  {/* Action content block with simple understandable wording */}
                  <div className="flex flex-col lg:col-span-8">
                    <AnimatedHeading
                      id="hero-heading"
                      text={"Smarter Planning.\nStronger Communities. Zero Crises."}
                      className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-light mb-4 text-white leading-tight"
                    />

                    <FadeIn id="hero-subheading-container" delayMs={600} durationMs={800}>
                      <p id="hero-subheading" className="text-base md:text-lg text-gray-350 mb-5 max-w-2xl font-light leading-relaxed">
                        SovereignMind is a collaborative preparation platform that helps municipal councils, agricultural groups, and local water cooperatives coordinate drinking water safeguards, crop reserves, and backup solar networks ahead of upcoming seasons.
                      </p>
                    </FadeIn>

                    <FadeIn id="hero-buttons-container" delayMs={900} durationMs={800}>
                      <div id="hero-buttons" className="flex flex-wrap gap-4 items-center">
                        <button
                          onClick={() => setActiveTab('platform')}
                          id="btn-hero-primary-start"
                          className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm md:text-base flex items-center justify-center shadow-lg"
                        >
                          Get Started
                        </button>
                        <button
                          onClick={() => setActiveTab('solutions')}
                          id="btn-hero-explore"
                          className="liquid-glass border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer text-sm md:text-base flex items-center justify-center"
                        >
                          Explore Platform
                        </button>
                      </div>
                    </FadeIn>
                  </div>

                  {/* Absolute Badge Panel - styled with clean, simple attributes */}
                  <div className="mt-8 lg:mt-0 flex items-end justify-start lg:justify-end lg:col-span-4">
                    <FadeIn id="glass-card-tag-container" delayMs={1100} durationMs={800}>
                      <div id="glass-card-tag" className="liquid-glass border border-white/20 px-6 py-3.5 rounded-2xl">
                        <span className="text-xs md:text-sm font-mono text-pink-400 tracking-wider">
                          Water Protection • Food Corridors • Local Solar Buffers
                        </span>
                      </div>
                    </FadeIn>
                  </div>
                </motion.div>
              </section>

              {/* Core Home Narrative Sections 2 to 10 */}
              <HomeNarrative onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}

          {activeTab === 'platform' && (
            <PlatformPage onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}

          {activeTab === 'solutions' && (
            <SolutionsPage onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}

          {activeTab === 'company' && (
            <CompanyPage onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}

          <div className={activeTab === 'pricing' ? 'block' : 'hidden'}>
            <PricingPage onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>

          {activeTab === 'contact' && (
            <ContactPage onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}

          <div className={activeTab === 'signin' ? 'block' : 'hidden'}>
            <>
              {loggedInUser ? (
                <div id="dashboard-view" className="w-full min-h-screen bg-[#030303] flex animate-in fade-in duration-500">
                  <DashboardSidebar 
                    activeItem={dashboardActiveTab} 
                    setActiveItem={setDashboardActiveTab}
                    user={loggedInUser} 
                    onUpgrade={() => setActiveTab('pricing')}
                    onLogout={() => {
                      localStorage.removeItem('sovereignmind_token');
                      localStorage.removeItem('sovereignmind_user');
                      setLoggedInUser(null);
                      setActiveTab('home');
                    }} 
                  />
                  <OperatorDashboard user={loggedInUser} activeItem={dashboardActiveTab} onNavigate={setDashboardActiveTab} />
                </div>
            ) : (
                <div id="signin-view" className="w-full relative min-h-screen">
                  <AuthInterface 
                    onLogin={(user) => {
                      setLoggedInUser(user);
                      setActiveTab('signin'); 
                    }} 
                    onNavigateToSignup={() => setActiveTab('signup')}
                  />
                </div>
              )}
            </>
          </div>

          {activeTab === 'signup' && (
            <div id="signup-view" className="w-full pt-32 pb-24 bg-[#030303] min-h-[90vh] flex items-center">
              <section className="px-6 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
                {loggedInUser ? (
                  /* Operator Dashboard direct redirect */
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="text-center py-12 liquid-glass border border-white/10 rounded-2xl space-y-4 max-w-md mx-auto">
                      <CheckCircle2 size={40} className="text-pink-400 mx-auto" />
                      <h3 className="text-xl text-white">Registered & Logged In Successfully</h3>
                      <button
                        onClick={() => setActiveTab('signin')}
                        className="bg-white text-black text-xs font-mono font-bold uppercase tracking-wider px-6 py-2.5 rounded hover:bg-gray-150 transition-all cursor-pointer"
                      >
                        Launch Interactive Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================= */
                  /* PREMIUM DUAL-PANE SIGN UP INTERFACE                        */
                  /* ========================================================= */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch animate-in fade-in slide-in-from-bottom-6 duration-500">
                    {/* LEFT COLUMN: THE REGISTRATION TERMINAL */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div className="liquid-glass border border-white/10 p-8 md:p-10 rounded-3xl relative flex-grow flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        {/* Interactive glow effects */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] bg-sky-950/60 border border-sky-500/30 text-sky-450 font-mono py-1 px-2.5 rounded-full uppercase tracking-wider">
                                Create Your Account
                              </span>
                              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">Sign Up for Sovereign Mind</h3>
                            <p className="text-xs text-gray-400 font-sans leading-relaxed">
                              Fill in your information to register as a local planner. You can also pick a pre-set template to try it immediately.
                            </p>
                          </div>

                          {/* Quick Preset Register Simulator Options */}
                          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-semibold">
                                DEMO TEMPLATES (ONE-CLICK REGISTER)
                              </span>
                              <span className="text-[9px] font-mono text-sky-400 uppercase">Quick Fill Form</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthName('Arthur Pendelton');
                                  setAuthInstitution('Zurich Solar Grid Cooperative');
                                  setAuthEmail('a.pendelton@solar-cooperative.ch');
                                  setAuthPassword('zurich-solar-grid-990');
                                  setAuthClearance('Federal Reserve Custodian');
                                  setAuthAgreement(true);
                                  setAuthError('');
                                }}
                                className="bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-400/40 rounded-lg p-2.5 transition-all text-left group cursor-pointer"
                              >
                                <div className="text-xs font-semibold text-sky-300 group-hover:text-sky-200">Arthur Pendelton</div>
                                <div className="text-[9px] font-mono text-gray-550">Solar Cooperative Lead</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthName('Clara Oswald');
                                  setAuthInstitution('Schwyz Logistics Depots');
                                  setAuthEmail('c.oswald@schwyz-logistique.ch');
                                  setAuthPassword('secure-silo-cleared-32');
                                  setAuthClearance('Quantum Level 4 Overseer (Admin)');
                                  setAuthAgreement(true);
                                  setAuthError('');
                                }}
                                className="bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-400/40 rounded-lg p-2.5 transition-all text-left group cursor-pointer"
                              >
                                <div className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">Clara Oswald</div>
                                <div className="text-[9px] font-mono text-gray-550">Logistics Administrator</div>
                              </button>
                            </div>
                          </div>

                          {authError && (
                            <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-red-350 text-xs rounded-xl flex items-center gap-2.5 animate-pulse">
                              <AlertOctagon size={14} className="flex-shrink-0 text-red-400" />
                              <span>{authError}</span>
                            </div>
                          )}

                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (!authName.trim()) {
                                setAuthError('Full name is required.');
                                return;
                              }
                              if (!authInstitution.trim()) {
                                setAuthError('Company / Organization is required.');
                                return;
                              }
                              if (!authEmail.trim()) {
                                setAuthError('Email address is required.');
                                return;
                              }
                              if (!authPassword || authPassword.length < 6) {
                                setAuthError('Password must be at least 6 characters.');
                                return;
                              }
                              if (!authAgreement) {
                                setAuthError('Please agree to the privacy and security terms to proceed.');
                                return;
                              }

                              setAuthError('');
                              setIsAuthenticating(true);

                              try {
                                const response = await fetch('http://localhost:4000/api/auth/signup', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    fullName: authName.trim(),
                                    email: authEmail.trim(),
                                    password: authPassword,
                                    company: authInstitution.trim(),
                                    role: authClearance,
                                    agreedToTerms: authAgreement,
                                  }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                  setAuthError(data.error || 'Registration failed. Please try again.');
                                  setIsAuthenticating(false);
                                  return;
                                }

                                // Store JWT token
                                if (data.token) {
                                  localStorage.setItem('sovereignmind_token', data.token);
                                  localStorage.setItem('sovereignmind_user', JSON.stringify(data.user));
                                }

                                setIsAuthenticating(false);
                                setLoggedInUser({
                                  name: data.user.fullName,
                                  institution: data.user.company || authInstitution,
                                  clearanceLevel: data.user.role || authClearance,
                                  enclaveRegion: data.user.enclaveRegion || 'Alpine Sector-12 Tactical Enclave',
                                });
                              } catch (err: any) {
                                console.error('Signup network error:', err);
                                setAuthError('Unable to connect to server. Please ensure the backend is running on port 4000.');
                                setIsAuthenticating(false);
                              }
                            }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                                  Full Name
                                </label>
                                <div className="relative">
                                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    required
                                    value={authName}
                                    onChange={(e) => setAuthName(e.target.value)}
                                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-650"
                                    placeholder="e.g. Clara Oswald"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                                  Company / Organization
                                </label>
                                <div className="relative">
                                  <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    required
                                    value={authInstitution}
                                    onChange={(e) => setAuthInstitution(e.target.value)}
                                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-650"
                                    placeholder="e.g. Swiss Hydrological Cooperative"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-655"
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
                                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none transition-all placeholder-gray-655"
                                    placeholder="••••••••••••••"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wide block">
                                  Clearance Level (Role)
                                </label>
                                <div className="relative">
                                  <Shield size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                  <select
                                    value={authClearance}
                                    onChange={(e) => setAuthClearance(e.target.value)}
                                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 text-white rounded-xl p-3 pl-9 text-xs focus:outline-none focus:border-pink-500/50 transition-all appearance-none cursor-pointer"
                                  >
                                    <option value="Sector Level 3 Planner" className="bg-[#030303] text-white">Sector Level 3 Planner</option>
                                    <option value="Federal Reserve Custodian" className="bg-[#030303] text-white">Federal Reserve Custodian</option>
                                    <option value="Quantum Level 4 Overseer (Admin)" className="bg-[#030303] text-white">Quantum Level 4 Overseer (Admin)</option>
                                    <option value="Logistics Administrator" className="bg-[#030303] text-white">Logistics Administrator</option>
                                    <option value="Regional Water Coordinator" className="bg-[#030303] text-white">Regional Water Coordinator</option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5 pt-1.5">
                              <input
                                id="agree-protocols-premium"
                                type="checkbox"
                                checked={authAgreement}
                                onChange={(e) => setAuthAgreement(e.target.checked)}
                                className="mt-1 accent-pink-455 w-4 h-4 cursor-pointer"
                              />
                              <label htmlFor="agree-protocols-premium" className="text-[11px] text-gray-400 leading-normal select-none cursor-pointer font-sans">
                                I agree to the secure Terms of Service and data privacy policies.
                              </label>
                            </div>

                            <button
                              type="submit"
                              disabled={isAuthenticating}
                              className="w-full bg-white text-black py-3.5 hover:bg-gray-150 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                            >
                              {isAuthenticating ? (
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                                  <span className="font-mono text-[11px] uppercase">Creating your secure profile...</span>
                                </div>
                              ) : (
                                <>
                                  <span>Create Account & Login</span>
                                  <Key size={12} className="text-pink-400" />
                                </>
                              )}
                            </button>
                          </form>
                        </div>

                        <div className="text-center pt-6 border-t border-white/5 mt-5">
                          <p className="text-xs text-gray-400 font-sans">
                            Already have an account?{' '}
                            <button
                              onClick={() => {
                                setAuthError('');
                                setActiveTab('signin');
                              }}
                              className="text-pink-400 hover:text-pink-350 hover:underline cursor-pointer font-semibold font-mono"
                            >
                              LOG IN
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: REGISTRATION SAFEGUARDS DETAILS */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="liquid-glass border border-white/10 p-6 md:p-8 rounded-3xl space-y-5 relative overflow-hidden flex-grow flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-4">
                          <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase block border-b border-white/5 pb-2">SIGN UP BENEFITS</span>
                          
                          <div className="space-y-3">
                            <h4 className="text-base font-light text-white leading-snug">
                              Private, Secure Operations
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-sans">
                              Access localized data indicators, path routing simulations, and community organization tools designed with next-generation privacy and Swiss confidentiality practices.
                            </p>
                          </div>
                        </div>

                        {/* Interactive registration block showing live decryption step process mockups */}
                        <div className="space-y-3 font-mono text-[10.5px] text-gray-400">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 bg-pink-950/50 border border-pink-500/20 text-pink-400 text-[10px] font-semibold flex items-center justify-center rounded-full">1</span>
                            <span>High contrast analytics & visual map tools</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 bg-pink-950/50 border border-pink-500/20 text-pink-400 text-[10px] font-semibold flex items-center justify-center rounded-full">2</span>
                            <span>Alternative offline/online path routing simulations</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 bg-pink-950/50 border border-pink-500/20 text-pink-400 text-[10px] font-semibold flex items-center justify-center rounded-full">3</span>
                            <span>Fully localized storage with strict privacy protection</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 text-xs text-slate-500 font-sans">
                          Sovereign Mind guarantees zero-knowledge configuration infrastructure. All metrics reside with industry-standard security and strict data protection keys.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!loggedInUser && <Footer onNavigate={(tab: any) => setActiveTab(tab)} />}

    </main>
  </>
);
}
