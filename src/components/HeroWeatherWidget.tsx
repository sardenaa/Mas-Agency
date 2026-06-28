import React, { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, Thermometer, Compass, Sparkles, RefreshCw } from 'lucide-react';

interface WeatherState {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKmh: number;
  weatherCode: number;
  description: string;
  iconSymbol: string;
  forecast: Array<{
    date: string;
    maxC: number;
    minC: number;
    icon: string;
    label: string;
  }>;
}

// Fallback/Initial state representing Hurghada's standard golden weather
const HURGHADA_FALLBACK: WeatherState = {
  tempC: 34,
  feelsLikeC: 36,
  humidity: 32,
  windKmh: 18,
  weatherCode: 0,
  description: "Sunny & Optimal Yachting",
  iconSymbol: "☀️",
  forecast: [
    { date: 'Tomorrow', maxC: 35, minC: 25, icon: '☀️', label: 'Clear Sky' },
    { date: 'Day 2', maxC: 36, minC: 26, icon: '☀️', label: 'Extremely Sunny' },
    { date: 'Day 3', maxC: 35, minC: 25, icon: '🌤️', label: 'Warm Breeze' },
  ]
};

function mapWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Crystal Clear Skies', icon: '☀️' };
  if (code >= 1 && code <= 3) return { label: 'Mainly Clear & Sunny', icon: '🌤️' };
  if (code === 45 || code === 48) return { label: 'Mist / Coastal Fog', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: 'Drizzle & Calm Seas', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { label: 'Warm Rain Showers', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: 'Hazy Horizon Dust', icon: '💨' };
  if (code >= 80 && code <= 82) return { label: 'Passing Refreshing Showers', icon: '🌦️' };
  if (code >= 95 && code <= 99) return { label: 'Desert Thunderstorm', icon: '⛈️' };
  return { label: 'Warm Beach Weather', icon: '☀️' };
}

export default function HeroWeatherWidget() {
  const [weather, setWeather] = useState<WeatherState>(HURGHADA_FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<boolean>(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const fetchRealTimeWeather = async () => {
    try {
      setLoading(true);
      setErr(false);
      
      // Hurghada coordinates: Latitude 27.2579, Longitude 33.8116
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=27.2579&longitude=33.8116&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa/Cairo&wind_speed_unit=kmh`
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const current = data.current;
      const daily = data.daily;

      const mapping = mapWeather(current.weather_code);

      // Handle simple date names for forecast
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const formattedForecast = daily.time.slice(1, 4).map((timeStr: string, idx: number) => {
        const dateObj = new Date(timeStr);
        const dayLabel = daysOfWeek[dateObj.getDay()];
        const dailyMapping = mapWeather(daily.weather_code[idx + 1] ?? 0);
        return {
          date: dayLabel,
          maxC: Math.round(daily.temperature_2m_max[idx + 1] ?? 35),
          minC: Math.round(daily.temperature_2m_min[idx + 1] ?? 25),
          icon: dailyMapping.icon,
          label: dailyMapping.label,
        };
      });

      setWeather({
        tempC: Math.round(current.temperature_2m),
        feelsLikeC: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windKmh: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        description: mapping.label,
        iconSymbol: mapping.icon,
        forecast: formattedForecast,
      });
    } catch (e) {
      console.error('Error fetching real-time Hurghada weather:', e);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeWeather();
  }, []);

  const convertTemp = (tempC: number) => {
    if (unit === 'F') return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  };

  return (
    <div 
      id="hero-live-weather"
      className="relative w-full max-w-4xl mx-auto mt-12 bg-slate-900/40 border border-amber-500/20 rounded-2xl p-5 md:p-6 backdrop-blur-md overflow-hidden text-left shadow-xl"
    >
      {/* Decorative Golden Ambient Backlighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 blur-2xl pointer-events-none" />

      {/* Title Header with live spinner indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-4 font-sans">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hurghada Direct satellite feed</span>
          </p>
        </div>

        {/* Units & Refresh Switch */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRealTimeWeather}
            disabled={loading}
            className={`p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer ${loading ? 'animate-spin text-amber-500' : ''}`}
            title="Update Live Forecast"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setUnit('C')}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                unit === 'C' 
                  ? 'bg-amber-500 text-slate-50 font-black' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                unit === 'F' 
                  ? 'bg-amber-500 text-slate-50 font-black' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Side: Temperature / Conditions Circle (5 Columns) */}
        <div className="md:col-span-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
          <div className="text-4xl md:text-5xl select-none shrink-0 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 shadow-inner">
            {weather.iconSymbol}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-xs text-amber-400 uppercase tracking-widest mb-0.5">
              Current climate
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-3xl md:text-4xl text-white tracking-tighter">
                {convertTemp(weather.tempC)}°{unit}
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-semibold">
                Feels {convertTemp(weather.feelsLikeC)}°
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 truncate mt-0.5 leading-tight">
              {err ? "Sunny & Ideal (Fallback)" : weather.description}
            </p>
          </div>
        </div>

        {/* Middle Stats Indicators (4 Columns) */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 text-xs font-sans text-slate-300">
          <div className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
            <Wind className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase text-slate-500 leading-none mb-0.5">Wind Force</p>
              <p className="font-bold text-[11px] text-slate-200 truncate">{weather.windKmh} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
            <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase text-slate-500 leading-none mb-0.5">Humidity</p>
              <p className="font-bold text-[11px] text-slate-200 truncate">{weather.humidity}%</p>
            </div>
          </div>

          <div className="col-span-2 text-[10.5px] text-slate-450 leading-normal bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 italic">
            <span className="font-bold text-amber-500 not-italic">Sailing Status:</span> Gentle offshore winds. Marine conditions are perfect for active diving, boat cruises and desert safaris today.
          </div>
        </div>

        {/* Right Side: 3-Day Forecast Strip (3 Columns) */}
        <div className="md:col-span-3 space-y-1.5 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mb-1">
            3-Day Outlook
          </p>
          <div className="space-y-1">
            {weather.forecast.map((fc, index) => (
              <div 
                key={index}
                className="flex items-center justify-between text-xs bg-slate-950/30 px-2 py-1 rounded border border-slate-900/50 hover:border-slate-850 transition-colors"
              >
                <span className="text-slate-400 font-medium truncate max-w-[65px] text-[10.5px]">
                  {fc.date}
                </span>
                <span className="select-none mx-1 text-sm">{fc.icon}</span>
                <span className="font-mono font-bold text-slate-200 text-[10.5px]">
                  {convertTemp(fc.maxC)}° / {convertTemp(fc.minC)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
