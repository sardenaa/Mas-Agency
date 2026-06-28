/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToggleLeft, Calendar, FileText, CheckCircle2, Ticket, MessageSquare, Send, X, Users, ClipboardCheck, ArrowRight } from 'lucide-react';
import { TourItem, BookingRequest } from '../types';
import { WHATSAPP_NUMBER, TOUR_PRICES } from '../data';

interface QuickBookingFormProps {
  tour: TourItem | null;
  onBookingSubmitted: (newBooking: BookingRequest) => void;
  onCancel: () => void;
  selectedCurrency: string;
  formatPrice: (valueUSD: number) => string;
  promoCodes?: Record<string, number>;
}

export default function QuickBookingForm({ 
  tour, 
  onBookingSubmitted, 
  onCancel,
  selectedCurrency,
  formatPrice,
  promoCodes = { GOLD10: 10 }
}: QuickBookingFormProps) {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [adults, setAdults] = useState<number>(2);
  const [kids, setKids] = useState<number>(0);
  const [hotel, setHotel] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formError, setFormError] = useState<string>('');
  
  // Promo code states
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string>('');
  const [promoErrorMsg, setPromoErrorMsg] = useState<string>('');

  if (!tour) return null;

  // Pricing calculations
  const cleanId = tour.id.trim();
  const pricing = TOUR_PRICES[cleanId] || { adult: 40, child: 20 };
  const adultsTotal = adults * pricing.adult;
  const kidsTotal = kids * pricing.child;
  const subtotal = adultsTotal + kidsTotal;
  const totalParticipants = adults + kids;
  const hasDiscount = totalParticipants >= 5;
  const discountAmount = hasDiscount ? subtotal * 0.1 : 0;
  
  // Promo percentage discount calculation
  const promoDiscountAmount = promoDiscountPercent > 0 ? (subtotal * (promoDiscountPercent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount - promoDiscountAmount);

  const handleApplyPromo = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;
    
    if (promoCodes[cleanCode] !== undefined) {
      setPromoDiscountPercent(promoCodes[cleanCode]);
      setPromoSuccessMsg(`🎉 Success! Promo code activated: Saved ${promoCodes[cleanCode]}% off standard rates.`);
      setPromoErrorMsg('');
    } else {
      setPromoDiscountPercent(0);
      setPromoErrorMsg('❌ Invalid promo code. Please double check administrative characters.');
      setPromoSuccessMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date) {
      setFormError('Please fill out Name, WhatsApp Number and preferred booking date.');
      return;
    }

    const draftBooking: BookingRequest = {
      id: `MAS-B-${Math.floor(1000 + Math.random() * 9000)}`,
      tourId: tour.id,
      tourTitle: tour.title,
      bookingDate: date,
      fullName,
      whatsappNumber: phone,
      adultsCount: adults,
      childrenCount: kids,
      specialRequests: notes,
      hotelName: hotel,
      createdAt: new Date().toISOString(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'client',
          note: 'Voucher drafted by guest and submitted for WhatsApp confirmation.'
        }
      ]
    };

    onBookingSubmitted(draftBooking);
    
    // Auto trigger WhatsApp message constructs
    const hotelLine = hotel ? `Staying at: *${hotel}*` : '';
    const notesLine = notes ? `Note: "${notes}"` : '';

    const discountLine = hasDiscount 
      ? `Original Price: ${formatPrice(subtotal)}\n*Group Saver Discount (10% Off Applied!):* -${formatPrice(discountAmount)}` 
      : '';

    const promoLine = promoDiscountPercent > 0
      ? `*Promo Discount Code Applied (${promoInput.trim().toUpperCase()} -${promoDiscountPercent}%):* -${formatPrice(promoDiscountAmount)}`
      : '';

    const text = `Hi MAS Agency Travel! 🌴✨ I just drafted a reservation voucher on your website:

Voucher ID: *${draftBooking.id}*
Selected Adventure: *${tour.title}* (${tour.duration})
Travel Date: *${date}*
Lead Guest: *${fullName}* (WA: ${phone})
Quantity: *${adults} Adults* ${kids > 0 ? `and *${kids} Kids*` : ''}
${hotelLine ? `${hotelLine}\n` : ''}${notesLine ? `${notesLine}\n` : ''}
*Estimated Price Details:*
Adults Total: ${formatPrice(adultsTotal)} ${kids > 0 ? `\nChildren Total: ${formatPrice(kidsTotal)}` : ''}
${discountLine ? `${discountLine}\n` : ''}${promoLine ? `${promoLine}\n` : ''}*Locked Draft Total:* *${formatPrice(finalTotal)}*

Please review my reservation details to confirm availability!`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-lg mx-auto relative overflow-hidden">
      {/* Decorative label */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

      <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-5 text-left">
        <div>
          <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            Adventure Voucher Builder
          </span>
          <h3 className="font-display font-black text-lg text-white mt-1">
            Book: {tour.title}
          </h3>
        </div>
        <button 
          id="btn-close-booking"
          onClick={onCancel}
          className="p-1 px-2 border border-slate-800 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg text-xs text-red-400 mb-4 font-sans text-left">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
            Full Name of Lead Guest *
          </label>
          <input 
            type="text"
            required
            placeholder="e.g. Sarah Jenkins"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* WhatsApp & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
              WhatsApp Number *
            </label>
            <input 
              type="tel"
              required
              placeholder="e.g. +447123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
              Preferred Date *
            </label>
            <input 
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Adults & Kids count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
              Adults Count
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                min="1"
                max="30"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
              Children (under 12)
            </label>
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

        {/* Hotel Transfer info */}
        <div>
          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
            Pickup Hotel in Hurghada (Optional)
          </label>
          <input 
            type="text"
            placeholder="e.g. Sunrise Crystal Bay, Marina Lobby"
            value={hotel}
            onChange={(e) => setHotel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
            Special Requirements / Requests
          </label>
          <textarea 
            rows={2}
            placeholder="Any extra requests, flight delays, snorkeling equipment sizes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Promo Code input field */}
        <div className="p-3.5 rounded-xl border border-slate-805 bg-slate-950/40">
          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">
            Apply Administrative Promo Code
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="e.g. GOLD10, AUTUMN25"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono tracking-wider uppercase text-white placeholder:text-slate-705 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-755 text-slate-200 hover:text-white rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {promoSuccessMsg && (
            <p className="text-[10.5px] text-emerald-400 mt-2 font-medium">{promoSuccessMsg}</p>
          )}
          {promoErrorMsg && (
            <p className="text-[10.5px] text-rose-450 mt-2 font-medium">{promoErrorMsg}</p>
          )}
        </div>

        {/* Live Cost Estimate and Auto-Discount Display */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/85 space-y-3 font-sans shadow-inner">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
            <span className="font-mono text-[9px] text-slate-450 font-bold uppercase tracking-wider">
              Cost Calculation
            </span>
            <span className="font-mono text-[9px] text-emerald-450 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/10">
              Recalculated in {selectedCurrency}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>{adults} × Adult{adults > 1 ? 's' : ''} ({formatPrice(pricing.adult)} ea)</span>
              <span className="font-mono text-slate-300">{formatPrice(adultsTotal)}</span>
            </div>
            {kids > 0 && (
              <div className="flex justify-between">
                <span>{kids} × Child{kids > 1 ? 'ren' : ''} ({formatPrice(pricing.child)} ea)</span>
                <span className="font-mono text-slate-300">{formatPrice(kidsTotal)}</span>
              </div>
            )}
            
            {hasDiscount && (
              <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-1 rounded border border-emerald-500/10 items-center justify-between flex-row">
                <span className="flex items-center gap-1">
                  <span>🎉 10% Group Saver Applied</span>
                </span>
                <span className="font-mono">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            {promoDiscountPercent > 0 && (
              <div className="flex justify-between text-indigo-400 font-semibold bg-indigo-950/20 px-2 py-1 rounded border border-indigo-500/10 items-center justify-between flex-row">
                <span className="flex items-center gap-1">
                  <span>💫 Promo Discount Applied ({promoDiscountPercent}%)</span>
                </span>
                <span className="font-mono">-{formatPrice(promoDiscountAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
            <span className="text-xs font-bold text-slate-200">Estimated Total</span>
            <div className="text-right">
              <span className="font-display font-black text-emerald-400 text-base font-extrabold">
                {formatPrice(finalTotal)}
              </span>
              {(hasDiscount || promoDiscountPercent > 0) && (
                <span className="block text-[9.5px] text-slate-500 line-through font-mono">
                  {formatPrice(subtotal)}
                </span>
              )}
            </div>
          </div>
          {hasDiscount && (
            <p className="text-[10px] text-emerald-500 font-sans italic">
              Group Saver discount automatically unlocked for 5 or more adventurers!
            </p>
          )}
        </div>

        {/* Guidelines Reminder */}
        <div className="p-3 bg-emerald-950/20 text-slate-400 font-sans text-[11px] border border-emerald-500/10 rounded-lg">
          <p className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Factual Traveler Reminder</span>
          </p>
          Our team coordinates roundtrip transfers directly from Hurghada tourist hotels. Pickups from distant locations (Makadi, El Gouna, Safaga) may have minor extra tourist travel charges.
        </div>

        {/* Submission buttons */}
        <div className="pt-2 flex gap-3.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-slate-800 text-slate-400 hover:text-white rounded-lg font-display text-xs cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            id="submit-booking-voucher"
            type="submit"
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-50 rounded-lg font-display font-extrabold text-xs tracking-wider cursor-pointer active:scale-97 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 animate-premium-gold"
          >
            <span>Lock Voucher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
