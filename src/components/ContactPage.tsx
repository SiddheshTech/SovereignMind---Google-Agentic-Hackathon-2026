import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  Globe,
  Star,
  Users,
  Heart,
  Droplets,
  Sun
} from 'lucide-react';

export function ContactPage({ onNavigate }: { onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup') => void }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const { scrollYProgress } = useScroll();

  // Scrolling texts
  const marqueeForwardX = useTransform(scrollYProgress, [0, 1], [-300, 500]);
  const marqueeReverseX = useTransform(scrollYProgress, [0, 1], [500, -300]);
  const fastMarqueeX = useTransform(scrollYProgress, [0, 1], [-800, 800]);
  
  // Floating elements
  const floatY = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const fastFloatY = useTransform(scrollYProgress, [0, 1], [0, 1200]);
  const slowFloatY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  
  // Hero section reveal
  const textOpacityA = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textScaleA = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  
  // Highlighting text on scroll
  const highlightA = useTransform(scrollYProgress, [0.3, 0.45], [0.1, 1]);
  const highlightB = useTransform(scrollYProgress, [0.4, 0.55], [0.1, 1]);
  const highlightC = useTransform(scrollYProgress, [0.5, 0.65], [0.1, 1]);
  
  // SVG drawing paths
  const pathLength1 = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 1]), { damping: 20 });
  const pathLength2 = useSpring(useTransform(scrollYProgress, [0.2, 0.8], [0, 1]), { damping: 20 });

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (contactEmail && contactName) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-[#020202] text-white min-h-[300vh] font-sans overflow-hidden relative selection:bg-rose-500 selection:text-white">
      {/* Dynamic Background Gradients */}
      <motion.div style={{ y: slowFloatY }} className="absolute top-0 left-0 w-full h-[150vh] bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.05)_0%,transparent_70%)] pointer-events-none z-0" />
      <motion.div style={{ y: floatY }} className="absolute -top-40 -left-10 w-[50rem] h-[50rem] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <motion.div style={{ y: fastFloatY }} className="absolute top-[30%] -right-20 w-[60rem] h-[60rem] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[60%] left-[10%] w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0 animate-[pulse_8s_ease-in-out_infinite]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-50 z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[120vh] pt-40 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Background Text */}
        <motion.div 
          style={{ y: slowFloatY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <span className="text-[15vw] font-bold text-white/[0.015] tracking-tighter whitespace-nowrap select-none">
            HELLO BEAUTIFUL
          </span>
        </motion.div>

        {/* Animated SVG line */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M -200,200 Q 500,-100 1000,400 T 2500,800" 
              fill="none" 
              stroke="url(#contactGradHero)" 
              strokeWidth="2"
              style={{ pathLength: pathLength1 }}
            />
            <defs>
              <linearGradient id="contactGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.3 }}
           className="relative inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-rose-500/10 to-indigo-500/10 border border-rose-500/20 rounded-full backdrop-blur-md mb-8 z-10 hover:scale-105 transition-transform cursor-default"
        >
          <Heart size={14} className="text-rose-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] font-extrabold text-rose-300">
            Reach Out To Happiness
          </span>
        </motion.div>

        <motion.h1 
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[9rem] font-extralight tracking-tighter text-white leading-[0.85] z-10"
          style={{ opacity: textOpacityA, scale: textScaleA }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          Let's Make <br />
          <span className="font-semibold bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 text-transparent bg-clip-text italic drop-shadow-2xl">
            Life Simple.
          </span>
        </motion.h1>

        {/* Scattered small text elements floating around hero */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1.2, delay: 1 }}
           className="absolute top-1/3 left-10 md:left-32 text-left hidden lg:block z-10"
        >
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Always Listening</span>
          <p className="text-sm font-sans text-gray-400 mt-1 max-w-[150px] italic">We are right here, ready to chat with you.</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1.2, delay: 1.2 }}
           className="absolute bottom-1/4 right-10 md:right-32 text-right hidden lg:block z-10"
        >
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">No Waiting</span>
          <p className="text-sm font-sans text-gray-400 mt-1 max-w-[180px] italic">Your peace of mind is our absolute first priority.</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="mt-12 text-xl md:text-2xl text-gray-400 font-light max-w-3xl leading-relaxed z-10"
        >
          We genuinely care about how you feel every day. Send us a quick note below and let us surround you with everything you beautifully deserve.
        </motion.p>
      </section>

      {/* Fast & Slow Marquees */}
      <section className="py-16 bg-[#000000] border-y border-white/5 overflow-hidden flex flex-col gap-10 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeForwardX }} className="flex items-center gap-20 text-5xl sm:text-8xl font-extralight text-gray-800 uppercase tracking-tighter">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-20">
                <span>Say Hello Beautiful</span>
                <span className="text-rose-500/20">✿</span>
              </span>
            ))}
          </motion.div>
        </div>
        
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeReverseX }} className="flex items-center gap-16 text-4xl sm:text-6xl font-light text-white/5 uppercase tracking-widest italic">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-16">
                <span>Welcome To Our Family</span>
                <span className="text-indigo-500/20">✦</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: fastMarqueeX }} className="flex items-center gap-12 text-xl sm:text-3xl font-mono font-bold text-amber-500/10 uppercase tracking-[0.3em]">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>We Really Care</span>
                <span>You Complete Us</span>
                <span>Reach Out Today</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Massive Scattered Contact Information Block */}
      <section className="py-32 px-6 md:px-12 max-w-[120rem] mx-auto relative z-10">
        
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 2000">
            <motion.path 
              d="M 1000,200 Q 500,800 800,1200 T 200,1900" 
              fill="none" 
              stroke="url(#contactGradBody)" 
              strokeWidth="2"
              style={{ pathLength: pathLength2 }}
            />
            <defs>
              <linearGradient id="contactGradBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Scattered items filling the space left and right fully */}
        <motion.div 
           whileHover={{ scale: 1.05 }}
           className="absolute top-0 right-5 md:right-20 w-80 h-96 bg-indigo-950/20 border border-indigo-500/20 rounded-[3rem] p-10 rotate-3 hover:-translate-y-4 transition-all duration-700 backdrop-blur-md hidden xl:flex flex-col justify-between z-10"
        >
            <Compass size={48} className="text-indigo-400 font-extralight" strokeWidth={1} />
            <div>
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block font-bold mb-3">Find The Path</span>
              <p className="text-lg font-light text-white">We guide you perfectly to the safe living experience you have always wanted.</p>
            </div>
        </motion.div>

        <motion.div 
           whileHover={{ scale: 1.02, rotate: 0 }}
           className="absolute top-[30%] left-2 md:left-10 w-96 h-80 bg-gradient-to-tr from-rose-950/30 to-purple-950/10 border border-rose-500/20 rounded-[3rem] p-10 backdrop-blur-md -rotate-6 transition-all duration-700 hidden 2xl:flex flex-col justify-end z-10"
        >
            <Sun size={64} className="text-amber-400 mb-6 font-extralight opacity-50" strokeWidth={1} />
            <h4 className="text-5xl text-rose-300 font-extralight mb-4">24/7 Support</h4>
            <p className="text-sm font-sans text-gray-400">Our amazing warm team is constantly ready to support you with everything you need, completely effortlessly anywhere in the whole world.</p>
        </motion.div>

        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-20 items-center justify-center relative mt-20 z-20">
          
          <div className="w-full xl:w-5/12 space-y-12">
            <div className="space-y-6">
               {/* Scroll Highlight text */}
              <div className="space-y-6 text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight font-sans tracking-tight block">
                <motion.div style={{ opacity: highlightA }}>
                  Send us a quick, happy note today.
                </motion.div>
                <motion.div style={{ opacity: highlightB }} className="text-rose-400 italic">
                  Tell us what makes you feel perfectly at home.
                </motion.div>
                <motion.div style={{ opacity: highlightC }}>
                  We will take care of absolutely everything else.
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#050505]/80 block backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors hover:border-rose-500/30 group">
                <Mail size={32} className="text-rose-400 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                <h4 className="text-2xl font-light text-white mb-2">Email</h4>
                <p className="text-sm text-gray-400 font-mono">hello@peace.com</p>
              </div>
              <div className="bg-[#050505]/80 block backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors hover:border-indigo-500/30 group">
                 <Phone size={32} className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-2">Call</h4>
                 <p className="text-sm text-gray-400 font-mono">+1 800 999 1111</p>
              </div>
              <div className="bg-[#050505]/80 block backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors group sm:col-span-2 hover:border-purple-500/30">
                 <MapPin size={32} className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-2">Visit Our Cozy Home</h4>
                 <p className="text-sm text-gray-400 font-sans">123 Happiness Avenue, Beautiful Sun City</p>
              </div>
            </div>
          </div>

          {/* Majestic Form Box - Taking large space */}
          <div className="w-full xl:w-7/12 relative group z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-[4rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-[#020202]/90 backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              {formSubmitted ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-32 space-y-8 relative z-10"
                 >
                   <div className="w-32 h-32 bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400 animate-[pulse_3s_ease-in-out_infinite]">
                     <CheckCircle2 size={64} strokeWidth={1} />
                   </div>
                   <h4 className="text-5xl font-light text-white">Wonderfully Received</h4>
                   <p className="text-xl text-gray-400 leading-relaxed max-w-md mx-auto font-light">
                     Thank you for opening up to us. We are reading it now and will reply with a warm hello very soon.
                   </p>
                   <button
                     onClick={() => setFormSubmitted(false)}
                     className="mt-10 px-10 py-5 bg-white/[0.05] border border-white/10 rounded-full text-white hover:bg-white/[0.1] hover:scale-105 transition-all inline-block font-mono text-xs uppercase tracking-widest cursor-pointer"
                   >
                     Write Us Again
                   </button>
                 </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-10 relative z-10">
                   <div className="text-center mb-10">
                     <h3 className="text-3xl font-light text-white mb-3">Say Hello</h3>
                     <p className="text-sm text-gray-400">We want to hear your story.</p>
                   </div>
                   
                   <div className="space-y-3">
                     <label className="text-[12px] font-mono uppercase text-rose-400 tracking-[0.2em] block pl-6 font-bold">Your Beautiful Name</label>
                     <input
                       type="text"
                       required
                       value={contactName}
                       onChange={(e) => setContactName(e.target.value)}
                       className="w-full bg-[#050505] border border-white/10 hover:border-white/20 focus:border-rose-500/50 text-white rounded-[2rem] p-6 text-lg focus:outline-none placeholder-gray-700 transition-all font-light"
                       placeholder="What do your friends call you?"
                     />
                   </div>

                   <div className="space-y-3">
                     <label className="text-[12px] font-mono uppercase text-indigo-400 tracking-[0.2em] block pl-6 font-bold">Your Email Address</label>
                     <input
                       type="email"
                       required
                       value={contactEmail}
                       onChange={(e) => setContactEmail(e.target.value)}
                       className="w-full bg-[#050505] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 text-white rounded-[2rem] p-6 text-lg focus:outline-none placeholder-gray-700 transition-all font-light"
                       placeholder="Where should we write you back?"
                     />
                   </div>

                   <div className="space-y-3">
                     <label className="text-[12px] font-mono uppercase text-purple-400 tracking-[0.2em] block pl-6 font-bold">Your Message To Us</label>
                     <textarea
                       required
                       value={contactMessage}
                       onChange={(e) => setContactMessage(e.target.value)}
                       rows={6}
                       className="w-full bg-[#050505] border border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white rounded-[2rem] p-6 text-lg focus:outline-none placeholder-gray-700 transition-all font-light resize-none"
                       placeholder="Tell us everything you are dreaming of for your perfect home..."
                     />
                   </div>

                   <button
                     type="submit"
                     className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white py-6 rounded-[2rem] text-xl font-light transition-all hover:scale-[1.02] flex items-center justify-center gap-4 cursor-pointer hover:shadow-[0_0_80px_rgba(236,72,153,0.4)]"
                   >
                     <span>Send Us Joy</span>
                     <Send size={24} />
                   </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scattered deep detail random content blocks */}
      <section className="py-40 bg-[#010101] relative overflow-hidden border-t border-white/5 rounded-[5rem] mx-4 mb-20 z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-[90rem] mx-auto px-6 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono text-purple-400 tracking-widest uppercase block border border-purple-500/20 bg-purple-500/10 px-4 py-2 rounded-full w-fit mx-auto">
              You Are Always Welcome
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-white">We built a company to spread total warmth.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="p-10 border border-white/5 bg-[#050505] rounded-[3rem] -translate-y-8 hover:translate-y-0 transition-transform duration-500 hover:border-rose-500/20">
                 <Globe className="text-rose-400 mb-8 font-extralight" size={48} strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-4">Everywhere</h4>
                 <p className="text-base font-sans text-gray-400 leading-relaxed">It does not matter where you live on this great big planet. We are happy and fully ready to help you surround yourself with comfort anywhere.</p>
              </div>
              
              <div className="p-10 border border-indigo-500/15 bg-indigo-950/10 rounded-[3rem] translate-y-12 hover:translate-y-4 transition-transform duration-500">
                 <Star className="text-indigo-400 mb-8 font-extralight" size={48} strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-4">Beautiful Lives</h4>
                 <p className="text-base font-sans text-gray-400 leading-relaxed">Everything we design is deeply beautiful. We do not do complicated menus or ugly wires. We only do pure, stunning simplicity.</p>
              </div>

              <div className="p-10 border border-white/5 bg-[#050505] rounded-[3rem] -translate-y-4 hover:translate-y-4 transition-transform duration-500 hover:border-purple-500/20">
                 <Users className="text-purple-400 mb-8 font-extralight" size={48} strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-4">Genuine People</h4>
                 <p className="text-base font-sans text-gray-400 leading-relaxed">When you talk to us, you talk to real friends. We listen closely and sincerely want you to be completely happy every single day.</p>
              </div>

              <div className="p-10 border border-amber-500/15 bg-amber-950/10 rounded-[3rem] translate-y-8 hover:translate-y-0 transition-transform duration-500">
                 <Droplets className="text-amber-400 mb-8 font-extralight" size={48} strokeWidth={1} />
                 <h4 className="text-2xl font-light text-white mb-4">Pure Flow</h4>
                 <p className="text-base font-sans text-gray-400 leading-relaxed">Water falls softly, air flows brightly, and things just work wonderfully. There are no technical instructions needed to enjoy it.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Massive modern footer block in contact page */}
      <section className="min-h-screen px-6 bg-[#000000] text-center relative overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/10 via-[#000] to-transparent pointer-events-none z-0" />
        
        {/* Animated giant background text */}
        <motion.div 
           animate={{ rotate: [0, 5, -5, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute w-[150%] h-[150%] flex items-center justify-center opacity-5 pointer-events-none select-none z-0"
        >
          <div className="text-[30vw] font-bold text-white leading-none mix-blend-overlay">SMILE.</div>
        </motion.div>

        <h2 className="text-[12vw] sm:text-[15rem] leading-[0.8] font-extralight text-white opacity-20 tracking-tighter mix-blend-overlay break-words w-full px-4 mb-20 z-10 relative">
          STAY PEACEFUL
        </h2>
        
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative px-12 py-6 bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-widest rounded-full hover:scale-110 hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-4 z-10 shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
        >
          <span>Return To Our Homepage</span>
          <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform" />
        </button>
      </section>
      
    </div>
  );
}
