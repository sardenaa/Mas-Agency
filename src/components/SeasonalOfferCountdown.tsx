import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Flame } from 'lucide-react';

export default function SeasonalOfferCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 15,
  });

  // Calculate or retrieve the target countdown end time to ensure persistency across refreshes
  useEffect(() => {
    const countdownStorageKey = 'mas_travel_seasonal_target';
    let targetTimeMsStr = localStorage.getItem(countdownStorageKey);
    let targetTimeMs = targetTimeMsStr ? parseInt(targetTimeMsStr, 10) : 0;

    const now = Date.now();
    
    // If no stored end time exists, or the stored end time has already passed,
    // initialize a fresh, urgent 3-hour limit
    if (!targetTimeMs || targetTimeMs < now) {
      targetTimeMs = now + 3 * 60 * 60 * 1000 + 15 * 60 * 1000 + 45 * 1000; // 3h 15m 45s
      localStorage.setItem(countdownStorageKey, targetTimeMs.toString());
    }

    const interval = setInterval(() => {
      const difference = targetTimeMs - Date.now();

      if (difference <= 0) {
        // Automatically cycle the offer to maintain urgency if it hits zeros
        const freshTarget = Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000; // 2h 45m
        localStorage.setItem(countdownStorageKey, freshTarget.toString());
      } else {
        const totalSecs = Math.floor(difference / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        setTimeLeft({
          hours: hrs,
          minutes: mins,
          seconds: secs,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <div 
      id="seasonal-offer-banner"
      className="relative z-50 w-full overflow-hidden border-b border-emerald-500/10 bg-[#0d0c0b] px-4 py-2.5 text-slate-100 font-sans shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 md:px-4">
        {/* Highlight Text */}
        <div className="flex items-center gap-2.5 text-center sm:text-left select-none">
          <div className="flex -space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <Flame className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <p className="text-xs font-semibold tracking-wide text-slate-200 font-sans">
            <span className="text-emerald-400 font-extrabold uppercase mr-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-550/30 text-[10px] font-display">
              Seasonal Deal
            </span>
            Hurghada Golden Season: Use code <strong className="font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20 tracking-wider">GOLD10</strong> for extra priority lock + Auto 10% Group Saver!
          </p>
        </div>

        {/* Dynamic Countdown */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-400 font-bold select-none font-display">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Time Left:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 min-w-[24px] text-center shadow-inner">
                {formatNum(timeLeft.hours)}
              </div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold font-sans mt-0.5">hrs</span>
            </div>

            <span className="text-emerald-500/40 leading-none -mt-4">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 min-w-[24px] text-center shadow-inner">
                {formatNum(timeLeft.minutes)}
              </div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold font-sans mt-0.5">mins</span>
            </div>

            <span className="text-emerald-500/40 leading-none -mt-4">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-slate-905 border border-slate-800 text-rose-500 min-w-[24px] text-center shadow-inner font-black animate-pulse">
                {formatNum(timeLeft.seconds)}
              </div>
              <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold font-sans mt-0.5">secs</span>
            </div>
          </div>

          <button
            onClick={() => {
              document.getElementById('all-programs-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-50 bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all px-3 py-1.5 rounded-lg border border-emerald-600 cursor-pointer shadow-md font-display"
          >
            Claim Space
          </button>
        </div>
      </div>
    </div>
  );
}
