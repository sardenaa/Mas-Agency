/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TourCategory = 'island' | 'marine' | 'safari' | 'day-trip' | 'submarine' | 'special';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface TourItem {
  id: string;
  title: string;
  arabicTitle?: string;
  subtitle: string;
  category: TourCategory;
  duration: string; // e.g., "7 Hours" or "16 Hours"
  location: string; // e.g., "Hurghada, Red Sea" or "Starting Hurghada to Luxor"
  meetingPoint?: string;
  rating: number;
  reviewsCount: number;
  priceEstimate: string; // e.g., "Standard & Luxury Options" or custom currency symbol
  badge?: string;
  description: string;
  highlights: string[];
  includedServices: string[];
  optionalServices?: string[];
  schedule: ScheduleItem[];
  extraTips?: string[];
  imageUrl: string;
  imageType: 'submarine' | 'sunset' | 'speedboat' | 'orange-island' | 'safari' | 'star-safari' | 'luxor' | 'cairo' | 'horse-riding' | 'cruise';
}

export interface StatusHistoryEntry {
  status: 'draft' | 'pending' | 'confirmed' | 'denied' | 'flagged';
  timestamp: string;
  updatedBy: 'client' | 'admin' | 'system';
  note?: string;
}

export interface BookingRequest {
  id: string;
  tourId: string;
  tourTitle: string;
  bookingDate: string;
  fullName: string;
  whatsappNumber: string;
  adultsCount: number;
  childrenCount: number;
  specialRequests?: string;
  hotelName?: string;
  createdAt: string;
  status: 'draft' | 'pending' | 'confirmed' | 'denied' | 'flagged';
  adminNotes?: string;
  statusHistory?: StatusHistoryEntry[];
}

export interface CustomActivitySelection {
  id: string;
  title: string;
  category: TourCategory;
  durationHours: number;
  timeSlot: string; // e.g. "Morning", "Afternoon", "Evening"
  emoji: string;
}

export interface ToastMessage {
  id: string;
  idVoucher?: string;
  tourTitle?: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface Review {
  id?: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  date: string;
  helpfulCount?: number;
  bookingId?: string;
  imageUrl?: string;
  isFlagged?: boolean;
  status?: 'Active' | 'Reported';
}

