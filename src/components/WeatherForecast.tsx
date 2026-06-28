/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sun, Wind, Compass, Waves, ShieldAlert, Sparkles, Navigation, Globe } from 'lucide-react';

interface WeatherDay {
  dayName: string;
  tempC: number;
  tempF: number;
  icon: string;
  condition: string;
}

interface DestinationWeather {
  city: string;
  status: string;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  seaTempC: number;
  seaTempF: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  humidity: number;
  forecast: WeatherDay[];
}

const RED_SEA_WEATHER: Record<string, DestinationWeather> = {
  hurghada: {
    city: 'Hurghada',
    status: 'Crystal Clear Skies',
    tempC: 35,
    tempF: 95,
    feelsLikeC: 37,
    feelsLikeF: 99,
    seaTempC: 26,
    seaTempF: 79,
    windSpeedKmh: 18,
    windDirection: 'NNW',
    uvIndex: 11,
    humidity: 32,
    forecast: [
      { dayName: 'Thu', tempC: 35, tempF: 95, icon: '☀️', condition: 'Sunny & Windy' },
      { dayName: 'Fri', tempC: 36, tempF: 97, icon: '☀️', condition: 'Extremely Sunny' },
      { dayName: 'Sat', tempC: 36, tempF: 97, icon: '☀️', condition: 'Gentle Breezy Day' },
      { dayName: 'Sun', tempC: 35, tempF: 95, icon: '☀️', condition: 'Perfect Reef Snorkel' }
    ]
  },
  'sharm-el-sheikh': {
    city: 'Sharm El-Sheikh',
    status: 'Sun-Drenched Shoreline',
    tempC: 36,
    tempF: 97,
    feelsLikeC: 39,
    feelsLikeF: 102,
    seaTempC: 27,
    seaTempF: 80,
    windSpeedKmh: 12,
    windDirection: 'NNE',
    uvIndex: 11,
    humidity: 28,
    forecast: [
      { dayName: 'Thu', tempC: 36, tempF: 97, icon: '☀️', condition: 'Sunny & Calmer Seas' },
      { dayName: 'Fri', tempC: 37, tempF: 99, icon: '☀️', condition: 'Intense Warmth' },
      { dayName: 'Sat', tempC: 37, tempF: 99, icon: '☀️', condition: 'Perfect Diver Calm' },
      { dayName: 'Sun', tempC: 36, tempF: 97, icon: '☀️', condition: 'Hazy Horizon' }
    ]
  }
};

export default function WeatherForecast() {
  const [selectedCity, setSelectedCity] = useState<'hurghada' | 'sharm-el-sheikh'>('hurghada');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const activeWeather = RED_SEA_WEATHER[selectedCity];

  // Helper function to interpret UV Index risk
  const getUVWarning = (index: number) => {
    if (index >= 11) return 'Extreme Risk (High SPF 50+, hats & shades required)';
    if (index >= 8) return 'Very High Risk (Frequent sunscreen re-applications)';
    return 'Moderate to High Risk (Regular Protection)';
  };

  return (
    <div id="mas-weather-widget" className="rounded-3xl bg-slate-900/35 border border-slate-900 p-6 md:p-8 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl pointer-events-none" />
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold uppercase rounded-full w-fit mb-2.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Interactive Forecast Feed</span>
          </div>
          <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-tight">
            Red Sea Marine Weather Portal
          </h3>
          <p className="font-sans text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            Real-time conditions for coastal diving centers, yacht departure spots, and sandy beaches.
          </p>
        </div>

        {/* City & Temperature Unit Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setSelectedCity('hurghada')}
              className={`px-3 py-1.5 text-[10px] font-mono font-semibold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                selectedCity === 'hurghada' 
                  ? 'bg-amber-500 text-slate-50 font-black shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hurghada
            </button>
            <button
              onClick={() => setSelectedCity('sharm-el-sheikh')}
              className={`px-3 py-1.5 text-[10px] font-mono font-semibold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                selectedCity === 'sharm-el-sheikh' 
                  ? 'bg-amber-500 text-slate-50 font-black shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sharm El-Shaikh
            </button>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setUnit('C')}
              className={`w-8 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'C' 
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 font-black' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`w-8 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'F' 
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 font-black' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Today Detailed Card, Right is multi-day prediction & tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* Detailed Card Today (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-850/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-650 tracking-wider">
            UPDATED TODAY
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1">
                <Navigation className="w-3 h-3 text-emerald-400" />
                <span>currently at destination</span>
              </span>
              <h4 className="font-display font-black text-2xl text-slate-100 uppercase tracking-wide">
                🌊 {activeWeather.city}
              </h4>
              <p className="text-amber-400 font-mono text-xs font-semibold">
                {activeWeather.status}
              </p>
            </div>

            {/* Giant Temp Display */}
            <div className="flex items-baseline gap-2.5">
              <span className="font-display font-black text-5xl md:text-6xl text-white tracking-tighter leading-none select-none">
                {unit === 'C' ? `${activeWeather.tempC}°` : `${activeWeather.tempF}°`}
              </span>
              <span className="font-mono text-xs text-slate-400 font-heavy">
                Feels like {unit === 'C' ? `${activeWeather.feelsLikeC}°C` : `${activeWeather.feelsLikeF}°F`}
              </span>
            </div>
          </div>

          {/* Core Marine indicators list */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 pt-5 border-t border-slate-900 text-xs font-sans text-slate-300">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 leading-none mb-1">Sea water Temp</p>
                <p className="font-bold text-slate-200">
                  {unit === 'C' ? `${activeWeather.seaTempC}°C` : `${activeWeather.seaTempF}°F`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 leading-none mb-1">Marine Winds</p>
                <p className="font-bold text-slate-200">
                  {activeWeather.windSpeedKmh} km/h • {activeWeather.windDirection}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 leading-none mb-1">UV radiation INDEX</p>
                <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold rounded">
                  {activeWeather.uvIndex} (Extreme)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 leading-none mb-1">relative humidity</p>
                <p className="font-bold text-slate-200">
                  {activeWeather.humidity}%
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 3/4-Day Forecast Row + Coral Marine safety advice (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Quick Outlook row */}
          <div className="space-y-3 text-left">
            <h5 className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>4-Day Adventure Outlook (Recommended Excursions suitability)</span>
            </h5>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeWeather.forecast.map((fc, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-950 border border-slate-900 hover:border-slate-800 transition-colors rounded-xl flex flex-col items-center text-center space-y-1"
                >
                  <span className="font-mono text-[10px] text-slate-400 font-black tracking-wider uppercase">
                    {fc.dayName}
                  </span>
                  <span className="text-xl inline-block leading-none py-1 select-none">
                    {fc.icon}
                  </span>
                  <span className="font-mono text-xs font-bold text-white leading-none">
                    {unit === 'C' ? `${fc.tempC}°` : `${fc.tempF}°`}
                  </span>
                  <span className="text-[8px] font-sans text-slate-500 leading-tight">
                    {fc.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Weather Warning warning alert strip */}
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 text-xs text-orange-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-widest font-black text-orange-400 leading-none">
                ☀️ UV Index Extreme Warning & Hydration Alert
              </p>
              <p className="leading-normal font-sans text-slate-300 text-[11px]">
                {getUVWarning(activeWeather.uvIndex)}
                <span className="block text-slate-500 text-[10px] mt-1 italic">
                  Strong water breeze can mask intense desert ultraviolet heat. Drink 3.5L of mineral fluids daily and reapply SPF 50 blocks.
                </span>
              </p>
            </div>
          </div>

          {/* Advice strip specific to Hurghada/Sharm sea programs */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60 text-[11px] text-slate-400 leading-relaxed font-sans">
            <span className="font-bold text-slate-200">🔍 Safe Yacht Sailing Recommendation: </span>
            Our local yacht departures from Hurghada Marina are optimal this week. Light offshore {activeWeather.windSpeedKmh} km/h winds ensure manageable swell levels of 0.3m to 0.6m—perfect for families seeking dolphins or diving Giftun Island reefs safely.
          </div>

        </div>

      </div>
    </div>
  );
}
