import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sun, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  LifeBuoy, 
  Thermometer, 
  AlertTriangle,
  Flame,
  PhoneCall,
  Clock,
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { WHATSAPP_NUMBER, DISPLAY_PHONE } from '../data';

interface WeatherSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: 'heatwave' | 'storm' | 'normal';
}

export default function WeatherSafetyModal({ isOpen, onClose, condition }: WeatherSafetyModalProps) {
  if (!isOpen) return null;

  const currentCondition = condition === 'normal' ? 'heatwave' : condition;

  const isHeatwave = currentCondition === 'heatwave';

  // Protocols for Heatwave
  const heatwaveProtocols = [
    {
      title: 'Mandatory Hydration Intervals',
      desc: 'Drink at least 500ml of mineralized water every 45 minutes of direct solar exposure. Free bottled mineral water is provided at our boat decks.',
      icon: Droplets,
    },
    {
      title: 'UV Shielding Recommendations',
      desc: 'Use broad-spectrum SPF 50+ sunscreen, reapplying every 2 hours. Wear high-factor polarized sunglasses and wide-brimmed sun hats.',
      icon: Sun,
    },
    {
      title: 'Peak Intensity Safety (11:00 AM - 3:00 PM)',
      desc: 'Avoid dry sandbars during the highest heat pinnacle. Boat crews will extend the canopy cover to 100% shade during these peak hours.',
      icon: Thermometer,
    },
    {
      title: 'Heatstroke Awareness checks',
      desc: 'Notify ship captains immediately if experiencing dizziness, rapid breathing, or localized cramping. On-board cooling towels are fully stocked.',
      icon: Flame,
    }
  ];

  // Protocols for Coastal Gale / Storm
  const stormProtocols = [
    {
      title: 'Obligatory Life Jacket Policy',
      desc: 'Life jackets must be fastened securely at all times while aboard a speedboat, regardless of swimming proficiency or age.',
      icon: LifeBuoy,
    },
    {
      title: 'Speed Limitations & Comfort Caps',
      desc: 'Captains are instructed to throttle speedboat velocities to maximum 22 knots to ensure safe passenger comfort against choppy tides.',
      icon: Wind,
    },
    {
      title: 'Safe Lagoon Anchoring Points',
      desc: 'Open reef snorkeling may be rerouted to protected marine lagoons like Giftun South Bay to avoid large open swells.',
      icon: Navigation,
    },
    {
      title: 'Real-time Coast Guard Sync',
      desc: 'Our dispatch team remains in constant VHF radio communication with the Egyptian Red Sea Coast Guard for active wind advisory telemetry.',
      icon: ShieldAlert,
    }
  ];

  const activeProtocols = isHeatwave ? heatwaveProtocols : stormProtocols;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header Theme Accent Grid banner */}
          <div className={`p-6 pr-14 relative shrink-0 ${isHeatwave ? 'bg-gradient-to-r from-amber-950/40 to-indigo-950/20 border-b border-amber-500/20' : 'bg-gradient-to-r from-rose-955/40 to-indigo-950/20 border-b border-rose-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider rounded-md border flex items-center gap-1 shrink-0 ${
                isHeatwave ? 'bg-amber-500/10 border-amber-500/35 text-amber-400' : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
              }`}>
                <AlertTriangle className="w-3 h-3 animate-pulse" />
                <span>Extreme Weather Protocol</span>
              </span>
            </div>
            
            <h2 className="font-display font-black text-lg md:text-xl text-slate-150 uppercase tracking-wide">
              {isHeatwave ? 'Red Sea Sun & Heatwave Safety Directive' : 'Coastal Gale & Marine Safety Protocol'}
            </h2>
            <p className="text-slate-400 font-sans text-xs mt-1.5 leading-relaxed">
              Issued in alignment with standard Red Sea Port Authority regulations to guarantee absolute traveler comfort and vessel safety.
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close modal"
              id="close-safety-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Main Scrollable Area */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            
            {/* Quick Summary Warning Callout */}
            <div className={`p-4 rounded-2xl flex gap-3 text-xs leading-relaxed ${isHeatwave ? 'bg-amber-950/20 border border-amber-500/10 text-amber-200' : 'bg-rose-955/20 border border-rose-500/10 text-rose-200'}`}>
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40 shrink-0 self-start">
                {isHeatwave ? <Sun className="w-5 h-5 text-amber-450" /> : <Wind className="w-5 h-5 text-rose-450" />}
              </div>
              <div className="font-sans space-y-1">
                <span className="font-bold uppercase tracking-wider block text-[10px] text-slate-400">Current Advisory Summary</span>
                <p>
                  {isHeatwave 
                    ? 'High air pressure over Hurghada is boosting peak UV levels. While boat voyages are 100% active, guests need custom protections to counter sunburn and dehydration side-effects.'
                    : 'A safety wind pressure wave is causing localized 1.5 to 1.8 meter tidal crests. Cruising channels remain operational, but captains use alternate calm routes to optimize comfort.'
                  }
                </p>
              </div>
            </div>

            {/* Protocol Steps List */}
            <div className="space-y-4">
              <span className="block font-sans text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Mandatory Safety Checks & Instructions
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProtocols.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div key={idx} className="p-4 bg-slate-955 border border-slate-850/60 rounded-2xl flex gap-3 text-left">
                      <div className={`p-2 rounded-xl shrink-0 self-start ${isHeatwave ? 'bg-amber-500/5 text-amber-400 border border-amber-500/10' : 'bg-rose-500/5 text-rose-450 border border-rose-500/10'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-[11px] uppercase tracking-wide text-slate-200">
                          {p.title}
                        </h4>
                        <p className="font-sans text-slate-450 text-[11px] leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Captain's Notes & Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/15 border border-indigo-500/10 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 self-start">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="text-left font-sans text-[11.5px]">
                <span className="font-extrabold text-indigo-300 block mb-0.5">Vessel Captain’s Dispatch Guarantee</span>
                <p className="text-slate-450 leading-relaxed">
                  Our professional crew members hold active international marine safety certifications level 3. If winds or temperature ratings exceed safe threshold metrics, your tour draft shifts to free rescheduling options immediately.
                </p>
              </div>
            </div>

            {/* Quick Contact Desk */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-855 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left font-sans">
                  <span className="block font-black text-[10.5px] uppercase tracking-wider text-slate-300">Direct Support Command Desk</span>
                  <p className="text-slate-500 text-[11px]">Chat on WhatsApp regarding schedule adjustments</p>
                </div>
              </div>
              
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-555 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <span>WhatsApp: {DISPLAY_PHONE}</span>
              </a>
            </div>

          </div>

          {/* Footer Action buttons */}
          <div className="p-5 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-mono text-[11px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              Close Directive
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
