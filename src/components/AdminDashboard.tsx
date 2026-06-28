/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart2, 
  Users, 
  Coins, 
  ShieldAlert, 
  Edit3, 
  Check, 
  Trash2, 
  Plus, 
  BookOpen, 
  Search, 
  FileText, 
  Database, 
  RefreshCw, 
  TrendingUp,
  Tag,
  Sliders,
  AlertTriangle,
  X,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  Download,
  Zap,
  Award,
  Activity,
  Compass,
  Mail,
  Send,
  CheckCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Monitor
} from 'lucide-react';
import { BookingRequest, TourItem, TourCategory } from '../types';
import { CURRENCIES, ALL_TOURS, TOUR_PRICES } from '../data';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  bookings: BookingRequest[];
  onUpdateBooking: (id: string, updatedFields: Partial<BookingRequest>) => void;
  onDeleteBooking: (id: string) => void;
  customPrices: Record<string, { adult: number; child: number }>;
  onUpdateTourPrice: (tourId: string, adult: number, child: number) => void;
  promoCodes: Record<string, number>;
  onAddPromoCode: (code: string, discountPercent: number) => void;
  onRemovePromoCode: (code: string) => void;
  currencyRatesOverride: Record<string, number>;
  onUpdateCurrencyRate: (code: string, rate: number) => void;
  weatherCondition: 'normal' | 'heatwave' | 'storm';
  onUpdateWeatherCondition: (cond: 'normal' | 'heatwave' | 'storm') => void;
  onSeedMockBookings: () => void;
  onClose: () => void;
}

const TOUR_CATEGORIES: { value: TourCategory; label: string }[] = [
  { value: 'island', label: 'Island Trips' },
  { value: 'marine', label: 'Marine & Speedboats' },
  { value: 'safari', label: 'Desert Safaris' },
  { value: 'day-trip', label: 'Cairo & Luxor' },
  { value: 'submarine', label: 'Submarines' },
  { value: 'special', label: 'Cruises & Specials' }
];

export default function AdminDashboard({
  bookings,
  onUpdateBooking: parentOnUpdateBooking,
  onDeleteBooking: parentOnDeleteBooking,
  customPrices,
  onUpdateTourPrice: parentOnUpdateTourPrice,
  promoCodes,
  onAddPromoCode: parentOnAddPromoCode,
  onRemovePromoCode: parentOnRemovePromoCode,
  currencyRatesOverride,
  onUpdateCurrencyRate: parentOnUpdateCurrencyRate,
  weatherCondition,
  onUpdateWeatherCondition: parentOnUpdateWeatherCondition,
  onSeedMockBookings: parentOnSeedMockBookings,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'bookings' | 'prices' | 'promos' | 'operations' | 'data'>('stats');
  
  // Newsletter subscription and template variables
  interface Subscription {
    email: string;
    preferences: string[];
    subscribedAt: string;
  }

  const [subscribers, setSubscribers] = useState<Subscription[]>(() => {
    try {
      const stored = localStorage.getItem('mas_newsletter_subscribers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
      const defaultSubs: Subscription[] = [
        { email: 'diamond.entertainment70@gmail.com', preferences: ['flash-deals', 'island-cruises'], subscribedAt: '8 May 2026, 14:15' },
        { email: 'tourist_vip@redseaexplorer.io', preferences: ['island-cruises', 'desert-safari'], subscribedAt: '22 May 2026, 09:30' },
        { email: 'cairo.historian@egypttravels.com', preferences: ['antiquities'], subscribedAt: '1 June 2026, 18:45' },
        { email: 'adrenaline_seeker@buggysprint.net', preferences: ['desert-safari', 'flash-deals'], subscribedAt: '7 June 2026, 11:20' }
      ];
      localStorage.setItem('mas_newsletter_subscribers', JSON.stringify(defaultSubs));
      return defaultSubs;
    } catch {
      return [];
    }
  });

  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPrefs, setNewSubPrefs] = useState<string[]>(['flash-deals']);
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  const NEWSLETTER_PRESETS = [
    {
      id: 'promo-autumn',
      title: '🏝️ Excursion Promo (15% Off VIP)',
      subject: '🏝️ Exclusive: Red Sea Island Beach Cruises & VIP Sandbar Action!',
      body: `Marhaban!

We are hosting our exclusive private Catamaran Cruise and Hula Hula Sandbar excursion this week with special, eye-level marine life diving instruction. Because you signed up for MAS VIP alerts, you can lock in 15% saved pricing using code: AUTUMN15.

What is included in this week's guide:
- Private transfers from El Gouna, Sahl Hasheesh, and Hurghada City Center.
- Fresh sea lunch cooked live by on-board chef.
- Guided snorkeling with full professional gear.

Reply directly over WhatsApp or create your secure voucher inside the tracker to lock your spot!

Kind regards,
MAS Agency Dispatch Desk`,
      voucher: 'AUTUMN15'
    },
    {
      id: 'safari-night',
      title: '🐪 Starbed Desert Safari (10% Off)',
      subject: '🐪 Adrenaline Desert Quad Safari & Starbed Bedouin Night',
      body: `Hello Explorer,

The desert winds are calling. Dust off your sunglasses for a 45-minute premium quad cruiser sprint inside the heart of the Hurghada desert, followed by:
- Traditional organic tea and homemade pita in our authentic Bedouin camp.
- Guided telescope stargazing after the sunset gold fades.
- Live fire performance and belly dancing ceremonies.

Claim 10% off your desert booking today by copying code GOLD10 into your itinerary drawer.

Safe travels,
The MAS Safari Crew`,
      voucher: 'GOLD10'
    },
    {
      id: 'luxor-historic',
      title: '🏛️ Pharaonic Valley Legacy',
      subject: '🏛️ Pharaonic Valley Dispatch: Luxor Temple & Kings Treasures',
      body: `Dear Travel Enthusiast,

Our premium Air-Conditioned luxury Mercedes coach departs Hurghada twice a week for the majestic valley of Luxor:
- Avoid crowded queues with priority skip-the-line entrance.
- Marvel at Karnak Temple & Hatshepsut Colossi with our private Egyptology Guide.
- Sail the Nile River on a traditional Faluca for sunset pictures.

Customize your private itinerary today through our digital planner widget!

Warm wishes,
Historical Tours Coordinator`,
      voucher: 'AUTUMN15'
    }
  ];
  
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [customSubject, setCustomSubject] = useState(NEWSLETTER_PRESETS[0].subject);
  const [customBody, setCustomBody] = useState(NEWSLETTER_PRESETS[0].body);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setCustomSubject(NEWSLETTER_PRESETS[idx].subject);
    setCustomBody(NEWSLETTER_PRESETS[idx].body);
  };

  const [isBulkSending, setIsBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkLogs, setBulkLogs] = useState<string[]>([]);

  // Telemetry cookie logs
  interface TelemetryRecord {
    id: string;
    timestamp: string;
    consentLevel: string;
    essentialAllowed: boolean;
    analyticsAllowed: boolean;
    marketingAllowed: boolean;
    userAgent: string;
    viewportSize: string;
    screenSize: string;
    timezone: string;
    locale: string;
    wishlistCount: number;
    bookingsDraftCount: number;
  }

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryRecord[]>(() => {
    try {
      const stored = localStorage.getItem('mas_collected_telemetry_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
      
      const prePop: TelemetryRecord[] = [
        {
          id: 'log-f1',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          consentLevel: 'accepted_all',
          essentialAllowed: true,
          analyticsAllowed: true,
          marketingAllowed: true,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/125.0.0.0 Safari/537.36',
          viewportSize: '1440x880',
          screenSize: '1440x900',
          timezone: 'Europe/London',
          locale: 'en-GB',
          wishlistCount: 2,
          bookingsDraftCount: 1,
        },
        {
          id: 'log-f2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          consentLevel: 'essential_only',
          essentialAllowed: true,
          analyticsAllowed: false,
          marketingAllowed: false,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/604.1',
          viewportSize: '390x844',
          screenSize: '390x844',
          timezone: 'Africa/Cairo',
          locale: 'ar-EG',
          wishlistCount: 0,
          bookingsDraftCount: 0,
        },
        {
          id: 'log-f3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          consentLevel: 'accepted_all',
          essentialAllowed: true,
          analyticsAllowed: true,
          marketingAllowed: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36',
          viewportSize: '1920x960',
          screenSize: '1920x1080',
          timezone: 'Europe/Berlin',
          locale: 'de-DE',
          wishlistCount: 4,
          bookingsDraftCount: 1,
        }
      ];
      localStorage.setItem('mas_collected_telemetry_logs', JSON.stringify(prePop));
      return prePop;
    } catch {
      return [];
    }
  });

  const [isDataSweeping, setIsDataSweeping] = useState(false);

  // Exporters: CSV and Grand Unified database payload
  const triggerCombinedDataExport = () => {
    try {
      const activeBookings = bookings;
      const activeSubs = subscribers;
      const activeReviews = JSON.parse(localStorage.getItem('mas_travel_reviews') || '[]');
      const activeTelemetry = telemetryLogs;
      
      const fullPayload = {
        meta: {
          exporter: "MAS Operations Command Office",
          timestamp: new Date().toISOString(),
          version: "2.6.4-build",
          securityHash: "SHA256-CLIENT-LEDGER-VERIFIED"
        },
        newsletterSubscribers: activeSubs,
        bookingLedger: activeBookings,
        passengerReviews: activeReviews,
        cookieConsentAnalytics: activeTelemetry,
        customPriceOverrides: customPrices,
        activeVoucherCoupons: promoCodes
      };

      const jsonString = JSON.stringify(fullPayload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mas_travel_database_archive_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addAuditLog("Data Vault: Grand combined database package exported.", "success");
    } catch (e) {
      console.error(e);
      addAuditLog("Data Vault: Grand database package export failed.", "warning");
    }
  };

  const triggerCSVExport = (type: 'subscribers' | 'consent' | 'bookings') => {
    try {
      let headers = '';
      let rows = '';
      let filename = '';

      if (type === 'subscribers') {
        headers = 'Email,Preferences,SubscribedAt\n';
        rows = subscribers.map(s => `"${s.email}","${s.preferences.join(';') || 'none'}","${s.subscribedAt}"`).join('\n');
        filename = 'mas_newsletter_subscribers.csv';
      } else if (type === 'consent') {
        headers = 'LogID,Timestamp,ConsentLevel,Essential,Analytics,Marketing,UserAgent,Viewport,Timezone,Locale\n';
        rows = telemetryLogs.map(l => `"${l.id}","${l.timestamp}","${l.consentLevel}",${l.essentialAllowed},${l.analyticsAllowed},${l.marketingAllowed},"${l.userAgent.replace(/"/g, '""')}","${l.viewportSize}","${l.timezone}","${l.locale}"`).join('\n');
        filename = 'mas_cookie_consent_audit.csv';
      } else {
        headers = 'BookingID,TourTitle,BookingDate,FullName,WhatsApp,Adults,Children,HotelName,Status,CreatedAt\n';
        rows = bookings.map(b => `"${b.id}","${b.tourTitle}","${b.bookingDate}","${b.fullName}","${b.whatsappNumber}",${b.adultsCount},${b.childrenCount},"${b.hotelName || ''}","${b.status}","${b.createdAt}"`).join('\n');
        filename = 'mas_booking_ledger_records.csv';
      }

      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addAuditLog(`Data Vault: Exported ${type.toUpperCase()} standard spreadsheet LEDGER CSV.`, 'success');
    } catch (e) {
      console.error(e);
      addAuditLog("Data Vault: CSV conversion routine caught system exception.", "warning");
    }
  };

  const handleManualAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailStr = newSubEmail.trim();
    if (!emailStr) return;
    
    if (!emailStr.includes('@')) {
      alert("Please enter a valid email address with @ symbol.");
      return;
    }

    if (subscribers.some(s => s.email.toLowerCase() === emailStr.toLowerCase())) {
      alert("This traveler is already enrolled in the VIP list.");
      return;
    }

    const newSub: Subscription = {
      email: emailStr,
      preferences: [...newSubPrefs],
      subscribedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [...subscribers, newSub];
    setSubscribers(updated);
    try {
      localStorage.setItem('mas_newsletter_subscribers', JSON.stringify(updated));
      setNewSubEmail('');
      addAuditLog(`Newsletter Whitelist: Manually enrolled account [${emailStr}].`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriberEntry = (emailToDelete: string) => {
    const updated = subscribers.filter(s => s.email.toLowerCase() !== emailToDelete.toLowerCase());
    setSubscribers(updated);
    try {
      localStorage.setItem('mas_newsletter_subscribers', JSON.stringify(updated));
      addAuditLog(`Newsletter Whitelist: Revoked subscription permissions for [${emailToDelete}].`, 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkSenderLaunch = (subject: string, bodyContent: string) => {
    const targets = selectedSubs.length > 0 
      ? subscribers.filter(s => selectedSubs.includes(s.email))
      : subscribers;

    if (targets.length === 0) {
      alert("No active subscribers matched. Verify whitelist selections.");
      return;
    }

    setIsBulkSending(true);
    setBulkProgress(0);
    setBulkLogs([`[${new Date().toLocaleTimeString()}] Establishing secure marketing SMTP gateway pipeline...`,
                 `[${new Date().toLocaleTimeString()}] Locked targeted dispatch queue to ${targets.length} accounts.`]);

    let idx = 0;
    const runQueue = () => {
      if (idx >= targets.length) {
        setBulkProgress(100);
        setBulkLogs(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] ✔ Campaign transmission terminated with 100% telemetry success!`,
          `[${new Date().toLocaleTimeString()}] Dispatched newsletter campaign topic: [${subject}]`
        ]);
        setIsBulkSending(false);
        addAuditLog(`Newsletter Blast: Dispatched batch campaign "${subject}" to ${targets.length} subscribers.`, 'success');
        return;
      }

      const activeTarget = targets[idx];
      setBulkLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⌛ Composing localized HTML template package with custom voucher codes for [${activeTarget.email}]...`
      ]);

      setTimeout(() => {
        setBulkLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 🟢 Standard SMTP dispatch succeeded for [${activeTarget.email}] [Code: SECURE-TLS-${idx + 10}].`
        ]);
        setBulkProgress(Math.floor(((idx + 1) / targets.length) * 100));
        idx++;
        runQueue();
      }, 600);
    };

    runQueue();
  };

  const handleSweepSystemData = () => {
    setIsDataSweeping(true);
    setTimeout(() => {
      try {
        const storedSubs = localStorage.getItem('mas_newsletter_subscribers');
        const parsedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        setSubscribers(parsedSubs);

        const storedLogs = localStorage.getItem('mas_collected_telemetry_logs');
        const parsedLogs = storedLogs ? JSON.parse(storedLogs) : [];
        setTelemetryLogs(parsedLogs);
        
        setIsDataSweeping(false);
        addAuditLog(`Data Vault Sweep: Successfully scanned ${bookings.length} vouchers, ${parsedSubs.length} subscribers, and ${parsedLogs.length} diagnostic cookie tracks.`, "success");
      } catch (e) {
        setIsDataSweeping(false);
        addAuditLog("Data Vault Sweep: Encountered system read exceptions during sweep.", "warning");
      }
    }, 850);
  };
  
  // Automated WhatsApp Pending Reminder system states
  const [pendingReminderBooking, setPendingReminderBooking] = useState<BookingRequest | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('finalize-details');
  const [customMessageText, setCustomMessageText] = useState('');
  const [reminderHistory, setReminderHistory] = useState<Record<string, string>>({}); // track reminder status in active screen session

  const REMINDER_PRESETS = [
    {
      id: 'finalize-details',
      label: '📋 Details Finalization Template',
      getMessage: (b: BookingRequest) => `Marhaban ${b.fullName}! 🏝️

Your booking request (ID: #${b.id}) for "${b.tourTitle}" on ${b.bookingDate} is currently pending validation in our system.

To expedite the confirmation of your boarding voucher, please review and finalize your details:
• Pax: ${b.adultsCount} Adults, ${b.childrenCount} Children
• Resort/Hotel Name: ${b.hotelName ? b.hotelName : "[Please specify your hotel and room number]"}
• Special Requests: ${b.specialRequests ? b.specialRequests : "None specified"}

Please reply directly to this message to confirm everything is accurate. Once done, our scheduling coordinators will issue your official ticket voucher immediately. ⛵✨

Thank you,
MAS Red Sea Support Desk`
    },
    {
      id: 'missing-hotel',
      label: '🏨 Missing Pickup Resort Template',
      getMessage: (b: BookingRequest) => `Marhaban ${b.fullName}! 🏝️

We are processing your pending booking request (ID: #${b.id}) for "${b.tourTitle}" on ${b.bookingDate}.

Our luxury transfer shuttle is fully included in your package. However, we do not have your pickup resort name or lobby details on file yet.

Could you please reply with:
1. Your Resort Name: 
2. Room Number (optional):

Once we receive these details, we will lock in your pickup timing and generate your official boarding passes. 🚐💨

Thank you,
MAS Red Sea Support Desk`
    },
    {
      id: 'friendly-checkin',
      label: '💬 Friendly Support Checkout Template',
      getMessage: (b: BookingRequest) => `Marhaban ${b.fullName}! 👋

Our team noticed you have a pending reservation (ID: #${b.id}) for "${b.tourTitle}" on ${b.bookingDate}.

We wanted to personally check if you have any questions about this excursion or require assistance with scheduling, pick-up times, or group prices. We are live on chat and ready to help!

Please let us know if you would like to proceed with locking in your spots. ⛵🐠

Warm regards,
MAS Red Sea Support Desk`
    }
  ];

  const handleTriggerSinglePendingReminder = (booking: BookingRequest) => {
    setPendingReminderBooking(booking);
    // Auto-select standard or missing-hotel template depending on if hotelName is empty
    const defaultPreset = (!booking.hotelName || booking.hotelName.trim() === '') ? 'missing-hotel' : 'finalize-details';
    setSelectedPresetId(defaultPreset);
    const selectedObj = REMINDER_PRESETS.find(p => p.id === defaultPreset) || REMINDER_PRESETS[0];
    setCustomMessageText(selectedObj.getMessage(booking));
  };

  const handleSelectReminderPreset = (presetId: string, booking: BookingRequest) => {
    setSelectedPresetId(presetId);
    const selectedObj = REMINDER_PRESETS.find(p => p.id === presetId) || REMINDER_PRESETS[0];
    setCustomMessageText(selectedObj.getMessage(booking));
  };

  const handleExecuteWhatsAppReminder = (booking: BookingRequest, customText: string) => {
    const cleanPhone = booking.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customText);
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    
    // Open in new tab securely
    window.open(url, '_blank');
    
    addAuditLog(`Dispatched automated WhatsApp template reminder to passenger "${booking.fullName}" (#${booking.id}) via Direct API linkage.`, 'success');
    
    setReminderHistory(prev => ({
      ...prev,
      [booking.id]: new Date().toLocaleTimeString()
    }));

    const updatedNotes = booking.adminNotes 
      ? `${booking.adminNotes}\n[System Notice: Reminded about details on ${new Date().toLocaleDateString()}]`
      : `[System Notice: Reminded about details on ${new Date().toLocaleDateString()}]`;
    
    onUpdateBooking(booking.id, {
      adminNotes: updatedNotes
    });

    setPendingReminderBooking(null);
  };

  interface AuditLog {
    id: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'system';
    message: string;
  }

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), type: 'system', message: 'MAS Pro Console online. Security connection handshake completed.' },
    { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), type: 'info', message: `Synchronized live bookings database. ${bookings.length} active records found.` },
    { id: 'log-3', timestamp: new Date(Date.now() - 3605000).toISOString(), type: 'success', message: 'Ready for operations. Central dispatcher active.' }
  ]);

  const addAuditLog = (message: string, type: 'info' | 'success' | 'warning' | 'system' = 'info') => {
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        type,
        message
      },
      ...prev
    ]);
  };

  // Wrapped operations implementation
  const onUpdateBooking = (id: string, updatedFields: Partial<BookingRequest>) => {
    parentOnUpdateBooking(id, updatedFields);
    const detail = updatedFields.status ? `status update to [${updatedFields.status.toUpperCase()}]` : 'record details adjusted';
    addAuditLog(`Booking Voucher #${id}: Modified ${detail}.`, 'info');
  };

  const onDeleteBooking = (id: string) => {
    parentOnDeleteBooking(id);
    addAuditLog(`Booking Voucher #${id} was permanently purged from local ledger.`, 'warning');
  };

  const onUpdateTourPrice = (tourId: string, adult: number, child: number) => {
    parentOnUpdateTourPrice(tourId, adult, child);
    const defP = TOUR_PRICES[tourId] || { adult: 40, child: 20 };
    if (defP.adult === adult && defP.child === child) {
      addAuditLog(`Tour [${tourId}]: Restored default standard pricing.`, 'system');
    } else {
      addAuditLog(`Tour [${tourId}]: Overrode pricing structure (Adult: $${adult}, Child: $${child}).`, 'success');
    }
  };

  const onAddPromoCode = (code: string, discountPercent: number) => {
    parentOnAddPromoCode(code, discountPercent);
    addAuditLog(`Promos Engine: Injected voucher coupon [${code}] granting ${discountPercent}% discount.`, 'success');
  };

  const onRemovePromoCode = (code: string) => {
    parentOnRemovePromoCode(code);
    addAuditLog(`Promos Engine: Evicted voucher coupon [${code}] from checkout whitelist.`, 'warning');
  };

  const onUpdateCurrencyRate = (code: string, rate: number) => {
    parentOnUpdateCurrencyRate(code, rate);
    addAuditLog(`Ex-Rates Engine: Tweak ${code} multiplier manually to [${rate}].`, 'info');
  };

  const onUpdateWeatherCondition = (cond: 'normal' | 'heatwave' | 'storm') => {
    parentOnUpdateWeatherCondition(cond);
    const type = cond === 'normal' ? 'success' : cond === 'heatwave' ? 'warning' : 'system';
    addAuditLog(`Operations Guard: Adjusted sea safety conditions to [${cond.toUpperCase()}].`, type);
  };

  const onSeedMockBookings = () => {
    parentOnSeedMockBookings();
    addAuditLog(`Database Sandbox: Seeding finished. Injected 5 premium mock records to sandbox ledger.`, 'success');
  };

  // Export to CSV Functionality
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Voucher ID', 'Passenger Name', 'WhatsApp Number', 'Booking Date', 'Resort Hotel', 'Tour Title', 'Adults', 'Children', 'Status', 'Admin Notes', 'CreatedAt'];
    const rows = bookings.map(b => [
      b.id,
      `"${b.fullName.replace(/"/g, '""')}"`,
      b.whatsappNumber,
      b.bookingDate,
      `"${(b.hotelName || '').replace(/"/g, '""')}"`,
      `"${b.tourTitle.replace(/"/g, '""')}"`,
      b.adultsCount,
      b.childrenCount,
      b.status,
      `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
      b.createdAt || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mas_tours_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog(`Database Ledger: Exported ${bookings.length} reservations to downloadable CSV.`, 'success');
  };

  // Pricing presets overrides
  const handleApplyPreset = (preset: 'all-premium' | 'all-sale' | 'reset-all') => {
    if (preset === 'reset-all') {
      ALL_TOURS.forEach(tour => {
        const def = TOUR_PRICES[tour.id] || { adult: 40, child: 20 };
        parentOnUpdateTourPrice(tour.id, def.adult, def.child);
      });
      addAuditLog(`Pricing Engine: Erased all administrative margins. Restored factory defaults.`, 'info');
    } else if (preset === 'all-premium') {
      ALL_TOURS.forEach(tour => {
        const current = customPrices[tour.id] || TOUR_PRICES[tour.id] || { adult: 40, child: 20 };
        const newAdult = Math.round(current.adult * 1.15);
        const newChild = Math.round(current.child * 1.15);
        parentOnUpdateTourPrice(tour.id, newAdult, newChild);
      });
      addAuditLog(`Pricing Engine: Applied Summer Peak Premium preset (+15% upward margin).`, 'success');
    } else if (preset === 'all-sale') {
      ALL_TOURS.forEach(tour => {
        const current = customPrices[tour.id] || TOUR_PRICES[tour.id] || { adult: 40, child: 20 };
        const newAdult = Math.round(current.adult * 0.90);
        const newChild = Math.round(current.child * 0.90);
        parentOnUpdateTourPrice(tour.id, newAdult, newChild);
      });
      addAuditLog(`Pricing Engine: Applied Autumn Affiliate Promo preset (-10% downward markdown).`, 'warning');
    }
  };
  
  // Search & Filter state for bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingCategoryFilter, setBookingCategoryFilter] = useState<string>('all');
  
  // Editing bookings in dashboard state
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editBookingForm, setEditBookingForm] = useState<Partial<BookingRequest>>({});

  // Bulk Selection States and handlers
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);

  const handleToggleSelectBooking = (id: string) => {
    setSelectedBookingIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (visibleBookings: BookingRequest[]) => {
    const visibleIds = visibleBookings.map(b => b.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedBookingIds.includes(id));
    if (allVisibleSelected) {
      setSelectedBookingIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedBookingIds(prev => {
        const next = [...prev];
        visibleIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      });
    }
  };

  const handleBulkUpdateStatus = (newStatus: 'draft' | 'pending' | 'confirmed' | 'denied' | 'flagged') => {
    const activeSelected = selectedBookingIds.filter(id => bookings.some(b => b.id === id));
    if (activeSelected.length === 0) return;
    
    activeSelected.forEach(id => {
      onUpdateBooking(id, { status: newStatus });
    });
    setSelectedBookingIds([]);
  };

  const handleBulkDelete = () => {
    const activeSelected = selectedBookingIds.filter(id => bookings.some(b => b.id === id));
    if (activeSelected.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${activeSelected.length} booking request(s)? This action is irreversible.`)) {
      activeSelected.forEach(id => {
        onDeleteBooking(id);
      });
      setSelectedBookingIds([]);
    }
  };
  
  // Custom Promo form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(10);

  // Helper to resolve actual tour prices (including admin overrides)
  const getResolvedTourPrice = (tourId: string, adults: number, children: number) => {
    const cleanId = tourId.trim();
    const prices = customPrices[cleanId] || TOUR_PRICES[cleanId] || { adult: 40, child: 20 };
    const basePrice = (adults * prices.adult) + (children * prices.child);
    if (adults + children >= 5) {
      return basePrice * 0.9; // 10% auto group discount
    }
    return basePrice;
  };

  // Compute stats metrics
  const totalBookingsCount = bookings.length;
  const potentialRevenueUSD = bookings.reduce((sum, b) => sum + getResolvedTourPrice(b.tourId, b.adultsCount, b.childrenCount), 0);
  const totalAdults = bookings.reduce((sum, b) => sum + b.adultsCount, 0);
  const totalChildren = bookings.reduce((sum, b) => sum + b.childrenCount, 0);

  // Dynamic calculated excursion rankings leaderboard
  const excursionLeaderboard = ALL_TOURS.map(tour => {
    const matchingBookings = bookings.filter(b => b.tourId === b.tourId && b.tourId === tour.id);
    const salesCount = matchingBookings.length;
    const totalRevenue = matchingBookings.reduce((sum, b) => sum + getResolvedTourPrice(b.tourId, b.adultsCount, b.childrenCount), 0);
    return {
      ...tour,
      salesCount,
      totalRevenue
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue || b.salesCount - a.salesCount);
  
  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, { draft: 0, pending: 0, confirmed: 0, denied: 0, flagged: 0 });

  // Excursion category counts for chart
  const categoryStatsUSD = bookings.reduce<Record<string, number>>((acc, b) => {
    const tour = ALL_TOURS.find(t => t.id === b.tourId);
    const cat = tour ? tour.category : 'special';
    const cost = getResolvedTourPrice(b.tourId, b.adultsCount, b.childrenCount);
    acc[cat] = (acc[cat] || 0) + cost;
    return acc;
  }, {});

  const barChartData = Object.entries(categoryStatsUSD).map(([name, value]) => ({
    category: name.toUpperCase(),
    revenue: value
  }));

  const pieChartData = [
    { name: 'Confirmed', value: statusCounts.confirmed, color: '#10b981' },
    { name: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
    { name: 'Drafts', value: statusCounts.draft, color: '#64748b' },
    { name: 'Flagged', value: statusCounts.flagged, color: '#a855f7' },
    { name: 'Denied', value: statusCounts.denied, color: '#f43f5e' }
  ].filter(item => item.value > 0);

  // Daily distribution data for the last 7 days of new booking requests
  const dailyDistributionData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toDateString();
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    // Count how many booking requests were created on this specific day
    const count = bookings.filter(b => {
      if (!b.createdAt) return false;
      const createdDate = new Date(b.createdAt);
      return createdDate.toDateString() === dateKey;
    }).length;

    return {
      day: label,
      requests: count
    };
  });

  // Filter bookings list
  const filteredBookings = bookings.filter(b => {
    const searchLower = bookingSearch.toLowerCase();
    const matchesSearch = b.fullName.toLowerCase().includes(searchLower) ||
                          b.id.toLowerCase().includes(searchLower) ||
                          b.tourTitle.toLowerCase().includes(searchLower) ||
                          (b.hotelName && b.hotelName.toLowerCase().includes(searchLower));
    
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    
    let matchesCategory = true;
    if (bookingCategoryFilter !== 'all') {
      const tour = ALL_TOURS.find(t => t.id === b.tourId);
      matchesCategory = tour?.category === bookingCategoryFilter;
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStartEditing = (booking: BookingRequest) => {
    setEditingBookingId(booking.id);
    setEditBookingForm({ ...booking });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateBooking(id, editBookingForm);
    setEditingBookingId(null);
    setEditBookingForm({});
  };

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/35 shadow-[0_0_8px_rgba(245,158,11,0.25)] animate-pulse',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    flagged: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    denied: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        id="pro-admin-dashboard-container"
        className="w-full max-w-6xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-emerald-500/10">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-slate-50 uppercase tracking-wider">
                  MAS PRO ADMIN PORTAL
                </h2>
                <span className="hidden sm:inline bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono border border-emerald-500/20 font-bold uppercase select-none">
                  V2.4 Active
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400 leading-none mt-0.5">
                Central Operations, Dynamic Price Adjuster, and Operational overrides.
              </p>
            </div>
          </div>

          {/* Quick Stats Overviews & Close Tab */}
          <div className="flex items-center gap-3.5 self-end md:self-center">
            <button
              onClick={onSeedMockBookings}
              className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              title="Populates system with 5 realistic bookings for rich charts and demonstrations"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Seed Booking Ledger</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-450 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800 shrink-0"
              title="Return to store front"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar / Tab Row */}
        <div className="flex bg-slate-950/40 border-b border-slate-850 overflow-x-auto select-none gap-1 p-2">
          {[
            { id: 'stats', label: 'Overview Analytics', icon: BarChart2 },
            { id: 'bookings', label: 'Booking Ledgers', icon: Users },
            { id: 'prices', label: 'Excursion Pricing Override', icon: Coins },
            { id: 'promos', label: 'Promo Code Engine', icon: Tag },
            { id: 'data', label: 'Subscribers & Data Vault', icon: Database },
            { id: 'operations', label: 'Operations & Sandbox Controls', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Workspace */}
        <div className="p-6 overflow-y-auto bg-slate-950/15 custom-scrollbar flex-1">
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW ANALYTICS */}
            {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              
              {/* Highlight KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black">Total Bookings</span>
                    <h3 className="text-2xl font-display font-black text-white mt-1">{totalBookingsCount}</h3>
                  </div>
                  <p className="text-[9px] text-slate-500 font-sans mt-2">Active drafted / verified list</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400/90 uppercase font-black">Estimated Value</span>
                    <h3 className="text-2xl font-display font-black text-emerald-400 mt-1">${potentialRevenueUSD.toLocaleString()}</h3>
                  </div>
                  <p className="text-[9px] text-slate-500 font-sans mt-2">Sum base conversions in USD</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black">Passenger Distribution</span>
                    <h3 className="text-xl font-display font-bold text-slate-200 mt-1">
                      {totalAdults} <span className="text-[10px] text-slate-500 font-mono">AD</span> • {totalChildren} <span className="text-[10px] text-slate-500 font-mono">CH</span>
                    </h3>
                  </div>
                  <p className="text-[9px] text-slate-500 font-sans mt-2">Adult vs pediatric ratio</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black">Active Alerts</span>
                    <h3 className={`text-xl font-display font-extrabold mt-1 uppercase ${weatherCondition !== 'normal' ? 'text-amber-500 animate-pulse' : 'text-emerald-400'}`}>
                      {weatherCondition === 'normal' ? 'All Clear' : `${weatherCondition} alert`}
                    </h3>
                  </div>
                  <p className="text-[9px] text-slate-500 font-sans mt-2">Operations forecast system</p>
                </div>
              </div>

              {/* Data Visualization Charts */}
              {totalBookingsCount === 0 ? (
                <div className="p-10 text-center rounded-2xl border border-slate-850 bg-slate-950/40 text-slate-500 flex flex-col items-center justify-center">
                  <Database className="w-8 h-8 text-slate-700 mb-2" />
                  <p className="font-display font-bold text-slate-400">No Booking Data Available for Charts</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                    Book an excursion flyer inside the app first, or click &ldquo;Seed Booking Ledger&rdquo; above to load sample telemetry records.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Revenue Contribution */}
                    <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">Revenue Allocation by Class</h4>
                        <p className="font-sans text-[11px] text-slate-500">Aggregate potential pricing index in USD.</p>
                      </div>
                      <div className="w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                            <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 8 }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }} />
                            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Status Allocation ratio */}
                    <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">Ticket Status Breakdown</h4>
                        <p className="font-sans text-[11px] text-slate-500">Logistical ratios for drafted, pending, and confirmed vouchers.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                        <div className="w-full h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={55}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Metric list */}
                        <div className="space-y-2.5 text-[11px] font-sans">
                          {pieChartData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-300 font-semibold">{item.name}</span>
                              </div>
                              <span className="font-mono text-slate-400 font-bold">{item.value} tickets ({Math.round((item.value / totalBookingsCount) * 100)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Distribution of New Booking Requests */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">
                            Daily Distribution of New Booking Requests
                          </h4>
                          <p className="font-sans text-[11px] text-slate-500">
                            Volume of reservations submitted per day over the last 7 days.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-950/20 border border-indigo-500/10 rounded-lg text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3 text-indigo-455" />
                        <span>Last 7 Days</span>
                      </div>
                    </div>

                    <div className="w-full h-64 pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                          <XAxis 
                            dataKey="day" 
                            tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                            stroke="#1e293b"
                          />
                          <YAxis 
                            tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                            allowDecimals={false}
                            stroke="#1e293b"
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#020617', 
                              border: '1px solid #1e293b', 
                              borderRadius: '12px',
                              fontFamily: 'sans-serif',
                              fontSize: '11px',
                              color: '#fff'
                            }} 
                            itemStyle={{ color: '#a5b4fc' }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                          />
                          <Bar 
                            dataKey="requests" 
                            name="Booking Requests" 
                            fill="#6366f1" 
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Robust Live Administrative Panel Extensions */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    {/* Excursion Sales Leaderboard */}
                    <div className="lg:col-span-6 p-5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">
                              Excursion Program Sales Rank
                            </h4>
                            <p className="font-sans text-[11px] text-slate-500">
                              Top producing adventure itineraries sorted by calculated sales.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1 custom-scrollbar">
                        {excursionLeaderboard.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-5 h-5 font-mono text-[10px] uppercase font-black rounded-lg flex items-center justify-center border ${
                                index === 0 
                                  ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' 
                                  : index === 1 
                                  ? 'bg-slate-300/10 border-slate-300/40 text-slate-350'
                                  : index === 2
                                  ? 'bg-amber-700/10 border-amber-700/45 text-amber-500'
                                  : 'bg-slate-900 border-slate-850 text-slate-500'
                              }`}>
                                {index + 1}
                              </span>
                              
                              <div className="min-w-0">
                                <p className="font-sans font-bold text-slate-200 truncate" title={item.title}>{item.title}</p>
                                <p className="font-mono text-[9px] uppercase text-emerald-500 font-extrabold flex items-center gap-1.5 mt-0.5">
                                  <span>{item.category}</span>
                                  <span className="text-slate-650">•</span>
                                  <span className="text-slate-400">{item.salesCount} Bookings Sold</span>
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-[11px] font-black tracking-wider text-slate-100">
                                ${item.totalRevenue.toLocaleString()}
                              </span>
                              <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full" 
                                  style={{ width: `${potentialRevenueUSD > 0 ? (item.totalRevenue / potentialRevenueUSD) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Telemetry Terminal Log */}
                    <div className="lg:col-span-6 p-5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">
                              Real-Time Security Event & Audit Log
                            </h4>
                            <p className="font-sans text-[11px] text-slate-500">
                              Interactive telemetry for testing checkouts, rates, and condition updates.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setAuditLogs([])}
                          className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-850 px-2 py-1 rounded text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/30 transition-all font-bold cursor-pointer"
                          title="Purge local telemetry view screen"
                        >
                          Clear Logs
                        </button>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 h-[230px] overflow-y-auto custom-scrollbar font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5">
                        {auditLogs.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-650 font-sans italic text-center text-xs">
                            <span>No event records listed in console.</span>
                            <span className="text-[10px] mt-0.5">Dispatch metadata updates below to inject events.</span>
                          </div>
                        ) : (
                          auditLogs.map((log) => {
                            const badgeColors = {
                              info: 'text-sky-450',
                              success: 'text-emerald-450',
                              warning: 'text-yellow-450',
                              system: 'text-purple-450'
                            };
                            return (
                              <div key={log.id} className="text-left flex items-start gap-1.5 text-slate-350">
                                <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span className={`${badgeColors[log.type]} font-bold uppercase shrink-0`}>[{log.type}]</span>
                                <span className="text-slate-300 select-text">{log.message}</span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="uppercase tracking-widest text-[8.5px] font-black text-emerald-400">Telemetry Stream Live</span>
                        </div>
                        <span>Active Session ID: x{(bookings.length % 9) + 1}7aFz</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Admin Quick Reminders */}
              <div className="p-4 rounded-xl bg-slate-905 border border-slate-850 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs font-sans text-slate-400 leading-relaxed">
                  <p className="font-bold text-slate-200">🔒 System Integrity Notice:</p>
                  <p className="mt-0.5 text-slate-400">
                    This admin console simulates database manipulation over your browser. All updates sync natively inside your local sandbox. Set base prices below to manually test the checkout or customize discount codes.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: BOOKING LEDGER */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              
              {/* Automated WhatsApp Pending Bookings Banner Alert */}
              {(() => {
                const pendingList = bookings.filter(b => b.status === 'pending');
                if (pendingList.length === 0) return null;
                return (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/15 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 border border-amber-500/25">
                        <MessageSquare className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <span>Pending Bookings Engagement Queue</span>
                          <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-mono text-[9px] font-black rounded-md">{pendingList.length} Pending</span>
                        </h4>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          We detected <span className="text-amber-400 font-bold">{pendingList.length} local booking requests</span> waiting for registration validation. Speed up your confirmation process by launching our WhatsApp templates dispatcher to request finalized details immediately.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 md:self-center self-end">
                      <button
                        onClick={() => handleTriggerSinglePendingReminder(pendingList[0])}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 shrink-0"
                        title="Launches interactive reminder queue manager"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Send Automated Reminders</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                {/* Search */}
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search passenger, Voucher ID..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder:text-slate-650 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Status Selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="all">All States</option>
                      <option value="draft">Drafts</option>
                      <option value="pending">Pending WhatsApp</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="denied">Denied</option>
                      <option value="flagged">Flagged</option>
                    </select>
                  </div>

                  {/* Category filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium">Category:</span>
                    <select
                      value={bookingCategoryFilter}
                      onChange={(e) => setBookingCategoryFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      {TOUR_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Operational Export CSV Trigger */}
                  <button
                    onClick={handleExportCSV}
                    disabled={bookings.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-55 disabled:cursor-not-allowed text-slate-950 font-mono text-[10px] font-black uppercase tracking-normal rounded-lg transition-all cursor-pointer shrink-0"
                    title="Generate and download CSV datasheet of all current ledger bookings"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV Ledger</span>
                  </button>
                </div>
              </div>

              {/* Bookings Ledger list */}
              {filteredBookings.length === 0 ? (
                <div className="p-16 text-center rounded-2xl border border-slate-850 bg-slate-950/40 text-slate-500">
                  <Search className="w-8 h-8 mx-auto text-slate-705 mb-2.5" />
                  <p className="font-display font-bold text-slate-400 text-sm">No bookings match filter constraints</p>
                  <p className="text-xs text-slate-550 mt-1">Try resetting search keywords or status indicators.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bulk Actions Menu & Control Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 px-4 border border-slate-855 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filteredBookings.length > 0 && filteredBookings.every(b => selectedBookingIds.includes(b.id))}
                        onChange={() => handleToggleSelectAll(filteredBookings)}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-555 focus:ring-emerald-500/30 cursor-pointer"
                        title="Select/deselect all visible items"
                      />
                      <span className="text-xs font-mono font-bold text-slate-450">
                        {selectedBookingIds.filter(id => bookings.some(b => b.id === id)).length} of {filteredBookings.length} Selected
                      </span>

                      {selectedBookingIds.length > 0 && (
                        <button
                          onClick={() => setSelectedBookingIds([])}
                          className="text-[10px] uppercase font-mono tracking-wider text-[#a855f7] hover:text-[#c084fc] font-bold cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {selectedBookingIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-500">
                          Bulk Actions:
                        </span>
                        
                        {/* Status updates select */}
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 px-2">
                          <span className="text-[9px] uppercase font-mono text-slate-500">Set Status:</span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleBulkUpdateStatus(e.target.value as any);
                                e.target.value = '';
                              }
                            }}
                            defaultValue=""
                            className="bg-transparent border-none text-[10px] font-mono font-black text-emerald-400 focus:outline-none cursor-pointer pr-1 uppercase"
                          >
                            <option value="" disabled>Choose...</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="denied">Denied</option>
                            <option value="flagged">Flagged</option>
                          </select>
                        </div>

                        {/* Bulk Delete Button */}
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-950 hover:border-rose-800 text-rose-450 font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          title="Permanently remove selected booking requests"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Purge Selected</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {filteredBookings.map((b) => {
                    const isEditing = editingBookingId === b.id;
                    const resolvedTotalCost = getResolvedTourPrice(b.tourId, b.adultsCount, b.childrenCount);
                    const isSelected = selectedBookingIds.includes(b.id);
                    return (
                      <div 
                        key={b.id}
                        className={`p-5 bg-slate-950 border rounded-2xl transition-all ${
                          isSelected ? 'border-emerald-500/40 shadow-inner ring-1 ring-emerald-500/10' : isEditing ? 'border-amber-500/40 shadow-lg' : 'border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        {/* Header metadata row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3 mb-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectBooking(b.id)}
                              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-emerald-555 focus:ring-emerald-500/30 cursor-pointer shrink-0"
                            />
                            <span className="font-mono text-xs font-black text-slate-400">
                              ID: {b.id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">
                              Created: {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Set Status tag */}
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <select
                                value={editBookingForm.status}
                                onChange={(e) => setEditBookingForm(prev => ({ ...prev, status: e.target.value as any }))}
                                className="bg-slate-900 border border-amber-500/30 rounded-lg px-2 py-1 text-amber-400 text-xs font-bold focus:outline-none cursor-pointer"
                              >
                                <option value="draft">Draft</option>
                                <option value="pending">Pending WhatsApp</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="denied">Denied</option>
                                <option value="flagged">Flagged</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-0.5 border font-mono text-[9px] font-black uppercase tracking-wider rounded-lg ${statusColors[b.status] || ''}`}>
                                {b.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Edit Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                          
                          {/* Lead Guest info */}
                          <div className="md:col-span-4 space-y-3">
                            <div>
                              <label className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                Lead Passenger Name
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editBookingForm.fullName || ''}
                                  onChange={(e) => setEditBookingForm(prev => ({ ...prev, fullName: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                              ) : (
                                <p className="text-sm font-bold text-slate-200">{b.fullName}</p>
                              )}
                            </div>

                            <div>
                              <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                Contact Linkage (WhatsApp)
                              </span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editBookingForm.whatsappNumber || ''}
                                  onChange={(e) => setEditBookingForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                                />
                              ) : (
                                <a 
                                  href={`https://wa.me/${b.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="font-mono text-xs text-emerald-400 hover:text-emerald-350 transition-colors flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                                  <span>{b.whatsappNumber}</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Date & Resort location */}
                          <div className="md:col-span-4 space-y-3">
                            <div>
                              <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                Travel Target Date
                              </span>
                              {isEditing ? (
                                <input
                                  type="date"
                                  value={editBookingForm.bookingDate || ''}
                                  onChange={(e) => setEditBookingForm(prev => ({ ...prev, bookingDate: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-slate-200 font-bold flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                                  <span>{b.bookingDate}</span>
                                </p>
                              )}
                            </div>

                            <div>
                              <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                Pickup Resort Name
                              </span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editBookingForm.hotelName || ''}
                                  onChange={(e) => setEditBookingForm(prev => ({ ...prev, hotelName: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-slate-300 font-semibold truncate flex items-center gap-1" title={b.hotelName}>
                                  <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                                  <span className="truncate">{b.hotelName || 'Pickup not configured'}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Excursion and Cost allocation */}
                          <div className="md:col-span-4 space-y-3">
                            <div>
                              <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1 font-bold">
                                Program Specialization
                              </span>
                              <p className="text-xs font-bold text-slate-200 truncate">{b.tourTitle}</p>
                            </div>

                            <div className="flex gap-4">
                              <div>
                                <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                  Adults Count
                                  </span>
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="1"
                                    value={editBookingForm.adultsCount || 1}
                                    onChange={(e) => setEditBookingForm(prev => ({ ...prev, adultsCount: parseInt(e.target.value) || 1 }))}
                                    className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                                  />
                                ) : (
                                  <p className="text-xs text-slate-300 font-bold">{b.adultsCount} Pax</p>
                                )}
                              </div>

                              <div>
                                <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                                  Children Count
                                </span>
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={editBookingForm.childrenCount || 0}
                                    onChange={(e) => setEditBookingForm(prev => ({ ...prev, childrenCount: parseInt(e.target.value) || 0 }))}
                                    className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                                  />
                                ) : (
                                  <p className="text-xs text-slate-300 font-bold">{b.childrenCount} Pax</p>
                                )}
                              </div>

                              <div className="text-right ml-auto">
                                <span className="block font-mono text-[8px] uppercase tracking-wider text-emerald-500/90 font-black mb-1">
                                  Estimated Base
                                </span>
                                <span className="font-mono text-sm font-black text-emerald-400">
                                  ${resolvedTotalCost.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Guest Special requests & ADMIN PRIVATE NOTES */}
                          <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-900/60 text-xs">
                            <div>
                              <span className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-550 font-bold mb-1">
                                Direct Client Request Memo:
                              </span>
                              <p className="italic text-slate-400 bg-slate-900/40 border border-slate-900/80 p-2 rounded-lg">
                                {b.specialRequests ? `"${b.specialRequests}"` : 'No custom traveler notes specified.'}
                              </p>
                            </div>

                            <div>
                              <span className="block font-mono text-[8.5px] uppercase tracking-wider text-amber-500 font-extrabold mb-1">
                                🔑 Core Admin Private Notes:
                              </span>
                              {isEditing ? (
                                <textarea
                                  value={editBookingForm.adminNotes || ''}
                                  onChange={(e) => setEditBookingForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                                  placeholder="Write local notes e.g., 'Driver Assigned', 'VIP Seat', 'EGP Paid'..."
                                  rows={2}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-650"
                                />
                              ) : (
                                <p className={`p-2 rounded-lg border text-xs leading-normal font-sans italic ${
                                  b.adminNotes 
                                    ? 'bg-amber-500/5 text-amber-400 border-amber-550/15' 
                                    : 'bg-slate-900 font-medium text-slate-500 border-slate-900'
                                }`}>
                                  {b.adminNotes || 'No administrative memos assigned yet. Enter edit mode to apply notes.'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Tracker Timeline section */}
                          <div className="col-span-1 md:col-span-12 pt-4 border-t border-slate-900/60 pb-1.5">
                            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#a855f7] font-black mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Voucher Verification Tracking Timeline</span>
                            </span>

                            <div className="relative pl-6 border-l border-slate-900 space-y-3.5 mt-3">
                              {(b.statusHistory && b.statusHistory.length > 0 ? b.statusHistory : [
                                {
                                  status: b.status,
                                  timestamp: b.createdAt || b.createdAt || new Date().toISOString(),
                                  updatedBy: 'client' as const,
                                  note: 'Initial traveler reservation voucher drafted.'
                                }
                              ]).map((historyEntry, index) => {
                                const entryStatusColors: Record<string, string> = {
                                  draft: 'bg-slate-700 border-slate-600 text-slate-300',
                                  pending: 'bg-indigo-950 border-indigo-500/30 text-indigo-400',
                                  confirmed: 'bg-emerald-950 border-emerald-550/30 text-emerald-400',
                                  denied: 'bg-rose-950 border-rose-500/20 text-rose-450',
                                  flagged: 'bg-amber-950 border-amber-550/20 text-amber-400'
                                };

                                const dotColor = entryStatusColors[historyEntry.status] || 'bg-slate-800 border-slate-700 text-slate-300';
                                const formattedTime = new Date(historyEntry.timestamp).toLocaleString();

                                return (
                                  <div key={index} className="relative text-left flex flex-col gap-0.5">
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-[32.5px] top-1 w-3.5 h-3.5 rounded-full border-2 ${dotColor} bg-slate-950`} />
                                    
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <span className="font-mono font-black uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[8.5px] tracking-wider">
                                        {historyEntry.status === 'pending' ? '⏳ pending' : historyEntry.status === 'confirmed' ? '✅ confirmed' : historyEntry.status === 'denied' ? '❌ denied' : historyEntry.status === 'flagged' ? '⚠️ flagged' : '📝 draft'}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-500">
                                        {formattedTime}
                                      </span>
                                      <span className="text-[8.5px] font-mono uppercase tracking-widest text-slate-450 bg-slate-900 border border-slate-850 px-2 py-0.1 rounded shrink-0">
                                        Action by: {historyEntry.updatedBy}
                                      </span>
                                    </div>
                                    {historyEntry.note && (
                                      <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5 pl-0.5 font-sans font-medium">
                                        ↳ {historyEntry.note}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* Actions Row */}
                        <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-end gap-2.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => setEditingBookingId(null)}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono tracking-wider uppercase text-slate-450 hover:text-white transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(b.id)}
                                className="px-5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-mono tracking-wider uppercase font-black transition-all cursor-pointer flex items-center gap-1 animate-premium-gold"
                              >
                                <Check className="w-3.5 h-3.5 shrink-0" />
                                <span>Save System Record</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {b.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleTriggerSinglePendingReminder(b)}
                                  className="px-3.5 py-1.5 bg-emerald-950/20 border border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-400 text-[10px] font-mono tracking-wider uppercase font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                                  title="Construct and trigger automated WhatsApp details template for this pending reservation"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                                  <span>{reminderHistory[b.id] ? `Reminded (${reminderHistory[b.id]})` : "Send Reminder"}</span>
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteBooking(b.id)}
                                className="px-3.5 py-1.5 bg-slate-900 border border-slate-850 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-[10px] font-mono tracking-wider uppercase font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                title="Discard voucher forever"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Delete Record</span>
                              </button>
                              <button
                                onClick={() => handleStartEditing(b)}
                                className="px-5 py-1.5 bg-slate-900 border border-slate-850 hover:border-amber-500/30 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 text-[10px] font-mono tracking-wider uppercase font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                                <span>Edit Telemetry</span>
                              </button>
                            </>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3: EXCURSION PRICING INTERACTIVE OVERRIDE */}
          {activeTab === 'prices' && (
            <motion.div
              key="prices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6 text-left"
            >
              <div>
                <h3 className="font-display font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Interactive Pricing Override Module</span>
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Override baseline prices for any official adventure program live. As soon as you update any dollar value here, the edits sync instantaneously across the user catalog, voucher calculators, and planning dashboards!
                </p>
              </div>

              {/* Quick Preset Control Center */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-display font-black text-xs text-slate-200 uppercase tracking-widest leading-none">Quick Margins Controller • Seasonal Presets</span>
                </div>
                <p className="font-sans text-[11px] text-slate-500">
                  Bulk apply pricing templates with single-click precision across all listed excursions:
                </p>
                
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('all-premium')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 hover:text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    title="Raise all excursion prices by 15% for summer rush"
                  >
                    <span>📈 Peak Season TEMPLATE (+15%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('all-sale')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    title="Markdown all prices by 10% for autumn affiliate sale"
                  >
                    <span>📉 Off-Peak Markdown (-10%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('reset-all')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    title="Clear all manual price overrides and restore factory defaults"
                  >
                    <span>🔄 Revert Factory Defaults</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_TOURS.map((tour) => {
                  const resolvedPrice = customPrices[tour.id] || TOUR_PRICES[tour.id] || { adult: 40, child: 20 };
                  const isModified = !!customPrices[tour.id];
                  
                  return (
                    <div 
                      key={tour.id}
                      className={`p-4 rounded-2xl bg-slate-950 border transition-all ${
                        isModified ? 'border-emerald-500/40 bg-slate-950/80 shadow-md shadow-emerald-500/5' : 'border-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="min-w-0">
                          <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold leading-none truncate">
                            {tour.category} • ID: {tour.id}
                          </p>
                          <h4 className="font-display font-extrabold text-xs text-slate-200 mt-1.5 truncate" title={tour.title}>
                            {tour.title}
                          </h4>
                        </div>
                        
                        {isModified && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                            Custom Modified
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                        {/* Adult Price override */}
                        <div>
                          <label className="block font-mono text-[8px] uppercase tracking-wider text-slate-450 font-bold mb-1">
                            Adult rate (USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">$</span>
                            <input
                              type="number"
                              min="1"
                              value={resolvedPrice.adult}
                              onChange={(e) => {
                                const newAdult = parseInt(e.target.value) || 0;
                                onUpdateTourPrice(tour.id, newAdult, resolvedPrice.child);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Child Price override */}
                        <div>
                          <label className="block font-mono text-[8px] uppercase tracking-wider text-slate-450 font-bold mb-1">
                            Children rate (USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">$</span>
                            <input
                              type="number"
                              min="1"
                              value={resolvedPrice.child}
                              onChange={(e) => {
                                const newChild = parseInt(e.target.value) || 0;
                                onUpdateTourPrice(tour.id, resolvedPrice.adult, newChild);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic details */}
                      <p className="text-[9px] font-sans text-slate-550 mt-3 select-none">
                        * Standard default: ${TOUR_PRICES[tour.id]?.adult || 40} Adults • ${TOUR_PRICES[tour.id]?.child || 20} Kids base
                      </p>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {/* TAB 4: ACTIVE PROMO CODES */}
          {activeTab === 'promos' && (
            <motion.div
              key="promos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6 text-left"
            >
              <div>
                <h3 className="font-display font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4.5 h-4.5 text-amber-500" />
                  <span>Boutique Promotional Code Engine</span>
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Create and manage active booking discount codes. Customers can apply these codes in the QuickBookingForm to claim percentage subtractions. Default codes include <span className="text-emerald-400 font-mono font-black border-slate-800 bg-slate-900 px-1 py-0.2 rounded">GOLD10</span> (10% auto savings).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Creator form */}
                <div className="md:col-span-5 p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-2">
                    Inject Promos Code
                  </h4>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-450 font-extrabold mb-1.5">
                        Promo Code Label (e.g. SUMMER20)
                      </label>
                      <input
                        type="text"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono tracking-widest text-white focus:outline-none"
                        placeholder="SUMMERCODE"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-450 font-extrabold mb-1.5">
                        Savings Percentage Subtraction
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="95"
                          value={newPromoDiscount}
                          onChange={(e) => setNewPromoDiscount(Math.min(95, Math.max(1, parseInt(e.target.value) || 10)))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-white focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500 font-bold">% OFF</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newPromoCode) return;
                        onAddPromoCode(newPromoCode, newPromoDiscount);
                        setNewPromoCode('');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-[10.5px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Activate Discount Promo</span>
                    </button>
                  </div>
                </div>

                {/* Grid stats active list */}
                <div className="md:col-span-7 p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-2">
                    Active System Promos Matrix
                  </h4>

                  <div className="space-y-3">
                    {Object.entries(promoCodes).length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-6">No custom codes activated. Users can only apply default codes.</p>
                    ) : (
                      Object.entries(promoCodes).map(([code, value]) => (
                        <div 
                          key={code}
                          className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1 px-1.5 rounded bg-emerald-950 border border-emerald-500/15 text-emerald-400 font-mono text-xs tracking-wider font-extrabold uppercase">
                              {code}
                            </div>
                            <span className="font-sans text-xs text-slate-300 font-extrabold">
                              {value}% Off Excursions
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Usage indicator placeholder */}
                            <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                              Claimed: {Math.floor(Math.sin(code.charCodeAt(0)) * 4 + 5)} times
                            </span>

                            <button
                              onClick={() => onRemovePromoCode(code)}
                              className="p-2 bg-slate-950 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-850 rounded-lg transition-colors cursor-pointer"
                              title="Delete Code"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: OPERATIONS & SANDBOX ADVANCED CONTROLS */}
          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6 text-left"
            >
              <div>
                <h3 className="font-display font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Operational Settings & Sandbox Controls</span>
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Direct simulation parameters. Tweak standard currency rates, enable dynamic extreme alert banners on user layout, or manage state telemetry records instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Currency Manual Overrides */}
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Live Ex-Rate Override Multipliers</span>
                  </h4>
                  <p className="font-sans text-[11px] text-slate-500 leading-normal mb-2">
                    Modify the live exchange multiplier for 1 USD. Updates cost displays across checkout modules instantly!
                  </p>

                  <div className="space-y-3 text-xs font-sans">
                    {/* EGP override */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-300 block">Egyptian Pound (EGP)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Standard: 47.50 EGP</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        value={currencyRatesOverride['EGP']}
                        onChange={(e) => onUpdateCurrencyRate('EGP', parseFloat(e.target.value) || 47.50)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                    </div>

                    {/* EUR override */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-2.5">
                      <div>
                        <span className="font-bold text-slate-300 block">Euro (EUR)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Standard: 0.92 EUR</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={currencyRatesOverride['EUR']}
                        onChange={(e) => onUpdateCurrencyRate('EUR', parseFloat(e.target.value) || 0.92)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                    </div>

                    {/* GBP override */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-2.5">
                      <div>
                        <span className="font-bold text-slate-300 block">British Pound (GBP)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Standard: 0.78 GBP</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={currencyRatesOverride['GBP']}
                        onChange={(e) => onUpdateCurrencyRate('GBP', parseFloat(e.target.value) || 0.78)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Operations Weather Alert Simulator */}
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Red Sea Advisory Alert Simulator</span>
                  </h4>
                  <p className="font-sans text-[11px] text-slate-500 leading-normal mb-2">
                    Enable global dynamic warning labels. Active advisories show an interactive, high-contrast caution alert at the top of the passenger app!
                  </p>

                  <div className="flex flex-col gap-2.5 pt-1">
                    {[
                      { id: 'normal', label: 'ALL CLEAR (Standard Operations)', desc: 'Standard sea flow & sandbar visits', color: 'border-slate-800 hover:border-slate-705' },
                      { id: 'heatwave', label: '⚠️ EXTREME WEATHER WARNING (Heatwave advisory)', desc: 'Activates high-temperature caution prompts with dynamic advice', color: 'border-yellow-500/20 text-yellow-400 bg-yellow-950/5 hover:bg-yellow-950/10' },
                      { id: 'storm', label: '🚨 GALE-FORCE WINDS (Small Craft Warning)', desc: 'Trigger high wind sea advisory with warning to coordinate speeds', color: 'border-rose-500/20 text-rose-400 bg-rose-950/5 hover:bg-rose-950/10' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onUpdateWeatherCondition(item.id as any)}
                        className={`p-3 text-left rounded-xl border text-xs cursor-pointer transition-all ${
                          weatherCondition === item.id 
                            ? 'ring-2 ring-emerald-500/40 bg-emerald-950/10 border-emerald-500/45 text-emerald-400 font-bold' 
                            : item.color
                        }`}
                      >
                        <p className="font-semibold leading-relaxed">{item.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6 text-left"
            >
              {/* Header Title Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-905">
                <div className="space-y-1 bg-transparent border-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md">
                    <Database className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>Compliance Vault & Newsletter Dispatch</span>
                  </div>
                  <h3 className="font-display font-black text-sm text-slate-100 uppercase tracking-wide">
                    MAS Central Data Sweep & Subscribers Management
                  </h3>
                  <p className="font-sans text-xs text-slate-400 max-w-3xl">
                    Collect live checkout session cookies, audit passenger footprint data under secure protocols, manage newsletter subscriptions, and live-edit custom bulk email dispatches.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={handleSweepSystemData}
                    disabled={isDataSweeping}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-950 border border-slate-800 text-slate-350 hover:text-white font-mono text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 disabled:cursor-not-allowed"
                    title="Rescans client systems for newly registered vouchers, reviews, or privacy consents"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDataSweeping ? 'animate-spin text-emerald-400' : ''}`} />
                    <span>{isDataSweeping ? 'Sweeping DB...' : 'Sweep Live DB'}</span>
                  </button>

                  <button
                    onClick={triggerCombinedDataExport}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-[10px] rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                    title="Downloads complete backup state as structured JSON"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Export Data Audit (JSON)</span>
                  </button>
                </div>
              </div>

              {/* CSV Fast Export Toolbar */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Express Spreadsheet Exporters:</span>
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => triggerCSVExport('bookings')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-indigo-400 hover:text-indigo-300 border border-indigo-500/10 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    CSV: Bookings Ledger
                  </button>
                  <button
                    onClick={() => triggerCSVExport('subscribers')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-emerald-400 hover:text-emerald-300 border border-emerald-500/10 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    CSV: Newsletter Subs
                  </button>
                  <button
                    onClick={() => triggerCSVExport('consent')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-yellow-500 hover:text-yellow-400 border border-yellow-500/10 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    CSV: Cookie Consent Audit
                  </button>
                </div>
              </div>

              {/* Grid 2-column Structure */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column A: Subscribers Whitelist & Dispatch Machine */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Subscriber List Card */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <div>
                        <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-emerald-400" />
                          <span>Mailing List Subscribers Audit ({subscribers.length})</span>
                        </h4>
                        <p className="font-sans text-[10px] text-slate-500 mt-0.5 leading-normal">
                          Manage active email addresses on file for promotional vouchers and wind-safe sea wave guidelines.
                        </p>
                      </div>

                      {subscribers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete all subscribers?")) {
                              setSubscribers([]);
                              localStorage.removeItem('mas_newsletter_subscribers');
                              addAuditLog('Newsletter Whitelist: Pruned all subscribers.', 'warning');
                            }
                          }}
                          className="text-[10px] text-rose-500 hover:text-rose-400 cursor-pointer font-mono font-bold flex items-center gap-1 bg-rose-950/10 p-1 px-2 border border-rose-500/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear Whitelist</span>
                        </button>
                      )}
                    </div>

                    {/* Add Subscriber Inline Form */}
                    <form onSubmit={handleManualAddSubscriberSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-6 space-y-1.5">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Manual Enrollment Email:</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="passenger@explore-egypt.com"
                            value={newSubEmail}
                            onChange={(e) => setNewSubEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs font-sans text-white focus:bg-slate-950"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4 space-y-1.5 text-left">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Default Interests:</label>
                        <select
                          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs font-sans text-slate-300"
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewSubPrefs(val === 'all' ? ['flash-deals', 'island-cruises', 'desert-safari', 'antiquities'] : [val]);
                          }}
                        >
                          <option value="flash-deals">🔔 Deal Alerts ONLY</option>
                          <option value="island-cruises">🏝️ Island Beach & Cruises</option>
                          <option value="desert-safari">🐪 Desert Safaris</option>
                          <option value="antiquities">🏛️ Pharaonic Temples</option>
                          <option value="all">⚡ All Categories</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-[10px] rounded-xl uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Enroll</span>
                        </button>
                      </div>
                    </form>

                    {/* Search & Bulk Select tools */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/10 p-3 rounded-xl border border-slate-900">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-550" />
                        <input
                          type="text"
                          placeholder="Search subscribers & tags..."
                          value={subSearchQuery}
                          onChange={(e) => setSubSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-slate-700 font-sans"
                        />
                      </div>

                      {subscribers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const visibleEmails = subscribers.filter(s => {
                                const q = subSearchQuery.toLowerCase().trim();
                                return !q || s.email.toLowerCase().includes(q) || s.preferences.some(p => p.toLowerCase().includes(q));
                              }).map(s => s.email);

                              const allSelected = visibleEmails.every(email => selectedSubs.includes(email));
                              if (allSelected) {
                                setSelectedSubs(prev => prev.filter(e => !visibleEmails.includes(e)));
                              } else {
                                setSelectedSubs(prev => [...new Set([...prev, ...visibleEmails])]);
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-[10px] font-mono text-slate-400 border border-slate-850 rounded hover:text-white transition-colors cursor-pointer"
                          >
                            {subscribers.filter(s => {
                              const q = subSearchQuery.toLowerCase().trim();
                              return !q || s.email.toLowerCase().includes(q) || s.preferences.some(p => p.toLowerCase().includes(q));
                            }).every(email => selectedSubs.includes(email.email)) ? '✔ Uncheck All' : '☑ Check All visible'}
                          </button>

                          <span className="text-[10px] text-slate-400 font-mono">
                            Checked: <span className="font-bold text-emerald-400 font-mono">{selectedSubs.length}</span> / {subscribers.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Subscribers Scannable table list */}
                    <div className="max-h-56 overflow-y-auto custom-scrollbar border border-slate-900 rounded-xl bg-slate-950/40">
                      {subscribers.length === 0 ? (
                        <div className="p-8 text-center text-slate-600 space-y-1">
                          <p className="font-display font-medium text-xs">No active newsletter subscribers Whitelists found.</p>
                          <p className="font-sans text-[10px] text-slate-500">Subscribers created on frontend signups manifest here automatically.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-900/60 font-sans text-xs">
                          {subscribers.filter(sub => {
                            const q = subSearchQuery.toLowerCase().trim();
                            if (!q) return true;
                            return sub.email.toLowerCase().includes(q) || sub.preferences.some(p => p.toLowerCase().includes(q));
                          }).map((sub, i) => {
                            const isChecked = selectedSubs.includes(sub.email);
                            return (
                              <div key={sub.email || i} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-900/10 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setSelectedSubs(prev => 
                                        prev.includes(sub.email) ? prev.filter(e => e !== sub.email) : [...prev, sub.email]
                                      );
                                    }}
                                    className="w-4 h-4 accent-emerald-500 rounded border-slate-800 bg-slate-900 cursor-pointer"
                                  />

                                  <div className="space-y-0.5 max-w-full">
                                    <span className="font-mono text-slate-200 block truncate font-bold text-xs">{sub.email}</span>
                                    <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-[9px] text-slate-550 mr-2 font-mono">{sub.subscribedAt}</span>
                                      {sub.preferences.map(pref => {
                                        let label = pref;
                                        let color = "bg-slate-900 border-slate-800 text-slate-400";
                                        if (pref === 'flash-deals') { label = '🔔 Deals'; color = "bg-amber-950/40 border-amber-500/10 text-amber-500"; }
                                        else if (pref === 'island-cruises') { label = '🏝️ Islands'; color = "bg-emerald-950/40 border-emerald-500/10 text-emerald-400"; }
                                        else if (pref === 'desert-safari') { label = '🐪 Safaris'; color = "bg-amber-950/40 border-amber-500/10 text-amber-500"; }
                                        else if (pref === 'antiquities') { label = '🏛️ Temples'; color = "bg-sky-950/40 border-sky-500/10 text-sky-400"; }
                                        return (
                                          <span key={pref} className={`px-1.5 py-0.5 rounded text-[9px] font-medium border font-sans ${color}`}>
                                            {label}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubscriberEntry(sub.email)}
                                  className="p-1 px-2 border border-slate-850 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                  title="Remove Subscriber"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ready to Send Campaign Builder Card */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <div>
                      <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>Ready-To-Send Luxury Campaign Creator</span>
                      </h4>
                      <p className="font-sans text-[10px] text-slate-500 mt-0.5 leading-normal">
                        Select a pre-designed excursion brochure template, adjust contents live, and trigger automated secure email bulk deliveries under SMTP-TLS simulation.
                      </p>
                    </div>

                    {/* Template Whitelist Cards Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {NEWSLETTER_PRESETS.map((p, idx) => {
                        const isSelected = selectedPresetIdx === idx;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectPreset(idx)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#0a3120]/15 border-emerald-500/60 ring-1 ring-emerald-500/20'
                                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                            }`}
                          >
                            <span className={`block font-display font-bold text-xs tracking-tight ${isSelected ? 'text-white font-extrabold' : 'text-slate-300'}`}>
                              {p.title}
                            </span>
                            <span className="block font-mono text-[9px] text-[#cd853f] mt-1 uppercase font-bold">
                              Attachment Code: {p.voucher}
                            </span>
                            <span className="block text-[9px] text-slate-500 leading-normal font-sans line-clamp-2 mt-1">
                              {p.subject}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Editable Form Controls */}
                    <div className="space-y-3 font-sans text-xs">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold text-left">Campaign Subject Line:</label>
                        <input
                          type="text"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          disabled={isBulkSending}
                          className="w-full bg-slate-900 border border-slate-800 focus:outline-none focus:border-slate-700 focus:bg-slate-950 rounded-xl px-3 py-2 text-slate-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold text-left">Campaign Message Body:</label>
                        <textarea
                          rows={6}
                          value={customBody}
                          onChange={(e) => setCustomBody(e.target.value)}
                          disabled={isBulkSending}
                          className="w-full bg-slate-900 border border-slate-800 focus:outline-none focus:border-slate-700 focus:bg-slate-950 rounded-xl px-3 py-2 font-sans text-slate-300 custom-scrollbar text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Whitelisted Targets Alert */}
                    <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="text-slate-400 space-y-0.5 text-left">
                        <p>Recipients Whitelisted: <span className="font-bold text-white font-mono bg-slate-900 px-2 py-0.5 border border-slate-800 rounded">{selectedSubs.length > 0 ? selectedSubs.length : subscribers.length} Accounts</span></p>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {selectedSubs.length > 0 ? 'Only checked subscribers will receive this.' : 'All registered subscribers whitelists will receive this standard campaign list.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBulkSenderLaunch(customSubject, customBody)}
                        disabled={isBulkSending || subscribers.length === 0}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 text-slate-950 disabled:text-slate-500 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {isBulkSending ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Sending Campaign...</span>
                          </>
                        ) : (
                          <>
                            <span>Bulk Deliver Campaign 🚀</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simulated SMTP Logger Cabin */}
                    {(isBulkSending || bulkLogs.length > 0) && (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3 font-mono text-[10px] text-emerald-450 leading-normal text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                          <span className="font-bold uppercase tracking-widest text-[#cd853f] flex items-center gap-1.5 text-[9px]">
                            <span className="w-2 h-2 rounded-full bg-[#cd853f] animate-ping" />
                            <span>SMTP Dispatch Transceiver Terminal</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => { setBulkLogs([]); setBulkProgress(0); }}
                            disabled={isBulkSending}
                            className="text-[9px] text-[#cd853f] hover:text-white disabled:opacity-30 cursor-pointer font-bold font-mono bg-transparent border-none"
                          >
                            Close Terminal
                          </button>
                        </div>

                        {/* Animated progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>TRANSMISSION INTEGRITY METRICS:</span>
                            <span>{bulkProgress}%</span>
                          </div>
                          
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${bulkProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Log prints */}
                        <div className="max-h-36 overflow-y-auto custom-scrollbar space-y-1 pt-1 border-t border-emerald-500/5 select-text font-mono text-[9.5px]">
                          {bulkLogs.map((log, lIdx) => (
                            <p key={lIdx} className={log.includes("🟢") || log.includes("✔") ? "text-emerald-450" : log.includes("⌛") ? "text-amber-500/90" : "text-slate-500"}>
                              {log}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* Column B: Cookies GDPR footprints audits */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Cookies and Diagnostic logs Card */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <div>
                        <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>M.A.S Cookie Audits Ledger ({telemetryLogs.length})</span>
                        </h4>
                        <p className="font-sans text-[10px] text-slate-500 mt-0.5 leading-normal">
                          Trace GDPR compliance, user-agent details, timezone, and viewport metrics collected under guest choices.
                        </p>
                      </div>

                      {telemetryLogs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to purge telemetry footprints?")) {
                              setTelemetryLogs([]);
                              localStorage.removeItem('mas_collected_telemetry_logs');
                              addAuditLog('Cookies Consent Dashboard: Purged telemetry traces cache.', 'warning');
                            }
                          }}
                          className="text-[9px] text-[#cd853f] hover:text-rose-400 font-mono font-bold cursor-pointer transition-colors border border-slate-850 p-1 px-1.5 rounded bg-transparent"
                          title="Clears local cache ledger database"
                        >
                          Purge Logs
                        </button>
                      )}
                    </div>

                    {/* Log footprint stack */}
                    <div className="space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
                      {telemetryLogs.length === 0 ? (
                        <div className="p-10 text-center text-slate-600 font-display text-xs border border-dashed border-slate-900 rounded-xl bg-slate-950/20">
                          <p>Consent Audits database empty.</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-sans">Heartbeats triggers store anonymized diagnostic properties after guest decisions.</p>
                        </div>
                      ) : (
                        telemetryLogs.map((log) => {
                          const isAll = log.consentLevel === 'accepted_all';
                          return (
                            <div
                              key={log.id}
                              className="p-3.5 bg-[#0f0e0d] border border-slate-900 rounded-xl space-y-2.5 font-mono text-[9px] leading-relaxed relative overflow-hidden text-left"
                            >
                              {/* Background Gradient */}
                              <div className={`absolute top-0 right-0 w-20 h-20 opacity-[0.025] rounded-full blur-xl pointer-events-none ${isAll ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                              {/* Header metrics */}
                              <div className="flex justify-between items-start pb-1.5 border-b border-slate-900 font-sans">
                                <div className="space-y-0.5 text-left">
                                  <span className="font-mono text-[8px] bg-slate-900 border border-slate-850 text-slate-400 px-1.5 py-0.5 rounded">
                                    ID: {log.id}
                                  </span>
                                  <span className="block text-[8px] text-slate-500 font-mono mt-1">
                                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>

                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide border ${
                                  isAll
                                    ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-950/40 border-amber-500/20 text-amber-500'
                                }`}>
                                  {isAll ? '✔ Accepted All' : '⚠ Core Only'}
                                </span>
                              </div>

                              {/* Matrix characteristics */}
                              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-slate-400 font-mono">
                                <div className="space-y-0.5">
                                  <span className="block text-slate-500 text-[8px] uppercase">TimeZone & Area:</span>
                                  <span className="block text-slate-200 truncate" title={log.timezone}>{log.timezone} ({log.locale})</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="block text-slate-500 text-[8px] uppercase">Viewport Size:</span>
                                  <span className="block text-slate-200">{log.viewportSize} <span className="text-slate-500 text-[8px]">({log.screenSize})</span></span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="block text-slate-500 text-[8px] uppercase">Wishlist Stars:</span>
                                  <span className="block text-slate-200">{log.wishlistCount || 0} active tours</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="block text-slate-500 text-[8px] uppercase">Draft Booking request:</span>
                                  <span className="block text-slate-200">{log.bookingsDraftCount || 0} requests</span>
                                </div>

                                <div className="col-span-2 space-y-0.5 border-t border-slate-900/40 pt-1.5 text-left">
                                  <span className="block text-slate-500 text-[8px] uppercase">User-Agent footprint:</span>
                                  <p className="text-slate-300 leading-normal line-clamp-2 truncate select-all font-mono" title={log.userAgent}>
                                    {log.userAgent}
                                  </p>
                                </div>
                              </div>

                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Automated WhatsApp Reminder Dispatcher Assistant Modal Overlay */}
        {pendingReminderBooking && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs text-slate-100 uppercase tracking-wider">
                      WhatsApp Reminder Dispatcher Assistant
                    </h3>
                    <p className="font-sans text-[10px] text-slate-500">
                      Automated booking finalization messaging desk.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPendingReminderBooking(null)}
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-4 overflow-y-auto text-left flex-1 custom-scrollbar">
                {/* Guest Mini Card */}
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">Lead Passenger</span>
                    <span className="font-bold text-slate-200 block mt-0.5">{pendingReminderBooking.fullName}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">Contact WhatsApp</span>
                    <span className="font-mono text-emerald-400 block mt-0.5">{pendingReminderBooking.whatsappNumber}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">Tour Program</span>
                    <span className="font-semibold text-slate-350 block mt-0.5 truncate">{pendingReminderBooking.tourTitle}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">Travel target Date</span>
                    <span className="font-mono text-slate-400 block mt-0.5">{pendingReminderBooking.bookingDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">Pickup resort</span>
                    <span className="font-sans font-semibold text-amber-500 block mt-0.5">
                      {pendingReminderBooking.hotelName || "🏨 No Resort configured - Urgent Update Needed"}
                    </span>
                  </div>
                </div>

                {/* Preset Options selector */}
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold">
                    Step 1: Choose Automated Message Template
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {REMINDER_PRESETS.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectReminderPreset(preset.id, pendingReminderBooking)}
                          className={`p-2.5 text-left rounded-xl border text-[10.5px] font-medium leading-tight cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-500 text-amber-400' 
                              : 'bg-slate-950 border-slate-900 text-slate-450 hover:border-slate-850'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Customizer text area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-bold">
                      Step 2: Preview & Customize Template Text before sending
                    </label>
                    <span className="font-mono text-[8px] uppercase text-emerald-400 bg-emerald-550/10 px-1.5 py-0.2 rounded font-black tracking-widest">
                      Live Draft
                    </span>
                  </div>
                  <textarea
                    value={customMessageText}
                    onChange={(e) => setCustomMessageText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-amber-500 font-sans leading-relaxed custom-scrollbar"
                    placeholder="Enter custom text..."
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPendingReminderBooking(null)}
                  className="px-4 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close Assistant
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteWhatsAppReminder(pendingReminderBooking, customMessageText)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Send Template via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Console footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <span>CONSOLE LOG: NO UNRESOLVED SYMMETRY FAULTS</span>
          <span className="font-display tracking-widest text-slate-600 uppercase font-bold">MAS ADMIN PORTAL</span>
        </div>
      </div>
    </div>
  );
}
