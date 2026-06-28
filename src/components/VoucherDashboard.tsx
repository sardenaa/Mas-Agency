/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ticket, Trash2, ShieldAlert, MessageSquare, Coins, Printer, X, Activity, BarChart2, QrCode, FileDown, ListFilter, Share2, Calendar, CalendarDays, Clock, Compass, ChevronLeft, ChevronRight, Plus, Send, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { BookingRequest } from '../types';
import { WHATSAPP_NUMBER, Currency, CURRENCIES, getTourPrice, TOUR_PRICES, ALL_TOURS } from '../data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import VoucherQRCodeModal from './VoucherQRCodeModal';
import { exportVouchersToPDF } from '../utils/pdfGenerator';

interface VoucherDashboardProps {
  bookings: BookingRequest[];
  onRemoveBooking: (id: string) => void;
  selectedCurrency: string;
  onCurrencyChange: (code: string) => void;
  onAddBooking?: (newBooking: BookingRequest) => void;
}

export default function VoucherDashboard({ 
  bookings, 
  onRemoveBooking,
  selectedCurrency,
  onCurrencyChange,
  onAddBooking
}: VoucherDashboardProps) {
  const setSelectedCurrency = onCurrencyChange;
  const [customRate, setCustomRate] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [activePrintBooking, setActivePrintBooking] = useState<BookingRequest | null>(null);
  const [isPrintSummaryOpen, setIsPrintSummaryOpen] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [activeQRBooking, setActiveQRBooking] = useState<BookingRequest | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [viewTab, setViewTab] = useState<'list' | 'timeline' | 'calendar'>('list');

  // Calendar month navigation & detail capture states
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  
  // Quick booking form from calendar input states
  const [selectedTourId, setSelectedTourId] = useState<string>(ALL_TOURS[0]?.id || '');
  const [guestName, setGuestName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [adults, setAdults] = useState<number>(2);
  const [kids, setKids] = useState<number>(0);
  const [hotel, setHotel] = useState<string>('');
  const [requests, setRequests] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [localSuccessMsg, setLocalSuccessMsg] = useState<string>('');

  const formatDateToLocalISO = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0-6 (Sun-Sat)
    const totalDays = lastDay.getDate();
    
    // Previous month's padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        dateString: formatDateToLocalISO(new Date(year, month - 1, prevMonthLastDay - i))
      });
    }
    
    // Current month's days
    const currentMonthDays = [];
    for (let i = 1; i <= totalDays; i++) {
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        dateString: formatDateToLocalISO(new Date(year, month, i))
      });
    }
    
    // Next month's padding days (to complete the grid of 42 cells)
    const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = [];
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        day: i,
        isCurrentMonth: false,
        dateString: formatDateToLocalISO(new Date(year, month + 1, i))
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const handleDayClick = (dateStr: string) => {
    // Find latest booking if available to pre-populate details for speed!
    const latestBooking = bookings[bookings.length - 1];
    if (latestBooking) {
      setGuestName(latestBooking.fullName || '');
      setWhatsapp(latestBooking.whatsappNumber || '');
      setHotel(latestBooking.hotelName || '');
    } else {
      setGuestName('');
      setWhatsapp('');
      setHotel('');
    }
    setSelectedTourId(ALL_TOURS[0]?.id || '');
    setAdults(2);
    setKids(0);
    setRequests('');
    setFormError('');
    setLocalSuccessMsg('');
    setSelectedCalendarDate(dateStr);
  };

  // Helper to parse dates into stylized month/day/weekday components safely
  const getFormattedDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return { day: '?', month: '?', weekday: 'Day', year: '' };
      }
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        day: d.getDate(),
        month: months[d.getMonth()],
        weekday: days[d.getDay()],
        year: d.getFullYear()
      };
    } catch {
      return { day: '?', month: '?', weekday: 'Day', year: '' };
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (sortBy === 'date') {
      return a.bookingDate.localeCompare(b.bookingDate);
    } else if (sortBy === 'title') {
      return a.tourTitle.localeCompare(b.tourTitle);
    } else if (sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    return 0;
  });

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportVouchersToPDF(bookings, activeCurrencyInfo, activeRate);
    } catch (e) {
      console.error('Failed to export PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const activeCurrencyInfo = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const activeRate = isCustomMode ? (parseFloat(customRate) || activeCurrencyInfo.rate) : activeCurrencyInfo.rate;

  const formatPrice = (valueUSD: number, currency: Currency) => {
    const converted = valueUSD * activeRate;
    const isEGP = currency.code === 'EGP';
    const valStr = converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return isEGP ? `${valStr} EGP` : `${currency.symbol}${valStr}`;
  };

  const totalUSD = bookings.reduce((sum, booking) => {
    return sum + getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
  }, 0);

  const handleReInquire = (booking: BookingRequest) => {
    const individualUSDPrice = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
    const convertedPriceStr = formatPrice(individualUSDPrice, activeCurrencyInfo);
    
    const text = `Hi MAS Agency Travel! 🌴✨ I am reminding you about my drafted reservation voucher:

Voucher ID: *${booking.id}*
Selected Adventure: *${booking.tourTitle}*
Travel Date: *${booking.bookingDate}*
Lead Guest: *${booking.fullName}*
Quantity: *${booking.adultsCount} Adults* ${booking.childrenCount > 0 ? `and *${booking.childrenCount} Kids*` : ''}
Estimated Value: *${convertedPriceStr}*
${booking.hotelName ? `Staying at: *${booking.hotelName}*\n` : ''}
Please verify availability and advise on payment options. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  const handleWhatsAppShare = (booking: BookingRequest) => {
    const individualUSDPrice = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
    const convertedPriceStr = formatPrice(individualUSDPrice, activeCurrencyInfo);
    
    const text = `🇪🇬 *MAS EGYPT TRAVEL AGENCY Voucher Stub* 🇪🇬
--------------------------------------------
*🎫 Voucher ID:* ${booking.id}
*🏝️ Adventure:* ${booking.tourTitle}
*📅 Travel Date:* ${booking.bookingDate}
*👤 Lead Passenger:* ${booking.fullName}
*👥 Group Size:* ${booking.adultsCount} Adults ${booking.childrenCount > 0 ? `+ ${booking.childrenCount} Children` : ''}
*🏨 Hotel / Resort:* ${booking.hotelName || 'Not Provided'}
*💰 Estimated Value:* ${convertedPriceStr}
*⚙️ Status:* ${booking.status?.toUpperCase() || 'DRAFT PENDING'}
--------------------------------------------
${booking.specialRequests ? `*📝 Special Requests:* "${booking.specialRequests}"\n` : ''}${booking.adminNotes ? `*💬 Agent Annotation:* "${booking.adminNotes}"\n` : ''}
Please coordinate our final hotel pickup itinerary. Thank you! 🌴🌊`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-slate-900 bg-slate-950/40 text-slate-500">
        <Ticket className="w-8 h-8 mx-auto mb-2 text-slate-700" />
        <h4 className="font-display font-bold text-sm text-slate-400">No Draft Vouchers Active</h4>
        <p className="font-sans text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You haven’t drafted any booking vouchers yet. Select program itinerary options above and click &ldquo;Quick Book&rdquo; to lock your drafts.
        </p>
      </div>
    );
  }

  // Pre-process recharts data from bookings
  const chartData = Object.entries(
    bookings.reduce<Record<string, number>>((acc, booking) => {
      const rawPrice = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
      const converted = rawPrice * activeRate;
      acc[booking.tourTitle] = (acc[booking.tourTitle] || 0) + converted;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const CHART_COLORS = [
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#0ea5e9', // sky-500
    '#a855f7', // purple-500
    '#ec4899', // rose-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
    '#f43f5e', // rose-600
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl font-sans text-left">
          <p className="text-[11px] font-bold text-slate-200 leading-snug">{data.name}</p>
          <p className="text-xs font-mono font-black text-emerald-400 mt-1">
            {formatPrice(data.value / activeRate, activeCurrencyInfo)}
          </p>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            {totalUSD > 0 ? ((data.value / (totalUSD * activeRate)) * 100).toFixed(1) : '0'}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 text-left">
      {/* 🪙 Currency Converter & Visual Cost Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Cost Estimator */}
        <div className="lg:col-span-7 p-5 md:p-6 rounded-2xl border border-slate-850 bg-slate-900/10 backdrop-blur-xs shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Coins className="w-4 h-4" />
                  </span>
                  <h4 className="font-display font-extrabold text-sm text-slate-200 uppercase tracking-wider">
                    Cost Estimator & Currency Converter
                  </h4>
                </div>
                <p className="font-sans text-[11px] text-slate-400 mt-1 max-w-md">
                  Calculate the approx. total of your active draft vouchers using standard rates or your custom exchange multiplier.
                </p>
              </div>
              
              {/* Quick Stats Summary */}
              <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`px-4 py-2 border text-[10.5px] font-display font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer h-10 shadow-sm active:scale-95 ${
                    isExporting
                      ? 'bg-slate-900 border-slate-850 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-50 border-emerald-400 hover:border-emerald-300 shadow-md shadow-emerald-500/10 font-bold'
                  }`}
                  title="Download a beautifully styled consolidated PDF Itinerary and individual barcode QR tickets for pickup"
                >
                  <FileDown className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{isExporting ? 'Generating PDF...' : 'Download PDF Passes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintSummaryOpen(true)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 text-[10.5px] font-display font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer h-10 shadow-sm active:scale-95"
                  title="Generate combined, single-page summary for all travel vouchers"
                >
                  <Printer className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>Print Summary</span>
                </button>
                <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-left sm:text-right min-w-[120px] h-10 flex flex-col justify-center">
                  <p className="font-mono text-[8px] uppercase tracking-wider text-slate-500">vouchers total</p>
                  <p className="font-display font-black text-emerald-400 text-sm mt-0.5">
                    {formatPrice(totalUSD, activeCurrencyInfo)}
                  </p>
                </div>
              </div>
            </div>

            {/* Converter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-900">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Target Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => {
                    setSelectedCurrency(e.target.value);
                    const info = CURRENCIES.find(c => c.code === e.target.value);
                    if (info) {
                      setCustomRate(info.rate.toString());
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-sans text-slate-300 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Exchange Rate Type
                </label>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className={`flex-1 py-1 text-[9px] font-mono font-bold rounded uppercase transition-all cursor-pointer ${
                      !isCustomMode 
                        ? 'bg-emerald-500 text-slate-50 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMode(true);
                      if (!customRate) {
                        setCustomRate(activeCurrencyInfo.rate.toString());
                      }
                    }}
                    className={`flex-1 py-1 text-[9px] font-mono font-bold rounded uppercase transition-all cursor-pointer ${
                      isCustomMode 
                        ? 'bg-emerald-500 text-slate-50 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Rate Counter (1 USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={isCustomMode ? customRate : activeCurrencyInfo.rate}
                    onChange={(e) => {
                      if (isCustomMode) {
                        setCustomRate(e.target.value);
                      }
                    }}
                    disabled={!isCustomMode}
                    className={`w-full pl-3 pr-12 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 transition-all ${
                      !isCustomMode ? 'opacity-50 cursor-not-allowed select-none' : ''
                    }`}
                    placeholder="Rate factor"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-500 font-bold">
                    {selectedCurrency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Reference list for other major markets */}
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60 text-[9px] font-mono text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-4">
            <span className="text-[10px] font-sans font-semibold text-amber-500/80 mr-1">⚖️ Reference Matrix (USD Base):</span>
            {CURRENCIES.filter(c => c.code !== 'USD').map(c => (
              <span key={c.code} className="bg-slate-950/80 border border-slate-900 px-2 py-0.5 rounded text-slate-400">
                1 USD = {c.rate} {c.code}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Cost Breakdown Chart */}
        <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl border border-slate-850 bg-slate-900/10 backdrop-blur-xs shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-display font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Trip Budget breakdown</span>
              </h4>
              <p className="font-sans text-[11px] text-slate-450 leading-relaxed font-semibold">
                Distribution ratio of total trip costs across activities.
              </p>
            </div>

            {/* View style switches */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setChartType('pie')}
                className={`px-2 py-0.5 text-[9px] font-mono font-black rounded uppercase transition-colors cursor-pointer ${
                  chartType === 'pie'
                    ? 'bg-emerald-500 text-slate-50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Pie
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-2 py-0.5 text-[9px] font-mono font-black rounded uppercase transition-colors cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-emerald-500 text-slate-50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          <div className="w-full h-[180px] relative flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#0f172a" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 8 }}
                    tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 8)}...` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* Inner dynamic metrics total overlay for Pie */}
            {chartType === 'pie' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 leading-none">total</span>
                <span className="font-display font-black text-slate-100 text-sm mt-1 leading-none">
                  {activeCurrencyInfo.code === 'EGP'
                    ? `${Math.round(totalUSD * activeRate).toLocaleString()}`
                    : `${activeCurrencyInfo.symbol}${Math.round(totalUSD * activeRate).toLocaleString()}`}
                </span>
                <span className="text-[8px] font-mono text-emerald-400 font-black mt-1 uppercase leading-none">{activeCurrencyInfo.code}</span>
              </div>
            )}
          </div>

          {/* Color representation grids */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-4 border-t border-slate-900">
            {chartData.map((item, index) => {
              const percentage = totalUSD > 0 ? ((item.value / (totalUSD * activeRate)) * 100).toFixed(1) : '0';
              const color = CHART_COLORS[index % CHART_COLORS.length];
              return (
                <div key={item.name} className="flex items-start gap-2 text-[10px] min-w-0">
                  <span className="w-2 h-2 rounded-full mt-1 shrink-0 bg-slate-400" style={{ backgroundColor: color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-300 font-semibold truncate leading-none" title={item.name}>{item.name}</p>
                    <p className="text-[8.5px] font-mono text-slate-500 mt-0.5 leading-none font-bold">
                      {percentage}% • {formatPrice(item.value / activeRate, activeCurrencyInfo)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticket list sorting/switcher actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-850 bg-slate-900/10 backdrop-blur-xs mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
            <button
              type="button"
              onClick={() => setViewTab('list')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === 'list'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Stubs List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab('timeline')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === 'timeline'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Chronological Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab('calendar')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === 'calendar'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Planning Calendar</span>
            </button>
          </div>

          <span className="text-[10px] font-sans font-semibold text-slate-450 bg-slate-950/60 border border-slate-900 px-2.5 py-1.5 rounded-lg select-none">
            Active: <span className="text-emerald-400 font-mono font-bold">{bookings.length}</span> excursions
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {viewTab === 'list' && (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
              <ListFilter className="w-3.5 h-3.5 text-slate-450" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-sans font-semibold focus:outline-none cursor-pointer border-none p-0 pr-6"
              >
                <option value="date" className="bg-slate-950 text-slate-200">Date (Earliest First)</option>
                <option value="title" className="bg-slate-950 text-slate-200">Tour Title (A-Z)</option>
                <option value="status" className="bg-slate-950 text-slate-200">Booking Status</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsPrintSummaryOpen(true)}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-400 hover:border-emerald-300 text-[10.5px] font-display font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95 font-bold"
            title="Export all current booking stubs into a single summarized PDF-ready view using the print-friendly style"
          >
            <Printer className="w-3.5 h-3.5 text-slate-950" />
            <span>Export Summarized PDF</span>
          </button>
        </div>
      </div>

      {viewTab === 'list' && (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const individualUSD = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
            return (
              <div 
                key={booking.id} 
                className="relative bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row hover:border-emerald-500/20 transition-all duration-300"
              >
                {/* Sliced Ticket style dividers */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-slate-950 border-r border-slate-850 hidden md:block" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-slate-950 border-l border-slate-850 hidden md:block" />

                {/* Left panel (Ticket body) */}
                <div className="flex-1 p-5 md:p-6 text-left border-b md:border-b-0 md:border-r border-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    {booking.status === 'confirmed' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-550/30 font-mono text-[10px] uppercase font-bold tracking-wider rounded-full animate-pulse">
                        ✅ {booking.status} voucher
                      </span>
                    ) : booking.status === 'denied' ? (
                      <span className="px-2.5 py-0.5 bg-rose-950 text-rose-450 border border-rose-500/20 font-mono text-[10px] uppercase font-bold tracking-wider rounded-full">
                        ❌ Rejected Voucher
                      </span>
                    ) : booking.status === 'flagged' ? (
                      <span className="px-2.5 py-0.5 bg-amber-950 text-amber-500 border border-amber-550/20 font-mono text-[10px] uppercase font-bold tracking-wider rounded-full">
                        ⚠️ Action Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-950/40 text-amber-400 border border-amber-505/30 font-mono text-[10px] uppercase font-black tracking-wider rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                        ⏳ Pending Verification
                      </span>
                    )}
                    <span className="font-mono text-xs text-slate-500 font-semibold uppercase">
                      ID: {booking.id}
                    </span>
                  </div>

                  <h4 className="font-display font-extrabold text-base md:text-lg text-slate-200">
                    {booking.tourTitle}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 mt-4 text-xs font-sans text-slate-400">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-550">Scheduled Date</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{booking.bookingDate}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550">Lead Passenger</span>
                      <p className="font-semibold text-slate-200 mt-0.5 truncate">{booking.fullName}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550">Distribution</span>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {booking.adultsCount} Ad • {booking.childrenCount} Ch
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-550/90 font-bold">Estimated Cost</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5 font-mono">
                        <span className="font-extrabold text-emerald-400">
                          {formatPrice(individualUSD, activeCurrencyInfo)}
                        </span>
                        {booking.adultsCount + booking.childrenCount >= 5 && (
                          <span className="text-[10px] text-slate-500 line-through">
                            {formatPrice((booking.adultsCount * (TOUR_PRICES[booking.tourId.trim()] || { adult: 40, child: 20 }).adult) + (booking.childrenCount * (TOUR_PRICES[booking.tourId.trim()] || { adult: 40, child: 20 }).child), activeCurrencyInfo)}
                          </span>
                        )}
                      </div>
                      {booking.adultsCount + booking.childrenCount >= 5 && (
                        <span className="text-[8.5px] text-emerald-500 font-semibold bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-500/10 block mt-1 w-max col-span-2">
                          10% Group Discount Applied
                        </span>
                      )}
                    </div>

                    {booking.hotelName && (
                      <div className="col-span-2 sm:col-span-4">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-slate-550">Resort details</p>
                        <p className="font-semibold text-slate-200 mt-0.5">{booking.hotelName}</p>
                      </div>
                    )}
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-4">
                      <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-550 mb-1">My special requests</p>
                      <p className="p-2.5 rounded-lg bg-slate-900 border border-slate-900/40 text-[11px] text-slate-300 font-sans italic">
                        &ldquo;{booking.specialRequests}&rdquo;
                      </p>
                    </div>
                  )}

                  {booking.adminNotes && (
                    <div className="mt-3">
                      <p className="font-mono text-[8.5px] uppercase tracking-wider text-emerald-400 font-bold mb-1">🚨 MESSAGE FROM MAS DESK AGENTS</p>
                      <p className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/10 text-[11px] text-emerald-400 font-sans font-medium">
                        📱 {booking.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right panel (Ticket stub) */}
                <div className="p-5 md:p-6 bg-slate-900/40 md:w-56 shrink-0 flex flex-col justify-between gap-4 text-left">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Immediate Step</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Draft bookings require manual approval by our agent over WhatsApp. Click the button below to submit this ticket stub.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleWhatsAppShare(booking)}
                      className="w-full py-2 bg-emerald-650 hover:bg-emerald-600 text-slate-50 text-[11px] font-display font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title="Share complete booking details formatted text via WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share via WhatsApp</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onRemoveBooking(booking.id)}
                        className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-550 hover:text-red-400 hover:border-red-950/20 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                        title="Discard draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => setActivePrintBooking(booking)}
                        className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-550/30 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                        title="Print digital voucher"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => setActiveQRBooking(booking)}
                        className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                        title="View QR Code Entry Pass"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleReInquire(booking)}
                      className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-50 text-[11px] font-display font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-slate-50 text-slate-50" />
                      <span>Submit Stub</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewTab === 'timeline' && (
        <div className="relative pl-3 sm:pl-8 space-y-8 mt-6">
          {/* Vertical dashed line connecting points */}
          <div className="absolute left-[26px] sm:left-14 top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-dashed border-slate-850" />

          {[...bookings].sort((a, b) => a.bookingDate.localeCompare(b.bookingDate)).map((booking, idx) => {
            const dateParts = getFormattedDateParts(booking.bookingDate);
            const individualUSD = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
            const isConfirmed = booking.status === 'confirmed';
            const isDenied = booking.status === 'denied';
            const isFlagged = booking.status === 'flagged';

            return (
              <div key={booking.id} className="relative flex flex-col md:flex-row items-stretch gap-6 group">
                
                {/* Node marker with date component breakdown */}
                <div className="flex md:flex-col items-center justify-start shrink-0 z-10 select-none">
                  <div className={`w-[36px] h-14 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transition-all border font-mono ${
                    isConfirmed 
                      ? 'bg-emerald-950/40 border-emerald-500/30 ring-2 ring-emerald-500/10' 
                      : isFlagged 
                      ? 'bg-amber-950/40 border-amber-500/30' 
                      : 'bg-slate-900 border-slate-800'
                  }`}>
                    <span className={`text-[8px] sm:text-[9px] uppercase font-bold tracking-widest ${isConfirmed ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {dateParts.month}
                    </span>
                    <span className="text-sm sm:text-lg font-black text-white leading-none">
                      {dateParts.day}
                    </span>
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 mt-0.5 font-bold">
                      {dateParts.weekday}
                    </span>
                  </div>

                  <span className="hidden md:inline-block font-mono text-[9px] text-slate-650 font-bold mt-2.5 uppercase tracking-wider">
                    Stop {idx + 1}
                  </span>
                </div>

                {/* Timeline content voucher stub */}
                <div className="flex-1 bg-slate-950 border border-slate-850 hover:border-emerald-500/20 rounded-2xl overflow-hidden shadow-md flex flex-col sm:flex-row transition-all duration-300 md:-mt-1">
                  
                  {/* Left voucher ticket body */}
                  <div className="flex-1 p-5 md:p-6 text-left border-b sm:border-b-0 sm:border-r border-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {isConfirmed ? (
                          <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-555/30 font-mono text-[9px] uppercase font-bold tracking-wider rounded">
                            ✅ Confirmed Voucher
                          </span>
                        ) : isDenied ? (
                          <span className="px-2.5 py-0.5 bg-rose-950 text-rose-455 border border-rose-500/20 font-mono text-[9px] uppercase font-bold tracking-wider rounded">
                            ❌ Rejected Voucher
                          </span>
                        ) : isFlagged ? (
                          <span className="px-2.5 py-0.5 bg-amber-950 text-amber-500 border border-amber-550/20 font-mono text-[9px] uppercase font-bold tracking-wider rounded">
                            ⚠️ Action Required
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-950/40 text-amber-400 border border-amber-505/30 font-mono text-[9px] uppercase font-black tracking-wider rounded animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                            ⏳ Pending Verification
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
                        ID: {booking.id}
                      </span>
                    </div>

                    <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-200 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{booking.tourTitle}</span>
                    </h4>

                    {/* Meta components table */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 mt-4 text-xs font-sans text-slate-400">
                      <div>
                        <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-550">Travel Date</p>
                        <div className="flex items-center gap-1 mt-0.5 text-slate-300 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                          <span>{booking.bookingDate}</span>
                        </div>
                      </div>

                      <div>
                        <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-550">Lead Passenger</p>
                        <p className="font-semibold text-slate-300 mt-0.5 truncate">{booking.fullName}</p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-555">Distribution</p>
                        <p className="font-semibold text-slate-300 mt-0.5 font-bold">
                          {booking.adultsCount} Ad • {booking.childrenCount} Ch
                        </p>
                      </div>
                    </div>

                    {booking.hotelName && (
                      <div className="mt-3">
                        <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-550">Resort & pickup details</p>
                        <p className="text-xs text-slate-300 font-semibold mt-0.5">{booking.hotelName}</p>
                      </div>
                    )}

                    {booking.specialRequests && (
                      <div className="mt-3">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-slate-550 mb-1">My special requests</p>
                        <p className="p-2.5 rounded-lg bg-slate-900 border border-slate-900/40 text-[10px] text-slate-300 font-sans italic">
                          &ldquo;{booking.specialRequests}&rdquo;
                        </p>
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="mt-3">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 font-bold mb-1">🚨 MESSAGE FROM MAS AGENTS</p>
                        <p className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/10 text-[10px] text-emerald-400 font-sans font-medium">
                          📱 {booking.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions right panel */}
                  <div className="p-5 md:p-6 bg-slate-900/40 sm:w-48 shrink-0 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <p className="font-mono text-[8.5px] uppercase tracking-wider text-slate-555">Estimated Cost</p>
                      <p className="font-mono text-xs sm:text-sm font-extrabold text-emerald-400 mt-0.5">
                        {formatPrice(individualUSD, activeCurrencyInfo)}
                      </p>
                      {booking.adultsCount + booking.childrenCount >= 5 && (
                        <span className="text-[8px] text-emerald-500 font-semibold bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-500/10 block mt-1 w-max font-sans">
                          10% Group Saver Active
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppShare(booking)}
                        className="w-full py-1.5 bg-emerald-650 hover:bg-emerald-600 text-slate-50 text-[11px] font-display font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => onRemoveBooking(booking.id)}
                          className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-555 hover:text-red-400 hover:border-red-950/20 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                          title="Discard draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          type="button"
                          onClick={() => setActivePrintBooking(booking)}
                          className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-450 hover:text-emerald-400 hover:border-emerald-550/30 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                          title="Print digital voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          type="button"
                          onClick={() => setActiveQRBooking(booking)}
                          className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-450 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer active:scale-95 flex-1 flex items-center justify-center"
                          title="View QR Code Entry Pass"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReInquire(booking)}
                        className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-50 text-[11px] font-display font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-slate-50 text-slate-50" />
                        <span>Submit stubs</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewTab === 'calendar' && (
        <div className="space-y-6 mt-6">
          {/* Calendar visual wrapper */}
          <div className="p-4 sm:p-6 bg-slate-950 border border-slate-850 rounded-3xl shadow-xl">
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <span>Interactive Planning Calendar</span>
                  </h3>
                  <p className="font-sans text-[10px] text-slate-500">
                    Click any date to quickly draft an excursion voucher stub
                  </p>
                </div>
              </div>

              {/* Month Switcher Controls */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-[10.5px] font-black uppercase tracking-wider text-slate-250 px-2 min-w-[125px] text-center select-none">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sunday-Saturday header columns */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="font-mono text-[8px] sm:text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold pb-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
              {(() => {
                const days = getDaysInMonth(currentMonth);
                const bookingsByDate: Record<string, BookingRequest[]> = {};
                bookings.forEach(b => {
                  if (b.bookingDate) {
                    if (!bookingsByDate[b.bookingDate]) {
                      bookingsByDate[b.bookingDate] = [];
                    }
                    bookingsByDate[b.bookingDate].push(b);
                  }
                });

                const todayISO = formatDateToLocalISO(new Date());

                return days.map((dayObj, index) => {
                  const dayBookings = bookingsByDate[dayObj.dateString] || [];
                  const isToday = dayObj.dateString === todayISO;

                  return (
                    <div
                      key={`${dayObj.dateString}-${index}`}
                      onClick={() => handleDayClick(dayObj.dateString)}
                      className={`min-h-[70px] sm:min-h-[110px] p-1.5 sm:p-2.5 rounded-2xl text-left border flex flex-col justify-between transition-all cursor-pointer relative group ${
                        dayObj.isCurrentMonth
                          ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-850 hover:border-emerald-500/35'
                          : 'bg-slate-950/20 text-slate-750 border-slate-950/40 opacity-40 hover:opacity-75 hover:border-slate-800'
                      } ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-950/5 border-emerald-500/40' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[10.5px] sm:text-xs font-black ${
                          isToday 
                            ? 'text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md' 
                            : dayObj.isCurrentMonth 
                            ? 'text-slate-350' 
                            : 'text-slate-650'
                        }`}>
                          {dayObj.day}
                        </span>
                        
                        {/* Dot indicator for mobile screens */}
                        {dayBookings.length > 0 && (
                          <div className="flex gap-0.5 sm:hidden">
                            {dayBookings.slice(0, 3).map((b) => (
                              <span
                                key={b.id}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-400'
                                    : b.status === 'denied'
                                    ? 'bg-rose-555'
                                    : b.status === 'flagged'
                                    ? 'bg-amber-500'
                                    : 'bg-amber-450'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Excursion pills list for desk targets */}
                      <div className="hidden sm:flex flex-col gap-1.5 mt-2 overflow-hidden flex-1 justify-end">
                        {dayBookings.slice(0, 2).map((b) => (
                          <div
                            key={b.id}
                            className={`px-1.5 py-1 rounded-lg text-[8px] sm:text-[9.2px] leading-tight font-medium border truncate flex items-center gap-1 transition-all ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25'
                                : b.status === 'denied'
                                ? 'bg-rose-950/40 text-rose-455 border-rose-500/20'
                                : b.status === 'flagged'
                                ? 'bg-amber-955/45 text-amber-500 border-amber-550/25 animate-pulse'
                                : 'bg-slate-900 text-slate-350 border-slate-805'
                            }`}
                            title={`${b.fullName}: ${b.tourTitle}`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${
                              b.status === 'confirmed' ? 'bg-emerald-400' : b.status === 'flagged' ? 'bg-amber-505' : 'bg-amber-400'
                            }`} />
                            <span className="truncate">{b.tourTitle}</span>
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <span className="text-[8.5px] font-mono font-bold text-slate-500 pl-1">
                            +{dayBookings.length - 2} more...
                          </span>
                        )}
                      </div>

                      {/* Quick click floating visual layout */}
                      <div className="absolute right-2 bottom-2 w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 items-center justify-center hidden group-hover:flex transition-all scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 shadow-md">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Prompt banner detailing quick setup usage */}
          <div className="p-4 bg-slate-900 border border-slate-850 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-450 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left text-xs text-slate-400 leading-relaxed">
                <h4 className="font-display font-black text-slate-200 uppercase tracking-widest text-[10px]">Excursion Planner Guide</h4>
                <p className="mt-0.5">Have specific travel dates in Hurghada or Red Sea packages? Click on any date above to open our single-click voucher draft generator. Commit your stub, coordinate via WhatsApp, and start packing!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📅 Quick Excursion Provisioner Modal from Planning Calendar */}
      {selectedCalendarDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450 shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xs sm:text-sm text-slate-100 uppercase tracking-wider">
                    Quick Excursion Provisioner
                  </h3>
                  <p className="font-sans text-[10.5px] text-slate-500 font-bold">
                    Target Date: <span className="font-mono text-amber-450 font-black">{selectedCalendarDate}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalendarDate(null)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!guestName || !whatsapp) {
                  setFormError('Lead passenger name and valid WhatsApp contact coordinates are required.');
                  return;
                }
                const selectedTour = ALL_TOURS.find(t => t.id === selectedTourId) || ALL_TOURS[0];
                const draftBooking: BookingRequest = {
                  id: `MAS-B-${Math.floor(1000 + Math.random() * 9000).toString()}`,
                  tourId: selectedTour.id,
                  tourTitle: selectedTour.title,
                  bookingDate: selectedCalendarDate,
                  fullName: guestName,
                  whatsappNumber: whatsapp,
                  adultsCount: adults,
                  childrenCount: kids,
                  specialRequests: requests,
                  hotelName: hotel,
                  createdAt: new Date().toISOString(),
                  status: 'pending',
                  statusHistory: [
                    {
                      status: 'pending',
                      timestamp: new Date().toISOString(),
                      updatedBy: 'client',
                      note: 'Voucher drafted from interactive calendar widget.'
                    }
                  ]
                };

                if (onAddBooking) {
                  onAddBooking(draftBooking);
                }
                
                // Clear state & exit
                setSelectedCalendarDate(null);
              }}
              className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-left"
            >
              {formError && (
                <div className="p-3 bg-rose-955/30 border border-rose-500/20 rounded-xl text-rose-450 text-[11px] font-medium leading-relaxed">
                  ⚠️ {formError}
                </div>
              )}

              {/* 1. Excursion Selective Dropdown */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-bold">
                  Select Adventure Excursion
                </label>
                <select
                  value={selectedTourId}
                  onChange={(e) => setSelectedTourId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-150 focus:outline-none focus:border-emerald-500 font-sans font-semibold cursor-pointer"
                >
                  {ALL_TOURS.map(t => (
                    <option key={t.id} value={t.id} className="bg-slate-955 text-slate-200">
                      {t.title} ({t.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing breakdown card for selected adventure */}
              {(() => {
                const tourSelected = ALL_TOURS.find(t => t.id === selectedTourId) || ALL_TOURS[0];
                const cleanId = tourSelected?.id.trim() || '';
                const rates = TOUR_PRICES[cleanId] || { adult: 45, child: 25 };
                const adultsTotal = adults * rates.adult;
                const kidsTotal = kids * rates.child;
                const subtotal = adultsTotal + kidsTotal;
                const isEGP = activeCurrencyInfo.code === 'EGP';
                
                const rateConverted = (valUSD: number) => {
                  const conv = valUSD * activeRate;
                  return isEGP 
                    ? `${Math.round(conv).toLocaleString()} EGP` 
                    : `${activeCurrencyInfo.symbol}${Math.round(conv).toLocaleString()}`;
                };

                return (
                  <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-500 font-black">Adult price</span>
                      <span className="font-bold text-slate-200 text-xs block mt-0.5">{rateConverted(rates.adult)}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-500 font-black">Children price</span>
                      <span className="font-bold text-slate-200 text-xs block mt-0.5">{rateConverted(rates.child)}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-500 font-black font-extrabold text-emerald-450">Group subtotal</span>
                      <span className="font-extrabold text-emerald-400 text-xs block mt-0.5">{rateConverted(subtotal)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Personal Identity and Phone Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold">
                    Lead passenger name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Liam Sterling"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-bold">
                    WhatsApp Coordinate *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +201022124589"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              {/* 3. Group sizes counts */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-550 font-extrabold">
                    Adults quantity
                  </label>
                  <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 border border-slate-850/40 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-mono"
                    >
                      -
                    </button>
                    <span className="flex-1 font-mono text-xs font-black text-slate-300 flex items-center justify-center select-none">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 border border-slate-850/40 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-mono"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-550 font-extrabold">
                    Children quantity
                  </label>
                  <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setKids(prev => Math.max(0, prev - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 border border-slate-850/40 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-mono"
                    >
                      -
                    </button>
                    <span className="flex-1 font-mono text-xs font-black text-slate-300 flex items-center justify-center select-none">
                      {kids}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKids(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 border border-slate-850/40 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-mono"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Resort location details */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-bold">
                  Resort / Hotel pickup location
                </label>
                <input
                  type="text"
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  placeholder="e.g. desert rose resort lobby"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* 5. Special Requests / Requirements */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-bold">
                  Special requests & group remarks
                </label>
                <textarea
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  rows={2}
                  placeholder="Need vegetarian food option, infant seat, wheel-chair access, or dive master..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-emerald-500 font-sans font-medium"
                />
              </div>

              {/* Action operations controls */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDate(null)}
                  className="flex-1 py-3 text-center bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Dismiss / Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 shadow-lg shadow-emerald-500/10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Secure Voucher Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔮 Interactive On-Screen Print Preview Modal */}
      {activePrintBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs no-print">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">
                  Voucher Print Preview
                </h3>
              </div>
              <button
                onClick={() => setActivePrintBooking(null)}
                className="p-1 rounded-lg text-slate-450 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Box */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-950/40 custom-scrollbar flex-1 flex flex-col items-center">
              <p className="text-xs text-slate-400 mb-4 max-w-md text-center leading-relaxed font-sans">
                Review your digital travel ticket below. Click the print button to trigger your system&rsquo;s print dialog. The document is configured for compact, high-contrast black &amp; white layouts.
              </p>

              {/* The White Ticket (Visible in Modal) */}
              <div className="w-full bg-[#ffffff] text-stone-900 p-6 rounded-xl shadow-lg border-2 border-stone-200 text-left space-y-5 select-none relative overflow-hidden">
                <div className="flex justify-between items-start border-b-2 border-stone-100 pb-4">
                  <div>
                    <h4 className="font-display font-black text-xs uppercase tracking-tight text-stone-900 leading-none">
                      MAS TRAVEL AGENCY HURGHADA
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-amber-600 mt-1 uppercase">
                      OFFICIAL DIRECT BOOKING VOUCHER
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-stone-100 border border-stone-200 px-2 py-0.5 text-[9px] font-mono font-bold rounded text-stone-800">
                      ID: {activePrintBooking.id}
                    </span>
                    <p className="text-[9px] text-stone-400 font-mono mt-1">DRAFT RESERVATION</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">ADVENTURE SPECIALTY</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">{activePrintBooking.tourTitle}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">TRAVEL DATE</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">{activePrintBooking.bookingDate}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">LEAD PASSENGER</span>
                    <span className="font-bold text-stone-800 mt-0.5 block mb-0.5 truncate max-w-[120px]">{activePrintBooking.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">DISTRIBUTION</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">
                      {activePrintBooking.adultsCount} Ad • {activePrintBooking.childrenCount} Ch
                    </span>
                  </div>

                  {activePrintBooking.hotelName && (
                    <div className="col-span-2 border-t border-stone-100 pt-3">
                      <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">RESORT & PICKUP DETAILS</span>
                      <span className="font-semibold text-stone-800 mt-0.5 block truncate">{activePrintBooking.hotelName}</span>
                    </div>
                  )}
                </div>

                {/* Estimate fee strip */}
                <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold">ESTIMATED TOUR FEE</span>
                    {activePrintBooking.adultsCount + activePrintBooking.childrenCount >= 5 ? (
                      <span className="text-[9px] text-amber-600 font-semibold block mt-0.5">Includes 10% Group Saver Discount!</span>
                    ) : (
                      <span className="text-[9px] text-stone-400 block mt-0.5">Calculated in {activeCurrencyInfo.code} code</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-stone-900 text-xs block">
                      {formatPrice(getTourPrice(activePrintBooking.tourId, activePrintBooking.adultsCount, activePrintBooking.childrenCount), activeCurrencyInfo)}
                    </span>
                    {activePrintBooking.adultsCount + activePrintBooking.childrenCount >= 5 && (
                      <span className="text-[8.5px] text-stone-400 line-through font-mono">
                        {formatPrice((activePrintBooking.adultsCount * (TOUR_PRICES[activePrintBooking.tourId.trim()] || { adult: 40, child: 20 }).adult) + (activePrintBooking.childrenCount * (TOUR_PRICES[activePrintBooking.tourId.trim()] || { adult: 40, child: 20 }).child), activeCurrencyInfo)}
                      </span>
                    )}
                  </div>
                </div>

                {activePrintBooking.specialRequests && (
                  <div className="border-t border-stone-100 pt-3">
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Passanger Notes</span>
                    <p className="text-[10px] text-stone-600 italic bg-stone-55 p-2 border border-stone-100 rounded leading-relaxed">
                      &ldquo;{activePrintBooking.specialRequests}&rdquo;
                    </p>
                  </div>
                )}

                {/* Simulated barcode */}
                <div className="border-t border-stone-100 pt-4 flex flex-col items-center">
                  <div className="font-mono text-[14px] text-stone-600 tracking-[3px] select-none text-center">
                    ||| | | |||| ||| | || |||| | | ||| ||
                  </div>
                  <span className="text-[8px] tracking-widest text-stone-400 uppercase font-bold mt-1.5">
                    PRESENT UPON PICKUP
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-3">
              <button
                onClick={() => setActivePrintBooking(null)}
                className="px-4 py-2 text-[10px] font-mono font-bold uppercase rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-display font-black uppercase text-slate-50 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Trigger System Print</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 Interactive Consolidated On-Screen Print Preview Modal */}
      {isPrintSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs no-print">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-black text-xs text-slate-200 uppercase tracking-wider">
                  Consolidated Travel Summary Preview
                </h3>
              </div>
              <button
                onClick={() => setIsPrintSummaryOpen(false)}
                className="p-1 rounded-lg text-slate-450 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Box */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-950/40 custom-scrollbar flex-1 flex flex-col items-center">
              <p className="text-xs text-slate-400 mb-4 max-w-lg text-center leading-relaxed font-sans">
                Review your consolidated travel spreadsheet. This document aggregates all of your travel vouchers chronologically to form an organized, single-sheet pickup schedule.
              </p>

              {/* Consolidated Report Layout */}
              <div className="w-full bg-[#ffffff] text-stone-900 p-6 rounded-xl shadow-lg border-2 border-stone-200 text-left space-y-5 select-none relative overflow-hidden">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-stone-100 pb-4 gap-2">
                  <div>
                    <h4 className="font-display font-black text-sm uppercase tracking-tight text-stone-900 leading-none">
                      MAS TRAVEL AGENCY HURGHADA
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-amber-600 mt-1 uppercase tracking-wider">
                      CONSOLIDATED TRAVEL REPORT & PLANNING SUMMARY
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-block bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[8.5px] font-mono font-bold rounded text-emerald-800 select-none">
                      STATUS: DRAFT RESERVATIONS
                    </span>
                    <p className="text-[9px] text-stone-400 font-mono mt-1">Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Stat Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 border border-stone-150 p-3 rounded-lg text-xs leading-tight">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-bold">EXCURSIONS</span>
                    <span className="font-black text-stone-800 mt-1 block text-sm">{bookings.length} Selected</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-bold">TOTAL GUESTS</span>
                    <span className="font-black text-stone-800 mt-1 block text-sm">
                      {bookings.reduce((sum, b) => sum + b.adultsCount, 0)} Ad • {bookings.reduce((sum, b) => sum + b.childrenCount, 0)} Ch
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-bold">HOTELS</span>
                    <span className="font-black text-stone-800 mt-1 block text-xs truncate" title={Array.from(new Set(bookings.map(b => b.hotelName).filter(Boolean))).join(', ')}>
                      {Array.from(new Set(bookings.map(b => b.hotelName).filter(Boolean))).length > 0
                        ? `${Array.from(new Set(bookings.map(b => b.hotelName).filter(Boolean))).length} Resorts`
                        : 'Not Specified'}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-bold">SUM TOTAL EXPECTED</span>
                    <span className="font-mono font-black text-emerald-600 mt-1 block text-sm">
                      {formatPrice(totalUSD, activeCurrencyInfo)}
                    </span>
                  </div>
                </div>

                {/* Chronological Table of Activities */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-sans border-collapse text-stone-800">
                    <thead>
                      <tr className="border-b border-stone-250 text-stone-500 uppercase font-black text-[8px] tracking-wide text-left">
                        <th className="pb-2 font-semibold">Date</th>
                        <th className="pb-2 font-semibold">Excursion Specialty</th>
                        <th className="pb-2 font-semibold">Lead Guest & Pickup Resort</th>
                        <th className="pb-2 font-semibold">Travellers</th>
                        <th className="pb-2 font-semibold text-right">Est. Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {[...bookings]
                        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
                        .map((booking) => {
                          const usdCost = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
                          return (
                            <tr key={booking.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="py-2.5 font-bold text-stone-900 whitespace-nowrap pr-2">
                                {booking.bookingDate}
                              </td>
                              <td className="py-2.5 pr-3">
                                <span className="block font-bold text-stone-900">{booking.tourTitle}</span>
                                <span className="text-[8.5px] font-mono text-stone-400 font-medium">ID: {booking.id}</span>
                              </td>
                              <td className="py-2.5 pr-3 max-w-[130px] truncate">
                                <span className="block font-semibold text-stone-800 truncate">{booking.fullName}</span>
                                <span className="block text-[9.5px] text-stone-400 truncate">{booking.hotelName || 'Pickup not specified'}</span>
                              </td>
                              <td className="py-2.5 font-semibold text-stone-600 whitespace-nowrap pr-2">
                                {booking.adultsCount} Adults {booking.childrenCount > 0 ? `+ ${booking.childrenCount} Kids` : ''}
                              </td>
                              <td className="py-2.5 font-mono text-stone-900 font-bold text-right whitespace-nowrap">
                                {formatPrice(usdCost, activeCurrencyInfo)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Travel Notes & Sign-off footer */}
                <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[9px] text-stone-500 gap-3">
                  <div>
                    <p className="font-bold text-stone-700 uppercase">📝 IMPORTANT CONSOLIDATED PLANS:</p>
                    <p className="leading-relaxed text-stone-400 mt-0.5 max-w-[400px]">
                      This ledger is generated based on drafts in your browser. Complete validation is achieved by coordinating these codes with our staff on WhatsApp for marine and safari slot bookings.
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="font-mono text-[14px] text-stone-500 tracking-[2px] select-none text-center block">
                      |||| ||| || ||| |||| |
                    </span>
                    <span className="text-[7.5px] tracking-widest text-stone-400 uppercase font-black block mt-1">
                      MAS HURGHADA PLANNER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-3 font-sans">
              <button
                onClick={() => setIsPrintSummaryOpen(false)}
                className="px-4 py-2 text-[10px] font-mono font-bold uppercase rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              >
                Close Summary
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-display font-black uppercase text-slate-50 bg-emerald-500 hover:bg-emerald-450 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Trigger System Print</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🧾 INVISIBLE DOM PRINT TREE - EXCLUSIVELY ACCESSED BY AT-MEDIA PRINT DIRECTIVES */}
      {activePrintBooking && (
        <div className="print-only">
          <div className="max-w-[190mm] mx-auto p-[10mm] text-black">
            
            {/* Ticket header */}
            <div className="flex justify-between items-start border-b border-black pb-4 mb-6">
              <div>
                <h1 className="text-lg font-bold tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>
                  MAS TRAVEL AGENCY HURGHADA
                </h1>
                <p className="text-xs text-gray-600 mt-1 font-semibold uppercase tracking-wide">
                  Official Reservation Confirmation Voucher
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Red Sea, Egypt • Coordinated with Lead Agent
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block border border-black px-2.5 py-0.5 text-xs font-bold font-mono">
                  ID: {activePrintBooking.id}
                </span>
                <p className="text-[10px] text-gray-600 font-mono mt-1 font-bold">RESERVATION STATUS: DRAFT</p>
              </div>
            </div>

            {/* Barcode block */}
            <div className="bg-gray-100 p-3 rounded mb-6 text-center border border-gray-300">
              <div className="font-mono text-xs tracking-[6px] font-bold mb-1">
                ||| | | |||| ||| | || |||| | | ||| ||
              </div>
              <p className="text-[9px] uppercase font-bold text-gray-700 tracking-wider">
                PRESENT DIGITAL OR PRINTED STUB AT VEHICLE OR DEPARTURE MARINA FOR FAST VERIFICATION
              </p>
            </div>

            {/* Structured details table layout */}
            <div className="mb-6 grid grid-cols-2 gap-y-4 gap-x-8 text-xs border-b border-black pb-6">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Adventure Specialty Program</p>
                <p className="text-sm font-bold text-black mt-1">{activePrintBooking.tourTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Travel Schedule Date</p>
                <p className="text-sm font-bold text-black mt-1">{activePrintBooking.bookingDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Lead Passenger Name</p>
                <p className="text-sm font-bold text-black mt-1">{activePrintBooking.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Settle Distribution Total</p>
                <p className="text-sm font-bold text-black mt-1">
                  {activePrintBooking.adultsCount} Adults {activePrintBooking.childrenCount > 0 ? `, ${activePrintBooking.childrenCount} Children` : ''}
                </p>
              </div>
              {activePrintBooking.hotelName && (
                <div className="col-span-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hotels Resorts & Pickup Lobby</p>
                  <p className="text-sm font-bold text-black mt-1">{activePrintBooking.hotelName}</p>
                </div>
              )}
            </div>

            {/* Costs breakdown */}
            <div className="mb-6 p-4 rounded bg-gray-100 border border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Estimated Voucher Fee Total:</p>
                  {activePrintBooking.adultsCount + activePrintBooking.childrenCount >= 5 ? (
                    <p className="text-[9.5px] text-emerald-600 font-bold">Includes 10% Group Saver Discount (5+ Travelers)!</p>
                  ) : (
                    <p className="text-[9px] text-gray-500">Calculated base on currency matrix converted multiplier.</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black font-mono leading-none">
                    {formatPrice(getTourPrice(activePrintBooking.tourId, activePrintBooking.adultsCount, activePrintBooking.childrenCount), activeCurrencyInfo)}
                  </p>
                  {activePrintBooking.adultsCount + activePrintBooking.childrenCount >= 5 && (
                    <p className="text-xs text-gray-500 line-through font-mono mt-1">
                      {formatPrice((activePrintBooking.adultsCount * (TOUR_PRICES[activePrintBooking.tourId.trim()] || { adult: 40, child: 20 }).adult) + (activePrintBooking.childrenCount * (TOUR_PRICES[activePrintBooking.tourId.trim()] || { adult: 40, child: 20 }).child), activeCurrencyInfo)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {activePrintBooking.specialRequests && (
              <div className="mb-6">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Passenger Requests / Medical Notes</p>
                <p className="text-xs italic text-gray-800 bg-gray-50 p-2.5 rounded border border-gray-200 mt-1">
                  &ldquo;{activePrintBooking.specialRequests}&rdquo;
                </p>
              </div>
            )}

            {/* Directives */}
            <div className="text-[9px] text-gray-600 space-y-2 border-t border-black pt-4">
              <p className="font-bold text-black uppercase">⚠️ REQUIRED PICKUP TRAVEL DIRECTIVES:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Present this voucher slip to the transport driver when getting picked up at your lobby.</li>
                <li>Pickup timing window has a +/- 15 minutes grace interval depending on traffic. Keep WhatsApp handy!</li>
                <li>Please bring standard sunhats, high quality sunglasses, camera gears, and towels for water tours.</li>
                <li>Settle of exact dues can be paid directly to our manager in cash (USD, EUR, GBP, or EGP).</li>
              </ul>
              <div className="text-center text-gray-400 mt-8 pt-6 border-t border-gray-100 uppercase tracking-widest text-[8px]">
                RESERVED THROUGH MAS TRAVEL DIGITAL DOCKING PORTAL • THANK YOU!
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🧾 INVISIBLE DOM CONSOLIDATED PRINT TREE */}
      {isPrintSummaryOpen && (
        <div className="print-only">
          <div className="max-w-[190mm] mx-auto p-[10mm] text-black">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-black pb-4 mb-6">
              <div>
                <h1 className="text-lg font-bold tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>
                  MAS TRAVEL AGENCY HURGHADA
                </h1>
                <p className="text-xs text-gray-600 mt-1 font-bold uppercase tracking-wide">
                  Consolidated Travel Itinerary & planning report
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Red Sea, Egypt • Coordinated with Lead Agent
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block border border-black px-2.5 py-0.5 text-xs font-bold font-mono">
                  SUMMARY LEDGER
                </span>
                <p className="text-[10px] text-gray-600 font-mono mt-1 font-bold">TOTAL EXCURSIONS: {bookings.length}</p>
                <p className="text-[9px] text-gray-400 font-mono mt-0.5">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Stat boxes in double column for print */}
            <div className="grid grid-cols-4 gap-4 p-3 border border-black bg-gray-50 rounded mb-6 text-xs text-black">
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Total Excursions</span>
                <p className="font-bold text-sm text-black mt-1">{bookings.length} booked</p>
              </div>
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider font-sans">Total Passengers</span>
                <p className="font-bold text-sm text-black mt-1">
                  {bookings.reduce((sum, b) => sum + b.adultsCount, 0)} Adults {bookings.reduce((sum, b) => sum + b.childrenCount, 0) > 0 ? `+ ${bookings.reduce((sum, b) => sum + b.childrenCount, 0)} Kids` : ''}
                </p>
              </div>
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Resorts Visited</span>
                <p className="font-bold text-sm text-black mt-1 truncate">
                  {Array.from(new Set(bookings.map(b => b.hotelName).filter(Boolean))).length > 0
                    ? `${Array.from(new Set(bookings.map(b => b.hotelName).filter(Boolean))).length} Hotels`
                    : 'Not Specified'}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Combined Cost Dues</span>
                <p className="font-mono font-bold text-sm text-emerald-600 mt-1">
                  {formatPrice(totalUSD, activeCurrencyInfo)}
                </p>
              </div>
            </div>

            {/* Barcode strip */}
            <div className="bg-gray-100 p-2.5 border border-gray-300 mb-6 text-center rounded">
              <div className="font-mono text-xs tracking-[5px] font-bold">
                |||| ||| ||| | |||| ||| | || |||| | | ||| ||
              </div>
              <p className="text-[8.5px] uppercase font-bold text-gray-700 tracking-wider mt-1">
                COMBINED VISITATION STUB • KEEP A PRINTED OR DIGITAL PDF COPY FOR QUICK AGENCY VERIFICATION
              </p>
            </div>

            {/* Activity Table */}
            <table className="w-full text-xs font-sans text-left border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 uppercase text-[9px] font-bold text-gray-750">
                  <th className="p-2 border-r border-gray-300">Travel Date</th>
                  <th className="p-2 border-r border-gray-300">Excursion Name / ID</th>
                  <th className="p-2 border-r border-gray-300">Lead Passenger / Pickup Hotel</th>
                  <th className="p-2 border-r border-gray-300">Guests</th>
                  <th className="p-2 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {[...bookings]
                  .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
                  .map((booking) => {
                    const usdCost = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="p-2 font-bold text-black border-r border-gray-200">
                          {booking.bookingDate}
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          <span className="font-bold text-black block">{booking.tourTitle}</span>
                          <span className="font-mono text-[9px] text-gray-500">ID: {booking.id}</span>
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          <span className="font-semibold text-gray-800 block">{booking.fullName}</span>
                          <span className="text-[10px] text-gray-500 block truncate">{booking.hotelName || 'Not specified'}</span>
                        </td>
                        <td className="p-2 border-r border-gray-200 text-gray-800">
                          {booking.adultsCount} Adults {booking.childrenCount > 0 ? `, ${booking.childrenCount} Children` : ''}
                        </td>
                        <td className="p-2 font-mono text-black font-bold text-right whitespace-nowrap">
                          {formatPrice(usdCost, activeCurrencyInfo)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* Print Directives */}
            <div className="text-[9px] text-gray-600 space-y-2 border-t border-black pt-4">
              <p className="font-bold text-black uppercase font-sans">⚠️ COMPREHENSIVE PLANNING INSTRUCTIONS:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Settle of exact dues can be paid directly to our coordinating lead manager upon first tour pickup. Cash is preferred (USD, EUR, GBP, or EGP values converted according to current rates).</li>
                <li>Pickup timing ranges +/- 15 minutes. Always check active WhatsApp chat conversations for live vehicle coordinates.</li>
                <li>Remember to pack swimwear, custom equipment, towels, hydration flasks, and sun protective gear according to the individual program check-lists.</li>
                <li>Changes to travel programs should be communicated at least 24 hours prior to departure window.</li>
              </ul>
              <div className="text-center text-gray-400 mt-8 pt-6 border-t border-gray-150 uppercase tracking-widest text-[8px]">
                RESERVED ONLINE AT MAS TRAVEL DIGITAL DOCKING PORTAL • THANK YOU FOR VISITING HURGHADA!
              </div>
            </div>

          </div>
        </div>
      )}

      {activeQRBooking && (
        <VoucherQRCodeModal
          booking={activeQRBooking}
          onClose={() => setActiveQRBooking(null)}
          currencyCode={activeCurrencyInfo.code}
          currencySymbol={activeCurrencyInfo.symbol}
          estimatedPrice={formatPrice(
            getTourPrice(activeQRBooking.tourId, activeQRBooking.adultsCount, activeQRBooking.childrenCount),
            activeCurrencyInfo
          )}
        />
      )}
    </div>
  );
}
