/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Ticket, 
  Sparkles, 
  Star, 
  Map, 
  Anchor, 
  Ship, 
  Tent, 
  BookOpen,
  Info,
  ChevronRight,
  ChevronUp,
  UserCheck,
  Heart,
  X,
  Sliders,
  AlertTriangle,
  Check,
  Flag,
  Share2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { ALL_TOURS, WHATSAPP_NUMBER, DISPLAY_PHONE, CLIENT_REVIEWS, CURRENCIES, Currency, TOUR_PRICES } from './data';
import { TourItem, BookingRequest, TourCategory, ToastMessage, Review } from './types';
import Hero from './components/Hero';
import TourCard from './components/TourCard';
import FlyerModal from './components/FlyerModal';
import ItineraryPlanner from './components/ItineraryPlanner';
import QuickBookingForm from './components/QuickBookingForm';
import VoucherDashboard from './components/VoucherDashboard';
import TravelPrepHub from './components/TravelPrepHub';
import NewsletterSignup from './components/NewsletterSignup';
import SeasonalOfferCountdown from './components/SeasonalOfferCountdown';
import ToastNotification from './components/ToastNotification';
import AdminDashboard from './components/AdminDashboard';
import WeatherSafetyModal from './components/WeatherSafetyModal';
import FeedbackModal from './components/FeedbackModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeAppTab, setActiveAppTab] = useState<'programs' | 'planner' | 'vouchers' | 'prep' | 'reviews'>('programs');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSpySection, setActiveSpySection] = useState<string>('island');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Custom high-fidelity smooth easing deceleration scroll function
  const animateScrollTo = (targetY: number, duration: number = 750) => {
    const start = window.scrollY;
    const change = targetY - start;
    const startTime = performance.now();

    // Cubic deceleration easing curve: f(t) = 1 - (1-t)^3
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const scroll = (now: number) => {
      const time = Math.min(1, (now - startTime) / duration);
      const easedTime = easeOutCubic(time);
      window.scrollTo(0, start + change * easedTime);

      if (time < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  };

  const animateScrollToTop = () => animateScrollTo(0, 800);

  // Dynamic Scroll-Spy Observer effect for highlighting categories in 'Programs' tab
  useEffect(() => {
    if (activeAppTab !== 'programs') return;

    const handleScrollSpy = () => {
      const sectionIds = ['island', 'safari', 'submarine', 'day-trip', 'special'];
      let currentSection = 'island';
      
      const scrollPosition = window.scrollY + 220; // safe offset matching sticky bar height
      
      for (const id of sectionIds) {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = id;
          }
        }
      }
      
      setActiveSpySection(currentSection);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // immediate check

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [activeAppTab]);

  // Back to top visible trigger toggle
  useEffect(() => {
    const toggleScrollTopBtn = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
    return () => window.removeEventListener('scroll', toggleScrollTopBtn);
  }, []);

  const handleCategoryClick = (catId: string) => {
    if (catId === 'all') {
      setActiveCategory('all');
      animateScrollToTop();
    } else {
      setActiveCategory('all');
      setTimeout(() => {
        const targetEl = document.getElementById(`section-${catId}`);
        if (targetEl) {
          const yOffset = -90; // offset for sticky search/nav bar
          const y = targetEl.getBoundingClientRect().top + window.scrollY + yOffset;
          animateScrollTo(y, 750);
        }
      }, 50);
    }
  };
  
  const activeCurrencyInfo = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  const formatPriceGlobal = (valueUSD: number) => {
    const converted = valueUSD * activeCurrencyInfo.rate;
    const isEGP = activeCurrencyInfo.code === 'EGP';
    const valStr = converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return isEGP ? `${valStr} EGP` : `${activeCurrencyInfo.symbol}${valStr}`;
  };

  // Selected tour for full timetable modal description
  const [selectedTourForFlyer, setSelectedTourForFlyer] = useState<TourItem | null>(null);
  
  // Selected tour for locking a booking voucher
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<TourItem | null>(null);

  // Draft vouchers loaded into state & local storage
  const [draftVouchers, setDraftVouchers] = useState<BookingRequest[]>([]);

  // Wishlist / Saved favorites loaded into state & local storage
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isSavedToursOpen, setIsSavedToursOpen] = useState<boolean>(false);

  // Active toast notifications list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pro Admin Portal States
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [customPrices, setCustomPrices] = useState<Record<string, { adult: number; child: number }>>({});
  const [promoCodes, setPromoCodes] = useState<Record<string, number>>({ GOLD10: 10, AUTUMN15: 15 });
  const [currencyOverrides, setCurrencyOverrides] = useState<Record<string, number>>({ EUR: 0.92, EGP: 47.50, GBP: 0.78 });
  const [weatherCondition, setWeatherCondition] = useState<'normal' | 'heatwave' | 'storm'>('normal');
  const [isWeatherAlertDismissed, setIsWeatherAlertDismissed] = useState<boolean>(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);

  // Cookie Consent Preferences States
  const [cookieConsent, setCookieConsent] = useState<string | null>(() => {
    return localStorage.getItem('mas_cookie_consent_status');
  });
  const [showCookieCustomizer, setShowCookieCustomizer] = useState<boolean>(false);
  const [cookieAnalytics, setCookieAnalytics] = useState<boolean>(true);
  const [cookieMarketing, setCookieMarketing] = useState<boolean>(true);

  const handleSaveCookieConsent = (level: 'accepted_all' | 'essential_only' | 'customized') => {
    let finalAuth = level;
    let analytics = level === 'accepted_all';
    let marketing = level === 'accepted_all';

    if (level === 'customized') {
      analytics = cookieAnalytics;
      marketing = cookieMarketing;
      finalAuth = (analytics && marketing) ? 'accepted_all' : 'customized';
    }

    localStorage.setItem('mas_cookie_consent_status', finalAuth);
    setCookieConsent(finalAuth);
    setShowCookieCustomizer(false);

    // Record GDPR consent & metadata trace to telemetry log list
    try {
      const logsStr = localStorage.getItem('mas_collected_telemetry_logs');
      const logs = logsStr ? JSON.parse(logsStr) : [];
      
      const newTelemetry = {
        id: `log-f${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        consentLevel: finalAuth,
        essentialAllowed: true,
        analyticsAllowed: analytics,
        marketingAllowed: marketing,
        userAgent: navigator.userAgent || 'Telemetry Agent Sandbox',
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        locale: navigator.language || 'en-US',
        wishlistCount: wishlist.length,
        bookingsDraftCount: draftVouchers.length,
      };

      const updatedLogs = [newTelemetry, ...logs].slice(0, 50); // Keep last 50 entries
      localStorage.setItem('mas_collected_telemetry_logs', JSON.stringify(updatedLogs));
    } catch (err) {
      console.error(err);
    }

    triggerToast(
      'Privacy Preferences Configured',
      level === 'accepted_all' 
        ? 'Thank you! You allowed cookie storage for a richer, more tailored excursion tracker experience.' 
        : 'Essential cookie policies applied. Optional diagnostic cookies remain disabled.',
      'success'
    );
  };

  // Guest Book Reviews & Feedback State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');
  const [reviewSortOrder, setReviewSortOrder] = useState<string>('helpful');
  const [upvotedReviewIds, setUpvotedReviewIds] = useState<string[]>([]);

  const handleToggleHelpfulReview = (reviewId: string) => {
    if (!reviewId) return;
    
    setUpvotedReviewIds((prev) => {
      const isUpvoted = prev.includes(reviewId);
      const updatedUpvoted = isUpvoted 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId];
      
      localStorage.setItem('mas_reviews_upvoted', JSON.stringify(updatedUpvoted));

      // Also adjust reviews array helpfulCount
      const updatedReviews = reviews.map((r) => {
        if (r.id === reviewId) {
          const baseCount = r.helpfulCount || 0;
          return {
            ...r,
            helpfulCount: isUpvoted ? Math.max(0, baseCount - 1) : baseCount + 1
          };
        }
        return r;
      });

      setReviews(updatedReviews);
      localStorage.setItem('mas_travel_reviews', JSON.stringify(updatedReviews));
      
      triggerToast(
        isUpvoted ? 'Upvote Removed' : 'Thanks for Voting!',
        isUpvoted ? 'You unvoted this testimonial feedback.' : 'Your helpful feedback click has been registered.',
        'info'
      );

      return updatedUpvoted;
    });
  };

  const handleReportReview = (reviewId: string) => {
    if (!reviewId) return;

    const updatedReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        const isCurrentlyFlagged = r.isFlagged || false;
        const newFlagged = !isCurrentlyFlagged;
        return {
          ...r,
          isFlagged: newFlagged,
          status: newFlagged ? 'Reported' : 'Active'
        } as Review;
      }
      return r;
    });

    setReviews(updatedReviews);
    localStorage.setItem('mas_travel_reviews', JSON.stringify(updatedReviews));

    const updatedReview = updatedReviews.find(r => r.id === reviewId);
    if (updatedReview?.isFlagged) {
      triggerToast(
        'Review Flagged',
        'Thank you. The system registered this testimonial as [Reported] pending agent moderation.',
        'error'
      );
    } else {
      triggerToast(
        'Flag Removed',
        'The report flag has been successfully cleared from this testimonial.',
        'info'
      );
    }
  };

  const handleShareReview = (review: Review) => {
    if (!review) return;
    const shareText = `"${review.review}"\n— Travel Review by ${review.name} (${review.country})\nExperience the Red Sea with MAS Agency: ${window.location.href}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          triggerToast(
            'Copied to Clipboard!',
            `Testimonial by ${review.name} and referral link copied successfully.`,
            'success'
          );
        })
        .catch(() => {
          triggerToast(
            'Copy Failed',
            'Your browser context restricted automated clipboard writing.',
            'info'
          );
        });
    } else {
      // Fallback text area copy technique
      try {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = shareText;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        triggerToast(
          'Copied to Clipboard!',
          `Testimonial by ${review.name} and referral link copied successfully.`,
          'success'
        );
      } catch (err) {
        triggerToast(
          'Copy Failed',
          'Clipboard copying is not supported or was blocked by frame sandbox restrictions.',
          'info'
        );
      }
    }
  };

  const getInitialReviews = (): Review[] => [
    {
      id: 'rev-default-1',
      name: 'Sarah Jenkins',
      country: 'United Kingdom 🇬🇧',
      review: 'The Hula Hula Sunset program was hands down the absolute highlight of our Egypt vacation. The boat is massive, clean, and the beach sandbox was straight out of a painting. Highly recommend MAS Agency!',
      rating: 5,
      date: 'May 2026',
      helpfulCount: 24,
      bookingId: 'VOU-MOCK-101',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'rev-default-2',
      name: 'Ahmed Al-Mansoori',
      country: 'UAE 🇦🇪',
      review: 'Super Safari on the Buggy was extremely adventurous. The Bedouin tea had phenomenal flavor and the stargazing telescopes showed us craters on Venus and mountains of Moon very clearly. Will book again next winter!',
      rating: 5,
      date: 'April 2026',
      helpfulCount: 15,
      bookingId: 'VOU-MOCK-202',
      imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'rev-default-3',
      name: 'Elena Rostova',
      country: 'Poland 🇵🇱',
      review: 'Booked the Paradise Submarine for my parents who do not swim. They loved the coral window views. The open buffet felt like a five-star hotel. Great organization via quick WhatsApp support.',
      rating: 4,
      date: 'June 2026',
      helpfulCount: 9,
      bookingId: 'VOU-MOCK-303',
      imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const triggerToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'error' = 'success',
    idVoucher?: string,
    tourTitle?: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      idVoucher,
      tourTitle,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastAction = (idVoucher?: string) => {
    if (!idVoucher) return;
    setActiveAppTab('vouchers');
    setTimeout(() => {
      document.getElementById('vouchers-dashboard-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Initialize draft bookings, wishlist, & admin values from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mas_travel_vouchers');
    if (saved) {
      try {
        setDraftVouchers(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing vouchers:', e);
      }
    }

    const savedWish = localStorage.getItem('mas_travel_wishlist');
    if (savedWish) {
      try {
        setWishlist(JSON.parse(savedWish));
      } catch (e) {
        console.error('Error parsing wishlist:', e);
      }
    }

    const savedPrices = localStorage.getItem('mas_travel_custom_prices');
    if (savedPrices) {
      try {
        const parsedPrices = JSON.parse(savedPrices);
        setCustomPrices(parsedPrices);
        // Mutate shared global object directly in memory
        Object.entries(parsedPrices).forEach(([id, rates]: [string, any]) => {
          TOUR_PRICES[id] = rates;
        });
      } catch (e) {
        console.error('Error parsing custom prices:', e);
      }
    }

    const savedPromos = localStorage.getItem('mas_travel_promo_codes');
    if (savedPromos) {
      try {
        setPromoCodes(JSON.parse(savedPromos));
      } catch (e) {
        console.error('Error parsing promo codes:', e);
      }
    }

    const savedRates = localStorage.getItem('mas_travel_currency_rates');
    if (savedRates) {
      try {
        const parsedRates = JSON.parse(savedRates);
        setCurrencyOverrides(parsedRates);
        // Mutate shares array entry directly in memory
        Object.entries(parsedRates).forEach(([code, rate]: [string, any]) => {
          const curr = CURRENCIES.find(c => c.code === code);
          if (curr) curr.rate = rate;
        });
      } catch (e) {
        console.error('Error parsing currency rates:', e);
      }
    }

    const savedUpvoted = localStorage.getItem('mas_reviews_upvoted');
    if (savedUpvoted) {
      try {
        setUpvotedReviewIds(JSON.parse(savedUpvoted));
      } catch (e) {
        setUpvotedReviewIds([]);
      }
    }

    const savedReviews = localStorage.getItem('mas_travel_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Error parsing reviews:', e);
        setReviews(getInitialReviews());
      }
    } else {
      const initial = getInitialReviews();
      setReviews(initial);
      localStorage.setItem('mas_travel_reviews', JSON.stringify(initial));
    }
  }, []);

  const handleToggleFavorite = (tour: TourItem) => {
    setWishlist((prev) => {
      const isAlreadyFav = prev.includes(tour.id);
      const updated = isAlreadyFav 
        ? prev.filter(id => id !== tour.id) 
        : [...prev, tour.id];
      localStorage.setItem('mas_travel_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Update localStorage when changed
  const handleAddNewVoucher = (newVoucher: BookingRequest) => {
    const updated = [...draftVouchers, newVoucher];
    setDraftVouchers(updated);
    localStorage.setItem('mas_travel_vouchers', JSON.stringify(updated));
    setSelectedTourForBooking(null); // close booking panel
    
    // Switch to vouchers tab so they see their ticked voucher stub
    setTimeout(() => {
      setActiveAppTab('vouchers');
      animateScrollToTop();
    }, 450);

    // Lock immediate high-fidelity toast notification
    triggerToast(
      'Voucher Draft Saved',
      'Your booking draft has been safely captured and logged into your local dashboard!',
      'success',
      newVoucher.id,
      newVoucher.tourTitle
    );
  };

  const handleAddNewReview = (newReview: Review) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('mas_travel_reviews', JSON.stringify(updated));
    triggerToast(
      'Feedback Published!',
      'Thank you for sharing your experience. Your review is now live in our Guest Book!',
      'success'
    );
  };

  const handleRemoveVoucher = (id: string) => {
    const updated = draftVouchers.filter(v => v.id !== id);
    setDraftVouchers(updated);
    localStorage.setItem('mas_travel_vouchers', JSON.stringify(updated));
  };

  // Admin dashboard updates handlers
  const handleUpdateBooking = (id: string, updatedFields: Partial<BookingRequest>) => {
    setDraftVouchers((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          const newStatus = updatedFields.status ?? b.status;
          const statusChanged = updatedFields.status && updatedFields.status !== b.status;
          const notesChanged = updatedFields.adminNotes !== undefined && updatedFields.adminNotes !== b.adminNotes;
          
          let history = b.statusHistory ? [...b.statusHistory] : [
            {
              status: b.status,
              timestamp: b.createdAt || new Date().toISOString(),
              updatedBy: 'client' as const,
              note: 'Initial voucher drafted by guest.'
            }
          ];

          if (statusChanged) {
            history.push({
              status: newStatus,
              timestamp: new Date().toISOString(),
              updatedBy: 'admin' as const,
              note: updatedFields.adminNotes 
                ? `Voucher status updated to ${newStatus.toUpperCase()}. Memo: "${updatedFields.adminNotes}"` 
                : `Voucher status escalated/updated to: ${newStatus.toUpperCase()}`
            });
          } else if (notesChanged) {
            history.push({
              status: b.status,
              timestamp: new Date().toISOString(),
              updatedBy: 'admin' as const,
              note: `Admin record notes modifed: "${updatedFields.adminNotes}"`
            });
          }

          return { ...b, ...updatedFields, statusHistory: history };
        }
        return b;
      });
      localStorage.setItem('mas_travel_vouchers', JSON.stringify(updated));
      return updated;
    });
    triggerToast('System Record Updated', 'Voucher details and status history logged successfully in admin ledger!', 'info');
  };

  const handleDeleteBooking = (id: string) => {
    setDraftVouchers((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem('mas_travel_vouchers', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Record Purged', 'Booking request eradicated successfully from secure ledger.', 'error');
  };

  const handleUpdateTourPrice = (tourId: string, adult: number, child: number) => {
    setCustomPrices((prev) => {
      const updated = { ...prev, [tourId]: { adult, child } };
      localStorage.setItem('mas_travel_custom_prices', JSON.stringify(updated));
      
      // Mutate shared global object directly
      TOUR_PRICES[tourId] = { adult, child };
      return updated;
    });
  };

  const handleAddPromoCode = (code: string, discountPercent: number) => {
    setPromoCodes((prev) => {
      const updated = { ...prev, [code]: discountPercent };
      localStorage.setItem('mas_travel_promo_codes', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Promo Code Operational', `Activated code "${code}" drawing ${discountPercent}% savings!`, 'success');
  };

  const handleRemovePromoCode = (code: string) => {
    setPromoCodes((prev) => {
      const updated = { ...prev };
      delete updated[code];
      localStorage.setItem('mas_travel_promo_codes', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Promo Terminated', `Deactivated promotional code ${code}.`, 'info');
  };

  const handleUpdateCurrencyRate = (code: string, rate: number) => {
    setCurrencyOverrides((prev) => {
      const updated = { ...prev, [code]: rate };
      localStorage.setItem('mas_travel_currency_rates', JSON.stringify(updated));
      
      // Mutate shares array entry directly
      const curr = CURRENCIES.find(c => c.code === code);
      if (curr) curr.rate = rate;
      
      return updated;
    });
  };

  const handleSeedMockBookings = () => {
    const mockBookings: BookingRequest[] = [
      {
        id: 'MAS-B-8812',
        tourId: 'orange-bay-island',
        tourTitle: 'Orange Bay Island Excursion',
        bookingDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        fullName: 'Jean-Luc Picard',
        whatsappNumber: '+33140506070',
        adultsCount: 4,
        childrenCount: 2,
        specialRequests: 'Prefers non-seafood lunch. Need extra life jackets for juveniles.',
        hotelName: 'Sunrise Crystal Bay Hurghada',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'confirmed',
        adminNotes: 'Assigned Captain Mahmoud on Speedboat "Red Sea Swift". VIP client.',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedBy: 'client',
            note: 'Voucher drafted online for Orange Bay Island trip.'
          },
          {
            status: 'flagged',
            timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(),
            updatedBy: 'system',
            note: 'Automatic system notice: Group size >= 5 qualified for 10% auto-discount.'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            updatedBy: 'admin',
            note: 'Manual review completed by Agent Mahmoud. Assigned speed boat Red Sea Swift, VIP guest priority.'
          }
        ]
      },
      {
        id: 'MAS-B-3140',
        tourId: 'super-desert-safari',
        tourTitle: 'Super Desert Safari Buggy & Quad',
        bookingDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        fullName: 'Irina Petrova',
        whatsappNumber: '+79153004050',
        adultsCount: 2,
        childrenCount: 0,
        specialRequests: 'Sunset ATV tour sequence highlight request.',
        hotelName: 'Albatros Palace Resort',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'pending',
        adminNotes: 'Awaiting English translator assignment.',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            updatedBy: 'client',
            note: 'Voucher submitted from Albatros Palace Resort. Requested English audio guide translation.'
          }
        ]
      },
      {
        id: 'MAS-B-9922',
        tourId: 'royal-seascope-submarine',
        tourTitle: 'Royal Seascope Semi-Submarine',
        bookingDate: new Date().toISOString().split('T')[0],
        fullName: 'Sarah Jenkins',
        whatsappNumber: '+447911122233',
        adultsCount: 1,
        childrenCount: 3,
        specialRequests: 'Needs wheelchair ramp access proximity checking.',
        hotelName: 'Hilton Hurghada Plaza',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'confirmed',
        adminNotes: 'Fully paid in cash USD. Sent ticket. Confirmed transfer 09:30 AM.',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            updatedBy: 'client',
            note: 'Voucher registered by Sarah Jenkins for family dive trip.'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 5400000).toISOString(),
            updatedBy: 'admin',
            note: 'Voucher validated, cash confirmation of $80 submitted. Boarding cards delivered via WhatsApp.'
          }
        ]
      },
      {
        id: 'MAS-B-4321',
        tourId: 'cairo-pyramids-day-trip',
        tourTitle: 'Cairo & Giza Pyramids Day Trip Tour',
        bookingDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        fullName: 'Hans Mueller',
        whatsappNumber: '+491702334455',
        adultsCount: 3,
        childrenCount: 1,
        hotelName: 'Dana Beach Resort',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        status: 'flagged',
        adminNotes: 'Pending Luxor check flight tickets booking confirmation.',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            updatedBy: 'client',
            note: 'Inter-city Cairo flight request initialized from Dana Beach.'
          },
          {
            status: 'flagged',
            timestamp: new Date(Date.now() - 9000000).toISOString(),
            updatedBy: 'admin',
            note: 'Voucher flagged pending domestic airline availability confirmation for Luxor flight connection.'
          }
        ]
      },
      {
        id: 'MAS-B-7452',
        tourId: 'giftun-island-snorkeling',
        tourTitle: 'Giftun Island Speedboat & Snorkeling',
        bookingDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
        fullName: 'Clara Oswald',
        whatsappNumber: '+441223344556',
        adultsCount: 2,
        childrenCount: 1,
        specialRequests: 'Birthday celebration highlight surprise boat cake request!',
        hotelName: 'Steigenberger ALDAU Beach',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        status: 'confirmed',
        adminNotes: 'Birthday tour! Ordered cake from Marina bakery.',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            updatedBy: 'client',
            note: 'Clara Oswald submitted and requested cake details.'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 12000000).toISOString(),
            updatedBy: 'admin',
            note: 'Cake ordered from local Marina Bakery. Voucher marked ready.'
          }
        ]
      }
    ];

    setDraftVouchers((prev) => {
      const merged = [...prev];
      mockBookings.forEach((b) => {
        if (!merged.some((existing) => existing.id === b.id)) {
          merged.push(b);
        }
      });
      localStorage.setItem('mas_travel_vouchers', JSON.stringify(merged));
      return merged;
    });

    triggerToast('Mock Database Seeded', 'Inserted 5 realistic international guest bookings on diverse tours for simulation!', 'success');
  };

  // Filter logic
  const filteredTours = ALL_TOURS.filter((tour) => {
    const matchesCategory = activeCategory === 'all' || tour.category === activeCategory;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tour.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tour.arabicTitle && tour.arabicTitle.includes(searchQuery)) ||
                          tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-50">
      
      {/* 0. LIMITED-TIME SEASONAL OFFER COUNTDOWN */}
      <SeasonalOfferCountdown />

      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 animate-gold-glow border border-emerald-500/30 shadow-md">
              <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 tracking-tighter">
                  MAS
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-white tracking-tight leading-none gold-text-shimmer">
                MAS AGENCY
              </h3>
              <p className="font-mono text-[9px] tracking-wider text-emerald-500 font-semibold leading-none mt-0.5 uppercase">
                Tours & Travel
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-display font-sans uppercase tracking-wider text-slate-400">
            <button 
              onClick={() => { setActiveAppTab('programs'); animateScrollToTop(); }} 
              className={`relative transition-all pb-1.5 cursor-pointer font-bold duration-300 ${activeAppTab === 'programs' ? 'text-emerald-400 font-black' : 'hover:text-emerald-400'}`}
            >
              <span>Programs</span>
              {activeAppTab === 'programs' && (
                <motion.div layoutId="headerActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
            <button 
              onClick={() => { setActiveAppTab('planner'); animateScrollToTop(); }} 
              className={`relative transition-all pb-1.5 cursor-pointer font-bold duration-300 ${activeAppTab === 'planner' ? 'text-emerald-400 font-black' : 'hover:text-emerald-400'}`}
            >
              <span>Custom Planner</span>
              {activeAppTab === 'planner' && (
                <motion.div layoutId="headerActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
            <button 
              onClick={() => { setActiveAppTab('vouchers'); animateScrollToTop(); }} 
              className={`relative transition-all pb-1.5 cursor-pointer font-bold duration-300 ${activeAppTab === 'vouchers' ? 'text-emerald-400 font-black' : 'hover:text-emerald-400'}`}
            >
              <span>My Vouchers</span>
              {draftVouchers.length > 0 && (
                <span className="absolute -top-1.5 -right-3.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-50 font-mono text-[9px] leading-4 text-center font-bold z-10">
                  {draftVouchers.length}
                </span>
              )}
              {activeAppTab === 'vouchers' && (
                <motion.div layoutId="headerActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
            <button 
              onClick={() => { setActiveAppTab('prep'); animateScrollToTop(); }} 
              className={`relative transition-all pb-1.5 cursor-pointer font-bold duration-300 ${activeAppTab === 'prep' ? 'text-emerald-400 font-black' : 'hover:text-emerald-400'}`}
            >
              <span>Kit FAQ</span>
              {activeAppTab === 'prep' && (
                <motion.div layoutId="headerActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
            <button 
              onClick={() => { setActiveAppTab('reviews'); animateScrollToTop(); }} 
              className={`relative transition-all pb-1.5 cursor-pointer font-bold duration-300 ${activeAppTab === 'reviews' ? 'text-emerald-400 font-black' : 'hover:text-emerald-400'}`}
            >
              <span>Testimonials</span>
              {activeAppTab === 'reviews' && (
                <motion.div layoutId="headerActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
            <button 
              onClick={() => setIsSavedToursOpen(!isSavedToursOpen)} 
              className="hover:text-emerald-400 relative transition-all cursor-pointer flex items-center gap-1 font-bold"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <span>Saved ({wishlist.length})</span>
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="px-2.5 py-1 text-emerald-450 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-slate-950 font-black tracking-widest text-[9.5px] rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-1 font-sans"
            >
              <Sliders className="w-3 h-3" />
              <span>PRO ADMIN</span>
            </button>
          </nav>

          {/* WhatsApp Direct & Saved Wishlist Shortcut */}
          <div className="flex items-center gap-2.5">
            {/* Header Currency Selector */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 shadow-inner gap-0.5 mr-0.5">
              {[
                { code: 'USD', label: '$ USD' },
                { code: 'EUR', label: '€ EUR' },
                { code: 'EGP', label: 'EGP' }
              ].map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrency(curr.code)}
                  className={`px-2 py-1 text-[9.5px] font-mono font-bold tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                    selectedCurrency === curr.code
                      ? 'bg-emerald-500 text-slate-50 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {curr.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsSavedToursOpen(!isSavedToursOpen)}
              className={`p-2 rounded-lg border transition-all duration-300 relative cursor-pointer ${
                wishlist.length > 0
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
              title="Saved Tours"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[8.5px] flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-lg border border-slate-850 bg-slate-950 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all duration-300"
              title="Administrative Portal Control Desk"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-slate-50 text-emerald-400 text-xs font-display font-bold uppercase tracking-wider transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="hidden sm:inline">WhatsApp Booking</span>
            </a>
          </div>
        </div>

        {/* Saved Tours Dropdown Panel inside Sticky Header */}
        {isSavedToursOpen && (
          <div className="absolute right-4 md:right-8 top-16 z-50 w-full max-w-[340px] rounded-2xl border border-slate-850 bg-slate-950/95 backdrop-blur-lg p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-1.5 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
                  Saved Excursions ({wishlist.length})
                </h4>
              </div>
              <button 
                onClick={() => setIsSavedToursOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {wishlist.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Heart className="w-8 h-8 mx-auto text-slate-800 mb-2.5" />
                  <p className="text-xs font-medium">No saved programs yet</p>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-[220px] mx-auto leading-normal">
                    Browse excursions below and tap the 🤍 button on the card to add them here!
                  </p>
                </div>
              ) : (
                ALL_TOURS.filter(t => wishlist.includes(t.id)).map((tour) => (
                  <div key={tour.id} className="group/item flex gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/70 transition-all">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-900">
                      <img 
                        src={tour.imageUrl} 
                        alt={tour.title}
                        className="w-full h-full object-cover opacity-80 group-hover/item:scale-105 transition-transform duration-300" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono font-bold leading-none truncate">
                            {tour.category}
                          </p>
                          <span className="text-[10.5px] font-mono text-amber-500 font-bold leading-none shrink-0">
                            {tour.priceEstimate}
                          </span>
                        </div>
                        <h5 className="font-display font-extrabold text-xs text-slate-200 mt-1 truncate leading-tight group-hover/item:text-white">
                          {tour.title}
                        </h5>
                      </div>

                      <div className="flex gap-3 mt-1.5 pt-1.5 border-t border-slate-900/60 items-center justify-between">
                        <div className="flex gap-2.5">
                          <button
                            onClick={() => {
                              setSelectedTourForFlyer(tour);
                              setIsSavedToursOpen(false);
                            }}
                            className="text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTourForBooking(tour);
                              setIsSavedToursOpen(false);
                            }}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-350 transition-colors cursor-pointer"
                          >
                            Quick Book
                          </button>
                        </div>
                        <button
                          onClick={() => handleToggleFavorite(tour)}
                          className="text-[10px] font-semibold text-slate-500 hover:text-rose-450 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px]">
                <button 
                  onClick={() => {
                    setWishlist([]);
                    localStorage.setItem('mas_travel_wishlist', JSON.stringify([]));
                  }}
                  className="font-mono font-bold text-slate-500 hover:text-rose-450 transition-colors uppercase cursor-pointer"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => {
                    setIsSavedToursOpen(false);
                    setActiveAppTab('programs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-display font-black text-emerald-400 hover:text-emerald-350 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  View Grid ➔
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Dynamic weather warnings activated by Administrative Panel */}
      <AnimatePresence>
        {weatherCondition !== 'normal' && !isWeatherAlertDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16, marginBottom: 0, overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
            className={`p-4 mx-4 md:mx-8 rounded-2xl border flex items-start justify-between gap-4 transition-all duration-300 ${
              weatherCondition === 'heatwave' 
                ? 'bg-amber-950/45 border-amber-500/20 text-amber-100' 
                : 'bg-rose-955/45 border-rose-500/20 text-rose-100'
            }`}
          >
            <div className="flex gap-3 text-left">
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${weatherCondition === 'heatwave' ? 'text-amber-400' : 'text-rose-400'}`} />
              <div className="text-xs font-sans">
                <p className={`font-extrabold uppercase tracking-wider text-[11px] ${weatherCondition === 'heatwave' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {weatherCondition === 'heatwave' ? '☀️ Red Sea Weather Advisory Service' : '🚨 Coastal Gale Warning Notice'}
                </p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {weatherCondition === 'heatwave' 
                    ? "Extreme UV Index predicted over Hurghada today. Guests scheduled on Speedboat Beach or Island Sandbar tours are highly advised to carry polarized sunglasses, apply SPF 50+ sunscreen liberally, and consume plentiful hydration fluids."
                    : "Mild gale winds reported. High water tide conditions may prompt snorkeling speedboats to adjust standard tour timelines slightly. Please consult the Direct Support Desk link below for free itinerary rescheduling checkups."
                  }
                </p>
                <button
                  type="button"
                  onClick={() => setIsWeatherModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 mt-2.5 text-[10.5px] font-mono font-black uppercase tracking-widest underline underline-offset-4 cursor-pointer transition-all ${
                    weatherCondition === 'heatwave' 
                      ? 'text-amber-450 hover:text-amber-300' 
                      : 'text-rose-455 hover:text-rose-300'
                  }`}
                  title="Open extreme weather protocol directive guidelines"
                  id="trigger-safety-guidelines-modal"
                >
                  <span>View Detailed Safety Guidelines →</span>
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsWeatherAlertDismissed(true)}
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SWITCHABLE APP TABS CANVASES */}
      <AnimatePresence mode="wait">
        {activeAppTab === 'programs' && (
          <motion.div
            key="programs-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="focus:outline-none"
          >
            {/* 2. HERO COMPONENT inside Homepage */}
            <Hero 
              onExploreClick={() => {
                const targetHeader = document.getElementById('all-programs-section-header');
                if (targetHeader) {
                  const y = targetHeader.getBoundingClientRect().top + window.scrollY - 80;
                  animateScrollTo(y, 800);
                }
              }}
              onPlannerClick={() => {
                setActiveAppTab('planner');
                animateScrollToTop();
              }}
            />

            {/* 3. DYNAMIC EXCURSION GRID SECTION - SECTION [01] */}
            <section id="all-programs-section" className="py-16 max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-850/30">
              
              {/* Section Heading */}
              <div id="all-programs-section-header" className="text-center max-w-3xl mx-auto mb-14 pt-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                  <span className="text-amber-500">[ 01 ]</span>
                  <span>EXCURSION SHOWCASE</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-tight">
                  Our Official Tour Catalog
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto my-4 rounded-full" />
                <p className="font-sans text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Discover Egypt Red Sea adventure programs derived directly from official flyers. Click a flyer to inspect precise timelines, transfer parameters, and coordinate dynamic bookings.
                </p>
              </div>

              {/* Dynamic Interactive Filter & Search Bar with Sticky Position Anchor */}
              <div className="sticky top-[73px] z-30 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-900 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Category Pills (Active category highlighted via Scroll Spy!) */}
                <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'All Programs', icon: Map },
                    { id: 'island', label: 'Island Trips', icon: Ship },
                    { id: 'safari', label: 'Desert Safaris', icon: Tent },
                    { id: 'submarine', label: 'Submarines', icon: Anchor },
                    { id: 'day-trip', label: 'Cairo & Luxor', icon: BookOpen },
                    { id: 'special', label: 'Specials & Cruises', icon: Sparkles }
                  ].map((cat) => {
                    const Icon = cat.icon;
                    // Active highlight resolves either to standard filter selection OR scroll-spy active state!
                    const isPillActive = activeCategory === cat.id || (activeCategory === 'all' && activeSpySection === cat.id && cat.id !== 'all');
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-display font-semibold rounded-lg tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                          isPillActive
                            ? 'bg-emerald-500 text-slate-50 font-black scale-102 shadow-md shadow-emerald-550/20'
                            : 'bg-slate-905 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Input Box */}
                <div className="relative w-full md:w-80 shrink-0">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search e.g. Buggy, Orange Bay..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                  />
                </div>

              </div>

              {/* Dynamic Grid list grouped into sections for Scroll Spy */}
              {filteredTours.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-slate-900 background-radial mt-4">
                  <Compass className="w-10 h-10 mx-auto text-slate-700 animate-pulse mb-3" />
                  <p className="font-display font-bold text-slate-400">No Programs Found matching &ldquo;{searchQuery}&rdquo;</p>
                  <p className="font-sans text-xs text-slate-500 mt-1">Please try modifying your filters or clear search keywords to discover all Red Sea excursions.</p>
                  <button 
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:text-white mt-4 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-16">
                  {[
                    { id: 'island', label: 'Island Trips & Marine Escapes', icon: Ship, tourCategories: ['island', 'marine'], desc: 'Unforgettable boat cruises, wild dolphin snorkeling sanctuaries, and offshore beach sandbar spots.' },
                    { id: 'safari', label: 'Desert Safaris & Bedouin Culture', icon: Tent, tourCategories: ['safari'], desc: 'High-speed quad buggies, traditional Bedouin camp gatherings, camel rides, and deep desert sunset vistas.' },
                    { id: 'submarine', label: 'Undersea Submarines & Coral Ports', icon: Anchor, tourCategories: ['submarine'], desc: 'Pristine dry panoramic coral viewing ports sailing right under waves, perfect for non-swimmers, kids and families.' },
                    { id: 'day-trip', label: 'Cairo, Luxor & Egypt Landmarks', icon: BookOpen, tourCategories: ['day-trip'], desc: 'Unpack the ancient historical treasures of Giza Pyramids and the grand Valley of the Kings in Luxor.' },
                    { id: 'special', label: 'Specials & Luxury Sailing Cruises', icon: Sparkles, tourCategories: ['special'], desc: 'Elite bespoke charters, VIP overnight cruises, and private custom itineraries handcrafted with care.' }
                  ].map((sec) => {
                    const sectionTours = filteredTours.filter(t => sec.tourCategories.includes(t.category));
                    if (sectionTours.length === 0) return null;

                    return (
                      <div 
                        key={sec.id} 
                        id={`section-${sec.id}`}
                        className="scroll-mt-36 transition-all duration-300 pl-4 md:pl-6 border-l border-slate-900 hover:border-emerald-500/30"
                      >
                        {/* Section Header */}
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900/40 pb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <sec.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-display font-extrabold text-base md:text-lg text-slate-100 uppercase tracking-wide flex items-center gap-2">
                                <span>{sec.label}</span>
                                <span className="bg-slate-900 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-850">
                                  {sectionTours.length} Programs
                                </span>
                              </h3>
                              <p className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
                                {sec.desc}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Layout Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                          {sectionTours.map((tour) => (
                            <TourCard 
                              key={tour.id} 
                              tour={tour} 
                              onViewItinerary={(t) => setSelectedTourForFlyer(t)}
                              onQuickBook={(t) => setSelectedTourForBooking(t)}
                              isFavorited={wishlist.includes(tour.id)}
                              onToggleFavorite={handleToggleFavorite}
                              selectedCurrency={selectedCurrency}
                              formatPrice={formatPriceGlobal}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </motion.div>
        )}

        {activeAppTab === 'planner' && (
          <motion.div
            key="planner-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="py-12 max-w-7xl mx-auto px-4 md:px-8 focus:outline-none"
          >
            {/* 5. INTERACTIVE ITINERARY PLANNER SECTION */}
            <ItineraryPlanner />
          </motion.div>
        )}

        {activeAppTab === 'vouchers' && (
          <motion.div
            key="vouchers-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="py-12 max-w-5xl mx-auto px-4 md:px-8 focus:outline-none"
          >
            {/* 6. VOUCHERS DASHBOARD PANEL - SECTION [03] */}
            <div id="vouchers-dashboard-panel" className="text-center max-w-2xl mx-auto mb-10 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                <span className="text-amber-500">[ 03 ]</span>
                <span>SECURED PRIVATE LEDGER</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                My Applet Draft Vouchers
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto my-4 rounded-full" />
              <p className="font-sans text-xs md:text-sm text-slate-400 mt-1">
                When you complete our Quick Booking Form, your travel ticket voucher stubs persist privately in your browser session storage. Click on &ldquo;Submit Stub&rdquo; to send the coordinates over WhatsApp to locking pricing deals!
              </p>
            </div>

            <VoucherDashboard 
              bookings={draftVouchers}
              onRemoveBooking={handleRemoveVoucher}
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              onAddBooking={handleAddNewVoucher}
            />
          </motion.div>
        )}

        {activeAppTab === 'prep' && (
          <motion.div
            key="prep-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="py-12 max-w-5xl mx-auto px-4 focus:outline-none"
          >
            {/* 6.5. TRAVEL PREPARATION & FAQ HUB - SECTION [04] */}
            <div id="travel-preparation-hub" className="text-center max-w-3xl mx-auto mb-12 px-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                <span className="text-amber-500">[ 04 ]</span>
                <span>EXPLORER READY-KIT</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Travel Prep & FAQ Hub
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto my-4 rounded-full" />
              <p className="font-sans text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Equip yourself with practical pack checklists, understand pickup timings, study local marine protection standards, and inspect real-time Red Sea conditions.
              </p>
            </div>
            <TravelPrepHub bookings={draftVouchers} />
          </motion.div>
        )}

        {activeAppTab === 'reviews' && (
          <motion.div
            key="reviews-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="py-12 max-w-7xl mx-auto px-4 md:px-8 focus:outline-none"
          >
            {/* 7. REVIEWS & TESTIMONIALS - SECTION [05] */}
            <div id="egypt-reviews-section" className="text-center max-w-2xl mx-auto mb-10 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                <span className="text-amber-500">[ 05 ]</span>
                <span>TESTIMONIAL GUEST BOOK</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white mt-1">
                Unforgettable Red Sea Feedback
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto my-4 rounded-full" />
              <p className="font-sans text-xs md:text-sm text-slate-400 mt-1 mb-6">
                Read real feedback from international travelers who experienced our safaris and submarine excursions in Egypt.
              </p>
              
              <button
                id="open-feedback-sheet-btn"
                type="button"
                onClick={() => setIsFeedbackModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-650 hover:from-emerald-400 hover:to-emerald-550 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-103 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-97"
                title="Write a new review memory"
              >
                <span>➕ Leave Guest Book Feedback</span>
              </button>
            </div>

            {/* Premium Testimonials Filter & Sorting Hub Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-6 mb-8 rounded-2xl bg-slate-950/60 border border-slate-900 shadow-xl text-xs max-w-4xl mx-auto select-none">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                  Filter Rating:
                </span>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-850">
                  {[
                    { value: 'all', label: 'All Ratings' },
                    { value: '5', label: '⭐ 5 Stars Only' },
                    { value: '4plus', label: '⭐ 4+ Stars' },
                    { value: '3plus', label: '⭐ 3+ Stars' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setReviewRatingFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-md font-sans text-[11px] font-bold transition-all cursor-pointer ${
                        reviewRatingFilter === opt.value
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-left">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold shrink-0">
                  Sort Order:
                </span>
                <select
                  id="review-sort-select"
                  value={reviewSortOrder}
                  onChange={(e) => setReviewSortOrder(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-slate-200 text-[11px] font-extrabold focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                  <option value="helpful">🔥 Most Helpful / Upvoted</option>
                  <option value="stars-high">✨ Highest Stars (Excellent)</option>
                  <option value="stars-low">⚠️ Lowest Stars (Constructive)</option>
                  <option value="newest">📅 Newest Memories</option>
                </select>
              </div>
            </div>

            {/* Display list mapping */}
            {(() => {
              const filteredAndSortedReviews = reviews
                .filter((rev) => {
                  if (reviewRatingFilter === 'all') return true;
                  if (reviewRatingFilter === '5') return rev.rating === 5;
                  if (reviewRatingFilter === '4plus') return rev.rating >= 4;
                  if (reviewRatingFilter === '3plus') return rev.rating >= 3;
                  return true;
                })
                .sort((a, b) => {
                  if (reviewSortOrder === 'helpful') {
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                  }
                  if (reviewSortOrder === 'stars-high') {
                    return b.rating - a.rating;
                  }
                  if (reviewSortOrder === 'stars-low') {
                    return a.rating - b.rating;
                  }
                  return 0; // natural default newest / array order
                });

              if (filteredAndSortedReviews.length === 0) {
                return (
                  <div className="text-center p-12 bg-slate-950/40 border border-slate-900 rounded-2xl max-w-md mx-auto">
                    <Star className="w-8 h-8 text-slate-700 animate-pulse mx-auto mb-3" />
                    <p className="font-display font-bold text-slate-450 text-sm">No matches found</p>
                    <p className="font-sans text-xs text-slate-550 mt-1">Adjust your ratings selector to find alternative Guest Book records.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
                  {filteredAndSortedReviews.map((review, idx) => {
                    const reviewId = review.id || `rev-fallback-${idx}`;
                    const isVerified = review.bookingId && (
                      review.bookingId.startsWith('VOU-MOCK') || 
                      draftVouchers.some(v => v.id === review.bookingId)
                    );
                    const isUpvoted = upvotedReviewIds.includes(reviewId);

                    return (
                      <div 
                        key={reviewId} 
                        className={`relative p-6 rounded-2xl border transition-all duration-300 shadow-md group/card flex flex-col justify-between ${
                          review.isFlagged || review.status === 'Reported'
                            ? 'bg-red-950/15 border-red-900/40 hover:border-red-800'
                            : 'bg-slate-950/80 border-slate-900/60 hover:border-slate-800'
                        }`}
                      >
                        {/* Reported Status Badge Indicator */}
                        {(review.isFlagged || review.status === 'Reported') && (
                          <div className="absolute top-4 left-4 z-10 text-[8.5px] tracking-wider font-mono font-black uppercase text-red-550 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shadow animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span>Reported</span>
                          </div>
                        )}

                        {/* Verified Badge */}
                        {isVerified && (
                          <div className="absolute top-4 right-4 z-10 text-[8.5px] tracking-wider font-mono font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Verified Booker</span>
                          </div>
                        )}

                        <div>
                          {/* Attached trip snapshot photo */}
                          {review.imageUrl ? (
                            <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden border border-slate-900 shadow group/img">
                              <img 
                                src={review.imageUrl} 
                                alt={`Memory snap by ${review.name}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90" />
                              <div className="absolute bottom-2 left-2 text-[8px] font-mono bg-slate-950/85 text-emerald-450 py-0.5 px-1.5 rounded border border-emerald-500/20 max-w-[150px] truncate">
                                📸 Memory Poster
                              </div>
                            </div>
                          ) : (
                            // Add a clean spacer to look identical height
                            <div className="h-2" />
                          )}

                          {/* Star Row */}
                          <div className="flex items-center gap-1 text-amber-550 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                            ))}
                          </div>

                          <p className="font-sans text-slate-300 text-xs md:text-sm italic leading-relaxed text-left min-h-[48px]">
                            &ldquo;{review.review}&rdquo;
                          </p>
                        </div>

                        {/* Card metadata footer row */}
                        <div className="mt-5 pt-4 border-t border-slate-900/85 flex justify-between items-center text-xs">
                          <div className="text-left">
                            <h5 className="font-display font-extrabold text-slate-200">{review.name}</h5>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {review.country}
                              {(review.isFlagged || review.status === 'Reported') && (
                                <span className="ml-1.5 inline-block text-[8px] font-mono text-red-400 font-bold bg-red-500/10 px-1 rounded border border-red-500/20 uppercase">
                                  Flagged
                                </span>
                              )}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="font-mono text-[9px] text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded leading-none">
                              {review.date}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {/* Report Button */}
                              <button
                                type="button"
                                onClick={() => handleReportReview(reviewId)}
                                className={`px-2 py-1 rounded-md text-[9.5px] font-mono font-extrabold flex items-center gap-1 border transition-all cursor-pointer select-none active:scale-95 ${
                                  review.isFlagged || review.status === 'Reported'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/40 font-black'
                                    : 'bg-slate-900 text-slate-500 hover:text-red-400 border-slate-850 hover:border-red-950/20'
                                }`}
                                title={review.isFlagged || review.status === 'Reported' ? "This testimonial is reported. Click to clear report status." : "Flag review as inappropriate"}
                              >
                                <Flag className="w-2.5 h-2.5" />
                                <span>{review.isFlagged || review.status === 'Reported' ? 'Flagged' : 'Report'}</span>
                              </button>

                              {/* Upvote Button clickability */}
                              <button
                                type="button"
                                onClick={() => handleToggleHelpfulReview(reviewId)}
                                className={`px-2 py-1 rounded-md text-[9.5px] font-mono font-extrabold flex items-center gap-1 border transition-all cursor-pointer select-none active:scale-95 ${
                                  isUpvoted
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-black'
                                    : 'bg-slate-900 text-slate-500 hover:text-slate-300 border-slate-850 hover:border-slate-800'
                                }`}
                                title={isUpvoted ? "You upvoted this memory!" : "Mark this memory as helpful"}
                              >
                                <span>👍 Helpful</span>
                                <span>{review.helpfulCount || 0}</span>
                              </button>

                              {/* Share button tool */}
                              <button
                                type="button"
                                onClick={() => handleShareReview(review)}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-amber-450 border border-slate-850 hover:border-slate-700 rounded-md text-[9.5px] font-mono font-extrabold flex items-center gap-1 transition-all cursor-pointer select-none active:scale-95"
                                title="Share travel memory & referral link"
                              >
                                <Share2 className="w-2.5 h-2.5 text-slate-500 hover:text-amber-400" />
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK BOOKING MODAL OVERLAY SHEET */}
      <AnimatePresence>
        {selectedTourForBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-2xl bg-[#0f0e0c] border border-slate-850 rounded-2xl shadow-2xl p-5 md:p-8 max-h-[92vh] overflow-y-auto custom-scrollbar"
            >
              <button
                type="button"
                onClick={() => setSelectedTourForBooking(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
                title="Dismiss booking widget"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10.5px] font-mono font-bold uppercase tracking-wider mb-3">
                  <Ticket className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                  <span>Interactive Draft Voucher Desk</span>
                </div>
                <h3 className="font-display font-black text-xl md:text-2xl text-white">
                  Locking Deal: {selectedTourForBooking.title}
                </h3>
              </div>
              
              <QuickBookingForm 
                tour={selectedTourForBooking}
                onBookingSubmitted={handleAddNewVoucher}
                onCancel={() => setSelectedTourForBooking(null)}
                selectedCurrency={selectedCurrency}
                formatPrice={formatPriceGlobal}
                promoCodes={promoCodes}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7.5. NEWSLETTER SIGNUP SECTION */}
      <section id="mas-newsletter-section" className="py-8 bg-slate-950/20 border-t border-slate-900">
        <NewsletterSignup />
      </section>

      {/* 8. FOOTER WITH FLYERS ATTRIBUTIONS & SUPPORT DETAILS */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-24 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-left">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center font-display font-black text-xs text-slate-50">
                MAS
              </div>
              <span className="font-display font-extrabold text-white text-sm">MAS AGENCY TRAVEL</span>
            </div>
            
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              Egypt Hurghada&rsquo;s boutique tour coordinator. Specializing in premier speedboats, island sandbars, diving, safaris, and Giza excursions.
            </p>
            
            <p className="text-xs text-emerald-400 font-bold font-mono">
              Phone: {DISPLAY_PHONE}
            </p>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-sans text-left">
              <li><button onClick={() => { setActiveAppTab('programs'); handleCategoryClick('island'); }} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Island Beach Sandbars</button></li>
              <li><button onClick={() => { setActiveAppTab('programs'); handleCategoryClick('safari'); }} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Super Safari Adrenaline</button></li>
              <li><button onClick={() => { setActiveAppTab('programs'); handleCategoryClick('submarine'); }} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Submarine Glass Window Programs</button></li>
              <li><button onClick={() => { setActiveAppTab('programs'); handleCategoryClick('day-trip'); }} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Luxor & Giza Egypt Landmarks</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider mb-4">
              Useful Reminders
            </h4>
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              All bookings can be made directly over our WhatsApp linkage. Standard programs last around 7 to 16 hours. Bring passports, clean beach towels, snorkeling suits, and polarized eyeglasses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h5 className="font-display font-bold text-white text-xs">Direct Support Desk</h5>
            <p className="text-[11px] text-slate-400 font-sans leading-normal">
              Need immediate help to coordinate a custom group excursion layout? Call or message the number below.
            </p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-full justify-center items-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-50 font-display font-bold text-xs rounded-lg uppercase tracking-wider transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Message Manager</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-sans">
          <p>© 2026 MAS International Agency • Travel. All tour details derived from business flyers.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-display text-slate-400 font-semibold">MAS International Agency</span>
          </p>
        </div>
      </footer>

      {/* 9. FLOATING BOTTOM SECTION CONTROLLER CAPSULE (PORT DIRECTORY) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg md:max-w-xl bg-[#1c1917]/95 backdrop-blur-xl border border-emerald-500/20 shadow-2xl rounded-full px-4 md:px-6 py-2 flex items-center justify-between transition-all duration-300">
        {[
          { tab: 'programs' as const, label: 'Programs', icon: Compass },
          { tab: 'planner' as const, label: 'Planner', icon: Sliders },
          { tab: 'vouchers' as const, label: 'Vouchers', icon: Ticket, badge: draftVouchers.length },
          { tab: 'prep' as const, label: 'Kit FAQ', icon: Info },
          { tab: 'reviews' as const, label: 'Guest Book', icon: Star }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeAppTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => {
                setActiveAppTab(item.tab);
                animateScrollToTop();
              }}
              className="group flex flex-col items-center justify-center gap-1 text-[8.5px] font-display font-sans font-bold uppercase transition-all cursor-pointer relative py-1"
              title={`Switch tab to ${item.label}`}
            >
              <div className="relative p-1.5 rounded-full transition-all">
                {isActive && (
                  <motion.div 
                    layoutId="capsuleActiveHighlight" 
                    className="absolute inset-0 bg-emerald-500/20 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 w-4 h-4 transition-colors ${isActive ? 'text-emerald-400 scale-110' : 'text-[#d4cbbd] group-hover:text-emerald-400'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[#0d0c0b] font-mono text-[8.5px] font-black flex items-center justify-center border border-[#1c1917] z-20">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[8.5px] tracking-wider leading-none transition-colors ${isActive ? 'text-emerald-400 font-black' : 'text-[#d4cbbd]/80 group-hover:text-emerald-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Sticky Support bar for WhatsApp on Mobile */}
      <div className="fixed bottom-24 right-4 md:right-8 z-40">
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 p-3 px-4.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-50 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all text-sm font-display font-black uppercase tracking-wider cursor-pointer shadow-lg"
          title="Direct Support Desk"
        >
          <MessageSquare className="w-5 h-5 fill-slate-50 stroke-[2.5]" />
          <span>Inquire: {DISPLAY_PHONE}</span>
        </a>
      </div>

      {/* MODAL FOR DETAILED TIME SCHEDULING FLYER */}
      {selectedTourForFlyer && (
        <FlyerModal 
          tour={selectedTourForFlyer}
          isOpen={selectedTourForFlyer !== null}
          onClose={() => setSelectedTourForFlyer(null)}
          onQuickBook={(t) => setSelectedTourForBooking(t)}
        />
      )}

      {/* ADMINISTRATIVE PORTAL CONTROL PANEL */}
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)}
          bookings={draftVouchers}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
          customPrices={customPrices}
          onUpdateTourPrice={handleUpdateTourPrice}
          promoCodes={promoCodes}
          onAddPromoCode={handleAddPromoCode}
          onRemovePromoCode={handleRemovePromoCode}
          currencyRatesOverride={currencyOverrides}
          onUpdateCurrencyRate={handleUpdateCurrencyRate}
          weatherCondition={weatherCondition}
          onUpdateWeatherCondition={setWeatherCondition}
          onSeedMockBookings={handleSeedMockBookings}
        />
      )}

      {/* DETAILED EXTREME WEATHER SAFETY DIRECTIVE MODAL */}
      <WeatherSafetyModal 
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        condition={weatherCondition}
      />

      {/* FEEDBACK SUBMISSION GUEST REVIEW MODAL */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitReview={handleAddNewReview}
        bookings={draftVouchers}
      />

      {/* Global Toast Notifications Stack */}
      <ToastNotification 
        toasts={toasts}
        onDismiss={handleDismissToast}
        onAction={handleToastAction}
      />

      {/* COOKIE PRIVACY SYSTEM CONSENT BANNER & MODALS */}
      {showCookieCustomizer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-100 uppercase tracking-wide">Customize Cookie Ledger</h4>
                <p className="text-[10px] text-slate-500 font-mono">GDPR COMPLIANCE SECURITY LAYER</p>
              </div>
            </div>

            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              We process minimal telemetry. Toggle your preference permissions down below. Highly recommended to leave active for correct Sandbar weather indicators.
            </p>

            <div className="space-y-3 pt-1">
              {/* Category 1: Essential */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-start gap-3">
                <input type="checkbox" checked={true} disabled={true} className="mt-1 w-4 h-4 accent-emerald-500" />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-200">Strictly Essential Vouchers Cookie</span>
                  <span className="block text-[10px] text-slate-500">Persists itinerary drafts, shopping wishlist flags, and custom vouchers securely. (Cannot be disabled)</span>
                </div>
              </div>

              {/* Category 2: Analytics */}
              <div
                onClick={() => setCookieAnalytics(p => !p)}
                className="p-3 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 rounded-xl flex items-start gap-3 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={cookieAnalytics}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-200">Device Viewports & Performance</span>
                  <span className="block text-[10px] text-slate-500">Collects anonymous screen resolution metrics to balance map canvas layouts correctly.</span>
                </div>
              </div>

              {/* Category 3: Marketing */}
              <div
                onClick={() => setCookieMarketing(p => !p)}
                className="p-3 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 rounded-xl flex items-start gap-3 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={cookieMarketing}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-200">Custom Campaign Indicators</span>
                  <span className="block text-[10px] text-slate-500">Helps track newsletter voucher code usage to adjust seasonal flash-discount sequences.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 sm:font-mono">
              <button
                type="button"
                onClick={() => handleSaveCookieConsent('customized')}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors text-center"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowCookieCustomizer(false)}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-750 text-slate-350 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {!cookieConsent && !showCookieCustomizer && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 p-5 bg-slate-950/95 backdrop-blur border border-slate-850 rounded-3xl shadow-2xl flex flex-col gap-3.5 text-left animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-950/50 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">Privacy Consent & Cookie Policy</h4>
              <p className="font-sans text-[11px] text-slate-400 leading-normal">
                MAS Excursions processes essential viewport cookie hashes and checklist coordinates to calibrate live sandbar guides and customize tour itinerary drafts.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSaveCookieConsent('accepted_all')}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-[10.5px] uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/10 text-center"
              >
                Accept All
              </button>

              <button
                type="button"
                onClick={() => handleSaveCookieConsent('essential_only')}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white font-display font-bold text-[10.5px] uppercase tracking-wide rounded-xl cursor-pointer transition-all text-center"
              >
                Essential Only
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCookieCustomizer(true)}
              className="text-center text-[10px] text-[#cd853f] hover:text-white transition-colors cursor-pointer font-mono pt-1 bg-transparent border-none focus:outline-none"
            >
              ⚙ Custom Cookie Preferences
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
