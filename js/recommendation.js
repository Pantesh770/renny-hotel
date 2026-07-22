const RECOMMENDATION_WEIGHTS = {
  location: 0.40,
  budget: 0.30,
  amenities: 0.20,
  rating: 0.10
};

var CURRENCY = 'TSh';
var USD_TO_TSH = 2650;

let HOTELS = [
  {
    id: 1, name: 'Riu Palace Zanzibar - All Inclusive', city: 'Nungwi, Zanzibar',
    description: 'A 5-star adults-only all-inclusive beachfront resort with multiple pools, swim-up bar, and direct access to Nungwi\'s pristine white sands.',
    price: 950000, stars: 5, rating: 4.6,
    address: 'Nungwi Beach, Zanzibar, Tanzania', contact: '+255 777 111 222',
    image: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Hero/hero-slide-hotel-riu-palace-zanzibar.jpg',
    image2: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Piscinas/pool-hotel-riu-palace-zanzibar-5.jpg',
    image3: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Hotel/hotel-riu-palace-zanzibar-3-(1%29.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Beach Access', 'Water Sports', 'All Inclusive']
  },
  {
    id: 2, name: 'Baraza Resort & Spa Zanzibar', city: 'Bwejuu, Zanzibar',
    description: 'An ultra-luxury all-inclusive boutique resort blending Swahili, Arabic and Indian architecture with private villas and world-class spa facilities.',
    price: 1500000, stars: 5, rating: 4.7,
    address: 'Bwejuu Beach, Zanzibar, Tanzania', contact: '+255 777 222 333',
    image: 'https://cdn.audleytravel.com/1050/750/79/535219-pool-baraza-zanzibar-island.jpg',
    image2: 'https://cdn.audleytravel.com/1050/749/79/439435-baraza-zanzibar-island.jpg',
    image3: 'https://cdn.audleytravel.com/1050/751/79/439436-bwejuu-beach-baraza-zanzibar-island.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'Water Sports', 'Room Service', 'All Inclusive']
  },
  {
    id: 3, name: 'Park Hyatt Zanzibar', city: 'Stone Town, Zanzibar',
    description: 'A luxury waterfront hotel in a historic Stone Town building featuring Arabesque architecture, an infinity pool, and panoramic Indian Ocean views.',
    price: 1150000, stars: 5, rating: 4.5,
    address: 'Shangani Street, Stone Town, Zanzibar', contact: '+255 777 333 444',
    image: 'https://thriftytraveler.com/wp-content/uploads/2022/11/PHZ-exterior-from-water-1-scaled-e1671639938269.jpeg',
    image2: 'https://milestomemories.com/wp-content/uploads/2021/01/park-hyatt-zanzibar-pool.jpg',
    image3: 'https://milestomemories.com/wp-content/uploads/2021/01/park-hyatt-zanzibar-seating-near-pool.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Free WiFi', 'Concierge']
  },
  {
    id: 4, name: 'Bluebay Beach Resort & Spa', city: 'Kiwengwa, Zanzibar',
    description: 'A 5-star resort set on a white sandy beach with 116 rooms, lush tropical gardens, and a full-service spa overlooking the Indian Ocean.',
    price: 700000, stars: 5, rating: 4.4,
    address: 'Kiwengwa, North Coast, Zanzibar', contact: '+255 777 444 555',
    image: 'https://e8t95d9vg4g.exactdn.com/wp-content/uploads/2023/12/feature-6.jpg',
    image2: 'https://e8t95d9vg4g.exactdn.com/wp-content/uploads/2023/12/gal-2.jpg',
    image3: 'https://e8t95d9vg4g.exactdn.com/wp-content/uploads/2023/12/gal5-2.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach Access', 'Water Sports', 'Kids Club']
  },
  {
    id: 5, name: 'Four Seasons Safari Lodge Serengeti', city: 'Central Serengeti',
    description: 'A world-class safari lodge perched on elevated platforms overlooking a wildlife watering hole with infinity pools and panoramic savannah views.',
    price: 3200000, stars: 5, rating: 4.8,
    address: 'Central Serengeti, Serengeti National Park', contact: '+255 768 981 981',
    image: 'https://cdn.sanity.io/images/s82b6z49/production/367c77ed0705cd2aebb91858ba65995a6f7b00a2-930x523.webp',
    image2: 'https://cdn.sanity.io/images/s82b6z49/production/174dbdd8ece94618f28a2cb940dfd357720c411c-930x491.webp',
    image3: 'https://cdn.sanity.io/images/s82b6z49/production/ce765d017512f4d1f3d8ec516b8ebbafa57c943f-930x523.webp',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Free WiFi', 'Parking', 'Game Drives']
  },
  {
    id: 6, name: 'Singita Sasakwa Lodge', city: 'Grumeti, Serengeti',
    description: 'A magnificent Edwardian-style manor with ten private cottages offering sweeping views of the endless Serengeti plains and unmatched old-world luxury.',
    price: 6800000, stars: 5, rating: 4.9,
    address: 'Grumeti Game Reserve, Serengeti, Tanzania', contact: '+255 768 982 982',
    image: 'https://cdn.sanity.io/images/s82b6z49/production/b6b4af21f67be236e2bd370f95f43632d4be4e76-1801x1200.webp',
    image2: 'https://cdn.sanity.io/images/s82b6z49/production/669d77b38a39b9883731b59b09c0e84ee2ffc9d2-1800x1200.webp',
    image3: 'https://cdn.sanity.io/images/s82b6z49/production/9d569a5a41cb3801e0604188745c49c731ab4826-1799x1200.webp',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Free WiFi', 'Game Drives', 'Concierge']
  },
  {
    id: 7, name: 'The Maridadi Hotel', city: 'Moshi',
    description: 'A luxury boutique hotel at the foothills of Mount Kilimanjaro with peaceful gardens, mountain views, and easy access to trekking routes.',
    price: 400000, stars: 4, rating: 4.2,
    address: 'Kibosho Road, Moshi, Kilimanjaro, Tanzania', contact: '+255 675 111 222',
    image: 'https://www.tranquilkilimanjaro.com/wp-content/uploads/2025/11/maridadi1.webp',
    image2: 'https://www.tranquilkilimanjaro.com/wp-content/uploads/2025/11/maridadi3.webp',
    image3: 'https://www.tranquilkilimanjaro.com/wp-content/uploads/2025/11/the-maridadi-hotel.webp',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Airport Shuttle']
  },
  {
    id: 8, name: 'Malaika Beach Resort', city: 'Mwanza',
    description: 'A premier lakeside resort on Lake Victoria with a bohemian Afro-Dutch style infinity pool, stunning sunsets, and gourmet dining.',
    price: 400000, stars: 4, rating: 4.3,
    address: 'Capri Point, Mwanza, Tanzania', contact: '+255 763 111 111',
    image: 'https://beachresort.net/data/Photos/1200x675/17258/1725852/1725852458/Malaika-Beach-Resort-Mwanza-Exterior.JPEG',
    image2: 'https://beachresort.net/data/Photos/1200x675/17258/1725852/1725852806/Malaika-Beach-Resort-Mwanza-Beach.JPEG',
    image3: 'https://beachresort.net/data/Photos/1200x675/10225/1022557/1022557012/Malaika-Beach-Resort-Mwanza-Swimming-Pool.JPEG',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Water Sports']
  },
  {
    id: 9, name: 'Arusha Serena Hotel', city: 'Arusha',
    description: 'A colonial-era coffee farm turned lakeside retreat on the slopes of Mount Meru beside Lake Duluti, offering serene gardens and stone cottages.',
    price: 530000, stars: 4, rating: 4.4,
    address: 'Lake Duluti, Tengeru Road, Arusha, Tanzania', contact: '+255 787 222 222',
    image: 'https://kalamasafaris.com/wp-content/uploads/2023/02/lakedulutiserena-296.jpg',
    image2: 'https://kalamasafaris.com/wp-content/uploads/2023/02/arusha-serena-hotel-resort.jpg',
    image3: 'https://kalamasafaris.com/wp-content/uploads/2023/02/41451981.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Parking']
  },
  {
    id: 10, name: 'Pole Pole Bungalows', city: 'Mafia Island',
    description: 'An eco-luxury resort in the Chole Bay, offering a low-impact, high-comfort experience in the heart of the Mafia Island Marine Park.',
    price: 1200000, stars: 4, rating: 4.8,
    address: 'Utende, Mafia Island, Tanzania', contact: '+255 784 123 456',
    image: 'https://tanzania-experts.com/wp-content/uploads/pole_pole_lodge1.jpg',
    image2: 'https://tanzania-experts.com/wp-content/uploads/pole_pole_lodge3.jpg',
    image3: 'https://tanzania-experts.com/wp-content/uploads/pole_pole_lodge2.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Spa', 'Beach Access', 'Water Sports']
  },
  {
    id: 11, name: 'Kigoma Hilltop Hotel', city: 'Kigoma',
    description: 'Perched on a hill overlooking Lake Tanganyika, this hotel offers spectacular sunset views and easy access to Gombe Stream National Park.',
    price: 480000, stars: 4, rating: 4.2,
    address: 'Hilltop Road, Kigoma, Tanzania', contact: '+255 28 244 0444',
    image: 'https://b-cdn.springnest.com/media/img/lo/kigomaview6.jpg',
    image2: 'https://b-cdn.springnest.com/media/img/lo/kigomapool5.jpg',
    image3: 'https://b-cdn.springnest.com/media/img/lo/kigomadining_1.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Gym', 'Lake View']
  },
  {
    id: 12, name: 'Ruaha River Lodge', city: 'Ruaha National Park',
    description: 'The oldest lodge in Ruaha, built along the river banks where elephants and hippos are frequent visitors right outside your stone banda.',
    price: 930000, stars: 4, rating: 4.5,
    address: 'Ruaha National Park, Iringa, Tanzania', contact: '+255 22 212 8485',
    image: 'https://b-cdn.springnest.com/media/img/wu/ruaha_foxes_caseypratt_loveafrica-4880e860fdb.jpg?width=1600',
    image2: 'https://b-cdn.springnest.com/media/img/wu/ruaha_foxes_caseypratt_loveafrica-4725ef2b4b0.jpg?width=1600',
    image3: 'https://b-cdn.springnest.com/media/img/wu/copy_of_ruaha_foxes_caseypratt_loveafrica-4371d1e7abd.jpg?width=1600',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Game Drives', 'Parking', 'Solar Power']
  },
  {
    id: 13, name: 'Utengule Coffee Lodge', city: 'Mbeya',
    description: 'A luxury lodge set on a working coffee plantation on the slopes of the Mbeya Range, offering a unique "farm to cup" experience and mountain views.',
    price: 370000, stars: 4, rating: 4.4,
    address: 'Utengule, Mbeya, Tanzania', contact: '+255 25 250 0001',
    image: 'https://www.exploretanzania.nl/wp-content/uploads/2022/02/utengule-coffee-lodge-mbeya-1920x1280-6.jpg',
    image2: 'https://www.exploretanzania.nl/wp-content/uploads/2022/02/utengule-coffee-lodge-mbeya-1920x1280-3.jpg',
    image3: 'https://www.exploretanzania.nl/wp-content/uploads/2022/02/utengule-coffee-lodge-mbeya-1920x1280-13.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Tennis Court']
  }
];

const API_BASE_URL = '/api';

async function syncWithAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        HOTELS = data.map(h => ({ ...h, price: Math.round(h.price * USD_TO_TSH) }));
        console.log('Synced with live API:', HOTELS.length, 'hotels loaded');
        return true;
      }
    }
  } catch (error) {
    console.warn('API sync failed, using sample data:', error.message);
  }
  return false;
}

function calculateScore(hotel, preferences) {
  let score = 0;

  // Search filter (strict)
  if (preferences.search) {
    const term = preferences.search.toLowerCase();
    const nameMatch = hotel.name.toLowerCase().includes(term);
    const cityMatch = hotel.city.toLowerCase().includes(term);
    const regionMatch = hotel.region ? hotel.region.toLowerCase().includes(term) : false;
    const descMatch = hotel.description.toLowerCase().includes(term);

    if (!nameMatch && !cityMatch && !regionMatch && !descMatch) return -1; // Exclude
    if (nameMatch) score += 50;
  }

  // Strict filters for Hotels page (if strict: true)
  if (preferences.strict) {
    if (preferences.maxBudget && hotel.price > parseInt(preferences.maxBudget)) return -1;
    if (preferences.minStars && hotel.stars < parseInt(preferences.minStars)) return -1;
    if (preferences.region && hotel.region !== preferences.region) return -1;
    if (preferences.city && hotel.city !== preferences.city) return -1;
    if (preferences.amenities && preferences.amenities.length > 0) {
      const hasAll = preferences.amenities.every(a => hotel.amenities.includes(a));
      if (!hasAll) return -1;
    }
  }

  if (preferences.city && hotel.city === preferences.city) {
    score += RECOMMENDATION_WEIGHTS.location * 100;
  } else if (preferences.region && hotel.region === preferences.region) {
    score += RECOMMENDATION_WEIGHTS.location * 80;
  } else if (preferences.city || preferences.region) {
    score += RECOMMENDATION_WEIGHTS.location * 15;
  } else {
    score += RECOMMENDATION_WEIGHTS.location * 50;
  }

  if (preferences.maxBudget) {
    const budgetLimit = parseInt(preferences.maxBudget);
    if (hotel.price <= budgetLimit) {
      const budgetRatio = Math.min(1, (budgetLimit - hotel.price) / budgetLimit);
      score += RECOMMENDATION_WEIGHTS.budget * (70 + budgetRatio * 30);
    } else {
      const overRatio = Math.max(0, 1 - (hotel.price - budgetLimit) / (budgetLimit * 0.5));
      score += RECOMMENDATION_WEIGHTS.budget * (overRatio * 40);
    }
  } else {
    score += RECOMMENDATION_WEIGHTS.budget * 50;
  }

  if (preferences.amenities && preferences.amenities.length > 0) {
    let matchCount = 0;
    preferences.amenities.forEach(amenity => {
      if (hotel.amenities.includes(amenity)) matchCount++;
    });
    const ratio = matchCount / preferences.amenities.length;
    score += RECOMMENDATION_WEIGHTS.amenities * (ratio * 100);
  } else {
    score += RECOMMENDATION_WEIGHTS.amenities * 50;
  }

  if (preferences.minStars) {
    const minStars = parseInt(preferences.minStars);
    const starScore = Math.min(100, (hotel.stars / minStars) * 100);
    score += RECOMMENDATION_WEIGHTS.rating * starScore;
  } else {
    score += RECOMMENDATION_WEIGHTS.rating * (hotel.rating / 5) * 100;
  }

  return Math.round(score);
}

async function getRecommendations(preferences) {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    if (response.ok) {
      const data = await response.json();
      return data.map(h => ({ ...h, price: Math.round(h.price * USD_TO_TSH) }));
    }
  } catch (error) {
    console.warn('API recommend failed, using local scoring:', error);
  }

  // Fallback to local scoring
  const scored = HOTELS.map(hotel => ({
    ...hotel,
    matchScore: calculateScore(hotel, preferences)
  })).filter(h => h.matchScore >= 0);

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored;
}

function getHotelsByCity(city) {
  return HOTELS.filter(h => h.city === city);
}

function getHotelById(id) {
  return HOTELS.find(h => h.id === id);
}

async function fetchHotelById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
    if (response.ok) {
      const hotel = await response.json();
      hotel.price = Math.round(hotel.price * USD_TO_TSH);
      return hotel;
    }
  } catch (error) {
    console.warn('API fetch hotel failed, using local data:', error);
  }
  return getHotelById(id);
}

function getCities() {
  return [...new Set(HOTELS.map(h => h.city))].sort();
}

function getRegions() {
  return [...new Set(HOTELS.filter(h => h.region).map(h => h.region))].sort();
}

function getAllAmenities() {
  const set = new Set();
  HOTELS.forEach(h => h.amenities.forEach(a => set.add(a)));
  return [...set].sort();
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-TZ').format(price) + ' ' + CURRENCY;
}
