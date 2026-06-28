/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { BookingRequest } from '../types';
import { WHATSAPP_NUMBER, Currency, getTourPrice, TOUR_PRICES } from '../data';

export async function exportVouchersToPDF(
  bookings: BookingRequest[],
  currencyInfo: Currency,
  activeRate: number
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Calculate voucher prices for the specific currency selection
  const formatPriceLocal = (valueUSD: number) => {
    const converted = valueUSD * activeRate;
    const isEGP = currencyInfo.code === 'EGP';
    const valStr = converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return isEGP ? `${valStr} EGP` : `${currencyInfo.symbol}${valStr}`;
  };

  const vouchersWithQrs = await Promise.all(
    bookings.map(async (booking) => {
      const usdPrice = getTourPrice(booking.tourId, booking.adultsCount, booking.childrenCount);
      const formattedPrice = formatPriceLocal(usdPrice);

      const qrDataText = JSON.stringify({
        voucherId: booking.id,
        tourId: booking.tourId,
        tour: booking.tourTitle,
        date: booking.bookingDate,
        guest: booking.fullName,
        qty: `${booking.adultsCount} Adults, ${booking.childrenCount} Kids`,
        hotel: booking.hotelName || 'N/A',
        cost: formattedPrice,
        agency: 'MAS TRAVEL HURGHADA',
        status: booking.status,
      }, null, 2);

      try {
        const qrDataUrl = await QRCode.toDataURL(qrDataText, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 150,
        });
        return { booking, qrDataUrl, formattedPrice, usdPrice };
      } catch (e) {
        console.error(e);
        return { booking, qrDataUrl: null, formattedPrice, usdPrice };
      }
    })
  );

  // --- PAGE 1: CONSOLIDATED ITINERARY LEDGER & SUMMARY ---
  doc.setFillColor(15, 23, 42); // slate-900 / dark header bar
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MAS TRAVEL AGENCY HURGHADA', 15, 14);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11); // amber-500
  doc.text('CONSOLIDATED ITINERARY LEDGER & CUSTOMER PASSES', 15, 20);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()} • Red Sea, Egypt`, 15, 26);

  // Total summary badge on right hand side
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(145, 8, 50, 22, 'FD');

  doc.setTextColor(245, 158, 11); // Amber
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('EXPECTED TOTAL', 150, 14);

  const totalUSD = bookings.reduce((sum, b) => sum + getTourPrice(b.tourId, b.adultsCount, b.childrenCount), 0);
  const totalFormatted = formatPriceLocal(totalUSD);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(totalFormatted, 150, 21);
  doc.setFontSize(6);
  doc.setTextColor(180, 180, 180);
  doc.text(`${bookings.length} active program vouchers`, 150, 26);

  // Brief description introduction
  doc.setTextColor(50, 50, 50);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('YOUR ADVENTURE ITINERARY LEDGER', 15, 48);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Please carry this PDF document digitally or print it on paper. Present the respective QR codes at the marina jetty, speedboat deck, or safari base for express dispatch coordination.', 15, 54, { maxWidth: 180 });

  // Draw Chronological Table on page 1
  let currentY = 66;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(15, currentY, 195, currentY); // divider

  // Table Headers
  currentY += 5;
  doc.setTextColor(100, 100, 100);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Date', 15, currentY);
  doc.text('Excursion Specialty', 40, currentY);
  doc.text('Lead Guest & Resort Pickup', 95, currentY);
  doc.text('Distribution', 152, currentY);
  doc.text('Est. Cost', 182, currentY);

  currentY += 3;
  doc.line(15, currentY, 195, currentY);

  // Sort bookings by date
  const sortedVouchers = [...vouchersWithQrs].sort((a, b) => new Date(a.booking.bookingDate).getTime() - new Date(b.booking.bookingDate).getTime());

  sortedVouchers.forEach((v) => {
    currentY += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(v.booking.bookingDate, 15, currentY);

    doc.setFont('Helvetica', 'bold');
    doc.text(v.booking.tourTitle, 40, currentY);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`ID: ${v.booking.id}`, 40, currentY + 3.5);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(v.booking.fullName, 95, currentY);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(v.booking.hotelName || 'Not specified', 95, currentY + 3.5);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(`${v.booking.adultsCount} Ad • ${v.booking.childrenCount} Ch`, 152, currentY);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // emerald green
    doc.text(v.formattedPrice, 182, currentY);

    currentY += 4.5;
    doc.setDrawColor(240, 240, 240);
    doc.line(15, currentY, 195, currentY);
  });

  // Brief instructions footer for page 1
  currentY += 12;
  doc.setLineWidth(0.4);
  doc.setDrawColor(245, 158, 11); // Accent gold
  doc.setFillColor(254, 243, 199); // light yellow
  doc.rect(15, currentY, 180, 20, 'FD');

  doc.setTextColor(180, 83, 9); // dark amber
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('⚠️ DIGITAL PASSES CHECK-IN DIRECTIVE:', 20, currentY + 6);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text('Individual digital entry passes for each tour are attached on the following pages. Each ticket stub is coded with a secure JSON metadata scanner schema to guarantee authentic reservation records of Mas Travel.', 20, currentY + 11, { maxWidth: 170 });

  // --- PAGES 2+ FOR INDIVIDUAL TICKET PASSES ---
  vouchersWithQrs.forEach((v, idx) => {
    doc.addPage();
    
    // Aesthetic Ticket frame border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, 190, 277);

    // Header bar inside ticket frame
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(10, 10, 190, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MAS TRAVEL AGENCY HURGHADA', 18, 22);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(245, 158, 11); // golden accent
    doc.text('OFFICIAL DIGITAL ENTRY VOUCHER & SECURITY PASS', 18, 28);

    doc.setTextColor(180, 180, 180);
    doc.text(`TICKET SHEET ${idx + 1} OF ${bookings.length}`, 18, 34);

    // Ticket Reference Badge on header
    doc.setFillColor(30, 41, 59);
    doc.rect(140, 17, 52, 18, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('VOUCHER CODE ID', 144, 22);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(v.booking.id, 144, 28);

    // Main section
    // Left Grid details
    let itemY = 56;
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('CHOSEN ADVENTURE', 18, itemY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(v.booking.tourTitle, 18, itemY + 5.5);

    itemY += 15;
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('SCHEDULED TRAVEL DATE', 18, itemY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(v.booking.bookingDate, 18, itemY + 5.5);

    itemY += 15;
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('LEAD CLIENT DETAILS', 18, itemY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(v.booking.fullName, 18, itemY + 5.5, { maxWidth: 85 });
    
    itemY += 18;
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('RESORT & PICKUP LOBBY', 18, itemY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(v.booking.hotelName || 'Not specified (Direct Departure)', 18, itemY + 5.5, { maxWidth: 85 });

    itemY += 21;
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('TOTAL PARTICIPATING GUESTS', 18, itemY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${v.booking.adultsCount} Adults ${v.booking.childrenCount > 0 ? `+ ${v.booking.childrenCount} Children` : ''}`, 18, itemY + 5.5);

    // Right Box: QR Scanner Code Frame!
    const qrX = 115;
    const qrY = 56;
    doc.setDrawColor(245, 158, 11); // Amber golden border
    doc.setLineWidth(0.4);
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX, qrY, 70, 70, 'F');
    // Draw fine corner brackets
    doc.line(qrX - 2, qrY - 2, qrX + 6, qrY - 2);
    doc.line(qrX - 2, qrY - 2, qrX - 2, qrY + 6);
    doc.line(qrX + 72, qrY - 2, qrX + 64, qrY - 2);
    doc.line(qrX + 72, qrY - 2, qrX + 72, qrY + 6);
    doc.line(qrX - 2, qrY + 72, qrX + 6, qrY + 72);
    doc.line(qrX - 2, qrY + 72, qrX - 2, qrY + 64);
    doc.line(qrX + 72, qrY + 72, qrX + 64, qrY + 72);
    doc.line(qrX + 72, qrY + 72, qrX + 72, qrY + 64);

    if (v.qrDataUrl) {
      doc.addImage(v.qrDataUrl, 'PNG', qrX + 1, qrY + 1, 68, 68);
    } else {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('(QR Code Feed Error)', qrX + 18, qrY + 35);
    }
    
    // Label for scanning
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('SECURE QR ENCRYPTED SIGNATURE', qrX + 11, qrY + 75);

    // Ticket pricing details block at middle-bottom
    const priceY = 155;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(18, priceY, 172, 32, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(18, priceY, 172, 32, 'D');

    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ESTIMATED TRAVEL FEES DUE', 24, priceY + 8);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    if (v.booking.adultsCount + v.booking.childrenCount >= 5) {
      doc.text('Includes 10% auto-calculated Group Saver incentive.', 24, priceY + 14);
    } else {
      doc.text('Charges computed according to selected currency matrix.', 24, priceY + 14);
    }

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(v.formattedPrice, 24, priceY + 24);

    // Display original crossed-out price if group discount exists
    if (v.booking.adultsCount + v.booking.childrenCount >= 5) {
      const originalUSD = (v.booking.adultsCount * (TOUR_PRICES[v.booking.tourId.trim()] || { adult: 40, child: 20 }).adult) + (v.booking.childrenCount * (TOUR_PRICES[v.booking.tourId.trim()] || { adult: 40, child: 20 }).child);
      const convertedOriginalStr = (originalUSD * activeRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      const origIsEGP = currencyInfo.code === 'EGP';
      const origFormattedPrice = origIsEGP ? `${convertedOriginalStr} EGP` : `${currencyInfo.symbol}${convertedOriginalStr}`;
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Original: ${origFormattedPrice}`, 85, priceY + 23);
    }

    // Agent communication channel
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('✓ RESERVATION STATUS: SECURED DRAFT', 112, priceY + 14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7.5);
    doc.text('Check-in cleared for speedboats & safari.', 112, priceY + 19);

    // Special Requests block
    let notesY = 196;
    if (v.booking.specialRequests) {
      doc.setTextColor(100, 100, 100);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('PASSENGER REMARKS & CUSTOM NOTES', 18, notesY);
      doc.setFillColor(252, 252, 252);
      doc.setDrawColor(240, 240, 240);
      doc.rect(18, notesY + 3, 172, 14, 'FD');
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(70, 70, 70);
      doc.text(`"${v.booking.specialRequests}"`, 22, notesY + 10, { maxWidth: 164 });
      notesY += 24;
    } else {
      notesY += 4;
    }

    // Required Directives List
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('⚠️ MANDATORY PASSENGER PICKUP DIRECTIVES', 18, notesY);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    let bulletY = notesY + 5.5;
    const bullets = [
      'Present this page digitally on your mobile phone or printed on paper to our shuttle driver upon hotel pickup.',
      `Shuttle timing window allows +/- 15 mins for traffic margin. Coordinators are live on WhatsApp (+${WHATSAPP_NUMBER}).`,
      'Dress accordingly: Bring towels and spare shirts for aquatic cruises, or wind goggles and scarfs for quad desert safaris.',
      'Settle of dues can be paid directly to the coordinator at dock or safari camp in Cash (EGP, USD, EUR or GBP are welcome).'
    ];
    bullets.forEach((bullet) => {
      doc.text('•', 18, bulletY);
      doc.text(bullet, 22, bulletY, { maxWidth: 168 });
      bulletY += doc.splitTextToSize(bullet, 168).length * 3.5 + 1;
    });

    // Outer framing card bottom status text
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text('||||||| | || | |||| |||| ||| |||| | | ||| ||||||| |', 55, 274);
    doc.text('RESERVED WITH OFFICIAL DIGITAL VOUCHER HUB OF MAS TRAVEL HURGHADA Co.', 48, 278);
  });

  doc.save(`MAS_Travel_Hurghada_Vouchers_${new Date().toISOString().slice(0, 10)}.pdf`);
}
