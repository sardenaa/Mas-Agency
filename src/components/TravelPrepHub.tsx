/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Info, 
  Camera, 
  Briefcase, 
  Sun, 
  ShieldCheck, 
  Palmtree, 
  Sparkles, 
  Smartphone, 
  Users,
  Download,
  Plus,
  Trash2,
  FileText,
  RefreshCw,
  Check,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import WeatherForecast from './WeatherForecast';
import { BookingRequest } from '../types';
import { DISPLAY_PHONE, WHATSAPP_NUMBER, ALL_TOURS } from '../data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Do I have to pay in advance when booking?",
    answer: "No upfront fees! Since we operate on trust and want to keep booking safe, you only secure a draft ticket stub voucher online. Payment is settled securely with our tour driver or coordinator in cash (USD, EUR, GBP, or EGP) on the morning of your actual excursion."
  },
  {
    question: "How are resort pickups and transfers coordinated?",
    answer: "All MAS Agency packages include complimentary hotel round-trip transfers in air-conditioned vans anywhere inside Hurghada city center! Once you submit your voucher stub on WhatsApp, the coordinator locks your pickup timing based on your resort name."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that flight plans or health conditions change. You can cancel or reschedule any booked tour completely free of charge! Simply send a WhatsApp notification at least 12 hours prior to your scheduled pickup time."
  },
  {
    question: "Are diving gear, snorkeling masks, and life jackets supplied?",
    answer: "Yes, fully supplied! All standard life jackets, diving suites, fins, and professional snorkel breathing sets are provided clean and sanitized onboard with our professional divers and lifeguards at zero extra cost."
  }
];

type ChecklistCategory = 'island-marine' | 'desert-safari' | 'pyramids-luxor';

interface ChecklistItem {
  text: string;
  important: boolean;
}

const CHECKLIST_DATA: Record<ChecklistCategory, { title: string, description: string, items: ChecklistItem[] }> = {
  'island-marine': {
    title: "🏝️ Island & Sea Cruises",
    description: "Cruising to Orange Bay, Hula Hula Sunset, or Dolphin bays",
    items: [
      { text: "Copy or photo of your Passport (Mandatory for Coast Guard checks)", important: true },
      { text: "Towel (Resort hotels supply free beach towels to carry with you)", important: true },
      { text: "Waterproof pouch for your phone & camera", important: false },
      { text: "Reef-safe water-resistant Sunscreen (SPF 50+ strongly recommended)", important: true },
      { text: "Proper Swimsuits, shades, and light sun-shielding hat", important: false },
      { text: "Pocket cash (EGP or USD) for fresh island juice bars or souvenirs", important: false }
    ]
  },
  'desert-safari': {
    title: "🏜️ Desert Safari & Buggies",
    description: "Driving quads and visiting Bedouin deep mountain tents",
    items: [
      { text: "Keffiyeh / Scarf (Can be bought locally at our stable center)", important: true },
      { text: "Protective sunglasses (Crucial to block blowing sands and dust)", important: true },
      { text: "Comfy sportswear and flat sports shoes / sneakers", important: true },
      { text: "Long light trousers (Highly protects legs from quad engine heat)", important: true },
      { text: "Camera or phone strap to prevent dropping while riding buggies", important: false },
      { text: "Moist body wipes to refresh after driving sand circuits", important: false }
    ]
  },
  'pyramids-luxor': {
    title: "🔺 Ancient Pyramid Valley Trips",
    description: "Exploring Giza plateaus, sphinx crypts, and Luxor colonnades",
    items: [
      { text: "Fully charged backup power-bank for extensive pharaonic photography", important: false },
      { text: "Breathable cotton clothing (Temples under desert cliffs fetch high day heat)", important: true },
      { text: "Highly comfortable hiking sandals or strong walking sneakers", important: true },
      { text: "Cash for entry tickets inside internal tomb chambers if not pre-included", important: true },
      { text: "Equestrian caps, hats, and folding hand fans for sun shading", important: false },
      { text: "Extra bottled mineral water to stay thoroughly hydrated", important: true }
    ]
  }
};

const checklistContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    }
  }
};

const checklistItemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 26 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    x: -8,
    transition: { duration: 0.18, ease: "easeInOut" }
  }
};

export default function TravelPrepHub({ bookings }: { bookings?: BookingRequest[] }) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [checklistCat, setChecklistCat] = useState<ChecklistCategory>('island-marine');
  
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mas_travel_pack_checked');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading checked states', e);
      return {};
    }
  });
  
  // Custom smart generator states
  const [vouchers, setVouchers] = useState<BookingRequest[]>([]);
  const [checklistMode, setChecklistMode] = useState<'smart-generator' | 'standard'>('smart-generator');
  
  const [customItems, setCustomItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mas_travel_pack_custom');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading custom items', e);
      return [];
    }
  });

  const [newItemText, setNewItemText] = useState('');
  const [hidePacked, setHidePacked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mas_travel_pack_hide_packed');
      return saved ? JSON.parse(saved) === true : false;
    } catch {
      return false;
    }
  });
  
  const [selectedTourIds, setSelectedTourIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mas_travel_pack_selected_tours');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading selected tours', e);
      return [];
    }
  });

  // Simulation toggles for users with no booked tours yet
  const [simulatedIsland, setSimulatedIsland] = useState(false);
  const [simulatedSafari, setSimulatedSafari] = useState(false);
  const [simulatedDaytrip, setSimulatedDaytrip] = useState(false);
  const [simulatedKids, setSimulatedKids] = useState(false);

  // Write changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mas_travel_pack_checked', JSON.stringify(checkedStates));
    } catch (e) {
      console.error('Error saving checked states', e);
    }
  }, [checkedStates]);

  useEffect(() => {
    try {
      localStorage.setItem('mas_travel_pack_custom', JSON.stringify(customItems));
    } catch (e) {
      console.error('Error saving custom items', e);
    }
  }, [customItems]);

  useEffect(() => {
    try {
      localStorage.setItem('mas_travel_pack_selected_tours', JSON.stringify(selectedTourIds));
    } catch (e) {
      console.error('Error saving selected tours', e);
    }
  }, [selectedTourIds]);

  useEffect(() => {
    try {
      localStorage.setItem('mas_travel_pack_hide_packed', JSON.stringify(hidePacked));
    } catch (e) {
      console.error('Error saving hide packed state', e);
    }
  }, [hidePacked]);

  // Sync selectedTourIds with vouchers
  useEffect(() => {
    if (vouchers.length > 0) {
      const voucherTourIds = vouchers.map(v => v.tourId);
      setSelectedTourIds(prev => {
        const unique = Array.from(new Set([...prev, ...voucherTourIds]));
        return unique;
      });
    }
  }, [vouchers]);

  // Sync voucher bookings from props or local storage
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      setVouchers(bookings);
    } else {
      const saved = localStorage.getItem('mas_travel_vouchers');
      if (saved) {
        try {
          setVouchers(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing local vouchers:', e);
        }
      }
    }
  }, [bookings]);

  // Keep state updated in case localStorage items change inside other active views
  useEffect(() => {
    const handleStorageChange = () => {
      if (!bookings) {
        const saved = localStorage.getItem('mas_travel_vouchers');
        if (saved) {
          try {
            setVouchers(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [bookings]);

  const toggleFAQ = (idx: number) => {
    setActiveFAQ(activeFAQ === idx ? null : idx);
  };

  const handleToggleCheck = (itemText: string) => {
    setCheckedStates(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const clean = newItemText.trim();
    if (!customItems.includes(clean)) {
      setCustomItems(prev => [...prev, clean]);
    }
    setNewItemText('');
  };

  const handleRemoveCustomItem = (itemText: string) => {
    setCustomItems(prev => prev.filter(item => item !== itemText));
    setCheckedStates(prev => {
      const copy = { ...prev };
      delete copy[itemText];
      return copy;
    });
  };

  // Drag and drop sorting states
  const [itemOrders, setItemOrders] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('mas_travel_pack_orders');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [draggedText, setDraggedText] = useState<string | null>(null);
  const [draggedCategoryName, setDraggedCategoryName] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mas_travel_pack_orders', JSON.stringify(itemOrders));
    } catch (e) {
      console.error('Error saving item orders', e);
    }
  }, [itemOrders]);

  const handleReorderCategoryItems = (categoryName: string, draggedItemText: string, targetItemText: string) => {
    const categoryItems = getSmartGeneratorItems().filter(item => item.category === categoryName);
    const customOrder = itemOrders[categoryName] || [];
    
    const currentOrderedTexts = [...categoryItems]
      .sort((a, b) => {
        const idxA = customOrder.indexOf(a.text);
        const idxB = customOrder.indexOf(b.text);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      })
      .map(item => item.text);

    const draggedIndex = currentOrderedTexts.indexOf(draggedItemText);
    const targetIndex = currentOrderedTexts.indexOf(targetItemText);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...currentOrderedTexts];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setItemOrders(prev => ({
      ...prev,
      [categoryName]: newOrder
    }));
  };

  const handleReorderCustomItems = (draggedIdx: number, targetIdx: number) => {
    const reordered = [...customItems];
    const [removed] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, removed);
    setCustomItems(reordered);
  };

  const currentChecklist = CHECKLIST_DATA[checklistCat];

  // Dynamic booking logic segment queries
  const isMarineActive = simulatedIsland || selectedTourIds.some(id => {
    const tour = ALL_TOURS.find(t => t.id === id);
    return tour?.category === 'island' || tour?.category === 'marine' || tour?.category === 'submarine';
  }) || vouchers.some(v => {
    const title = v.tourTitle.toLowerCase();
    const id = v.tourId.toLowerCase();
    return title.includes('sunset') || title.includes('island') || title.includes('cruise') || 
           title.includes('marine') || title.includes('submarine') || title.includes('dolphin') || 
           title.includes('speedboat') || title.includes('beach') || id.includes('island') || 
           id.includes('submarine') || id.includes('hula-hula') || id.includes('dolphin');
  });

  const isSafariActive = simulatedSafari || selectedTourIds.some(id => {
    const tour = ALL_TOURS.find(t => t.id === id);
    return tour?.category === 'safari';
  }) || vouchers.some(v => {
    const title = v.tourTitle.toLowerCase();
    const id = v.tourId.toLowerCase();
    return title.includes('safari') || title.includes('quad') || title.includes('buggy') || 
           title.includes('desert') || id.includes('safari');
  });

  const isHistoricalActive = simulatedDaytrip || selectedTourIds.some(id => {
    const tour = ALL_TOURS.find(t => t.id === id);
    return tour?.category === 'day-trip';
  }) || vouchers.some(v => {
    const title = v.tourTitle.toLowerCase();
    const id = v.tourId.toLowerCase();
    return title.includes('luxor') || title.includes('cairo') || title.includes('pyramids') || 
           title.includes('day-trip') || title.includes('temple') || title.includes('giza') || 
           id.includes('luxor') || id.includes('cairo') || id.includes('pyramids');
  });

  const isSpecialActive = selectedTourIds.some(id => {
    const tour = ALL_TOURS.find(t => t.id === id);
    return tour?.category === 'special';
  }) || vouchers.some(v => {
    const title = v.tourTitle.toLowerCase();
    const id = v.tourId.toLowerCase();
    return title.includes('horse') || title.includes('riding') || title.includes('stable') || id.includes('horse') || id.includes('riding');
  });

  const isKidsActive = simulatedKids || vouchers.some(v => v.childrenCount > 0);

  // Compile full generator dataset Dynamically
  const getSmartGeneratorItems = () => {
    const items: { text: string; important: boolean; category: string; description: string }[] = [];

    // General Items (Always present)
    items.push(
      { text: "Copy or high-quality photo of Passport (Highly mandatory for police road check-points and Coast Guard authorizations)", important: true, category: "Essentials", description: "Required for all official Red Sea maritime and transit voyages" },
      { text: "Reef-friendly Water-Resistant Sunscreen (SPF 50+ is strongly recommended)", important: true, category: "Essentials", description: "Avoid chemical sunscreens that damage delicate soft coral ecosystems" },
      { text: "Insulated water flask to stay thoroughly hydrated in 35°C+ dry heat", important: true, category: "Essentials", description: "Essential defense against intense Egyptian coastal and desert solar wind" },
      { text: "Sufficient pocket cash (Egyptian Pounds EGP, USD, or EUR) for driver gratuities & island snacks", important: false, category: "Essentials", description: "Bazaars and Bedouin mountain camps operate predominantly in cash" },
      { text: "Polarized UV-Protected Sunglasses to guard your eyes from blinding glare", important: false, category: "Essentials", description: "Protects vision across sunlit deserts and sea crests" },
      { text: "Waterproof dry pocket sleeve for secure phone & camera photography", important: false, category: "Essentials", description: "Guards against fine quartz sand or splashing marine waves" }
    );

    if (isMarineActive) {
      items.push(
        { text: "Proper swimsuit, swim shorts or diving rash guard plus dry clothing replacements", important: true, category: "Snorkeling Gear", description: "Essential for speedboats, coral islands, or maritime snorkeling tours" },
        { text: "Quick-dry microfiber beach towel (Protip: Ask your resort hotel lobby desk for a complimentary beach towel!)", important: true, category: "Snorkeling Gear", description: "Most Hurghada resorts hand out towels daily — no need to pack heavy ones!" },
        { text: "Full UV sun protection swim shirt or snorkeling skin protection", important: false, category: "Snorkeling Gear", description: "Shields your torso during extensive 2-hour coral reef explorations" },
        { text: "Motion sickness or maritime nausea medication", important: false, category: "Snorkeling Gear", description: "Extremely helpful if you are sensitive to drifting speedboats or yachts" }
      );
    }

    if (isSafariActive) {
      items.push(
        { text: "Keffiyeh headscarf / face wrap to shield from sand debris", important: true, category: "Desert Gear", description: "Protects respiratory safety from sand columns kicked up during buggy races" },
        { text: "Long lightweight sports trousers or denim leggings (highly shields calves from quad engine blocks)", important: true, category: "Desert Gear", description: "Heated engines emit intense thermal friction during desert driving" },
        { text: "Fully sealed protective sunglasses or wraps around goggles", important: true, category: "Desert Gear", description: "Maintains clear vision under flying desert dust plumes" },
        { text: "Sturdy closed sports trainers or walking boots (avoid easy slip-flops)", important: true, category: "Desert Gear", description: "Allows secure drift and pedal manipulation inside safaris" },
        { text: "Moist skin wipes and hand sanitizers to refresh after buggy circuits", important: false, category: "Desert Gear", description: "Rapidly cleans fine brown sand off hands and neck contours" },
        { text: "Comfortable windbreaker or light thermal jacket for desert nights", important: false, category: "Desert Gear", description: "Temples and dune valleys lose heat exceptionally fast after twilight" }
      );
    }

    if (isHistoricalActive) {
      items.push(
        { text: "Highly breathable lightweight light-colored linen or cotton clothing", important: true, category: "Historical Day-Trip Gear", description: "Archaeological sites are enclosed within valley walls that trap high heat" },
        { text: "Supportive cushioned walking sneakers or trail running shoes", important: true, category: "Historical Day-Trip Gear", description: "Ideal for walking extensive pharaonic trails over uneven temple bedrock" },
        { text: "Equestrian sun hat, solar parasol or folding travel umbrella", important: true, category: "Historical Day-Trip Gear", description: "Provides physical shade under direct Giza plateau solar pathways" },
        { text: "Small EGP cash change notes (e.g. 5, 10, or 20 Egyptian Pound bills)", important: true, category: "Historical Day-Trip Gear", description: "Essential for local temple bathroom caretakers who provide towel sheets" },
        { text: "High-capacity dynamic portable backup lithium power-bank", important: false, category: "Historical Day-Trip Gear", description: "Extends battery life as you snap hundreds of historical temple photos" },
        { text: "Handheld folding paper-fan or handy battery-misting fan", important: false, category: "Historical Day-Trip Gear", description: "A lifesaver when entering tight, unventilated subterranean tomb chambers" }
      );
    }

    if (isSpecialActive) {
      items.push(
        { text: "Tall sweat-absorbing athletic sport socks", important: true, category: "Equestrian & Special Gear", description: "Highly recommended to prevent metal stirrup leather friction along your shins during coastal rides" },
        { text: "Comfortable form-fitting stretch leggings / riding trousers (avoid skirts or loose shorts)", important: true, category: "Equestrian & Special Gear", description: "Ensures painless mounting and smooth posture control while on Arabian stallion saddles" },
        { text: "A small packet of raw crunchy apples, sugar cubes, or clean carrots", important: false, category: "Equestrian & Special Gear", description: "A friendly, delicious reward for the beautiful horses at our private stable center" },
        { text: "Secure action-camera harness strap or chest mount adapter", important: false, category: "Equestrian & Special Gear", description: "Capture beautiful hands-free POV recordings as you trot across shallow sandbars" }
      );
    }

    if (isKidsActive) {
      items.push(
        { text: "Inflatable children swim floaties or certified armbands", important: true, category: "Family & Kids Care", description: "Provides extra safety during reef shallow lagoon wading" },
        { text: "Pediatric sunscreen SPF 55+ skin protective formula", important: true, category: "Family & Kids Care", description: "Prevents children's sensitive skin from peeling in harsh desert sun" },
        { text: "Compact child snack cookies, dry snacks, and juice boxes", important: false, category: "Family & Kids Care", description: "Keeps children cheerful and fed during long road transfers" },
        { text: "Kids secure sun hat with adjustable under-chin strings", important: false, category: "Family & Kids Care", description: "Winds can easily whisk loose clothing off yachts on open water" }
      );
    }

    return items;
  };

  const getSortedSmartItems = () => {
    const baseItems = getSmartGeneratorItems();
    return [...baseItems].sort((a, b) => {
      if (a.category !== b.category) return 0;
      const customOrder = itemOrders[a.category] || [];
      const idxA = customOrder.indexOf(a.text);
      const idxB = customOrder.indexOf(b.text);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  };

  const smartItems = getSortedSmartItems();

  const handleDownloadChecklist = () => {
    let t = `============================================================\n`;
    t    += `              MAS TRAVEL AGENCY HURGHADA\n`;
    t    += `            MY DYNAMIC TRAVEL PACKING LIST\n`;
    t    += `     Generated on: ${new Date().toLocaleDateString()} • Official Red Sea Support Portal\n`;
    t    += `============================================================\n\n`;
    
    t    += `Thank you for choosing MAS Agency for your adventures in Egypt!\n`;
    t    += `We compiled this custom packing checklist based on your schedule.\n\n`;

    t    += `BOOKINGS DETECTED:\n`;
    if (vouchers.length === 0) {
      t  += `- No verified active vouchers. Generated with standard configuration.\n`;
    } else {
      vouchers.forEach((v, idx) => {
        t += `- Excursion #${idx+1}: ${v.tourTitle} (Travel Date: ${v.bookingDate}, Distribution: ${v.adultsCount} Adults & ${v.childrenCount} Kids)\n`;
      });
    }

    // List generated triggers
    t    += `\nSPECIALIZED CATEGORIES ACTIVATED FOR YOUR PROGRAM:\n`;
    t    += `- General Adventure Basics (ACTIVE)\n`;
    if (isMarineActive) t += `- Island Beach, Yachts & Boat Snorkeling (ACTIVE)\n`;
    if (isSafariActive) t += `- Desert Quad Biking & Sand Buggy Safaris (ACTIVE)\n`;
    if (isHistoricalActive) t += `- Pharaonic Monuments, Pyramids & Luxor Valley (ACTIVE)\n`;
    if (isSpecialActive) t += `- Horse Riding, Desert & Seaside Gallops (ACTIVE)\n`;
    if (isKidsActive) t += `- Pediatric & Family Sun Safety Safeguards (ACTIVE)\n`;

    t    += `\n============================================================\n`;
    t    += `                  PACKING ITEMS CHECKLIST\n`;
    t    += `============================================================\n`;

    const grouped: Record<string, typeof smartItems> = {};
    smartItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    Object.entries(grouped).forEach(([catTitle, catItems]) => {
      t += `\n>>> ${catTitle.toUpperCase()} SEGMENT <<<\n`;
      t += `------------------------------------------------------------\n`;
      catItems.forEach(item => {
        const checkedMark = checkedStates[item.text] ? '[X]' : '[ ]';
        const impMark = item.important ? ' (! HIGH IMPORTANT)' : '';
        t += `${checkedMark} ${item.text}${impMark}\n`;
        t += `    ℹ️ Guidance: ${item.description}\n\n`;
      });
    });

    if (customItems.length > 0) {
      t += `\n>>> MY PERSONAL CUSTOM EXPENSES & EXTRA ADDITIONS <<<\n`;
      t += `------------------------------------------------------------\n`;
      customItems.forEach(item => {
        const checkedMark = checkedStates[item] ? '[X]' : '[ ]';
        t += `${checkedMark} ${item}\n\n`;
      });
    }

    t += `\n============================================================\n`;
    t += `⚠️ CORE ADVENTURE TRAVEL DIRECTIVES:\n`;
    t += `1. Passports: Physical books are required for maritime Coast Guard clearance.\n`;
    t += `2. Beach Towels: Carry towels from your resort lobby desk instead of buying new ones.\n`;
    t += `3. Payments: Settled smoothly in cash (EGP, USD, EUR, GBP) upon pickup arrival.\n`;
    t += `4. Support Helplines: WhatsApp Agent Contact +${WHATSAPP_NUMBER} or ${DISPLAY_PHONE}\n`;
    t += `============================================================\n`;
    t += `\nHAVE A FANTASTIC TRAVEL EXPERIENCE OVER RED SEA CORALS!`;

    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MAS_Travel_Packing_Essentials.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllCheckedMarkers = () => {
    setCheckedStates({});
  };

  // Dynamic Recharts data preparation for Packing Progress
  const totalSmartItems = smartItems.length;
  const packedSmartItems = smartItems.filter(item => checkedStates[item.text]).length;
  const totalCustomItems = customItems.length;
  const packedCustomItems = customItems.filter(item => checkedStates[item]).length;

  const grandTotal = totalSmartItems + totalCustomItems;
  const grandPacked = packedSmartItems + packedCustomItems;
  const grandPercent = grandTotal > 0 ? Math.round((grandPacked / grandTotal) * 100) : 0;

  // Shorthand mapper functions for clean chart rendering
  const categoryNameShorthand = (category: string) => {
    switch (category) {
      case 'Essentials': return 'Essentials 💼';
      case 'Snorkeling Gear': return 'Snorkeling 🤿';
      case 'Desert Gear': return 'Desert 🏜️';
      case 'Historical Day-Trip Gear': return 'Historical 🏛️';
      case 'Equestrian & Special Gear': return 'Equestrian 🐎';
      case 'Family & Kids Care': return 'Kids Care 👶';
      default: return category;
    }
  };

  // Compile individual category progress data for Recharts
  const rechartsCategoryData = (() => {
    const categoriesMap = smartItems.reduce<Record<string, { packed: number; total: number }>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { packed: 0, total: 0 };
      }
      acc[item.category].total += 1;
      if (checkedStates[item.text]) {
        acc[item.category].packed += 1;
      }
      return acc;
    }, {});

    const list = Object.entries(categoriesMap).map(([category, stats]) => {
      const remaining = stats.total - stats.packed;
      return {
        name: categoryNameShorthand(category),
        fullName: category,
        Packed: stats.packed,
        Remaining: remaining,
        Total: stats.total,
        percentage: Math.round((stats.packed / stats.total) * 100),
      };
    });

    if (customItems.length > 0) {
      const total = customItems.length;
      const packed = customItems.filter(item => checkedStates[item]).length;
      list.push({
        name: 'Custom 📝',
        fullName: 'My Custom Personal Gear Additions',
        Packed: packed,
        Remaining: total - packed,
        Total: total,
        percentage: Math.round((packed / total) * 100),
      });
    }

    return list;
  })();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-xl font-sans text-xs">
          <p className="font-bold text-slate-150 mb-1">{data.fullName}</p>
          <div className="space-y-0.5">
            <p className="flex items-center gap-1 text-emerald-450 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Packed: {data.Packed} of {data.Total} ({data.percentage}%)
            </p>
            <p className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              Remaining: {data.Remaining} items
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-16 py-12 max-w-7xl mx-auto px-4 md:px-8">
      
      {/* SECTION A: BOOKING PROCESS FLOW TIMELINE */}
      <div className="rounded-3xl bg-slate-900/35 border border-slate-900 p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase rounded-full mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Process Stepper</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight">
            How MAS Booking Flow Works
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Follow our stress-free three-step workflow to configure, finalize, and enjoy dream excursions with our coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10 pt-2">
          
          {[
            {
              step: "01",
              title: "Discover Excursion Flyers",
              desc: "Browse our official curated tour flyers above, or piece together a bespoke timeline with our Custom Planner. Study timing files, optional programs, and reviews.",
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/10",
              borderColor: "border-emerald-500/10"
            },
            {
              step: "02",
              title: "Lock Your Ticket Voucher",
              desc: "Fill in passenger counts, resort details, and dates inside our Quick Booking form. Instantly mint traveler ticket vouchers that save privately in your local browser storage.",
              color: "text-amber-400",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/10"
            },
            {
              step: "03",
              title: "WhatsApp & Pay on Pickup",
              desc: "Click 'Submit Stub' to transfer voucher coordinates automatically to our WhatsApp agent. We schedule high-comfort A/C pick-ups. Pay comfortably upon arrival!",
              color: "text-sky-400",
              bgColor: "bg-sky-500/10",
              borderColor: "border-sky-500/10"
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all text-left flex flex-col justify-between group relative`}>
              {/* Arrow Connector on Desktop */}
              {idx < 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 translate-x-1/2 text-slate-700 font-mono text-xl pointer-events-none">
                  ➜
                </div>
              )}
              
              <div>
                <span className={`font-mono font-black text-4xl ${item.color} leading-none block mb-4`}>
                  {item.step}
                </span>
                <h4 className="font-display font-extrabold text-sm text-slate-200 uppercase tracking-wider mb-2.5">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Stage {idx + 1} finalized</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* SECTION B: RED SEA WEATHER FORECAST */}
      <WeatherForecast />

      {/* SECTION C: FAQ & PACKING CHECKLIST TWIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* checklist panel (7 columns) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-slate-900/11 border border-slate-900 text-left space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-black text-lg md:text-xl text-white tracking-tight uppercase">
                  Traveler Packing Essentials Hub
                </h3>
              </div>
              <p className="font-sans text-xs text-slate-400">
                Organize high-contrast gear checklists based on your booked tours and travel requirements.
              </p>
            </div>

            {/* Quick Master Mode Toggler Slider */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start sm:self-center">
              <button
                onClick={() => setChecklistMode('smart-generator')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  checklistMode === 'smart-generator' 
                    ? 'bg-emerald-500 text-slate-50 shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Booking Generator
              </button>
              <button
                onClick={() => setChecklistMode('standard')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  checklistMode === 'standard' 
                    ? 'bg-emerald-500 text-slate-50 shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Browse Standard
              </button>
            </div>
          </div>

          {/* MODE 1: SMART DYNAMIC BOOKING GENERATOR */}
          {checklistMode === 'smart-generator' && (
            <div className="space-y-6">
              
              {/* Information Indicator Starp */}
              <div className="p-4 p-y.5 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col md:flex-row items-stretch justify-between gap-4">
                <div className="space-y-1.5 flex-1 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                      Consolidated Smart-Packer Engine
                    </span>
                  </div>
                  {vouchers.length > 0 ? (
                    <div>
                      <p className="text-xs font-display font-semibold text-slate-300">
                        ⚡ Synced with {vouchers.length} booked tour ticket vouchers!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-display font-semibold text-slate-400">
                        Customize your plan below to consolidatedly generate a detailed packing list:
                      </p>
                    </div>
                  )}

                  {/* Smart-Packer Tour selection flow */}
                  <div className="space-y-3.5 pt-3 border-t border-slate-900/60 font-sans">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-display font-bold text-[11px] text-slate-200 uppercase tracking-wider">
                        Select Tours to Pack For:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 select-none">
                      {ALL_TOURS.map((tour) => {
                        const isSelected = selectedTourIds.includes(tour.id);
                        return (
                          <button
                            key={tour.id}
                            type="button"
                            onClick={() => {
                              setSelectedTourIds(prev =>
                                prev.includes(tour.id)
                                  ? prev.filter(tid => tid !== tour.id)
                                  : [...prev, tour.id]
                              );
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-950/20 border-emerald-500/50 text-white'
                                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm shrink-0">
                                {tour.category === 'island' || tour.category === 'submarine' ? '🏝️' :
                                 tour.category === 'safari' ? '🏜️' :
                                 tour.category === 'day-trip' ? '🏛️' :
                                 tour.category === 'marine' ? '🚤' : '🐎'}
                              </span>
                              <div className="truncate text-left">
                                <p className="font-semibold text-[11px] leading-tight text-slate-200 truncate">
                                  {tour.title}
                                </p>
                                <p className="font-mono text-[9px] text-slate-500 leading-none mt-0.5 capitalize">
                                  Category: {tour.category === 'day-trip' ? 'Day Trip' : tour.category}
                                </p>
                              </div>
                            </div>
                            <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-emerald-500 border-emerald-400' : 'border-slate-800 bg-slate-900/50'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3.5]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Children traveling toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-900 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👶</span>
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-slate-200 leading-none">Family or Children Traveling?</p>
                          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Automatically includes pediatric sun safety and swim floaties</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSimulatedKids(prev => !prev)}
                        className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer border ${
                          isKidsActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold'
                            : 'bg-slate-900 border-slate-850 text-slate-550 hover:text-slate-400'
                        }`}
                      >
                        {isKidsActive ? 'Activated ✅' : 'Enable ＋'}
                      </button>
                    </div>

                    {/* Dynamic segment active indicator */}
                    <div className="flex items-center gap-y-1.5 gap-x-2 flex-wrap pt-2 border-t border-slate-900">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Active Categories:</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${isMarineActive ? 'bg-sky-950/40 border-sky-500/20 text-sky-400' : 'bg-slate-900/20 border-slate-950 text-slate-655'}`}>🏝️ Marine</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${isSafariActive ? 'bg-amber-950/40 border-amber-500/20 text-amber-400' : 'bg-slate-900/20 border-slate-950 text-slate-655'}`}>🏜️ Desert Safari</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${isHistoricalActive ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-400' : 'bg-slate-900/20 border-slate-950 text-slate-655'}`}>🏛️ Cairo/Luxor</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${isSpecialActive ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-slate-900/20 border-slate-950 text-slate-655'}`}>🐎 Equestrian</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${isKidsActive ? 'bg-pink-950/40 border-pink-500/20 text-pink-400' : 'bg-slate-900/20 border-slate-950 text-slate-655'}`}>👶 Kids Care</span>
                    </div>

                  </div>
                </div>

                {/* Big Download Button */}
                <div className="flex items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-900 md:pl-4">
                  <button
                    onClick={handleDownloadChecklist}
                    className="w-full md:w-auto px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-50 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
                    title="Download offline packing stub"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download TXT List</span>
                  </button>
                </div>
              </div>

              {/* Live Recharts Packing Analytics */}
              {grandTotal > 0 && (
                <div className="p-5 rounded-3xl bg-slate-950/20 border border-slate-900 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3.5">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold">
                          Live Packing Statistics
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-xs text-slate-200">
                        Smart-Packer Progress Board
                      </h4>
                    </div>
                    
                    {/* Overall Progress badge */}
                    <div className="flex items-baseline gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      <span className="font-display font-black text-sm text-emerald-450 leading-none">{grandPercent}%</span>
                      <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold">Packed</span>
                    </div>
                  </div>

                  {/* Consolidate status bars */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Consolidated Status</span>
                      <span className="font-bold text-slate-300">{grandPacked} of {grandTotal} items completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-850">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${grandPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Shorthand list visualizer using Recharts */}
                  <div className="pt-2 text-left space-y-2">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Analytics by active excursion group:
                    </p>
                    <div className="w-full h-[150px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={rechartsCategoryData}
                          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                        >
                          <XAxis type="number" hide domain={[0, 'dataMax']} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={9.5}
                            fontWeight={600}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                          <Bar dataKey="Packed" stackId="a" fill="#10b981" radius={[3, 0, 0, 3]}>
                            {rechartsCategoryData.map((entry, index) => (
                              <Cell key={`cell-packed-${index}`} fill="#10b981" fillOpacity={entry.percentage === 100 ? 1 : 0.8} />
                            ))}
                          </Bar>
                          <Bar dataKey="Remaining" stackId="a" fill="#1e293b" radius={[0, 3, 3, 0]}>
                            {rechartsCategoryData.map((entry, index) => (
                              <Cell key={`cell-remaining-${index}`} fill="#1e293b" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* View filter controls bar */}
              {grandTotal > 0 && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {hidePacked ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </>
                      ) : (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </>
                      )}
                    </span>
                    <span className="text-xs font-display font-semibold text-slate-305">
                      {hidePacked ? "Simplified view (hiding packed tasks)" : "Showing all recommendations"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHidePacked(prev => !prev)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      hidePacked 
                        ? 'bg-amber-550/15 hover:bg-amber-500/20 text-amber-400 border-amber-500/30' 
                        : 'bg-emerald-555/15 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {hidePacked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{hidePacked ? "Show Packed Items" : "Clear Packed"}</span>
                  </button>
                </div>
              )}

              {/* Display compiled check items */}
              <div className="space-y-6">
                {(() => {
                  const getCategoryTheme = (category: string) => {
                    switch (category) {
                      case 'Essentials':
                        return { icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />, title: '💼 Essentials' };
                      case 'Snorkeling Gear':
                        return { icon: <Palmtree className="w-3.5 h-3.5 text-sky-450" />, title: '🤿 Snorkeling Gear' };
                      case 'Desert Gear':
                        return { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, title: '🏜️ Desert Gear' };
                      case 'Historical Day-Trip Gear':
                        return { icon: <Compass className="w-3.5 h-3.5 text-indigo-400" />, title: '🏛️ Historical Day-Trip' };
                      case 'Equestrian & Special Gear':
                        return { icon: <Sparkles className="w-3.5 h-3.5 text-violet-400" />, title: '🐎 Equestrian & Special Gear' };
                      case 'Family & Kids Care':
                        return { icon: <Users className="w-3.5 h-3.5 text-pink-400" />, title: '👶 Family & Kids Care' };
                      default:
                        return { icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />, title: category };
                    }
                  };

                  const itemsToDisplay = hidePacked 
                    ? smartItems.filter(item => !checkedStates[item.text]) 
                    : smartItems;

                  const customToDisplay = hidePacked
                    ? customItems.filter(item => !checkedStates[item])
                    : customItems;

                  const totalUnpacked = itemsToDisplay.length + customToDisplay.length;

                  // Staggered empty state if everything is checked off and display view is simplified (hidden)
                  if (grandTotal > 0 && totalUnpacked === 0 && hidePacked) {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-3xl bg-emerald-950/10 border border-emerald-500/20 text-center space-y-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-550/20 flex items-center justify-center mx-auto text-emerald-450">
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1">
                          <h6 className="font-display font-medium text-slate-100 text-sm uppercase tracking-wide">
                            All Packed & Ready to Go! 🎉
                          </h6>
                          <p className="text-slate-450 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                            You have checked off every single recommendation and custom addition for your upcoming Hurghada excursions.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHidePacked(false)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer font-mono font-bold uppercase tracking-wider"
                        >
                          View Packed Recommendations
                        </button>
                      </motion.div>
                    );
                  }

                  const groupedCategories = itemsToDisplay.reduce<Record<string, typeof itemsToDisplay>>((acc, curr) => {
                    if (!acc[curr.category]) acc[curr.category] = [];
                    acc[curr.category].push(curr);
                    return acc;
                  }, {});

                  return (
                    <motion.div 
                      variants={checklistContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <AnimatePresence mode="popLayout">
                        {Object.entries(groupedCategories).map(([categoryName, items]) => {
                          const theme = getCategoryTheme(categoryName);
                          // Calculate stats based on initial state, to show original categories bounds
                          const origCategoryItems = smartItems.filter(item => item.category === categoryName);
                          const packedCount = origCategoryItems.filter(item => checkedStates[item.text]).length;
                          const totalCount = origCategoryItems.length;
                          const isAllPacked = packedCount === totalCount && totalCount > 0;

                          if (items.length === 0) return null;

                          return (
                            <motion.div 
                              key={categoryName} 
                              layout="position"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.25 }}
                              className="space-y-3 bg-slate-950/20 border border-slate-900 p-4.5 rounded-2xl relative overflow-hidden"
                            >
                              <h5 className="font-display font-extrabold text-[#94a3b8] text-[11px] tracking-wider uppercase border-b border-slate-900 pb-2.5 mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {theme.icon}
                                  <span className="text-slate-200">{theme.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono text-[9.5px]">
                                  {isAllPacked ? (
                                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">
                                      Packed & Ready ✅
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 bg-slate-905 border border-slate-850 px-2 py-0.5 rounded">
                                      {packedCount} / {totalCount} Packed
                                    </span>
                                  )}
                                </div>
                              </h5>

                              <div className="grid grid-cols-1 gap-2 relative">
                                <AnimatePresence mode="popLayout">
                                  {items.map((item) => {
                                    const isChecked = checkedStates[item.text] || false;
                                    const isBeingDragged = draggedText === item.text && draggedCategoryName === categoryName;
                                    return (
                                      <motion.div
                                        key={item.text}
                                        layout
                                        variants={checklistItemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        draggable
                                        onDragStart={(e) => {
                                          setDraggedText(item.text);
                                          setDraggedCategoryName(categoryName);
                                          e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onDragEnd={() => {
                                          setDraggedText(null);
                                          setDraggedCategoryName(null);
                                        }}
                                        onDragOver={(e) => {
                                          if (draggedCategoryName === categoryName && draggedText !== item.text) {
                                            e.preventDefault();
                                          }
                                        }}
                                        onDragEnter={() => {
                                          if (draggedCategoryName === categoryName && draggedText && draggedText !== item.text) {
                                            handleReorderCategoryItems(categoryName, draggedText, item.text);
                                          }
                                        }}
                                        className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 text-left group/item select-none ${
                                          isBeingDragged
                                            ? 'opacity-40 border-dashed border-emerald-500 scale-98 bg-slate-950/40 cursor-grabbing'
                                            : isChecked
                                              ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500 opacity-60 cursor-pointer'
                                              : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-350 cursor-pointer'
                                        }`}
                                      >
                                        {/* Drag handle */}
                                        <div className="pt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-slate-650 hover:text-slate-400 self-center">
                                          <GripVertical className="w-3.5 h-3.5 text-slate-600 transition-colors" />
                                        </div>

                                        <div className="pt-0.5 shrink-0" onClick={(e) => { e.stopPropagation(); handleToggleCheck(item.text); }}>
                                          <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                                            isChecked
                                              ? 'bg-emerald-500 border-emerald-400 text-slate-50'
                                              : 'border-slate-705 bg-slate-905 group-hover/item:border-slate-500'
                                          }`}>
                                            {isChecked && (
                                              <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                              >
                                                <Check className="w-3.5 h-3.5 text-slate-50 stroke-[3.5]" />
                                              </motion.div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex-1 space-y-0.5 select-none" onClick={(e) => { e.stopPropagation(); handleToggleCheck(item.text); }}>
                                          <p className={`text-xs font-semibold leading-normal ${isChecked ? 'line-through text-slate-550 font-normal' : 'text-slate-100'}`}>
                                            {item.text}
                                          </p>
                                          <p className="text-[10px] text-slate-500 font-sans leading-normal">
                                            {item.description}
                                          </p>
                                          {item.important && !isChecked && (
                                            <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 uppercase font-bold rounded">
                                              Highly Recommended
                                            </span>
                                          )}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  );
                })()}

                {/* CUSTOM USER ADDED ITEMS SECTOR */}
                <div className="space-y-3.5 pt-4 border-t border-slate-900">
                  <h5 className="font-display font-extrabold text-[#94a3b8] text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Custom Personal Gear Additions</span>
                  </h5>

                  {customItems.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      <AnimatePresence mode="popLayout">
                        {(hidePacked ? customItems.filter(item => !checkedStates[item]) : customItems).map((item, idx) => {
                          const isChecked = checkedStates[item] || false;
                          const isBeingDragged = draggedText === item && draggedCategoryName === "custom-personal-items";
                          return (
                            <motion.div
                              key={item}
                              layout
                              variants={checklistItemVariants}
                              initial="hidden"
                              animate="show"
                              exit="exit"
                              draggable
                              onDragStart={(e) => {
                                setDraggedText(item);
                                setDraggedCategoryName("custom-personal-items");
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              onDragEnd={() => {
                                setDraggedText(null);
                                setDraggedCategoryName(null);
                              }}
                              onDragOver={(e) => {
                                if (draggedCategoryName === "custom-personal-items" && draggedText !== item) {
                                  e.preventDefault();
                                }
                              }}
                              onDragEnter={() => {
                                if (draggedCategoryName === "custom-personal-items" && draggedText && draggedText !== item) {
                                  const listToQuery = hidePacked ? customItems.filter(ci => !checkedStates[ci]) : customItems;
                                  const draggedIdx = listToQuery.indexOf(draggedText);
                                  const targetIdx = listToQuery.indexOf(item);
                                  if (draggedIdx !== -1 && targetIdx !== -1) {
                                    const parentDraggedIdx = customItems.indexOf(draggedText);
                                    const parentTargetIdx = customItems.indexOf(item);
                                    if (parentDraggedIdx !== -1 && parentTargetIdx !== -1) {
                                      handleReorderCustomItems(parentDraggedIdx, parentTargetIdx);
                                    }
                                  }
                                }
                              }}
                              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-left group/custom select-none ${
                                isBeingDragged
                                  ? 'opacity-40 border-dashed border-emerald-500 scale-98 bg-slate-950/40 cursor-grabbing'
                                  : isChecked
                                    ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500 opacity-60'
                                    : 'bg-slate-950 border-slate-900 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Drag handle */}
                                <div className="shrink-0 cursor-grab active:cursor-grabbing text-slate-650 hover:text-slate-400">
                                  <GripVertical className="w-3.5 h-3.5 text-slate-600 transition-colors" />
                                </div>

                                <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => handleToggleCheck(item)}>
                                  <div className="shrink-0">
                                    <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                                      isChecked
                                        ? 'bg-emerald-500 border-emerald-400 text-slate-50'
                                        : 'border-slate-705 bg-slate-905 group-hover/custom:border-slate-500'
                                    }`}>
                                      {isChecked && (
                                        <motion.div
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                        >
                                          <Check className="w-3.5 h-3.5 text-slate-50 stroke-[3.5]" />
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`text-xs font-semibold truncate ${isChecked ? 'line-through text-slate-550 font-normal' : 'text-slate-200'}`}>
                                    {item}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveCustomItem(item)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Add item interactive form inline */}
                  <form onSubmit={handleAddCustomItem} className="flex gap-2">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      placeholder="Add individual custom items (e.g. prescription medicines, kids toys...)"
                      className="flex-1 bg-slate-950 border border-slate-900 focus:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-800 font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-mono text-xs font-bold shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono tracking-wider">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={clearAllCheckedMarkers}
                      className="uppercase font-extrabold text-slate-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Checklist
                    </button>
                    {grandTotal > 0 && (
                      <button
                        onClick={() => setHidePacked(prev => !prev)}
                        className={`uppercase font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          hidePacked ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        {hidePacked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{hidePacked ? "Show Packed" : "Clear Packed"}</span>
                      </button>
                    )}
                  </div>
                  <span className="text-slate-600">
                    {Object.values(checkedStates).filter(Boolean).length} / {smartItems.length + customItems.length} checked
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* MODE 2: STANDARD PRESETS CAT BROWSER */}
          {checklistMode === 'standard' && (
            <div className="space-y-6">
              
              {/* Selector pills */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CHECKLIST_DATA) as ChecklistCategory[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setChecklistCat(key)}
                    className={`px-3.5 py-2 text-xs font-display rounded-xl tracking-wide transition-all cursor-pointer border ${
                      checklistCat === key
                        ? 'bg-slate-900 border-emerald-500/55 text-emerald-400 font-bold'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {CHECKLIST_DATA[key].title}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-4">
                <div>
                  <p className="font-mono text-[10px] text-emerald-500 uppercase font-semibold leading-none mb-1">
                    Currently displaying:
                  </p>
                  <h4 className="font-display font-extrabold text-sm text-slate-200">
                    {currentChecklist.title} Packing Guidelines
                  </h4>
                  <p className="font-sans text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {currentChecklist.description}
                  </p>
                </div>

                {/* List checklist checked toggling block */}
                <div className="space-y-2 pt-2">
                  {currentChecklist.items.map((item, idx) => {
                    const isChecked = checkedStates[item.text] || false;
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleToggleCheck(item.text)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500 opacity-60' 
                            : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            isChecked 
                              ? 'bg-emerald-500 border-emerald-400 text-slate-50' 
                              : 'border-slate-705 bg-slate-950'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3 h-3 text-slate-50 stroke-[3.5]" />}
                          </div>
                        </div>
                        
                        <div className="flex-1 text-xs select-none text-left">
                          <span className={isChecked ? 'line-through' : ''}>
                            {item.text}
                          </span>
                          {item.important && !isChecked && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 uppercase font-bold rounded">
                              Highly Important
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-2 text-right">
                  <button 
                    onClick={() => setCheckedStates({})}
                    className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear Checklist Markers
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* FAQs Panel (5 columns) */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-extrabold text-lg md:text-xl text-white tracking-tight">
                Frequently Answered Questions
              </h3>
            </div>
            <p className="font-sans text-xs text-slate-400">
              Need clarity about payment modes, transfers, or scuba diving instructions? Read these rapid summaries.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-slate-905 bg-slate-950 overflow-hidden hover:border-slate-850 transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-4.5 text-left flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                  >
                    <span className="font-display font-semibold text-xs md:text-sm text-slate-200 leading-normal">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[220px] border-t border-slate-900' : 'max-h-0'
                  }`}>
                    <p className="p-4.5 font-sans text-xs text-slate-400 leading-relaxed bg-slate-950/40">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              MAS International Agency commits 10% of profit allocations directly to marine conservation programs and artificial coral rehabilitation inside the Red Sea Coastguards area.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
