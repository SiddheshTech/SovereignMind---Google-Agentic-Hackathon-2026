import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Shield, Landmark, Globe } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  badge: string;
  icon: any;
  annualMonthly: number;
  biennialMonthly: number;
  description: string;
  features: string[];
  ctaText: string;
}

const PLANS: PricingTier[] = [
  {
    id: 'tier-inst',
    name: 'Institutional Foresight Plan',
    badge: 'Regional Resilience',
    icon: Shield,
    annualMonthly: 12500,
    biennialMonthly: 10500,
    description: 'Perfect for sub-national agencies, regional utility boards, and municipal asset management committees requiring local foresight.',
    features: [
      'Access to regional physical logistic vulnerability models',
      'Continuous algorithmic polarization monitoring alerts',
      'Alternative localized sea-land transit pathfinders',
      'Daily sub-channel utility grid buffer analysis reports',
      '14-day pre-emptive scenario projections buffer'
    ],
    ctaText: 'Establish Regional Foresight'
  },
  {
    id: 'tier-state',
    name: 'Sovereign State Plan',
    badge: 'National Security Core',
    icon: Landmark,
    annualMonthly: 45000,
    biennialMonthly: 38000,
    description: 'Enterprise-grade national resilience infrastructure built for central ministries of defense, strategic food boards, and central bank frameworks.',
    features: [
      'Full trans-continental physical distribution flow mapping',
      'Integrated physical buffer management simulation triggers',
      'Cryptographic information trust metadata signatures api',
      'Real-time automated resource relocation treaty alerts',
      '180-day pre-emptive scenario projections horizon',
      'Direct secure coordination node with geneva cluster core',
      'Dedicated local installation and 24/7 strategic support'
    ],
    ctaText: 'Access Sovereign Autopilot'
  },
  {
    id: 'tier-con',
    name: 'Global Consortium Alliance Plan',
    badge: 'Multi-lateral Coordination',
    icon: Globe,
    annualMonthly: 95000,
    biennialMonthly: 80000,
    description: 'Designed for global inter-governmental alliances, maritime corridors councils, and trans-continental energy stabilization foundations.',
    features: [
      'Multi-lateral regional coordination mapping interfaces',
      'Sovereign-to-Sovereign emergency credit ledgers integration',
      'Coordinating network links to London, Geneva, and Tokyo clusters',
      'Unlimited scenario simulation test allocations',
      'Customized planetary thermal climate impact predictions',
      'Direct strategic coordination with the board of directors',
      'Advisory consulting and executive policy auditing'
    ],
    ctaText: 'Form Strategic Alliance'
  }
];

export function InstitutionalPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'biennial'>('annual');

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 space-y-4">
        <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Subscription Modalities</span>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-none">
          Enterprise Security Portfolios
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed font-sans">
          Secure robust civilizational resilience allocations under predictable structures. Toggle programs below to view standard access models.
        </p>

        {/* Toggle Billing Period Button */}
        <div id="pricing-billing-toggle" className="inline-flex p-1 bg-white/[0.05] border border-white/10 rounded-xl mt-3 relative">
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
              billingPeriod === 'annual'
                ? 'bg-white text-black font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annual Program (-20%)
          </button>
          <button
            onClick={() => setBillingPeriod('biennial')}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
              billingPeriod === 'biennial'
                ? 'bg-white text-black font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Biennial Alliance Program (-35%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-8">
        {PLANS.map((tier) => {
          const Icon = tier.icon;
          const rate = billingPeriod === 'annual' ? tier.annualMonthly : tier.biennialMonthly;
          const savings = billingPeriod === 'annual' ? '' : 'Billed Biennially';
          
          return (
            <div
              key={tier.id}
              className={`liquid-glass border rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 relative ${
                tier.id === 'tier-state'
                  ? 'border-white/35 bg-white/[0.03] shadow-[0_0_30px_rgba(255,255,255,0.06)] scale-105 z-10'
                  : 'border-white/10'
              }`}
            >
              {tier.id === 'tier-state' && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-[9px] font-mono tracking-widest px-3 py-1 rounded-full uppercase">
                  Primary State Choice
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    {tier.badge}
                  </span>
                  <Icon size={20} className="text-gray-300" />
                </div>

                <h4 className="text-xl font-normal text-white leading-tight">
                  {tier.name}
                </h4>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-4xl font-light text-white tracking-tight">
                    ${rate.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-gray-400"> / Month</span>
                  {savings && <span className="block text-[9px] text-pink-400 font-mono mt-1">{savings}</span>}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                  {tier.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-4 border-t border-white/10 flex-1">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Allocated Protections</span>
                <ul className="space-y-2.5">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                      <Check size={14} className="text-pink-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger button */}
              <button
                className={`w-full py-3.5 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-6 ${
                  tier.id === 'tier-state'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white border border-white/10 hover:border-white/30'
                }`}
              >
                <span>{tier.ctaText}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 justify-center max-w-xl mx-auto border border-white/5 bg-white/[0.01] rounded-xl p-4 mt-12 text-center text-xs text-gray-400 leading-relaxed">
        <Info size={16} className="text-gray-500 shrink-0" />
        <span>Sovereign Mind security structures are deployed in fully localized data clusters with end-to-end user custody. Custom deployment models can be configured.</span>
      </div>
    </div>
  );
}
