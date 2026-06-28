/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Ship, Sunrise, Calendar, ShieldCheck, Star } from 'lucide-react';
import { DISPLAY_PHONE } from '../data';
import HeroWeatherWidget from './HeroWeatherWidget';

interface HeroProps {
  onExploreClick: () => void;
  onPlannerClick: () => void;
}

export default function Hero({ onExploreClick, onPlannerClick }: HeroProps) {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
      {/* Immersive Red Sea Travel Background Image with ReferrerPolicy */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80" 
          alt="Red Sea Coastline" 
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-102 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Luxury Radial & Linear Dark Contrast Gradients */}
        <div className="absolute inset-0 bg-radial from-slate-950/40 via-slate-950/85 to-slate-950" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        
        {/* Subtle Decorative Brand Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eae3d8_0.5px,transparent_0.5px),linear-gradient(to_bottom,#eae3d8_0.5px,transparent_0.5px)] bg-[size:4rem_4rem] opacity-5" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 text-center">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-medium tracking-wide mb-8 animate-fade-in">
          <Star className="w-3.5 h-3.5 fill-emerald-400" />
          <span>The #1 Red Sea & Desert Tour Agency in Egypt</span>
        </div>

        {/* Brand Representation Logo/Motto */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            {/* Styled Logo SVG that mirrors the MAS logo */}
            <div className="relative w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center group overflow-hidden relative">
                <span className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-emerald-800 via-emerald-600 to-green-500 tracking-tighter">
                  MAS
                </span>
                <div className="absolute bottom-1 text-[7.5px] text-emerald-700 font-mono tracking-widest leading-none uppercase font-bold">
                  Travel
                </div>
              </div>
            </div>
            <div className="text-left">
              <p className="font-display text-xs text-emerald-400 font-extrabold tracking-widest uppercase">
                International Agency
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-none tracking-tight">
                MAS TRAVEL
              </h1>
            </div>
          </div>
        </div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Experience More,<br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
            Travel Better
          </span>
        </h2>

        <p className="font-sans text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Embark on breathtaking island cruises, explore vibrant coral gardens, conquer golden dunes in high-tech desert safaris, and unlock Luxor & Cairo pyramids with professional Egyptologist guides.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-w-md mx-auto">
          <button
            id="btn-explore-tours"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-50 text-base shadow-lg shadow-emerald-500/20 active:scale-97 cursor-pointer transition-all duration-200"
          >
            Explore Active Programs
          </button>
          <button
            id="btn-itinerary-builder"
            onClick={onPlannerClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white text-base active:scale-97 cursor-pointer transition-all duration-200"
          >
            Create Custom Trip
          </button>
        </div>

        {/* Real-time Hurghada Weather Forecast Widget */}
        <HeroWeatherWidget />

        {/* Factual Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-5xl mx-auto backdrop-blur-md mt-12">
          <div className="flex items-center gap-3.5 text-left p-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Expert Leads
              </p>
              <h4 className="font-display font-bold text-sm text-white">
                Professional Guides
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-left p-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Red Sea Journeys
              </p>
              <h4 className="font-display font-bold text-sm text-white">
                Premium Vessels
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-left p-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Top Safaris
              </p>
              <h4 className="font-display font-bold text-sm text-white">
                Sunset Wonders
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-left p-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Guaranteed Fun
              </p>
              <h4 className="font-display font-bold text-sm text-white">
                Unparalleled Quality
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
