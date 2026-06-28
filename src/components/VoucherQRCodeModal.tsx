import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Sparkles, Copy, Check, Calendar, User, Users, MapPin, Printer } from 'lucide-react';
import { BookingRequest } from '../types';

interface VoucherQRCodeModalProps {
  booking: BookingRequest;
  onClose: () => void;
  currencyCode: string;
  currencySymbol: string;
  estimatedPrice: string;
}

export default function VoucherQRCodeModal({
  booking,
  onClose,
  currencyCode,
  currencySymbol,
  estimatedPrice,
}: VoucherQRCodeModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Re-generate the QR data structure
  const qrDataText = JSON.stringify({
    voucherId: booking.id,
    tourId: booking.tourId,
    tour: booking.tourTitle,
    date: booking.bookingDate,
    guest: booking.fullName,
    qty: `${booking.adultsCount} Adults, ${booking.childrenCount} Kids`,
    hotel: booking.hotelName || 'N/A',
    cost: estimatedPrice,
    agency: 'MAS TRAVEL HURGHADA',
    status: booking.status,
  }, null, 2);

  useEffect(() => {
    setLoading(true);
    // Generate QR with custom parameters for ultra-reliable scanning
    QRCode.toDataURL(
      qrDataText,
      {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: {
          dark: '#0f172a',  // deep slate-900 (ultra-contrast)
          light: '#ffffff', // pure white (perfect scanning on phone and paper)
        },
      }
    )
      .then((url) => {
        setQrUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to generate high-precision QR code', err);
        setLoading(false);
      });
  }, [qrDataText]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="qr-modal-wrapper"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
    >
      <div 
        id="qr-modal-card"
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Accent Top Lip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="font-display font-black text-xs text-slate-200 uppercase tracking-widest">
              Digital Scanner Entry Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable if needed) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col items-center text-center space-y-6">
          
          <div className="space-y-1 select-none">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MAS Travel Hurghada Verification</span>
            </div>
            <h4 className="font-display font-black text-base text-slate-100 uppercase tracking-tight mt-1">
              {booking.tourTitle}
            </h4>
            <p className="text-xs text-slate-400">
              Show this pass at our marina dock or safari desk for prompt check-in.
            </p>
          </div>

          {/* QR Holder with Golden Inner Frame */}
          <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-amber-600/30 via-yellow-400/20 to-amber-600/30 border border-amber-500/40 shadow-lg shrink-0">
            {loading ? (
              <div className="w-[200px] h-[200px] bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 text-xs font-mono animate-pulse">
                Generating secure pass...
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden shadow-inner border bg-white p-1">
                <img 
                  src={qrUrl} 
                  alt="Voucher QR Code" 
                  className="w-[200px] h-[200px]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}
            
            {/* Corner Bracket Accents to highlight camera framing */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-xl -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-xl translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-xl -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-xl translate-x-1 translate-y-1" />
          </div>

          {/* Key Quick Facts Grid */}
          <div className="w-full bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 text-xs text-left space-y-2.5 font-sans">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-900/80">
              <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold">Voucher Token</span>
              <button 
                onClick={handleCopyText}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors font-mono font-bold font-black uppercase tracking-wider text-[10px] cursor-pointer"
              >
                <span>ID: {booking.id}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase text-slate-500 font-bold leading-none mb-0.5">Scheduled</p>
                  <p className="font-bold text-slate-300 truncate text-[11px]">{booking.bookingDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase text-slate-500 font-bold leading-none mb-0.5">Lead Guest</p>
                  <p className="font-bold text-slate-300 truncate text-[11px]">{booking.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase text-slate-500 font-bold leading-none mb-0.5">Distribution</p>
                  <p className="font-bold text-slate-300 truncate text-[11px]">
                    {booking.adultsCount} Ad • {booking.childrenCount} Ch
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase text-slate-500 font-bold leading-none mb-0.5">Pickup Location</p>
                  <p className="font-bold text-slate-300 truncate text-[11px]">{booking.hotelName || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900/80 flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Estimated Fees Due</span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {estimatedPrice}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs font-sans italic">
            * This QR code stores an authentic secure JSON signature. Please present it to your bus driver or reception coordinator upon vehicle pickup in Hurghada.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-end gap-3 font-sans">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[10px] font-mono font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-705 transition-colors cursor-pointer"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-display font-black uppercase text-slate-50 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5 text-slate-50" />
            <span>Print Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
}
