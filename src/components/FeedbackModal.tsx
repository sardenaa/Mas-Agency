/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare, Heart, ShieldAlert, Sparkles, Check, Loader2, Camera, Compass } from 'lucide-react';
import { Review, BookingRequest } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
  bookings: BookingRequest[];
}

const COMMON_COUNTRIES = [
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
];

// Preset options for travel memories to choose from or use as base
const MEMORY_PHOTO_PRESETS = [
  {
    id: 'island-snorkel',
    title: '🐬 Island Snorkeling & Dolphins',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    prompt: 'Hyper-vibrant underwater snorkeling with wild dolphins, soft coral shafts of light under Red Sea cyan water'
  },
  {
    id: 'desert-buggy',
    title: '🦂 Grand Sahara Desert Buggy',
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    prompt: 'Quad buggy speeding through massive desert sand dunes during golden hour sunset'
  },
  {
    id: 'pyramids-sunset',
    title: '🐪 Giza Pyramids Ancient Sunset',
    url: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=800&q=80',
    prompt: 'Giza Pyramids towering in orange twilight haze, camel silhouette on gold sands'
  },
  {
    id: 'coral-submarine',
    title: '🐠 Marine Submarine Coral Portal',
    url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    prompt: 'Glorious deep ocean coral reef with school of yellow clownfish seen from giant glass circular viewport'
  },
  {
    id: 'yacht-sunset',
    title: '⛵ Sunset Marina Yacht sail',
    url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
    prompt: 'Royal Red Sea white multi-deck sailing yacht sailing away into a pristine violet-gold sundown'
  },
  {
    id: 'luxor-temple',
    title: '🏛️ Luxor Obelisk Columns',
    url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
    prompt: 'Giant ancient Egyptian hieroglyphic columns illuminated at night under starlight sky'
  },
  {
    id: 'bedouin-fire',
    title: '🔥 Bedouin Camp Stargazing Dome',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    prompt: 'Cozy Bedouin campfire fire pit with travelers watching clear Milky Way night sky with massive telescope'
  }
];

export default function FeedbackModal({ isOpen, onClose, onSubmitReview, bookings }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [countryType, setCountryType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetCountry, setSelectedPresetCountry] = useState<string>('United Kingdom 🇬🇧');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [reviewMessage, setReviewMessage] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Voucher lookup & linking state
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  
  // AI Image generation states
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [attachedImageUrl, setAttachedImageUrl] = useState<string>('');

  // Automatically update passenger name if they select a booking
  useEffect(() => {
    if (selectedBookingId && bookings) {
      const match = bookings.find(b => b.id === selectedBookingId);
      if (match) {
        setName(match.fullName);
      }
    }
  }, [selectedBookingId, bookings]);

  if (!isOpen) return null;

  // Run a fake high-fidelity image generation loader with steps
  const handleGenerateAiImage = () => {
    if (isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    setGenerationProgress(5);
    setGenerationStep('Initializing AI Stable diffusion pipeline...');

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 1;
        
        if (next >= 100) {
          clearInterval(interval);
          
          // Select source image URL based on custom prompt or nearest preset
          let finalUrl = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'; // default
          
          // Search if they typed buggy, safari, pyramids etc
          const lowerPrompt = customPrompt.toLowerCase();
          if (lowerPrompt.includes('safari') || lowerPrompt.includes('buggy') || lowerPrompt.includes('quad') || lowerPrompt.includes('desert')) {
            finalUrl = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80';
          } else if (lowerPrompt.includes('pyramid') || lowerPrompt.includes('egypt') || lowerPrompt.includes('giza') || lowerPrompt.includes('camel')) {
            finalUrl = 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=800&q=80';
          } else if (lowerPrompt.includes('sub') || lowerPrompt.includes('submarine') || lowerPrompt.includes('clownfish') || lowerPrompt.includes('fish')) {
            finalUrl = 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80';
          } else if (lowerPrompt.includes('yacht') || lowerPrompt.includes('boat') || lowerPrompt.includes('cruise') || lowerPrompt.includes('ship')) {
            finalUrl = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80';
          } else if (lowerPrompt.includes('temple') || lowerPrompt.includes('luxor') || lowerPrompt.includes('cairo')) {
            finalUrl = 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80';
          } else if (lowerPrompt.includes('fire') || lowerPrompt.includes('camp') || lowerPrompt.includes('star') || lowerPrompt.includes('telescope')) {
            finalUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80';
          } else {
            // Pick a preset or generate a dynamic premium picsum placeholder if they entered random values!
            const cleanPrompt = encodeURIComponent(customPrompt.slice(0, 30));
            finalUrl = `https://picsum.photos/seed/${cleanPrompt}/800/600`;
          }

          setAttachedImageUrl(finalUrl);
          setIsGeneratingImage(false);
          setGenerationProgress(100);
          return 100;
        }

        // Cycle through detailed steps
        if (next < 25) {
          setGenerationStep('Tuning Egyptian lighting parameters...');
        } else if (next < 50) {
          setGenerationStep('Adding atmospheric Red Sea refraction details...');
        } else if (next < 75) {
          setGenerationStep('Simulating photo grain & retro polaroid frame tint...');
        } else {
          setGenerationStep('Assembling visual high-fidelity layers...');
        }

        return next;
      });
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name/alias.');
      return;
    }

    const finalCountry = countryType === 'preset' 
      ? selectedPresetCountry 
      : customCountry.trim();

    if (!finalCountry.trim()) {
      setFormError('Please specify your country or origin.');
      return;
    }

    if (!reviewMessage.trim() || reviewMessage.trim().length < 10) {
      setFormError('Please write a slightly longer honest review message (at least 10 characters).');
      return;
    }

    // Capture dynamic month & year for Egypt Travel Agency
    const dateObj = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthYear = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    // Construct unique id for helper buttons mapping
    const randomId = 'rev-' + Math.random().toString(36).substr(2, 9);

    // Construct the Review entity
    const newReview: Review = {
      id: randomId,
      name: name.trim(),
      country: finalCountry,
      review: reviewMessage.trim(),
      rating,
      date: currentMonthYear,
      helpfulCount: 0,
      bookingId: selectedBookingId || undefined,
      imageUrl: attachedImageUrl || undefined
    };

    onSubmitReview(newReview);
    
    // Reset state & close
    setName('');
    setReviewMessage('');
    setRating(5);
    setCustomCountry('');
    setCountryType('preset');
    setSelectedBookingId('');
    setAttachedImageUrl('');
    setSelectedPresetId('');
    setCustomPrompt('');
    onClose();
  };

  return (
    <div id="feedback-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        id="feedback-modal-box" 
        className="relative w-full max-w-xl bg-[#0f0e0c] border border-slate-850 rounded-2xl shadow-2xl p-5 md:p-7 overflow-y-auto max-h-[92vh] custom-scrollbar"
      >
        {/* Dismiss Button */}
        <button
          id="close-feedback-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Dismiss feedback modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Egypt Guest Book Submission</span>
          </div>
          <h3 className="font-display font-black text-xl text-white">
            Share Your Experience
          </h3>
          <p className="font-sans text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Your memory transforms local tourism standards. Attach your verified voucher to display credit details publicly!
          </p>
        </div>

        {formError && (
          <div id="feedback-form-error-banner" className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/20 flex items-start gap-2 text-red-300 text-xs text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* OPTIONAL VOUCHER LINKER SECTION */}
          <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#d4cbbd] font-bold">
                🔗 Link Private Voucher (Optional)
              </span>
              {selectedBookingId && (
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Checked verified
                </span>
              )}
            </div>
            {bookings.length === 0 ? (
              <p className="text-[10px] text-slate-500 text-left">
                No active voucher stubs found in your local browser storage. Book a tour first to unlock the <strong className="text-emerald-450 font-black">Verified Booker</strong> status badge!
              </p>
            ) : (
              <div className="space-y-1">
                <select
                  id="voucher-id-select-reviewer"
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                >
                  <option value="">-- Select Your Active Voucher --</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#1c1917] text-slate-200">
                      🎫 {b.tourTitle} ({b.id}) - {b.fullName}
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-slate-500 text-left mt-0.5">
                  Select your active voucher to display the prestigious <b>Verified Booker</b> badge on your testimonial card.
                </p>
              </div>
            )}
          </div>

          {/* Star Selection Rating */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center justify-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Your Expedition Rating
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const filled = hoveredRating !== null 
                  ? starVal <= hoveredRating 
                  : starVal <= rating;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoveredRating(starVal)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-0.5 text-slate-650 hover:text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    title={`Rate ${starVal} Star${starVal > 1 ? 's' : ''}`}
                    id={`feedback-star-${starVal}`}
                  >
                    <Star 
                      className={`w-7 h-7 transition-colors ${
                        filled 
                          ? 'fill-amber-450 text-amber-450' 
                          : 'text-slate-800 hover:text-slate-550'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
            <span className="font-sans font-bold text-xs text-[#d4cbbd]">
              {rating === 5 && '🌟 Unforgettable! (5 Out of 5)'}
              {rating === 4 && '✨ Very Good! (4 Out of 5)'}
              {rating === 3 && '👍 Good / Average (3 Out of 5)'}
              {rating === 2 && '⚠️ Needs Some Work (2 Out of 5)'}
              {rating === 1 && '👎 Poor / Disappointed (1 Out of 5)'}
            </span>
          </div>

          {/* Name & Country Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label htmlFor="feedback-name" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                Lead Adventurer Name
              </label>
              <input 
                id="feedback-name"
                type="text"
                placeholder="e.g. Liam Thompson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-amber-500/40 transition-colors"
                maxLength={40}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold text-left">
                  Country or Origin
                </label>
                <button
                  type="button"
                  onClick={() => setCountryType(countryType === 'preset' ? 'custom' : 'preset')}
                  className="text-[8px] font-mono font-bold uppercase text-amber-500 hover:underline"
                  id="toggle-country-selector-btn"
                >
                  {countryType === 'preset' ? 'Type Custom' : 'Use Presets'}
                </button>
              </div>

              {countryType === 'preset' ? (
                <select
                  id="feedback-preset-country-select"
                  value={selectedPresetCountry}
                  onChange={(e) => setSelectedPresetCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/40 cursor-pointer"
                >
                  {COMMON_COUNTRIES.map((ct) => (
                    <option key={ct.name} value={`${ct.name} ${ct.flag}`} className="bg-[#1c1917] text-slate-200">
                      {ct.flag} {ct.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input 
                  id="feedback-custom-country-input"
                  type="text"
                  placeholder="e.g. Ireland 🇮🇪"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-amber-500/40 transition-colors"
                  maxLength={30}
                />
              )}
            </div>
          </div>

          {/* DYNAMIC POST TRIP AI MEMORY IMAGE ATTACHMENT */}
          <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#d4cbbd] font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-450" />
                <span>AI Photo Memory Attachment</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAiMode(!isAiMode)}
                className="text-[9.5px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-md px-2 py-0.5 hover:bg-emerald-550/20 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiMode ? 'Show Presets' : 'Custom Prompt Art'}
              </button>
            </div>

            {/* If preset selection is active */}
            {!isAiMode ? (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500">
                  Select one verified highlight visual to embed in your review block from our high-res camera archive:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-24 overflow-y-auto custom-scrollbar p-1 border border-slate-900/60 rounded bg-slate-980">
                  {MEMORY_PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setAttachedImageUrl(preset.url);
                      }}
                      className={`text-left p-1 rounded border text-[9px] font-sans truncate transition-all flex items-center gap-1 ${
                        selectedPresetId === preset.id
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50'
                          : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-900'
                      }`}
                    >
                      <span className="truncate">{preset.title}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetId('none');
                      setAttachedImageUrl('');
                    }}
                    className={`text-left p-1 rounded border text-[9px] font-mono truncate transition-all flex items-center justify-center ${
                      selectedPresetId === 'none' || !attachedImageUrl
                        ? 'bg-slate-900 text-slate-200 border-slate-500'
                        : 'bg-slate-950 text-slate-500 border-slate-900'
                    }`}
                  >
                    🚫 No Image
                  </button>
                </div>
              </div>
            ) : (
              /* Custom prompt creator */
              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-500">
                  Provide keywords or describe your custom experience details (e.g. <i>"snorkeling reef turtles sunset"</i> or <i>"fast dune buggy polaroid vintage art style"</i>). Our AI will formulate your postcard:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Describe your Red Sea memory..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiImage}
                    disabled={isGeneratingImage || !customPrompt.trim()}
                    className="px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-display font-black uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGeneratingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{isGeneratingImage ? 'Drawing...' : 'AI Draw'}</span>
                  </button>
                </div>

                {isGeneratingImage && (
                  <div className="space-y-1.5 p-2 bg-slate-950 border border-slate-900 rounded-lg">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-450">
                      <span className="animate-pulse">{generationStep}</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-1 transition-all duration-300 rounded-full" 
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview of Attached Image */}
            {attachedImageUrl && (
              <div className="relative mt-2 p-1.5 bg-slate-900 border border-slate-800 rounded-lg max-w-[170px] mx-auto group">
                <img 
                  src={attachedImageUrl} 
                  alt="Review Visual Memo Attachment" 
                  className="w-full h-24 object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAttachedImageUrl('');
                    setSelectedPresetId('');
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-650 hover:bg-red-600 text-slate-50 p-1 rounded-full shadow-md transition-colors cursor-pointer"
                  title="Remove image memo"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1.5 text-[8.5px] font-mono bg-slate-950/70 py-0.5 px-1.5 text-emerald-400 rounded border border-emerald-500/20 backdrop-blur-xs select-none">
                  AI Illustrated 💫
                </div>
              </div>
            )}
          </div>

          {/* Feedback message */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label htmlFor="feedback-comment" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                Your Review Message
              </label>
              <span className="font-mono text-[8px] text-slate-550 font-bold">
                {reviewMessage.length} / 500 characters
              </span>
            </div>
            <textarea
              id="feedback-comment"
              placeholder="Tell other travelers about your Red Sea snorkeling, the quality of safari lunch, stargazing telescopes, boat safety standards, etc..."
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-amber-500/40 transition-colors min-h-[90px] max-h-[160px] custom-scrollbar"
              maxLength={500}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-white font-display font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              id="cancel-feedback-btn"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-650 hover:from-emerald-400 hover:to-emerald-550 text-slate-950 hover:text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98"
              id="submit-feedback-btn"
            >
              Publish Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
