/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TourItem } from './types';

export const WHATSAPP_NUMBER = '201022124589';
export const DISPLAY_PHONE = '+201022124589';
export const ALT_WHATSAPP = '201140222241';

export const ALL_TOURS: TourItem[] = [
  {
    id: 'hula-hula-sunset',
    title: 'Hula Hula Sunset & Island Cruise',
    arabicTitle: 'برنامج هولا هولا - رحلة بحرية',
    subtitle: 'Luxury Cruise, Private Island, & Golden Sunset in Hurghada',
    category: 'island',
    duration: '7 Hours',
    location: 'Hurghada to Hula Hula Island, Red Sea',
    meetingPoint: 'Tourist Marina - Hurghada',
    rating: 4.9,
    reviewsCount: 342,
    priceEstimate: 'Premium Package',
    badge: 'Best Seller',
    description: 'Immerse yourself in a luxurious full-day marine experience featuring open sea sailing, active snorkeling stops, premium buffet lunch, and a stellar sunset return cruise with gorgeous views.',
    highlights: [
      'Luxurious 4-deck tourist boat with professional, experienced crew',
      'Exclusive full beach access with comfortable loungers',
      'Stunning golden glow sunset return cruise back to Hurghada',
      'Volleyball court usage & exciting beach vibes',
      'Dynamic foam party & lively onboard music entertainment'
    ],
    includedServices: [
      'Full Island Beach & Lounger Access',
      'Open Buffet Lunch + 1 Soft Drink',
      'Unlimited Clean Water Dispensers',
      'Snorkeling Equipment & Life Jackets',
      'Beach Volleyball & Foam Party',
      'Professional Crew & Lifeguards'
    ],
    optionalServices: [
      'Professional Photography & Video Session',
      'Fresh Creamy Ice Cream Cups',
      'Bazaar & Souvenir Shopping',
      'Delicious Extra Snacks & Candy Shop',
      'Traditional Shisha Lounge Corner'
    ],
    schedule: [
      { time: '11:15 AM', title: 'Arrival & Marina Gathering', description: 'Meet the team at the Tourist Marina Hurghada to check in.' },
      { time: '11:30 AM', title: 'Luxury Cruise Departure', description: 'Set sail into the calm, pristine waters of the Red Sea.' },
      { time: '12:30 PM', title: 'Guided SnorkelingStop', description: 'Swim among colorful coral gardens & tropical sea life.' },
      { time: '14:00 PM', title: 'Island Arrival & Beach Vibes', description: 'Step onto the gorgeous island. Indulge in full beach access.' },
      { time: '14:30 PM', title: 'Sumptuous Buffet Lunch', description: 'Enjoy our freshly prepared buffet lunch + soft drinks.' },
      { time: '15:30 PM', title: 'Volleyball & Foam Party', description: 'Fun beach activities, music, and an immersive foam party.' },
      { time: '17:00 PM', title: 'Scenic Sunset Sailing', description: 'Embark on the cruise back during the golden hour.' },
      { time: '19:00 PM', title: 'Marina Return', description: 'Safely arrive back at Hurghada with unforgettable memories.' }
    ],
    imageUrl: '/src/assets/images/hula_hula_sunset_1780510190387.png',
    imageType: 'sunset'
  },
  {
    id: 'paradise-submarine',
    title: 'Paradise Submarine & Island Program',
    arabicTitle: 'برنامج باراديس والغواصة',
    subtitle: 'Undersea Discovery & Pristine Coral Snorkeling Stops',
    category: 'submarine',
    duration: 'Approximately 7 Hours',
    location: 'Tourist Marina Hurghada & Paradise Island',
    meetingPoint: 'Tourist Marina - Hurghada',
    rating: 4.8,
    reviewsCount: 228,
    priceEstimate: 'Family Favorite',
    badge: 'Undersea Adventure',
    description: 'Perfect for families and non-swimmers! Peek through underwater viewing panels to see Hurghada’s vibrant coral reefs, combined with snorkeling, sailing, and relaxing beach lounge time.',
    highlights: [
      'Comfortable submarine-viewing vessel with secure circular viewing ports',
      'Ideal for couples, kids, and families seeking deep-sea marine encounters',
      'Combines submarine visual cruise with actual ocean snorkeling stop',
      'Lavish buffet lunch served hot on boat',
      'Private island beach entry for relaxing on soft sandy shores'
    ],
    includedServices: [
      '30-Minute Submarine Undersea Viewing Experience',
      'Beautiful Beach Entry & Lounger Access',
      'Open Buffet Lunch + Fresh Soft Drink',
      'Active snorkeling stop with full gear & guidance',
      'Foam Party on deck with fun tracks',
      'Water dispensers & Volleyball court'
    ],
    optionalServices: [
      'Professional Photography',
      'Traditional Shisha corner on island',
      'Creamy Ice cream & Candy shop',
      'Bazaar traditional souvenirs'
    ],
    schedule: [
      { time: '08:30 AM', title: 'Arrival & Gathering', description: 'Check-in at Tourist Marina Hurghada.' },
      { time: '09:00 AM', title: 'Sailing Start', description: 'Vessel departs the marina with views of Hurghada.' },
      { time: '09:30 AM', title: 'Submarine Undersea Experience', description: 'Observe unique coral formations and marine life through paned views.' },
      { time: '10:00 AM', title: 'Guided SnorkelingStop', description: 'Hop into the turquoise water for an optional snorkeling session.' },
      { time: '11:00 AM', title: 'Sailing to Paradise Island', description: 'Cruise towards the golden sandy beaches of Paradise Island.' },
      { time: '12:00 PM', title: 'Island Access & Buffet Lunch', description: 'Settle down, enjoy standard playground, and a grand lunch buffet.' },
      { time: '13:35 PM', title: 'Free Beach Time & Games', description: 'Relax, sunbathe, play volleyball, or capture gorgeous photos.' },
      { time: '15:30 PM', title: 'Sunset Cruise Back', description: 'Sailing calmly back while enjoying refreshing sea breezes.' },
      { time: '17:30 PM', title: 'Return to Hurghada', description: 'Dock at Hurghada with exceptional memories.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
    imageType: 'submarine'
  },
  {
    id: 'super-safari-desert',
    title: 'Super Safari Adrenaline Adventure',
    arabicTitle: 'رحلة سوبر سفاري الصحراء',
    subtitle: 'Buggy Riding, Spider Car Trial, Bedouin Dinner, & Camel Trekking',
    category: 'safari',
    duration: '7 Hours (12:00 PM - 07:00 PM)',
    location: 'Eastern Desert, Hurghada',
    meetingPoint: 'Complimentary Hurghada Hotel Transfer',
    rating: 4.9,
    reviewsCount: 410,
    priceEstimate: 'All-Inclusive Adventure',
    badge: 'Popular',
    description: 'Venture into the heart of the Egyptian Eastern Desert. Drive powerful beach buggies, test an agile spider car, ride a camel, visit a Bedouin village, and enjoy an evening oriental dance show with barbecue dinner.',
    highlights: [
      '40 Minutes of exciting beach buggy desert riding',
      '15 Minutes of rapid adrenaline Spider Car trial course',
      '50 km round-trip Jeep Safari deep into Bedouin mountain territory',
      'Visit authentic Bedouin village to taste traditional Bedouin bread & tea',
      'Charming evening desert camp party with oriental belly dance & fire performance'
    ],
    includedServices: [
      'Convenient high-comfort hotel pickup/dropoff in Hurghada',
      '40-Min Quad Beach Buggy excursion',
      '15-Min Spider Car dune driving',
      'Bedouin Village Guided Tour with local guide',
      'Scenic Camel Riding experience',
      'Bedouin Tea & Delicious Barbecue Buffet Dinner',
      '1 Bottled Mineral Water'
    ],
    optionalServices: [
      'Professional photography album/video',
      'Traditional Shisha sessions at Bedouin tent',
      'Extra soft juices and grocery items'
    ],
    schedule: [
      { time: '12:00 PM', title: 'Hotel Pickup & Transfer', description: 'Our air-conditioned transport picks you up from your hotel.' },
      { time: '12:45 PM', title: 'Beach Buggy Briefing & Ride', description: 'Put on your keffiyeh and drive for a thrilling 40 minutes across dunes.' },
      { time: '13:30 PM', title: 'Spider Car Trial', description: 'Harness into the spider-carts for a 15-minute high speed adrenaline track.' },
      { time: '14:00 PM', title: 'Mountain Jeep Safari', description: 'Ride in our 4x4 Jeep 50km into the stunning red desert mountains.' },
      { time: '15:00 PM', title: 'Traditional Bedouin Village Arrival', description: 'Meet local Bedouin families, take photos, and experience their lifestyle.' },
      { time: '15:30 PM', title: 'Camel Back Riding', description: 'Take a serene ride on top of Bedouin camels across flat golden sands.' },
      { time: '16:00 PM', title: 'Tent Visit & Traditional Tea', description: 'Taste aromatic desert tea cooked on burning embers.' },
      { time: '17:35 PM', title: 'Barbecue Dinner & Evening Show', description: 'A gorgeous oriental dance, tanoura show, and live fire gymnastics.' },
      { time: '19:00 PM', title: 'Transfer back to Hotel', description: 'Embark on the quiet night drive back to Hurghada.' }
    ],
    imageUrl: '/src/assets/images/super_safari_1780510206707.png',
    imageType: 'safari'
  },
  {
    id: 'star-safari-science',
    title: 'Star Safari & High-Tech Telescope Night',
    arabicTitle: 'رحلة السفاري ورصد النجوم',
    subtitle: 'Dune Buggy, Mountain Cave Sunset, Astronomy Guide & Stargazing',
    category: 'safari',
    duration: '10 Hours (12:00 PM - 10:00 PM)',
    location: 'Deep Hurghada Mountains Night Camp',
    meetingPoint: 'Hotel Pickup & Return Included',
    rating: 4.8,
    reviewsCount: 154,
    priceEstimate: 'Educational & Fun',
    badge: 'Highly Rated',
    description: 'Perfect for couples and nature lovers! Escape light pollution and head into the deep mountain valleys. Watch the sunset from a hidden cave, enjoy traditional Bedouin dinner, then observe spectacular planets and nebulae through high-powered telescopes.',
    highlights: [
      'Stunning sunset viewing and photography from a panoramic mountain cave',
      'Astronomical session led by an English-speaking stargazing expert',
      'Observation of Saturn rings, Jupiter stripes, and deep-space star clusters',
      'Delicious authentic Bedouin dinner composed of chicken, kofta, basmati rice',
      'Visit the mystic Acacia tree with a lesson about desert flora'
    ],
    includedServices: [
      'Round-trip A/C transfer from Hurghada hotels',
      'Desert riding session and sunset trekking',
      'Professional Astronomy presentation with lasers',
      'High-resolution Telescope stargazing access',
      'Rich Bedouin Dinner (quarter chicken, tasty kofta, basmati rice, seasonal fruits)',
      'Water, Cola, Bedouin Hot Tea'
    ],
    optionalServices: [
      'Sleek professional photography',
      'Souvenir bazaar purchases',
      'Alternative beverage menus'
    ],
    schedule: [
      { time: '12:00 PM', title: 'Hotel Pickup', description: 'Ride comfortably to our premium stargazing desert station.' },
      { time: '13:00 PM', title: 'Star Safari Start', description: 'Dune trekking, exploration of local geological features.' },
      { time: '14:30 PM', title: 'The Ancient Acacia Tree Rest', description: 'Learn survival skills and examine the sacred Acacia tree.' },
      { time: '17:00 PM', title: 'Mountain Cave Sunset Peak', description: 'Watch the skies light up in gold over the ancient valley.' },
      { time: '18:30 PM', title: 'Bedouin BBQ Dinner Feast', description: 'Sit down on traditional carpets for a lavish hot meal buffet.' },
      { time: '20:00 PM', title: 'High-Tech Telescope Session', description: 'Look through premium optical lenses at constellations, planets, and moons.' },
      { time: '22:00 PM', title: 'Safe Return Transfer', description: 'We transport you directly back to your hotel lobby.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80',
    imageType: 'star-safari'
  },
  {
    id: 'orange-island-full-day',
    title: 'Orange Island Marine Paradise',
    arabicTitle: 'برنامج جزيرة أورانج باي',
    subtitle: 'Warm Turquoise Shallow Water Sandbar, Snorkeling, & Fresh Seafood',
    category: 'island',
    duration: '7 Hours (08:30 AM - 16:30 PM)',
    location: 'Orange Bay sandbar, Giftun Island',
    meetingPoint: 'Tourist Marina - Hurghada',
    rating: 4.9,
    reviewsCount: 504,
    priceEstimate: 'Luxury Vibe',
    badge: 'Instagram Hotspot',
    description: 'Voted Hurghada’s best island bay experience! Relax on custom overwater swings, walk through shallow warm lagoon sandbars, snorkeling in two major reefs, and enjoy an extensive buffet onboard.',
    highlights: [
      'Scenic overwater wooden swings and premium sun hammocks perfect for photos',
      'Extremely shallow, warm, crystal clear turquoise sandbar safe for children',
      'Two major coral reef snorkeling stops with rich variety of marine life',
      'Gourmet lunch served onboard with soft drinks & bottled water'
    ],
    includedServices: [
      'Full Orange Bay Beach & sandbar access',
      'A/C luxury yacht transport with sundeck lounge',
      '2 Snorkeling Stops with professional guides',
      'Gourmet Open Buffet Lunch + Soft Drinks',
      'All snorkeling gear, towels and fins'
    ],
    optionalServices: [
      'Scuba Diving introduction with professional instructor (extra charge 600 LE)',
      'Professional drone photography session',
      'Luxury fresh juice and cocktail bar on island'
    ],
    schedule: [
      { time: '08:30 AM', title: 'Arrival & Boarding', description: 'Gather at Tourist Marina Hurghada to step onto the yacht.' },
      { time: '09:00 AM', title: 'Sailing Departure', description: 'Our beautiful yacht cruises towards Giftun Island reefs.' },
      { time: '10:00 AM', title: 'Coral Reef Stop (Diving/Snorkeling)', description: 'Option to dive (extra 600 LE) or snorkel among majestic marine life.' },
      { time: '11:00 AM', title: 'Second Snorkeling Stop', description: 'Explore a completely different reef with higher parrotfish abundance.' },
      { time: '11:30 AM', title: 'Snorkeling Stop No.2 Ends', description: 'Return to boat to dry off.' },
      { time: '13:30 PM', title: 'Delicious Yacht Lunch Buffet', description: 'Fresh seafood, dynamic pasta, salads, chicken, and soft beverages.' },
      { time: '14:00 PM', title: 'Orange Bay Sandbox Arrival', description: 'Spend relaxed hours swimming, walking, and snapping incredible portraits.' },
      { time: '16:30 PM', title: 'Sunset Harbor Return', description: 'Cruise back into the Hurghada Marina safely.' }
    ],
    imageUrl: '/src/assets/images/orange_island_1780510222587.png',
    imageType: 'orange-island'
  },
  {
    id: 'discover-luxor-day',
    title: 'Discover Luxor: A Day of History & Grandeur',
    arabicTitle: 'رحلة الأقصر التاريخية من الغردقة',
    subtitle: 'Karnak, Valley of the Kings, Hatshepsut Temple, & Nile Cruise',
    category: 'day-trip',
    duration: '16 Hours (05:00 AM - 21:00 PM)',
    location: 'Luxor (Thebes), Egypt',
    meetingPoint: 'Direct Hurghada Hotel Transfer Included',
    rating: 4.9,
    reviewsCount: 290,
    priceEstimate: 'World Heritage Iconic',
    badge: 'Once in a Lifetime',
    description: 'Travel from Hurghada over the scenic Red Sea hills to Nile valley. Walk through the giant pillars of Karnak Temple, enter mysterious tombs at the Valley of the Kings, view Hatshepsut’s architectural marvel, and cruise on the majestic Nile river.',
    highlights: [
      'Expert licensed Egyptologist guide explaining ancient scripts',
      'Access to three royal tombs inside the legendary Valley of the Kings',
      'Behold the Colossi of Memnon: giant limestone guards of the pharaohs',
      'Optional traditional Egyptian sailboats (Felucca) ride on the Nile'
    ],
    includedServices: [
      'High-quality Round-Trip A/C Bus / Van Transfers',
      'All Entry Tickets to Karnak, Valley of the Kings & Hatshepsut Temple',
      'Licensed Bilingual Egyptologist Tour Guide',
      'Excellent lunch buffet at Nile-view restaurant'
    ],
    optionalServices: [
      'Scenic Nile Boat felucca ride (Extra local charge)',
      'Professional photography packages near Tutankhamun area',
      'Purchase of authentic stone crafts at local Alabaster guild factory'
    ],
    schedule: [
      { time: '05:00 AM', title: 'Scenic Departure from Hurghada', description: 'Board comfortable A/C bus. Sleep or enjoy morning sunrise view.' },
      { time: '09:30 AM', title: 'Arrival & Karnak Temple Exploration', description: 'Walk through the grand Hypostyle Hall’s giant papyrus-shaped pillars.' },
      { time: '11:30 AM', title: 'Scenic Nile Felucca sailboat ride', description: 'Optional soothing boat cruise across the Nile (extra local charge).' },
      { time: '12:30 PM', title: 'Valley of the Kings Guided Tour', description: 'Walk deep inside burial structures carved with vivid pigments.' },
      { time: '14:00 PM', title: 'Egyptian Buffet Lunch', description: 'Restore energy with delicious authentic Egyptian foods at Nile waterfront.' },
      { time: '15:00 PM', title: 'Temple of Queen Hatshepsut Tour', description: 'Marvel at her three-tired terraces fitting naturally into towering cliffs.' },
      { time: '16:30 PM', title: 'The Iconic Colossi of Memnon Stop', description: 'Brief photo stop next to the 18-meter-tall giant twin statues.' },
      { time: '17:00 PM', title: 'High-comfort Return Drive', description: 'Relax in your secure transport back to Hurghada.' },
      { time: '21:00 PM', title: 'Hotel Arrival', description: 'Arrive right at your hotel lobby with unforgettable ancient memories.' }
    ],
    imageUrl: '/src/assets/images/luxor_temple_1780510256705.png',
    imageType: 'luxor'
  },
  {
    id: 'discover-cairo-pyramids',
    title: 'Discover Cairo & Great Pyramids Tour',
    arabicTitle: 'رحلة القاهرة والأهرامات من الغردقة',
    subtitle: 'The Great Giza Pyramids, Egyptian Museum, & The Cryptic Sphinx',
    category: 'day-trip',
    duration: '18 Hours (02:00 AM - 20:00 PM)',
    location: 'Giza Plateau, Cairo, Egypt',
    meetingPoint: 'Complimentary Round-Trip Hotel Transfer',
    rating: 4.8,
    reviewsCount: 310,
    priceEstimate: 'Bucket List Goal',
    badge: 'Highly Requested',
    description: 'Travel from Hurghada to the capital of Egypt. Stand beneath the Great Pyramid of Giza (Khufu) – the only remaining wonder of the ancient world. See the enigmatic Sphinx, capture magnificent panoramic photos, and explore treasures of the pharaohs at the Museum.',
    highlights: [
      'Staggering view of the legendary Pyramids of Khufu, Khafre, and Menkaure',
      'Face-to-face encounter with the Sphinx',
      'Comprehensive guided tour inside the world-famous Egyptian Museum',
      'Premium shopping opportunities for Papyrus paper, Oils, and Spices'
    ],
    includedServices: [
      'Full Round-trip transfers from Hurghada in secure A/C vehicles',
      'Official Entry Tickets to Giza Pyramids Plateau Area',
      'Official Entrance Tickets to the Egyptian Museum',
      'Skilled bilingual Egyptologist Guide',
      'Hot Buffet Lunch at local restaurant'
    ],
    optionalServices: [
      'Entry ticket to go inside the Great Pyramid chambers',
      'Memorable camel ride across the Giza sandy panorama',
      'Nile Felucca traditional boat cruise font-sans'
    ],
    schedule: [
      { time: '02:00 AM', title: 'Early Morning Departure', description: 'Pickup from hotel for an comfortable A/C ride.' },
      { time: '08:30 AM', title: 'The Egyptian Museum Discovery', description: 'Discover golden artifacts, coins, and legendary sarcophagi.' },
      { time: '11:30 AM', title: 'Grand Pyramids of Giza Visit', description: 'Behold the incredible blocks erected thousands of years ago.' },
      { time: '13:30 PM', title: 'Hot Buffet Lunch Stop', description: 'Relax, dine, and hydrate with traditional cuisines.' },
      { time: '14:30 PM', title: 'Touring the Mighty Sphinx', description: 'View the grand lion-bodied sculpture and learn the riddle.' },
      { time: '16:00 PM', title: 'Papyrus & Perfume Bazaars', description: 'Option to shop authentic oils, handcrafted papyrus drawings, and souvenir artifacts.' },
      { time: '17:30 PM', title: 'Departure back to Hurghada', description: 'Relaxing night transits back through the beautiful Red Sea shoreline.' },
      { time: '21:30 PM', title: 'Hotel Return', description: 'Safely walk back to your room after an elite Egyptian expedition.' }
    ],
    imageUrl: '/src/assets/images/cairo_pyramids_1780510238390.png',
    imageType: 'cairo'
  },
  {
    id: 'speed-boat- dolphins',
    title: '4-Hour Elite Speedboat Programs',
    arabicTitle: 'برنامج اليخت السريع و قارب السرعة',
    subtitle: 'Adrenaline Speeds, Dolphin Watching, Snorkeling Stop, & Free Massage',
    category: 'marine',
    duration: '4 Hours (Flexible morning or sunset slot)',
    location: 'Hurghada Shoreline & Dolphin Bay',
    meetingPoint: 'Tourist Marina - Hurghada',
    rating: 4.9,
    reviewsCount: 198,
    priceEstimate: 'Flexible & Fast',
    badge: 'High Action',
    description: 'Zip across the Red Sea in an ultra-fast speedboat! Get close to wild bottlenose dolphins, snorkel in preserved marine sanctuaries, explore a private island sandbar, and relax with a free 5-minute massage.',
    highlights: [
      'Fast-paced speed navigation across pristine waves with professional captain',
      'Dolphin Program: High rate of encounters and snorkels close to friendly dolphin pods',
      'Island Morning & Sunset Variants: Perfect and quick 4-hour escapes fitting any busy plan',
      'Complimentary 5-Minute relaxing massage session on the boat'
    ],
    includedServices: [
      'Ultra-Fast comfortable speedboat ride with shade roof',
      'Dolphin watching & coral snorkeling spot safety crew',
      'Full private beach access with lounger',
      'Bottled water, soft sodas & fruits',
      'Free 5-minute express muscle relaxation massage'
    ],
    optionalServices: [
      'Drone action video recording',
      'Custom luxury fresh fruit platters',
      'Private hotel transfers'
    ],
    schedule: [
      { time: '07:00 AM', title: 'Hotel Pickup', description: 'Transport directly to tourist marina.' },
      { time: '08:00 AM', title: 'Marina Departure', description: 'Captain safety briefing. Board high-powered twin-engine speed craft.' },
      { time: '08:30 AM', title: 'Active Dolphin Spotting', description: 'Navigate deep water bays where resident dolphin families feed and play.' },
      { time: '10:00 AM', title: 'Snorkeling Stop No. 1', description: 'Immerse into coral canyons rich with colorful anemones.' },
      { time: '11:00 AM', title: 'Island Sandbar Stop', description: 'Step off the boat into crystalline white sandbars.' },
      { time: '12:00 PM', title: 'Adrenaline High Return', description: 'Thrill ride back to Hurghada harbor.' },
      { time: '12:30 PM', title: 'Arrival back to Marina', description: 'Conclude your 4-hour action-filled adventure.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    imageType: 'speedboat'
  },
  {
    id: 'horse-riding-beach-desert',
    title: 'Scenic Beach & Desert Horse Riding Tour',
    arabicTitle: 'جولة ركوب الخيل في الصحراء والبحر',
    subtitle: 'Ride Along the Red Sea shoreline and across Golden desert dunes',
    category: 'special',
    duration: '2 Hours (Includes Hotel Transfers)',
    location: 'Private Stable & Hurghada Coastline',
    meetingPoint: 'Hotel Pickup & Drop-Off Included',
    rating: 4.9,
    reviewsCount: 167,
    priceEstimate: 'Unique Experience',
    badge: 'Insta Famous',
    description: 'Perfect for couples and animal lovers! Connect with beautiful, well-trained Arabian horses. Ride for 1 hour along soft sandy waves of the Red Sea coast, and spend another hour galloping across golden desert dunes.',
    highlights: [
      '1 Hour elegant seaside riding with ocean views',
      '1 Hour golden sand desert dune gallops with mountain backdrops',
      'Well-trained gentle horses matched beautifully to your exact experience level',
      'Professional friendly equestrian guide taking beautiful photos for you'
    ],
    includedServices: [
      'Round-trip comfortable hotel transfers',
      'Beautiful gentle horse matched to your level',
      'Complete safety helmet and modern equipment',
      'Professional guides & brief riding class for beginners',
      'Bottled mineral water'
    ],
    optionalServices: [
      'Special sunset timing photos',
      'Gourmet snacks back at stable'
    ],
    schedule: [
      { time: '08:00 AM', title: 'Hotel Pickup & Transport', description: 'Get picked up from your resort lobby.' },
      { time: '08:30 AM', title: 'Equestrian Stable Welcome', description: 'Safety briefing, matching of boots and helmet, and horse introduction.' },
      { time: '09:00 AM', title: 'Ride Hour 1: The Pristine Red Sea Coast', description: 'Feel the sea splash as your horse walks gently along the beach.' },
      { time: '10:00 AM', title: 'Ride Hour 2: Golden Desert Dunes', description: 'Ride across open desert sands with breathtaking Red Sea mountain silhouettes.' },
      { time: '11:00 AM', title: 'Water Refreshments & Goodbye', description: 'Dismount, feed apples to the horses, and view photos.' },
      { time: '11:30 AM', title: 'Hotel Dropoff', description: 'Ride back in A/C comfortable comfort' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598974357801-cb814d6840fc?auto=format&fit=crop&w=800&q=80',
    imageType: 'horse-riding'
  },
  {
    id: 'luxury-daily-cruise',
    title: 'Adventour Luxury Daily Cruise',
    arabicTitle: 'رحلة اليخت الفاخر أدڤنتور',
    subtitle: '4 Decks Yacht, Indoor A/C Salons, Pool Party, & Semi Submarine',
    category: 'special',
    duration: '7 Hours (11:00 AM - 18:00 PM)',
    location: 'Hurghada Tourist Marina & Magawish Island',
    meetingPoint: 'Tourist Marina - Hurghada',
    rating: 5.0,
    reviewsCount: 189,
    priceEstimate: 'VVIP Experience',
    badge: 'VVIP Top Cruise',
    description: 'Experience pure luxury! Board the giant "Adventour" 4-decks state-of-the-art motor yacht. Includes a swimming pool onboard, fully air-conditioned levels, high-class restaurant buffet, snorkeling stops, a semi-submarine underwater window stop, and dynamic pool parties.',
    highlights: [
      'Vast 4-Decks premium mega yacht with fully air-conditioned restaurant & rooms',
      'Swimming pool on the top deck with sunbeds & high-end musical sound system',
      'Underwater viewing window (Semi-submarine experience) onboard the boat',
      'Fabulous fresh seafood buffet with customized soft and dry drinks included',
      'Full stop and beach relaxation at the exclusive Magawish Island'
    ],
    includedServices: [
      'Yacht Access to all 4 decks containing open and closed sections',
      'Pool party access & live DJ performance',
      'Red Sea reef snorkeling stop with guide & luxury gear',
      'Fabulous lunch buffet (Seafood, chicken, grilled foods, custom salads)',
      'High-end indoor A/C lounges',
      'Unlimited warm and cold beverages served to your table'
    ],
    optionalServices: [
      'Professional photographer drone video service',
      'Traditional Shisha corner in sunset lounge',
      'Souvenir bazaar onboard'
    ],
    schedule: [
      { time: '10:30 AM', title: 'Check-in at Marina', description: 'Register at Hurghada Tourist Marina.' },
      { time: '11:00 AM', title: 'Yacht Sailing Start & DJ Beats', description: 'Depart as the DJ starts playing high quality chill music.' },
      { time: '11:45 AM', title: 'Semi Submarine View Stop', description: 'Descend to lower deck circular glass viewports to see corals.' },
      { time: '12:30 PM', title: 'Ocean Snorkeling Stop', description: 'Swim comfortably with guides in deeply rich coral formations.' },
      { time: '13:45 PM', title: 'Gourmet Seafood Resturant Lunch', description: 'Dine in our custom cooler A/C dining hall with elite chef service.' },
      { time: '14:45 PM', title: 'Magawish Island Sandbar Stop', description: 'Disembark onto the pristine sandy beach for 2 full hours.' },
      { time: '16:45 PM', title: 'Sky Pool Party & Sunset sailing', description: 'Dance by the rooftop pool while sailing back under gold skies.' },
      { time: '18:00 PM', title: 'Harbor Docking', description: 'Conclude the ultimate luxury Red Sea trip.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
    imageType: 'cruise'
  }
];

export const DESERT_SAFARI_TAGS = ['Quad Buggy', 'Jeep Safari', 'Bedouin Tent', 'Sunset Cave', 'Astronomy', 'Camel Ride'];
export const ISLAND_TAGS = ['Orange Bay', 'Paradise Island', 'Magawish Island', 'Hula Hula Sandbar', 'Giftun Island'];
export const HISTORICAL_TAGS = ['Karnak Egypt', 'Valley of Kings', 'Great Pyramids Giza', 'The Great Sphinx', 'Egyptian Museum'];

export const CLIENT_REVIEWS = [
  {
    name: 'Sarah Jenkins',
    country: 'United Kingdom 🇬🇧',
    review: 'The Hula Hula Sunset program was hands down the absolute highlight of our Egypt vacation. The boat is massive, clean, and the beach sandbox was straight out of a painting. Highly recommend MAS Agency!',
    rating: 5,
    date: 'May 2026'
  },
  {
    name: 'Ahmed Al-Mansoori',
    country: 'UAE 🇦🇪',
    review: 'Super Safari on the Buggy was extremely adventurous. The Bedouin tea had phenomenal flavor and the stargazing telescopes showed us craters on Venus and mountains of Moon very clearly. Will book again next winter!',
    rating: 5,
    date: 'April 2026'
  },
  {
    name: 'Elena Rostova',
    country: 'Poland 🇵🇱',
    review: 'Booked the Paradise Submarine for my parents who do not swim. They loved the coral window views. The open buffet felt like a five-star hotel. Great organization via quick WhatsApp support.',
    rating: 5,
    date: 'June 2026'
  }
];

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP ', rate: 47.50 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.50 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 90.00 }
];

export interface CostRates {
  adult: number;
  child: number;
}

export const TOUR_PRICES: Record<string, CostRates> = {
  'hula-hula-sunset': { adult: 35, child: 20 },
  'paradise-submarine': { adult: 45, child: 25 },
  'super-safari-desert': { adult: 30, child: 15 },
  'star-safari-science': { adult: 35, child: 20 },
  'orange-island-full-day': { adult: 40, child: 20 },
  'discover-luxor-day': { adult: 75, child: 40 },
  'discover-cairo-pyramids': { adult: 85, child: 45 },
  'speed-boat- dolphins': { adult: 90, child: 45 },
  'speed-boat--dolphins': { adult: 90, child: 45 },
  'horse-riding-beach-desert': { adult: 30, child: 20 },
  'luxury-daily-cruise': { adult: 65, child: 35 },
};

export const getTourPrice = (tourId: string, adults: number, children: number) => {
  const cleanId = tourId.trim();
  const prices = TOUR_PRICES[cleanId] || { adult: 40, child: 20 };
  const basePrice = (adults * prices.adult) + (children * prices.child);
  if (adults + children >= 5) {
    return basePrice * 0.9; // 10% auto group discount for 5 or more participants
  }
  return basePrice;
};

