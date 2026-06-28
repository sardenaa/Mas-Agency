/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  ShoppingBag, 
  Send,
  ChevronLeft,
  ChevronRight,
  Image,
  Play,
  Pause
} from 'lucide-react';
import { TourItem } from '../types';
import { WHATSAPP_NUMBER } from '../data';

const GALLERY_IMAGES: Record<string, string[]> = {
  'sunset': [
    '/src/assets/images/hula_hula_sunset_1780510190387.png',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80'
  ],
  'submarine': [
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb756c?auto=format&fit=crop&w=1000&q=80'
  ],
  'safari': [
    '/src/assets/images/super_safari_1780510206707.png',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80'
  ],
  'star-safari': [
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1000&q=80'
  ],
  'orange-island': [
    '/src/assets/images/orange_island_1780510222587.png',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
  ],
  'luxor': [
    '/src/assets/images/luxor_temple_1780510256705.png',
    'https://images.unsplash.com/photo-1600577916048-804c9191e36c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1568322422390-f55db4d21def?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80'
  ],
  'cairo': [
    '/src/assets/images/cairo_pyramids_1780510238390.png',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1568322422390-f55db4d21def?auto=format&fit=crop&w=1000&q=80'
  ],
  'speedboat': [
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80'
  ],
  'horse-riding': [
    'https://images.unsplash.com/photo-1598974357801-cb814d6840fc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80'
  ],
  'cruise': [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80'
  ]
};

interface FlyerModalProps {
  tour: TourItem;
  isOpen: boolean;
  onClose: () => void;
  onQuickBook: (tour: TourItem) => void;
}

export default function FlyerModal({ tour, isOpen, onClose, onQuickBook }: FlyerModalProps) {
  const [adults, setAdults] = useState<number>(2);
  const [kids, setKids] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [hotel, setHotel] = useState<string>('');

  const images = GALLERY_IMAGES[tour.imageType] || [tour.imageUrl];
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Reset index when the tour selection changes
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
    }
  }, [tour.id, isOpen]);

  // Handle slide autoplay rotation
  useEffect(() => {
    if (!isPlaying || images.length <= 1 || !isOpen) return;
    const interval = identityInterval();
    return () => clearInterval(interval);

    function identityInterval() {
      return setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  }, [isPlaying, images.length, isOpen]);

  if (!isOpen) return null;

  // Generate automated pre-filled WhatsApp message
  const handleDirectWhatsApp = () => {
    const formattedDate = date ? `on *${date}*` : 'soon';
    const hotelText = hotel ? ` Staying at: *${hotel}*.` : '';
    const text = `Hello MAS Agency Travel! 🌴✨ I would like to book the *${tour.title}* adventure ${formattedDate}.
    
Details:
- Guests: *${adults} Adults* ${kids > 0 ? `and *${kids} Children*` : ''}
- Program: *${tour.title}* (${tour.duration})
- Meeting Point: *${tour.meetingPoint || 'Hotel Transfer'}*
${hotelText}

Please confirm availability and current ticket pricing. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="flyer-modal-container"
        className="relative w-full max-w-5xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-emerald-950/20"
      >
        
        {/* Top Header */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full border border-slate-800 text-slate-400 hover:text-white cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero banner representing the program with interactive image gallery carousel */}
        <div 
          className="relative border-b border-slate-900 shrink-0 min-h-[220px] md:min-h-[280px] flex flex-col justify-end overflow-hidden group/hero"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Multiple backdropped cover images cycling through */}
          {images.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl} 
              alt={`${tour.title} vista angle ${idx + 1}`}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out z-0 capitalize ${
                idx === currentSlideIndex 
                  ? 'opacity-40 scale-100' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}

          {/* Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/25 z-[2]" />
          <div className="absolute inset-0 bg-radial from-transparent to-slate-950/80 z-[2]" />

          {/* Quick status bar showing index count + pause/play status */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/85 border border-slate-800/80 rounded-full px-2.5 py-1 text-[10px] font-mono font-black text-slate-300 shadow-md">
              <span className="flex items-center gap-1">
                <Image className="w-3 h-3 text-emerald-400" />
                <span>{currentSlideIndex + 1} / {images.length}</span>
              </span>
              <span className="text-slate-800 font-normal">|</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
                title={isPlaying ? "Pause autoplay rotation" : "Resume autoplay rotation"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[9px] text-slate-500 font-normal">PLAYING</span>
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 text-slate-400 fill-slate-400" />
                    <span className="text-[9px] text-slate-500 font-normal">PAUSED</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Left/Right Carousel slide arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white z-10 opacity-0 group-hover/hero:opacity-100 transition-opacity cursor-pointer active:scale-90 shadow-md"
                aria-label="Previous destination angle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white z-10 opacity-0 group-hover/hero:opacity-100 transition-opacity cursor-pointer active:scale-90 shadow-md"
                aria-label="Next destination angle"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Interactive banner floating header context */}
          <div className="p-6 md:p-8 relative z-10 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {tour.category} program
                </span>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {tour.duration}
                </span>
              </div>

              {/* Page Indicator dot elements */}
              {images.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-900/60 p-1 rounded-full shadow-inner backdrop-blur-sm">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIndex(dotIdx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === currentSlideIndex 
                          ? 'bg-emerald-400 w-3.5' 
                          : 'bg-slate-600 hover:bg-slate-400'
                      }`}
                      title={`Observe slice ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {tour.title}
            </h2>
            {tour.arabicTitle && (
              <p className="text-emerald-400 font-sans text-sm md:text-base font-bold mt-1 drop-shadow" dir="rtl">
                {tour.arabicTitle}
              </p>
            )}
            <p className="font-sans text-xs md:text-sm text-slate-300 mt-2.5 max-w-2xl leading-relaxed drop-shadow">
              {tour.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 custom-scrollbar">
          
          {/* LEFT PANEL: Interactive Timeline & Location Factual details (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Quick Trip Details */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2.5">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase">Est. Duration</p>
                  <p className="text-sm font-semibold text-slate-200">{tour.duration}</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase">Meeting Point</p>
                  <p className="text-sm font-semibold text-slate-200">{tour.meetingPoint || 'Hotel Pickup Included'}</p>
                </div>
              </div>
            </div>

            {/* Description & Overview */}
            <div>
              <h3 className="font-display text-base font-bold text-slate-200 mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Program Experience Overview</span>
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Program Schedule Timeline */}
            <div>
              <h3 className="font-display text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Official Program Timetable</span>
              </h3>
              
              <div className="relative border-l border-slate-800 ml-3.5 space-y-6">
                {tour.schedule.map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Timestamp Dot */}
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950 group-hover:scale-110 transition-transform" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="font-mono text-xs text-amber-400 font-bold tracking-wide shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.time}
                      </span>
                      <h4 className="font-display text-sm font-bold text-slate-200">
                        {item.title}
                      </h4>
                    </div>
                    {item.description && (
                      <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Highlights list */}
            <div>
              <h3 className="font-display text-base font-semibold text-slate-200 mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((item, index) => (
                  <div key={index} className="flex gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-900/60 font-sans text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Included/Optional items & Direct WhatsApp Builder Form (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Services Lists */}
            <div className="space-y-6">
              
              {/* Included Services */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <h4 className="font-display font-bold text-sm text-emerald-400 mb-3 flex items-center gap-1.5">
                  <span className="p-1 rounded bg-emerald-400/10">🟢</span>
                  <span>INCLUDED SERVICES:</span>
                </h4>
                <ul className="space-y-2">
                  {tour.includedServices.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional Services */}
              {tour.optionalServices && tour.optionalServices.length > 0 && (
                <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <h4 className="font-display font-bold text-sm text-amber-500 mb-3 flex items-center gap-1.5">
                    <span className="p-1 rounded bg-amber-400/10">🟠</span>
                    <span>OPTIONAL SERVICES:</span>
                  </h4>
                  <ul className="space-y-2">
                    {tour.optionalServices.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Pricing Note */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-200 mb-1">Egypt Entry Requirements</p>
                <p className="leading-relaxed">Please bring your copy of passport identity, suitable swimwear, sunglasses, and high protective sunscreen cream for island/marine programs.</p>
              </div>
            </div>

            {/* Interactive Booking / WhatsApp constructor */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-display text-sm font-extrabold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp Inquiry</span>
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Adults</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Kids (0-11)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="20"
                      value={kids}
                      onChange={(e) => setKids(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Preferred Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Hotel Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Hilton Hurghada, Rixos"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="btn-whatsapp-send"
                    onClick={handleDirectWhatsApp}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-50 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/10 active:scale-98 cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <Send className="w-4 h-4 fill-slate-50 text-slate-50" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with quick-booking state toggle */}
        <div className="p-4 bg-slate-950 border-t border-slate-900 shrink-0 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-xs text-slate-400 font-mono">
            Booking reference number: MAS-{tour.id.slice(0, 4).toUpperCase()}
          </p>
          <div className="flex gap-2">
            <button
              id="modal-btn-cancel"
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:border-slate-700 font-display text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              id="modal-btn-confirm"
              onClick={() => {
                onClose();
                onQuickBook(tour);
              }}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-50 font-display font-bold text-xs cursor-pointer active:scale-95 transition-transform"
            >
              Open Booking Voucher Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
