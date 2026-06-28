/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, MapPin, Star, Sparkles, CheckCircle2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourItem } from '../types';
import { TOUR_PRICES } from '../data';

const TOUR_GALLERIES: Record<string, string[]> = {
  'hula-hula-sunset': [
    '/src/assets/images/hula_hula_sunset_1780510190387.png',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
  ],
  'paradise-submarine': [
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  ],
  'super-safari-desert': [
    '/src/assets/images/super_safari_1780510206707.png',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  ],
  'star-safari-science': [
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1539321908154-04927596764d?auto=format&fit=crop&w=800&q=80'
  ],
  'orange-island-full-day': [
    '/src/assets/images/orange_island_1780510222587.png',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'
  ],
  'discover-luxor-day': [
    '/src/assets/images/luxor_temple_1780510256705.png',
    'https://images.unsplash.com/photo-1608958223610-d0df2c7104b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543859846-9937107779b6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'
  ],
  'discover-cairo-pyramids': [
    '/src/assets/images/cairo_pyramids_1780510238390.png',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80'
  ],
  'speed-boat- dolphins': [
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570481662006-a3a13746fe4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80'
  ],
  'speed-boat--dolphins': [
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570481662006-a3a13746fe4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80'
  ],
  'horse-riding-beach-desert': [
    'https://images.unsplash.com/photo-1598974357801-cb814d6840fc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553285991-4c87029e50a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518815068914-038920b6f4c8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  ],
  'luxury-daily-cruise': [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  ]
};

const getTourGallery = (tourItem: TourItem): string[] => {
  const cleanId = tourItem.id.trim();
  const explicit = TOUR_GALLERIES[cleanId];
  if (explicit && explicit.length > 0) {
    return explicit;
  }
  return [
    tourItem.imageUrl,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
  ];
};

interface TourCardProps {
  key?: string;
  tour: TourItem;
  onViewItinerary: (tour: TourItem) => void;
  onQuickBook: (tour: TourItem) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (tour: TourItem) => void;
  selectedCurrency: string;
  formatPrice: (valueUSD: number) => string;
}

export default function TourCard({ 
  tour, 
  onViewItinerary, 
  onQuickBook, 
  isFavorited = false, 
  onToggleFavorite,
  selectedCurrency,
  formatPrice
}: TourCardProps) {
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const cleanId = tour.id.trim();
  const prices = TOUR_PRICES[cleanId] || { adult: 40, child: 20 };
  const gallery = getTourGallery(tour);

  // Return attractive styling classes or gradients according to the trip focus
  const getCardHeaderStyle = (type: string) => {
    switch (type) {
      case 'sunset':
        return 'from-amber-600/35 via-rose-600/20 to-slate-950';
      case 'submarine':
        return 'from-blue-600/35 via-cyan-800/25 to-slate-950';
      case 'safari':
        return 'from-orange-600/35 via-amber-800/25 to-slate-950';
      case 'star-safari':
        return 'from-violet-800/35 via-indigo-900/25 to-slate-950';
      case 'luxor':
        return 'from-yellow-700/35 via-amber-900/25 to-slate-950';
      case 'cairo':
        return 'from-yellow-600/35 via-orange-950/25 to-slate-950';
      case 'speedboat':
        return 'from-sky-500/35 via-indigo-950/20 to-slate-950';
      case 'horse-riding':
        return 'from-emerald-600/35 via-amber-900/20 to-slate-950';
      default:
        return 'from-teal-600/35 via-slate-900 to-slate-950';
    }
  };

  const getEmojiForType = (type: string) => {
    switch (type) {
      case 'sunset': return '🌅';
      case 'submarine': return '🤿';
      case 'safari': return '🏜️';
      case 'star-safari': return '🔭';
      case 'luxor': return '🏺';
      case 'cairo': return '🔺';
      case 'speedboat': return '⚡';
      case 'horse-riding': return '🐎';
      default: return '🌴';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/85 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-2xl hover:shadow-emerald-500/10" id={`tour-card-${tour.id}`}>
      
      {/* Decorative Glow background on hover */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card Visual Header with gorgeous gradient background simulating the flyers */}
      <div className={`relative h-52 w-full flex flex-col justify-between p-5 bg-gradient-to-b ${getCardHeaderStyle(tour.imageType)} overflow-hidden group/carousel`}>
        {/* Real background images featuring the tour in a carousel view */}
        <div className="absolute inset-0 z-0">
          {gallery.map((imgUrl, idx) => (
            <img 
              key={`${imgUrl}-${idx}`}
              src={imgUrl} 
              alt={`${tour.title} - Destination Scene ${idx + 1}`}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                idx === activeImgIdx 
                  ? 'opacity-55 scale-100 mix-blend-luminosity hover:mix-blend-normal group-hover/carousel:scale-110' 
                  : 'opacity-0 pointer-events-none scale-95'
              }`}
            />
          ))}
        </div>

        {/* Carousel indicators (dots) centered top-middle */}
        {gallery.length > 1 && (
          <div className="absolute top-14 left-1/3 right-1/3 flex items-center justify-center gap-1.5 z-20 mx-auto max-w-[120px] bg-slate-950/65 py-1 px-2 rounded-full border border-slate-800/40 backdrop-blur-xs opacity-85 hover:opacity-100 transition-all shadow-md">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveImgIdx(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeImgIdx 
                    ? 'bg-emerald-400 w-3' 
                    : 'bg-slate-500/80 hover:bg-slate-200'
                }`}
                title={`Go to view ${i + 1}`}
                aria-label={`Go to view ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Carousel navigation controls - left and right arrows */}
        {gallery.length > 1 && (
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 flex justify-between px-3 z-30 pointer-events-none">
            <button
              id={`carousel-prev-${tour.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveImgIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
              }}
              className="w-7 h-7 rounded-full bg-slate-950/90 hover:bg-emerald-500 border border-slate-800/80 hover:border-emerald-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-md scale-90 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:scale-100 duration-250"
              title="Previous image"
              aria-label="Previous destination image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id={`carousel-next-${tour.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
              }}
              className="w-7 h-7 rounded-full bg-slate-950/90 hover:bg-emerald-500 border border-slate-800/80 hover:border-emerald-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-md scale-90 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:scale-100 duration-250"
              title="Next image"
              aria-label="Next destination image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Subtle decorative grid overlay inside header */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-5 pointer-events-none" />
        
        {/* Animated particles */}
        <div className="absolute top-4 right-10 text-4xl opacity-80 select-none animate-bounce z-10 duration-1000">
          {getEmojiForType(tour.imageType)}
        </div>

        {/* Top bar with labels */}
        <div className="relative z-10 flex justify-between items-center w-full">
          {tour.badge ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-50 text-[10px] uppercase font-mono font-bold rounded-full tracking-wider shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              {tour.badge}
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] font-mono rounded-full uppercase tracking-wider">
              {tour.category}
            </span>
          )}
          
          <div className="flex items-center gap-2">
            <button
              id={`btn-fav-${tour.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(tour);
              }}
              className={`p-1.5 rounded-lg backdrop-blur-xs border transition-all duration-300 cursor-pointer active:scale-95 ${
                isFavorited 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30' 
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-400' : ''}`} />
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 text-amber-400 font-mono text-xs border border-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{tour.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal font-sans">({tour.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Bottom bar inside header */}
        <div className="relative z-10">
          <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase font-mono">
            {tour.priceEstimate}
          </p>
          <h3 className="font-display font-black text-xl text-white tracking-tight line-clamp-1">
            {tour.title}
          </h3>
          {tour.arabicTitle && (
            <p className="text-right text-xs text-slate-400/90 font-sans tracking-wide mt-0.5" dir="rtl">
              {tour.arabicTitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex-1 flex flex-col justify-between p-5 relative z-10 bg-slate-950/40">
        
        {/* Duration & Location bar */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-400 pb-3 border-b border-slate-900 mb-3.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>
        </div>

        {/* Short description */}
        <p className="font-sans text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3.5">
          {tour.description}
        </p>

        {/* Dynamic Recalculated Card Prices */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-900 mb-4 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider pl-1">
            Ticket Prices
          </span>
          <div className="flex gap-2 text-[11.5px] font-semibold items-center">
            <span className="font-sans text-slate-300">
              Adult: <strong className="font-mono text-emerald-400 font-black">{formatPrice(prices.adult)}</strong>
            </span>
            <span className="text-slate-805">|</span>
            <span className="font-sans text-slate-300">
              Child: <strong className="font-mono text-amber-500 font-black">{formatPrice(prices.child)}</strong>
            </span>
          </div>
        </div>

        {/* Quick Highlights Checkboxes list */}
        <div className="space-y-1.5 mb-5 shrink-0">
          {tour.highlights.slice(0, 3).map((hl, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{hl}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-900/60">
          <button
            id={`btn-view-${tour.id}`}
            onClick={() => onViewItinerary(tour)}
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 font-display font-medium text-xs text-slate-200 hover:bg-slate-900 active:scale-97 cursor-pointer transition-all duration-200"
          >
            Full Itinerary
          </button>
          <button
            id={`btn-book-${tour.id}`}
            onClick={() => onQuickBook(tour)}
            className="px-3.5 py-2.5 rounded-lg font-display font-bold text-xs bg-emerald-500 text-slate-50 hover:bg-emerald-400 active:scale-97 cursor-pointer transition-all duration-200"
          >
            Quick Book
          </button>
        </div>
      </div>
    </div>
  );
}
