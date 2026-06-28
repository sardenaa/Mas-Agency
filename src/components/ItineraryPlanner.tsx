/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, HelpCircle, FileText, Send, Sparkles, Compass, Check } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data';

interface ActivityOption {
  id: string;
  title: string;
  category: string;
  durationString: string;
  durationHours: number;
  emoji: string;
  description: string;
  recs?: string;
}

const AVAILABLE_ACTIVITIES: ActivityOption[] = [
  { id: 'buggy', title: 'Quad Desert Buggy Trial', category: 'Safari', durationString: '40 Minutes', durationHours: 0.75, emoji: '🏝️', description: 'Action-packed tour across the Hurghada dunes' },
  { id: 'spider', title: 'Spider Car Speed Circuit', category: 'Safari', durationString: '15 Minutes', durationHours: 0.25, emoji: '🏎️', description: 'Lightweight dune-crossing buggy adrenaline' },
  { id: 'jeep', title: 'Mountain Jeep Expedition', category: 'Safari', durationString: '2 Hours (50km)', durationHours: 2, emoji: '🚙', description: 'Drive deep into high mountain territory to a Bedouin village' },
  { id: 'camel', title: 'Sunset Camel Riding', category: 'Safari', durationString: '45 Minutes', durationHours: 0.75, emoji: '🐫', description: 'Take a serene ride on top of Bedouin camels' },
  { id: 'snorkel', title: 'Giftun Coral SnorkelingStop', category: 'Marine', durationString: '1.5 Hours', durationHours: 1.5, emoji: '🤿', description: 'Observe unique Red Sea coral reefs and exotic fish' },
  { id: 'submarine', title: 'Red Sea Submarine Window', category: 'Submarine', durationString: '30 Minutes', durationHours: 0.5, emoji: '⚓', description: 'Deep sea viewports perfect for family observation' },
  { id: 'bedouintea', title: 'Bedouin Tea Guest Tent', category: 'Safari', durationString: '1 Hour', durationHours: 1, emoji: '☕', description: 'Enjoy traditional Bedouin bread-making and aromatic charcoal tea' },
  { id: 'dinner', title: 'Barbecue Oriental Camp Dinner', category: 'Special', durationString: '1.5 Hours', durationHours: 1.5, emoji: '🍖', description: 'Hot grilled buffet with lively Tanoura oriental dancing show' },
  { id: 'telescope', title: 'Deep Space Stargazing', category: 'Safari', durationString: '1.5 Hours', durationHours: 1.5, emoji: '🔭', description: 'High-power telescope session identifying Saturn rings with astronomer guide' },
  { id: 'horsebeach', title: 'Coastline Horse Galloping', category: 'Special', durationString: '1 Hour', durationHours: 1, emoji: '🐎', description: 'Connect with gorgeous Arabian horses splashing close to Red Sea waves' },
  { id: 'horsedesert', title: 'Desert Mountain Dunes Ride', category: 'Special', durationString: '1 Hour', durationHours: 1, emoji: '🏜️', description: 'Gallop across the desert flats' },
  { id: 'poolparty', title: 'A/C Decks Pool Party', category: 'Special', durationString: '2 Hours', durationHours: 2, emoji: '🎵', description: 'Premium DJ tracks on the panoramic top deck' }
];

export default function ItineraryPlanner() {
  const [selectedActivities, setSelectedActivities] = useState<ActivityOption[]>([
    AVAILABLE_ACTIVITIES[0], // Buggy
    AVAILABLE_ACTIVITIES[3], // Camel
    AVAILABLE_ACTIVITIES[6], // Bedouin tea
    AVAILABLE_ACTIVITIES[8]  // Stargazing
  ]);

  const [date, setDate] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [leadName, setLeadName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [hotel, setHotel] = useState<string>('');

  const [successDraft, setSuccessDraft] = useState<boolean>(false);

  // Time Calculation
  const totalDurationHours = selectedActivities.reduce((acc, curr) => acc + curr.durationHours, 0);

  const handleAddActivity = (act: ActivityOption) => {
    // Put limits
    if (selectedActivities.find(item => item.id === act.id)) return;
    setSelectedActivities([...selectedActivities, act]);
    setSuccessDraft(false);
  };

  const handleRemoveActivity = (id: string) => {
    setSelectedActivities(selectedActivities.filter(item => item.id !== id));
    setSuccessDraft(false);
  };

  const handleSaveDraft = () => {
    setSuccessDraft(true);
    setTimeout(() => setSuccessDraft(false), 4000);
  };

  const handleWhatsAppCustomItinerary = () => {
    const formattedDate = date ? `on *${date}*` : 'soon';
    const hotelText = hotel ? `Staying at: *${hotel}*` : '';
    const activitiesList = selectedActivities.length > 0 
      ? selectedActivities.map((act, i) => `${i + 1}. [${act.category}] *${act.title}* (${act.durationString})`).join('\n')
      : 'Custom flexible combinations';

    const text = `Hello MAS Agency Travel! 🌴✨ I used your Custom Itinerary Builder to construct a personalized Egypt adventure!

Proposed Schedule Date: ${formattedDate}
Lead Traveler: *${leadName || 'Interested Guest'}*
Guests Count: *${guestsCount} Adults*
${hotelText ? `${hotelText}\n` : ''}
Selected Activities (${totalDurationHours.toFixed(1)} hrs total time):
${activitiesList}

${notes ? `Special Notes: "${notes}"\n` : ''}
Please check if MAS Travel can bundle this custom itinerary for us, and provide a price quote!`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  return (
    <div className="p-6 md:p-10 rounded-3xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-md relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
              <span className="text-amber-500">[ 02 ]</span>
              <span>CUSTOM ADVENTURE ARCHITECT</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Interactive Egypt Custom Itinerary Builder
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 my-4 rounded-full text-left" />
            <p className="font-sans text-sm text-slate-400 mt-1 max-w-2xl">
              Construct your absolute dream day by piling your favorite activities from our flyers. We will customize logistics, guides, and hotel transfers perfectly for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEP 1: All available blocks selector (5 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3.5 pb-2 border-b border-slate-900 uppercase tracking-wider">
                1. Select Programs to Add
              </h3>
              
              <div className="space-y-2 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                {AVAILABLE_ACTIVITIES.map((act) => {
                  const isSelected = selectedActivities.some(item => item.id === act.id);
                  return (
                    <div 
                      key={act.id} 
                      className={`group p-3 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'bg-emerald-950/20 border-emerald-500/30 opacity-60' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer'
                      }`}
                      onClick={() => !isSelected && handleAddActivity(act)}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl mt-0.5">{act.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-display font-extrabold text-xs text-slate-200 group-hover:text-amber-400 transition-colors">
                              {act.title}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest shrink-0">
                              {act.durationString}
                            </span>
                          </div>
                          <p className="font-sans text-[11px] text-slate-400 line-clamp-1 leading-normal mt-0.5">
                            {act.description}
                          </p>
                        </div>
                        
                        <div className="shrink-0 pt-0.5">
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-50 text-slate-400 flex items-center justify-center text-xs transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Selected visual schedule block (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-3.5">
                <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
                  2. Your Draft Timeline
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  {selectedActivities.length} Steps
                </span>
              </div>

              {selectedActivities.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Compass className="w-10 h-10 text-slate-700 mb-3 animate-spin duration-3000" />
                  <p className="text-xs text-slate-500 font-sans">No activities selected. Click the items on the left to queue up components of your custom day!</p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 custom-scrollbar">
                  {selectedActivities.map((act, index) => (
                    <div 
                      key={act.id} 
                      className="relative p-3 rounded-xl bg-slate-900 border border-slate-850 flex items-start justify-between gap-2.5 group/item hover:border-slate-750 transition-all"
                    >
                      {/* Interactive timing block connectors */}
                      {index < selectedActivities.length - 1 && (
                        <div className="absolute top-10 left-6.5 w-0.5 h-6 bg-slate-800" />
                      )}

                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm font-mono font-black text-amber-400">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-display font-bold text-xs text-slate-200">
                            <span>{act.emoji}</span>
                            <span className="line-clamp-1">{act.title}</span>
                          </div>
                          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
                            {act.category} • Est. {act.durationString}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRemoveActivity(act.id)}
                        className="p-1 px-1.5 rounded-lg border border-slate-850 hover:border-red-950 hover:bg-red-950/20 text-slate-500 hover:text-red-400 active:scale-95 transition-all text-xs cursor-pointer"
                        title="Remove segment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Summary Footer */}
                  <div className="pt-3.5 mt-4 border-t border-slate-900 grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 border border-slate-900 bg-slate-900/40 rounded-lg">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Total Hours</p>
                      <p className="font-display font-extrabold text-base text-white">{totalDurationHours.toFixed(1)} hrs</p>
                    </div>
                    <div className="p-2 border border-slate-900 bg-slate-900/40 rounded-lg">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Activity Fit</p>
                      <p className="font-display font-extrabold text-xs text-emerald-400">
                        {totalDurationHours > 12 ? 'Multi-Day trip' : '1 Full Day'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Draft Traveller voucher (3 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3.5 pb-2 border-b border-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>3. Guest Credentials</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Your Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Michael Smith"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Guests count</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Trip Date</label>
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Hurghada Hotel Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Steigenberger Al Dau"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Special Desires or Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. vegetarian dining, custom photographer, pick up from Soma Bay..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                {successDraft && (
                  <div className="p-3 bg-emerald-950/40 text-emerald-400 font-sans text-xs border border-emerald-500/20 rounded-lg flex gap-2 items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Voucher and Itinerary saved locally in your browser memory!</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="w-full py-2.5 rounded-lg border border-slate-800 hover:bg-slate-900 hover:border-slate-700 font-display font-semibold text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    Draft Quote locally
                  </button>
                  <button
                    id="btn-send-custom-itinerary"
                    onClick={handleWhatsAppCustomItinerary}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-50 font-display font-bold text-xs tracking-wider cursor-pointer active:scale-97 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                  >
                    <Send className="w-3.5 h-3.5 fill-slate-50" />
                    <span>Request Quotation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
