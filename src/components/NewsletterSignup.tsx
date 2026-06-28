/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Gift, 
  Compass, 
  Settings, 
  Trash2, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

interface Subscription {
  email: string;
  preferences: string[];
  subscribedAt: string;
}

const TOUR_PREFERENCES = [
  { id: 'island-cruises', label: '🏝️ Red Sea Island Cruises', desc: 'Orange Bay, Hula Hula & Sunset Catamarans' },
  { id: 'desert-safari', label: '🐪 Desert Safaris & Buggies', desc: 'Quad racing, Bedouin tents & stargazing' },
  { id: 'antiquities', label: '🏛️ Pharaonic Valley Expeditions', desc: 'Luxor Temples & Giza Pyramids' },
  { id: 'flash-deals', label: '🔔 Last-Minute Promo Alerts', desc: 'Exclusive seasonal 15%-30% off deals' },
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['flash-deals']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<Subscription | null>(null);
  const [systemSubscriptions, setSystemSubscriptions] = useState<Subscription[]>([]);
  const [showManagePanel, setShowManagePanel] = useState(false);

  // Load existing subscriptions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mas_newsletter_subscribers');
      if (stored) {
        const parsed = JSON.parse(stored) as Subscription[];
        setSystemSubscriptions(parsed);

        // Also check if current user in session has subscribed
        const activeSubEmail = localStorage.getItem('mas_active_subscriber');
        if (activeSubEmail) {
          const matched = parsed.find(s => s.email.toLowerCase() === activeSubEmail.toLowerCase());
          if (matched) {
            setSuccessData(matched);
          }
        }
      }
    } catch (e) {
      console.error("Local storage lookup failed", e);
    }
  }, []);

  const handleTogglePref = (prefId: string) => {
    if (selectedPrefs.includes(prefId)) {
      setSelectedPrefs(prev => prev.filter(id => id !== prefId));
    } else {
      setSelectedPrefs(prev => [...prev, prefId]);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic email pattern validate
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please supply a correct email format (e.g. name@domain.com).');
      return;
    }

    if (selectedPrefs.length === 0) {
      setErrorMsg('Kindly select at least one travel update category.');
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API response latencies
    setTimeout(() => {
      const newSubscription: Subscription = {
        email: trimmedEmail,
        preferences: [...selectedPrefs],
        subscribedAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      try {
        // Retrieve and update global list
        const stored = localStorage.getItem('mas_newsletter_subscribers');
        let currentList: Subscription[] = stored ? JSON.parse(stored) : [];
        
        // Remove old duplicates if they re-registered
        currentList = currentList.filter(s => s.email.toLowerCase() !== trimmedEmail.toLowerCase());
        currentList.push(newSubscription);

        localStorage.setItem('mas_newsletter_subscribers', JSON.stringify(currentList));
        localStorage.setItem('mas_active_subscriber', trimmedEmail);

        setSystemSubscriptions(currentList);
        setSuccessData(newSubscription);
        setEmail('');
      } catch (err) {
        console.error("Storage save error", err);
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleUnsubscribe = (targetEmail: string) => {
    try {
      const stored = localStorage.getItem('mas_newsletter_subscribers');
      if (stored) {
        const currentList = JSON.parse(stored) as Subscription[];
        const filteredList = currentList.filter(s => s.email.toLowerCase() !== targetEmail.toLowerCase());
        
        localStorage.setItem('mas_newsletter_subscribers', JSON.stringify(filteredList));
        setSystemSubscriptions(filteredList);

        if (successData && successData.email.toLowerCase() === targetEmail.toLowerCase()) {
          setSuccessData(null);
          localStorage.removeItem('mas_active_subscriber');
        }
      }
    } catch (err) {
      console.error("Storage delete error", err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10" id="newsletter-signup-panel">
      <div className="relative rounded-3xl bg-slate-900/35 border border-slate-900 p-6 md:p-10 lg:p-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-brand-gold/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center text-left">
          
          {/* Column A: Information & Pitch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase rounded-full">
              <Gift className="w-3.5 h-3.5 text-brand-green-light" />
              <span>MAS VIP Deals Circle</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white tracking-tight leading-none">
                Subscribe to Seasonal Deals
              </h3>
              <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
                Unlock instant access to flight matching advice, early-bird slots, and exclusive tourist packages directly inside your mailbox. Zero spam, complete travel luxury.
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-3.5 pt-2">
              {[
                { 
                  icon: <Sparkles className="w-4 h-4 text-brand-gold" />, 
                  title: "Seasonal Voucher Promo codes", 
                  desc: "Save 15% to 30% on premier catamarans and desert expeditions during peak vacation times." 
                },
                { 
                  icon: <Bell className="w-4 h-4 text-emerald-400" />, 
                  title: "Instant Weather & Safe Wind alerts", 
                  desc: "Crucial sea waves guidance before booking open deck motorboat activities." 
                },
                { 
                  icon: <ShieldCheck className="w-4 h-4 text-sky-400" />, 
                  title: "100% Privacy Preserved", 
                  desc: "No unsolicited brochures or third-party tracking. Control preferences or resign in seconds." 
                }
              ].map((bullet, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="p-1 rounded-lg bg-slate-950 border border-slate-900 shrink-0 h-7 w-7 flex items-center justify-center">
                    {bullet.icon}
                  </div>
                  <div>
                    <h5 className="font-display font-extrabold text-xs text-slate-200">
                      {bullet.title}
                    </h5>
                    <p className="font-sans text-[11px] text-slate-500 leading-normal">
                      {bullet.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscriptions Setting Trigger */}
            {systemSubscriptions.length > 0 && (
              <div className="pt-4 border-t border-slate-900/40">
                <button
                  onClick={() => setShowManagePanel(!showManagePanel)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Manage active subscribers ({systemSubscriptions.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Column B: Interactive Forms */}
          <div className="lg:col-span-7">
            
            {successData ? (
              /* Success Card state */
              <div className="p-6 md:p-8 rounded-2xl bg-slate-950 border border-brand-green/35 shadow-xl shadow-brand-green/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green/20 border border-brand-green/45 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-brand-green-light stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm md:text-base text-white">
                      Seasonal Updates Provisioned!
                    </h4>
                    <p className="font-sans text-[11px] text-brand-green-light">
                      Successfully registered on {successData.subscribedAt}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-3">
                  <p className="font-sans text-xs text-slate-300">
                    We have mapped <span className="font-mono text-white underline">{successData.email}</span> to receive matching alerts for these categories:
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {successData.preferences.map(prefId => {
                      const found = TOUR_PREFERENCES.find(p => p.id === prefId);
                      return (
                        <span 
                          key={prefId}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded font-sans"
                        >
                          {found ? found.label.split(' ')[0] + ' ' + found.label.split(' ').slice(1).join(' ') : prefId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  💌 Keep a lookout! Our upcoming Autumn Red Sea Expedition Guide with exclusive pricing coupons will land in your mailbox shortly.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-900/60 text-xs">
                  <span className="text-slate-500 font-mono">ID: MAS-SUB-2026</span>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSuccessData(null);
                        setSelectedPrefs(['flash-deals']);
                      }}
                      className="text-brand-green hover:hover:text-brand-green-light transition-colors font-semibold cursor-pointer"
                    >
                      Subscribe Another Email
                    </button>
                    <button
                      onClick={() => handleUnsubscribe(successData.email)}
                      className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Core Subscribe Form */
              <form onSubmit={handleSubscribeSubmit} className="space-y-6">
                
                {/* Interest Toggles */}
                <div className="space-y-3 text-left">
                  <span className="block font-display font-extrabold text-xs text-slate-300 uppercase tracking-wider">
                    Select Your Travel Interests (Multiple Optional):
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TOUR_PREFERENCES.map((pref) => {
                      const isSelected = selectedPrefs.includes(pref.id);
                      return (
                        <div
                          key={pref.id}
                          onClick={() => handleTogglePref(pref.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-950 border-emerald-500/50 text-white shadow-md'
                              : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-display font-bold text-xs">
                              {pref.label}
                            </span>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isSelected 
                                ? 'bg-brand-green border-brand-green-light' 
                                : 'border-slate-700 bg-slate-950'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-slate-50 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="font-sans text-[10px] text-slate-500 mt-1">
                            {pref.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Email submission layout Row */}
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your personal email (e.g. wanderlust@explore.com)"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="block w-full pl-10 pr-32 py-3.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:bg-slate-950 transition-all font-sans"
                    />
                    
                    <div className="absolute inset-y-1.5 right-1.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-full px-5 bg-brand-green hover:bg-brand-green-light disabled:bg-slate-800 text-slate-50 font-display font-extrabold text-xs rounded-lg uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-50 border-t-transparent rounded-full animate-spin" />
                            <span>Securing...</span>
                          </>
                        ) : (
                          <>
                            <span>Join Club</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 text-xs animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                {/* Secure Seal */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Encrypted verification. Unsubscribe with a single click any time.</span>
                </div>

              </form>
            )}

            {/* Toggleable Subscriber management Panel */}
            {showManagePanel && systemSubscriptions.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-4 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                  <h5 className="font-display font-medium text-xs text-slate-300">
                    Active Local Subscribers list
                  </h5>
                  <button
                    onClick={() => {
                      localStorage.removeItem('mas_newsletter_subscribers');
                      localStorage.removeItem('mas_active_subscriber');
                      setSystemSubscriptions([]);
                      setSuccessData(null);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer font-mono font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Prune List</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-950/50 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                  {systemSubscriptions.map((sub, i) => (
                    <div key={i} className="flex justify-between items-center py-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono text-slate-200 block">{sub.email}</span>
                        <span className="text-[10px] text-slate-500 block">Subscribed {sub.subscribedAt}</span>
                      </div>
                      
                      <button
                        onClick={() => handleUnsubscribe(sub.email)}
                        className="text-[10px] text-slate-500 hover:text-red-400 p-1.5 rounded bg-slate-900/40 hover:bg-slate-900 border border-slate-900 text-right transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
