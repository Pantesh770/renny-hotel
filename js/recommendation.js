const RECOMMENDATION_WEIGHTS = {
  location: 0.40,
  budget: 0.30,
  amenities: 0.20,
  rating: 0.10
};

var CURRENCY = 'TSh';
var USD_TO_TSH = 2650;

let HOTELS;

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
const HOTELS_FALLBACK = [
  {
    "id": 1,
    "name": "Arusha Serena Hotel",
    "city": "Arusha",
    "region": "Arusha",
    "description": "A colonial-era coffee farm turned lakeside retreat on the slopes of Mount Meru beside Lake Duluti.",
    "price": 556500,
    "stars": 4,
    "rating": 4.4,
    "address": "Lake Duluti, Tengeru Road, Arusha",
    "contact": "+255 787 222 222",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden",
      "Parking"
    ]
  },
  {
    "id": 2,
    "name": "Mount Meru Hotel",
    "city": "Arusha",
    "region": "Arusha",
    "description": "Arusha’s premier luxury hotel, offering breathtaking views of Mount Meru and lush landscaped gardens.",
    "price": 490250,
    "stars": 4,
    "rating": 4.3,
    "address": "Kanisa Road, Arusha",
    "contact": "+255 27 297 0000",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden"
    ]
  },
  {
    "id": 3,
    "name": "Gran Melia Arusha",
    "city": "Arusha",
    "region": "Arusha",
    "description": "A sanctuary of luxury nestled between the peaks of Mount Meru and the coffee plantations.",
    "price": 874500,
    "stars": 5,
    "rating": 4.7,
    "address": "Simeon Road, Arusha",
    "contact": "+255 746 982 500",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Room Service"
    ]
  },
  {
    "id": 4,
    "name": "Hyatt Regency Dar Es Salaam",
    "city": "Dar es Salaam",
    "region": "Dar es Salaam",
    "description": "A 5-star landmark overlooking the harbor, featuring a rooftop bar and an infinity pool.",
    "price": 689000,
    "stars": 5,
    "rating": 4.6,
    "address": "24 Kivukoni Front, Dar es Salaam",
    "contact": "+255 764 701 234",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Casino"
    ]
  },
  {
    "id": 5,
    "name": "Johari Rotana",
    "city": "Dar es Salaam",
    "region": "Dar es Salaam",
    "description": "A modern luxury hotel within the MNF Square building, offering sophisticated rooms with ocean views.",
    "price": 596250,
    "stars": 5,
    "rating": 4.7,
    "address": "Sokoine Drive, Dar es Salaam",
    "contact": "+255 22 219 1000",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Room Service"
    ]
  },
  {
    "id": 6,
    "name": "Dar es Salaam Serena Hotel",
    "city": "Dar es Salaam",
    "region": "Dar es Salaam",
    "description": "Surrounded by tropical gardens, this hotel blends Swahili architecture with modern luxury.",
    "price": 569750,
    "stars": 5,
    "rating": 4.5,
    "address": "Ohio Street, Dar es Salaam",
    "contact": "+255 22 211 2416",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden"
    ]
  },
  {
    "id": 7,
    "name": "Best Western Dodoma City Hotel",
    "city": "Dodoma",
    "region": "Dodoma",
    "description": "A top choice for government officials and business travelers, featuring rooftop dining.",
    "price": 304750,
    "stars": 4,
    "rating": 4.2,
    "address": "Plot 23, Block A, Kuu Street, Dodoma",
    "contact": "+255 748 502 701",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Business Center"
    ]
  },
  {
    "id": 8,
    "name": "New Dodoma Hotel",
    "city": "Dodoma",
    "region": "Dodoma",
    "description": "A historic hotel with high ceilings and spacious gardens, located near the railway station.",
    "price": 225250,
    "stars": 4,
    "rating": 4,
    "address": "Plot No. 1, Dodoma",
    "contact": "+255 26 232 1641",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Garden",
      "Parking"
    ]
  },
  {
    "id": 9,
    "name": "Moreena Hotel Dodoma",
    "city": "Dodoma",
    "region": "Dodoma",
    "description": "A modern boutique hotel offering elegant rooms and high-quality service in the capital.",
    "price": 344500,
    "stars": 4,
    "rating": 4.4,
    "address": "Area D, Dodoma",
    "contact": "+255 754 555 666",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Spa"
    ]
  },
  {
    "id": 10,
    "name": "Gold Stone Hotel",
    "city": "Geita",
    "region": "Geita",
    "description": "A modern hotel offering upscale conveniences and a welcoming atmosphere for business.",
    "price": 212000,
    "stars": 4,
    "rating": 4.1,
    "address": "Mission Street, Geita",
    "contact": "+255 788 010 293",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Spa",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Air Conditioning"
    ]
  },
  {
    "id": 11,
    "name": "Mazinzi Hotel",
    "city": "Geita",
    "region": "Geita",
    "description": "Features multiple dining options and bars, making it a social hub for travelers.",
    "price": 132500,
    "stars": 3,
    "rating": 3.7,
    "address": "Kalangalala Area, Geita",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden",
      "Parking"
    ]
  },
  {
    "id": 12,
    "name": "Lennox Hotel Geita",
    "city": "Geita",
    "region": "Geita",
    "description": "Comfortable accommodation with modern amenities, catering to both business and leisure.",
    "price": 172250,
    "stars": 3,
    "rating": 3.9,
    "address": "Geita Town Center",
    "contact": "+255 754 111 222",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Parking"
    ]
  },
  {
    "id": 13,
    "name": "Ruaha River Lodge",
    "city": "Ruaha National Park",
    "region": "Iringa",
    "description": "The oldest lodge in Ruaha, built along the river banks where wildlife visits frequently.",
    "price": 954000,
    "stars": 4,
    "rating": 4.5,
    "address": "Ruaha National Park, Iringa",
    "contact": "+255 22 212 8485",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Game Drives",
      "Parking",
      "Solar Power"
    ]
  },
  {
    "id": 14,
    "name": "Tandala Tented Camp",
    "city": "Ruaha National Park",
    "region": "Iringa",
    "description": "Offering an authentic safari experience with tented accommodation and great wildlife viewing.",
    "price": 768500,
    "stars": 4,
    "rating": 4.4,
    "address": "Ruaha National Park Border, Iringa",
    "contact": "+255 754 033 131",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Game Drives",
      "Free WiFi"
    ]
  },
  {
    "id": 15,
    "name": "Iringa Sunset Hotel",
    "city": "Iringa",
    "region": "Iringa",
    "description": "Located on the Gangilonga Hills, offering panoramic views of Iringa town and beautiful sunsets.",
    "price": 291500,
    "stars": 4,
    "rating": 4.2,
    "address": "Gangilonga, Iringa",
    "contact": "+255 26 270 2636",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Hill View",
      "Garden"
    ]
  },
  {
    "id": 16,
    "name": "Walkgard Transit Hotel",
    "city": "Bukoba",
    "region": "Kagera",
    "description": "Located near Bukoba Bus Terminal, it offers clean, lake-breeze-cooled rooms.",
    "price": 159000,
    "stars": 3,
    "rating": 4,
    "address": "Uganda Road, Bukoba",
    "contact": "+255 754 538 412",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Free WiFi",
      "Parking",
      "Tour Desk"
    ]
  },
  {
    "id": 17,
    "name": "Victorious Perch Hotel",
    "city": "Bukoba",
    "region": "Kagera",
    "description": "A premium hotel in Bukoba offering stunning views of Lake Victoria and excellent hospitality.",
    "price": 238500,
    "stars": 4,
    "rating": 4.3,
    "address": "Bukoba Waterfront, Kagera",
    "contact": "+255 28 222 0000",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Lake View"
    ]
  },
  {
    "id": 18,
    "name": "Space Lodge Bukoba",
    "city": "Bukoba",
    "region": "Kagera",
    "description": "Known for its personalized adventure tour services and comfortable lakefront stay.",
    "price": 119250,
    "stars": 3,
    "rating": 3.8,
    "address": "Bukoba Waterfront, Kagera",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Lake View",
      "Tour Desk",
      "Restaurant",
      "Bar",
      "Garden"
    ]
  },
  {
    "id": 19,
    "name": "Chada Katavi",
    "city": "Katavi National Park",
    "region": "Katavi",
    "description": "A legendary, remote bush camp offering an authentic \"old school\" safari experience.",
    "price": 2597000,
    "stars": 5,
    "rating": 4.8,
    "address": "Chada Plain, Katavi NP",
    "contact": "+255 22 212 8485",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Bar",
      "Game Drives",
      "Solar Power",
      "Bush Meals"
    ]
  },
  {
    "id": 20,
    "name": "Nangero Royal Hotel",
    "city": "Mpanda",
    "region": "Katavi",
    "description": "A comfortable mid-range hotel in Mpanda town, serving as a primary gateway to Katavi.",
    "price": 251750,
    "stars": 4,
    "rating": 4,
    "address": "Mpanda Town, Katavi",
    "contact": "+255 754 590 000",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC"
    ]
  },
  {
    "id": 21,
    "name": "Arena Executive Hotel",
    "city": "Mpanda",
    "region": "Katavi",
    "description": "Modern executive accommodation offering premium services and comfort in the Katavi region.",
    "price": 291500,
    "stars": 4,
    "rating": 4.2,
    "address": "Mpanda, Katavi",
    "contact": "+255 765 745 055",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Conference Room",
      "Gym"
    ]
  },
  {
    "id": 22,
    "name": "Kigoma Hilltop Hotel",
    "city": "Kigoma",
    "region": "Kigoma",
    "description": "Perched on a hill overlooking Lake Tanganyika, offering spectacular sunset views.",
    "price": 503500,
    "stars": 4,
    "rating": 4.2,
    "address": "Hilltop Road, Kigoma",
    "contact": "+255 28 244 0444",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Gym",
      "Lake View"
    ]
  },
  {
    "id": 23,
    "name": "Lake Tanganyika Hotel",
    "city": "Kigoma",
    "region": "Kigoma",
    "description": "Located on the shores of Lake Tanganyika, featuring beautiful gardens and a serene atmosphere.",
    "price": 397500,
    "stars": 4,
    "rating": 4.1,
    "address": "Lake Front, Kigoma",
    "contact": "+255 28 244 0000",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Garden",
      "Lake Access"
    ]
  },
  {
    "id": 24,
    "name": "Gombe Forest Lodge",
    "city": "Gombe",
    "region": "Kigoma",
    "description": "A small, intimate lodge hidden in the forest of Gombe Stream National Park, home to the chimpanzees.",
    "price": 1192500,
    "stars": 4,
    "rating": 4.6,
    "address": "Gombe Stream National Park",
    "contact": "+255 22 212 8485",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Chimpanzee Trekking",
      "Beach Access"
    ]
  },
  {
    "id": 25,
    "name": "Kilimanjaro Wonders Hotel",
    "city": "Moshi",
    "region": "Kilimanjaro",
    "description": "A modern luxury hotel in Moshi offering great views of Mt. Kilimanjaro from its rooftop bar.",
    "price": 424000,
    "stars": 4,
    "rating": 4.5,
    "address": "Kiboriloni, Moshi",
    "contact": "+255 27 275 1984",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Mountain View"
    ]
  },
  {
    "id": 26,
    "name": "Salinero Kilimanjaro Hotel",
    "city": "Moshi",
    "region": "Kilimanjaro",
    "description": "Nestled in the quiet suburbs of Moshi, providing a peaceful base for Kilimanjaro climbers.",
    "price": 371000,
    "stars": 4,
    "rating": 4.2,
    "address": "Lyamungo Road, Moshi",
    "contact": "+255 754 553 078",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden"
    ]
  },
  {
    "id": 27,
    "name": "Parkview Inn Moshi",
    "city": "Moshi",
    "region": "Kilimanjaro",
    "description": "A centrally located hotel in Moshi known for its cleanliness, comfort, and views of the mountain.",
    "price": 318000,
    "stars": 3,
    "rating": 4.3,
    "address": "Aga Khan Road, Moshi",
    "contact": "+255 27 275 0711",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Free WiFi",
      "AC",
      "Mountain View"
    ]
  },
  {
    "id": 28,
    "name": "Sea View Beach Resort",
    "city": "Lindi",
    "region": "Lindi",
    "description": "Situated on the Lindi waterfront, offering a relaxing coastal experience.",
    "price": 172250,
    "stars": 3,
    "rating": 4,
    "address": "Waterfront Road, Lindi",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Beach Access",
      "Restaurant",
      "Bar",
      "Free WiFi"
    ]
  },
  {
    "id": 29,
    "name": "Burka Coffee Lounge",
    "city": "Lindi",
    "region": "Lindi",
    "description": "A boutique-style accommodation offering a personalized experience in Lindi town.",
    "price": 410750,
    "stars": 4,
    "rating": 4.4,
    "address": "Lindi Town Center",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Gourmet Restaurant",
      "Terrace",
      "AC",
      "Free WiFi",
      "Breakfast Included"
    ]
  },
  {
    "id": 30,
    "name": "Lindi Beach Hotel",
    "city": "Lindi",
    "region": "Lindi",
    "description": "Modern beach hotel offering standard amenities and proximity to the ocean.",
    "price": 145750,
    "stars": 3,
    "rating": 3.8,
    "address": "Beach Road, Lindi",
    "contact": "+255 712 000 111",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Parking"
    ]
  },
  {
    "id": 31,
    "name": "Lake Manyara Serena Safari Lodge",
    "city": "Lake Manyara",
    "region": "Manyara",
    "description": "Perched on the Rift Valley Escarpment with infinity pool views of the lake.",
    "price": 1219000,
    "stars": 4,
    "rating": 4.6,
    "address": "Mto wa Mbu Escarpment, Manyara",
    "contact": "+255 27 253 9160",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Bush Dining",
      "Boutique"
    ]
  },
  {
    "id": 32,
    "name": "Lake Manyara Kilimamoja Lodge",
    "city": "Lake Manyara",
    "region": "Manyara",
    "description": "A luxury lodge offering panoramic views of the lake and surrounding highlands.",
    "price": 1484000,
    "stars": 5,
    "rating": 4.8,
    "address": "Rim of Great Rift Valley, Manyara",
    "contact": "+255 784 233 444",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Spa",
      "Restaurant",
      "Bar",
      "Free WiFi"
    ]
  },
  {
    "id": 33,
    "name": "Manyara Wildlife Safari Camp",
    "city": "Lake Manyara",
    "region": "Manyara",
    "description": "Ten luxury tents and sixteen self-contained cottages located at the edge of the escarpment.",
    "price": 662500,
    "stars": 4,
    "rating": 4.2,
    "address": "Mto wa Mbu, Manyara",
    "contact": "+255 784 555 111",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Game Drives",
      "Free WiFi"
    ]
  },
  {
    "id": 34,
    "name": "Four Seasons Safari Lodge",
    "city": "Serengeti",
    "region": "Mara",
    "description": "A world-class safari lodge perched on elevated platforms overlooking a wildlife watering hole.",
    "price": 3312500,
    "stars": 5,
    "rating": 4.8,
    "address": "Central Serengeti, Serengeti NP",
    "contact": "+255 768 981 981",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Game Drives"
    ]
  },
  {
    "id": 35,
    "name": "Singita Sasakwa Lodge",
    "city": "Serengeti",
    "region": "Mara",
    "description": "A magnificent Edwardian-style manor with unmatched old-world luxury.",
    "price": 6890000,
    "stars": 5,
    "rating": 4.9,
    "address": "Grumeti Game Reserve, Serengeti",
    "contact": "+255 768 982 982",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Game Drives",
      "Concierge"
    ]
  },
  {
    "id": 36,
    "name": "Melia Serengeti Lodge",
    "city": "Serengeti",
    "region": "Mara",
    "description": "Sustainable luxury lodge in the heart of the Serengeti with an infinity pool and incredible views.",
    "price": 1457500,
    "stars": 5,
    "rating": 4.7,
    "address": "Nyamuma Hills, Serengeti",
    "contact": "+255 746 982 500",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Eco Friendly"
    ]
  },
  {
    "id": 37,
    "name": "Utengule Coffee Lodge",
    "city": "Mbeya",
    "region": "Mbeya",
    "description": "A luxury lodge set on a working coffee plantation on the slopes of the Mbeya Range.",
    "price": 384250,
    "stars": 4,
    "rating": 4.4,
    "address": "Utengule, Mbeya",
    "contact": "+255 25 250 0001",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden",
      "Tennis Court"
    ]
  },
  {
    "id": 38,
    "name": "Royal Mgwasi Hotel",
    "city": "Mbeya",
    "region": "Mbeya",
    "description": "Modern luxury hotel offering top-tier amenities and comfort in the heart of Mbeya.",
    "price": 265000,
    "stars": 4,
    "rating": 4.1,
    "address": "Mbeya City Center",
    "contact": "+255 754 416 161",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Conference Room"
    ]
  },
  {
    "id": 39,
    "name": "Hillview Hotel Mbeya",
    "city": "Mbeya",
    "region": "Mbeya",
    "description": "Offering scenic views of the surrounding mountains and comfortable executive rooms.",
    "price": 225250,
    "stars": 4,
    "rating": 4,
    "address": "Hillview St., Mbeya",
    "contact": "+255 754 888 777",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Parking"
    ]
  },
  {
    "id": 40,
    "name": "Nashera Hotel",
    "city": "Morogoro",
    "region": "Morogoro",
    "description": "A boutique hotel offering stunning mountain views and elegant, modern rooms.",
    "price": 357750,
    "stars": 4,
    "rating": 4.2,
    "address": "Boma Road, Morogoro",
    "contact": "+255 716 678 233",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Mountain View"
    ]
  },
  {
    "id": 41,
    "name": "Morogoro Hotel",
    "city": "Morogoro",
    "region": "Morogoro",
    "description": "One of the oldest and most trusted hotels, set on expansive grounds at the foot of the mountains.",
    "price": 185500,
    "stars": 3,
    "rating": 3.9,
    "address": "Rwegasore Road, Morogoro",
    "contact": "+255 23 261 3270",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Tennis Court",
      "Casino",
      "Garden",
      "Free Breakfast"
    ]
  },
  {
    "id": 42,
    "name": "Arc Hotel Morogoro",
    "city": "Morogoro",
    "region": "Morogoro",
    "description": "Modern hotel located near the city center, offering clean rooms and reliable service.",
    "price": 159000,
    "stars": 3,
    "rating": 3.8,
    "address": "Kihonda, Morogoro",
    "contact": "+255 23 260 0000",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Parking"
    ]
  },
  {
    "id": 43,
    "name": "Tiffany Diamond Hotel Mtwara",
    "city": "Mtwara",
    "region": "Mtwara",
    "description": "A premier business hotel in Mtwara, offering modern facilities.",
    "price": 238500,
    "stars": 4,
    "rating": 4.1,
    "address": "Makonde Road, Mtwara",
    "contact": "+255 23 233 3034",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Business Center"
    ]
  },
  {
    "id": 44,
    "name": "Luwa Evergreen Hotel",
    "city": "Mtwara",
    "region": "Mtwara",
    "description": "Comfortable hotel known for its lush green gardens and peaceful environment.",
    "price": 198750,
    "stars": 3,
    "rating": 4,
    "address": "Ligula, Mtwara",
    "contact": "+255 677 066 338",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Garden",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC"
    ]
  },
  {
    "id": 45,
    "name": "Cashewnut Hotel",
    "city": "Mtwara",
    "region": "Mtwara",
    "description": "Classic hotel in Mtwara offering spacious rooms and local hospitality.",
    "price": 145750,
    "stars": 3,
    "rating": 3.7,
    "address": "Mtwara Town",
    "contact": "+255 718 258 463",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC"
    ]
  },
  {
    "id": 46,
    "name": "Malaika Beach Resort",
    "city": "Mwanza",
    "region": "Mwanza",
    "description": "A premier lakeside resort on Lake Victoria with an infinity pool and stunning sunsets.",
    "price": 410750,
    "stars": 4,
    "rating": 4.3,
    "address": "Capri Point, Mwanza",
    "contact": "+255 763 111 111",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden",
      "Water Sports"
    ]
  },
  {
    "id": 47,
    "name": "Gold Crest Hotel",
    "city": "Mwanza",
    "region": "Mwanza",
    "description": "A stylish city hotel offering luxury accommodation and panoramic views of Lake Victoria.",
    "price": 344500,
    "stars": 4,
    "rating": 4.2,
    "address": "Makongoro Road, Mwanza",
    "contact": "+255 677 353 500",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Lake View"
    ]
  },
  {
    "id": 48,
    "name": "Ryan’s Bay Hotel",
    "city": "Mwanza",
    "region": "Mwanza",
    "description": "Ideally situated on the shores of Lake Victoria, offering tranquil luxury.",
    "price": 371000,
    "stars": 4,
    "rating": 4.4,
    "address": "Capri Point, Mwanza",
    "contact": "+255 784 699 393",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden",
      "Lake View"
    ]
  },
  {
    "id": 49,
    "name": "Ngailo Lodge",
    "city": "Njombe",
    "region": "Njombe",
    "description": "Highly rated for its modern touch, offering clean and well-furnished rooms.",
    "price": 92750,
    "stars": 3,
    "rating": 4.5,
    "address": "Vegas Road, Njombe",
    "contact": "+255 745 524 719",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking",
      "Room Service"
    ]
  },
  {
    "id": 50,
    "name": "Hillside Hotel Njombe",
    "city": "Njombe",
    "region": "Njombe",
    "description": "Known for its spectacular views of the Njombe landscape and beautiful gardens.",
    "price": 119250,
    "stars": 3,
    "rating": 4.1,
    "address": "Uzunguni St., Njombe",
    "contact": "+255 758 584 691",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Garden",
      "Terrace",
      "Restaurant",
      "Bar",
      "Free WiFi"
    ]
  },
  {
    "id": 51,
    "name": "Njombe Hotel",
    "city": "Njombe",
    "region": "Njombe",
    "description": "A classic town hotel providing essential comfort and friendly service.",
    "price": 79500,
    "stars": 2,
    "rating": 3.5,
    "address": "Njombe Town Center",
    "contact": "+255 26 273 0000",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking"
    ]
  },
  {
    "id": 52,
    "name": "The Manta Resort",
    "city": "Kigomasha",
    "region": "Pemba North",
    "description": "World-famous for its Underwater Room, offering a luxury island escape.",
    "price": 1722500,
    "stars": 5,
    "rating": 4.8,
    "address": "Kigomasha Peninsula, Pemba",
    "contact": "+255 776 718 852",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Dive Center",
      "Private Beach",
      "Underwater Room"
    ]
  },
  {
    "id": 53,
    "name": "Amani Shore Pemba",
    "city": "Kigomasha",
    "region": "Pemba North",
    "description": "A boutique luxury retreat offering absolute privacy and stunning ocean views.",
    "price": 1060000,
    "stars": 5,
    "rating": 4.7,
    "address": "North Pemba Coast",
    "contact": "+255 777 000 001",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Spa",
      "Water Sports"
    ]
  },
  {
    "id": 54,
    "name": "Kwanini Resort",
    "city": "Kigomasha",
    "region": "Pemba North",
    "description": "Eco-resort focused on community and conservation, providing a unique Pemba experience.",
    "price": 795000,
    "stars": 4,
    "rating": 4.5,
    "address": "Kigomasha Peninsula, Pemba",
    "contact": "+255 777 000 002",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Eco Tours",
      "Free WiFi"
    ]
  },
  {
    "id": 55,
    "name": "Fundu Lagoon",
    "city": "Wambaa",
    "region": "Pemba South",
    "description": "An exclusive, boat-access-only resort featuring safari-style tented bungalows.",
    "price": 2332000,
    "stars": 5,
    "rating": 4.7,
    "address": "Wambaa Gulf, Pemba",
    "contact": "+255 777 435 951",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Dive Center",
      "Bar",
      "Boat Transfers"
    ]
  },
  {
    "id": 56,
    "name": "Pemba Misali Sunset",
    "city": "Weska",
    "region": "Pemba South",
    "description": "Offering beautiful sunset views and proximity to Misali Island Marine Park.",
    "price": 477000,
    "stars": 4,
    "rating": 4.3,
    "address": "Weska Coast, Pemba",
    "contact": "+255 777 000 003",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Diving",
      "Boat Trips"
    ]
  },
  {
    "id": 57,
    "name": "Emerald Bay Resort",
    "city": "Chake Chake",
    "region": "Pemba South",
    "description": "A quiet resort overlooking the emerald waters of Chake Chake bay.",
    "price": 397500,
    "stars": 3,
    "rating": 4,
    "address": "Chake Chake Bay",
    "contact": "+255 777 000 004",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Garden"
    ]
  },
  {
    "id": 58,
    "name": "Millennium Sea Breeze Resort",
    "city": "Bagamoyo",
    "region": "Pwani",
    "description": "A tranquil beachfront resort blending modern luxury with local Swahili charm.",
    "price": 371000,
    "stars": 3,
    "rating": 4.1,
    "address": "Kaole Road, Bagamoyo",
    "contact": "+255 754 556 680",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Beach Access",
      "Restaurant",
      "Bar",
      "Nightclub"
    ]
  },
  {
    "id": 59,
    "name": "Oceanic Bay Hotel & Resort",
    "city": "Bagamoyo",
    "region": "Pwani",
    "description": "A premium beachfront resort with Swahili architecture and modern amenities.",
    "price": 397500,
    "stars": 4,
    "rating": 4.2,
    "address": "Beach Front, Bagamoyo",
    "contact": "+255 23 244 0000",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Beach Access"
    ]
  },
  {
    "id": 60,
    "name": "Firefly Boutique Lodge",
    "city": "Bagamoyo",
    "region": "Pwani",
    "description": "A charming boutique lodge with a pool, known for its intimate atmosphere and historic character.",
    "price": 212000,
    "stars": 4,
    "rating": 4.5,
    "address": "Old Town, Bagamoyo",
    "contact": "+255 754 555 222",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden"
    ]
  },
  {
    "id": 61,
    "name": "Lake Shore Lodge",
    "city": "Kipili",
    "region": "Rukwa",
    "description": "A scenic lodge on Lake Tanganyika offering chalets and luxury tents with diving club.",
    "price": 477000,
    "stars": 4,
    "rating": 4.6,
    "address": "Kipili, Lake Tanganyika",
    "contact": "+255 777 000 111",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Spa",
      "Diving",
      "Private Beach",
      "Restaurant",
      "Bar"
    ]
  },
  {
    "id": 62,
    "name": "Ufipa Highland’s Hotel",
    "city": "Sumbawanga",
    "region": "Rukwa",
    "description": "A pet-friendly hotel in Sumbawanga offering basic comfortable rooms and parking.",
    "price": 145750,
    "stars": 3,
    "rating": 3.9,
    "address": "Sumbawanga Center",
    "contact": "+255 737 133 731",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking",
      "Pet Friendly"
    ]
  },
  {
    "id": 63,
    "name": "Country Hotel Sumbawanga",
    "city": "Sumbawanga",
    "region": "Rukwa",
    "description": "Central hotel in Sumbawanga providing convenient access to regional attractions.",
    "price": 119250,
    "stars": 3,
    "rating": 3.7,
    "address": "Sumbawanga Town",
    "contact": "+255 25 282 0000",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking"
    ]
  },
  {
    "id": 64,
    "name": "Bwawani Gardens",
    "city": "Songea",
    "region": "Ruvuma",
    "description": "A property near the airport featuring a range of recreational activities.",
    "price": 172250,
    "stars": 3,
    "rating": 4,
    "address": "Songea Town Center",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Sauna",
      "Restaurant",
      "Free WiFi",
      "Airport Shuttle"
    ]
  },
  {
    "id": 65,
    "name": "Fancy Hill Hotel",
    "city": "Songea",
    "region": "Ruvuma",
    "description": "A centrally located hotel near Songea Cathedral with city views and AC.",
    "price": 106000,
    "stars": 3,
    "rating": 3.8,
    "address": "Songea Center",
    "contact": "+255 25 260 0001",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "City View"
    ]
  },
  {
    "id": 66,
    "name": "Mbambabay Biocamp Lodge",
    "city": "Mbamba Bay",
    "region": "Ruvuma",
    "description": "An eco-friendly lodge on the shores of Lake Nyasa, perfect for tranquility.",
    "price": 212000,
    "stars": 4,
    "rating": 4.4,
    "address": "Mbamba Bay, Lake Nyasa",
    "contact": "+255 777 000 222",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Lake Access",
      "Eco Friendly",
      "Restaurant",
      "Water Sports"
    ]
  },
  {
    "id": 67,
    "name": "Karena Hotel",
    "city": "Shinyanga",
    "region": "Shinyanga",
    "description": "Caters primarily to business travelers with clean facilities and professional service.",
    "price": 145750,
    "stars": 3,
    "rating": 3.8,
    "address": "Shinyanga City",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Business Center",
      "AC"
    ]
  },
  {
    "id": 68,
    "name": "Buzwagi View Hotel",
    "city": "Kahama",
    "region": "Shinyanga",
    "description": "A 3-star hotel offering English breakfast and on-site restaurant in Kahama.",
    "price": 159000,
    "stars": 3,
    "rating": 4,
    "address": "Kahama Center",
    "contact": "+255 754 000 333",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Breakfast Included"
    ]
  },
  {
    "id": 69,
    "name": "The Levels By 101 Hotel",
    "city": "Kahama",
    "region": "Shinyanga",
    "description": "Modern 4-star option in the region featuring an outdoor pool and fitness facilities.",
    "price": 238500,
    "stars": 4,
    "rating": 4.2,
    "address": "Kahama, Shinyanga",
    "contact": "+255 777 101 101",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi"
    ]
  },
  {
    "id": 70,
    "name": "Speke Bay Lodge",
    "city": "Busega",
    "region": "Simiyu",
    "description": "A unique lodge built like a small village on the shores of Lake Victoria.",
    "price": 490250,
    "stars": 4,
    "rating": 4.5,
    "address": "Speke Bay, Lake Victoria",
    "contact": "+255 28 262 1011",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Lake View",
      "Restaurant",
      "Bar",
      "Garden",
      "Boat Trips"
    ]
  },
  {
    "id": 71,
    "name": "Mbalageti Serengeti",
    "city": "Serengeti",
    "region": "Simiyu",
    "description": "A luxury 5-star lodge in the Western Corridor with breathtaking views of the plains.",
    "price": 1192500,
    "stars": 5,
    "rating": 4.7,
    "address": "Serengeti Western Corridor",
    "contact": "+255 784 111 444",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Game Drives"
    ]
  },
  {
    "id": 72,
    "name": "Simiyu Hotel",
    "city": "Bariadi",
    "region": "Simiyu",
    "description": "Town hotel in Bariadi offering basic amenities and gateway to the Serengeti.",
    "price": 119250,
    "stars": 2,
    "rating": 3.5,
    "address": "Bariadi Center",
    "contact": "+255 754 000 555",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking"
    ]
  },
  {
    "id": 73,
    "name": "Regency Hotel & Resort",
    "city": "Singida",
    "region": "Singida",
    "description": "Situated on the shores of Lake Singidani, offering a tranquil escape.",
    "price": 172250,
    "stars": 3,
    "rating": 4.1,
    "address": "Nyerere Road, Singida",
    "contact": "+255 26 250 2141",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Lake View",
      "Restaurant",
      "Bar",
      "Free WiFi"
    ]
  },
  {
    "id": 74,
    "name": "Lake View Resort Singida",
    "city": "Singida",
    "region": "Singida",
    "description": "Offering quiet surroundings and basic modern amenities along the B141 road.",
    "price": 132500,
    "stars": 3,
    "rating": 3.9,
    "address": "B141 Road, Singida",
    "contact": "+255 754 000 666",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Free WiFi",
      "Parking",
      "Lake View"
    ]
  },
  {
    "id": 75,
    "name": "Stanley Hotel Singida",
    "city": "Singida",
    "region": "Singida",
    "description": "Conveniently located town hotel with standard rooms and local dining.",
    "price": 106000,
    "stars": 2,
    "rating": 3.6,
    "address": "Singida Town Center",
    "contact": "+255 754 000 777",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking"
    ]
  },
  {
    "id": 76,
    "name": "Gracious Hotel",
    "city": "Vwawa",
    "region": "Songwe",
    "description": "The premier budget hotel in Vwawa Town offering clean rooms and high-speed Wi-Fi.",
    "price": 92750,
    "stars": 3,
    "rating": 4.2,
    "address": "Ichenjezya, Vwawa",
    "contact": "+255 204 173 80",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Breakfast Included",
      "Parking"
    ]
  },
  {
    "id": 77,
    "name": "Airport View Hotel Songwe",
    "city": "Mbalizi",
    "region": "Songwe",
    "description": "Conveniently located near the Songwe Airport with restaurant and bar.",
    "price": 145750,
    "stars": 3,
    "rating": 4,
    "address": "Mbalizi, Songwe",
    "contact": "+255 754 000 888",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking",
      "Airport Shuttle"
    ]
  },
  {
    "id": 78,
    "name": "Mlowo Hotel",
    "city": "Mlowo",
    "region": "Songwe",
    "description": "A key transit hotel in the Mlowo area providing comfortable rest for travelers.",
    "price": 79500,
    "stars": 2,
    "rating": 3.5,
    "address": "Mlowo Center",
    "contact": "+255 754 000 999",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Parking"
    ]
  },
  {
    "id": 79,
    "name": "Leah Amenities",
    "city": "Tabora",
    "region": "Tabora",
    "description": "An exquisite retreat blending modern elegance with traditional charm.",
    "price": 278250,
    "stars": 5,
    "rating": 4.5,
    "address": "Cheyo Street, Tabora City",
    "contact": "+255 777 000 000",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Free WiFi",
      "Room Service",
      "AC",
      "Parking"
    ]
  },
  {
    "id": 80,
    "name": "Orion Tabora Hotel",
    "city": "Tabora",
    "region": "Tabora",
    "description": "A historic hotel with colonial German architecture and relaxing gardens.",
    "price": 106000,
    "stars": 4,
    "rating": 4.1,
    "address": "Main St., Tabora",
    "contact": "+255 26 260 0000",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Garden",
      "Free WiFi",
      "Historic"
    ]
  },
  {
    "id": 81,
    "name": "Tabora Belmonte Hotel",
    "city": "Tabora",
    "region": "Tabora",
    "description": "Budget-friendly hotel in the heart of Tabora offering essential services.",
    "price": 79500,
    "stars": 3,
    "rating": 3.7,
    "address": "Tabora Center",
    "contact": "+255 754 001 111",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC"
    ]
  },
  {
    "id": 82,
    "name": "Tanga Beach Resort",
    "city": "Tanga",
    "region": "Tanga",
    "description": "The premier resort in Tanga, offering ocean views and family-friendly activities.",
    "price": 304750,
    "stars": 4,
    "rating": 4.3,
    "address": "Sahare Area, Tanga",
    "contact": "+255 785 171 717",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Beach Access"
    ]
  },
  {
    "id": 83,
    "name": "La Casa Preciosa",
    "city": "Tanga",
    "region": "Tanga",
    "description": "Charming boutique hotel in Tanga known for its comfort and hospitality.",
    "price": 198750,
    "stars": 4,
    "rating": 4.4,
    "address": "Bomani Avenue, Tanga",
    "contact": "+255 710 288 847",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Garden"
    ]
  },
  {
    "id": 84,
    "name": "Silverado Boutique Hotel",
    "city": "Tanga",
    "region": "Tanga",
    "description": "Boutique hotel offering modern facilities and elegant rooms in Tanga.",
    "price": 238500,
    "stars": 4,
    "rating": 4.2,
    "address": "Bomani Avenue, Tanga",
    "contact": "+255 27 264 5881",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Restaurant",
      "Bar",
      "Free WiFi",
      "AC",
      "Gym"
    ]
  },
  {
    "id": 85,
    "name": "Park Hyatt Zanzibar",
    "city": "Stone Town",
    "region": "Mjini Magharibi",
    "description": "A luxury waterfront hotel in a historic Stone Town building featuring Arabesque architecture.",
    "price": 1192500,
    "stars": 5,
    "rating": 4.5,
    "address": "Shangani Street, Stone Town",
    "contact": "+255 777 333 444",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Concierge"
    ]
  },
  {
    "id": 86,
    "name": "Zanzibar Serena Hotel",
    "city": "Stone Town",
    "region": "Mjini Magharibi",
    "description": "Experience the essence of Stone Town at this seafront hotel with Swahili-style architecture.",
    "price": 1007000,
    "stars": 5,
    "rating": 4.6,
    "address": "Stone Town Seafront",
    "contact": "+255 777 000 005",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Beach Access",
      "Free WiFi"
    ]
  },
  {
    "id": 87,
    "name": "Tembo House Hotel",
    "city": "Stone Town",
    "region": "Mjini Magharibi",
    "description": "A historic hotel with wood-carved furniture and beachfront pools in the heart of Stone Town.",
    "price": 397500,
    "stars": 4,
    "rating": 4.3,
    "address": "Forodhani St., Stone Town",
    "contact": "+255 777 000 006",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Restaurant",
      "Free WiFi",
      "Beach Front",
      "Historic"
    ]
  },
  {
    "id": 88,
    "name": "Riu Palace Zanzibar",
    "city": "Nungwi",
    "region": "Unguja North",
    "description": "A 5-star adults-only all-inclusive beachfront resort with direct access to Nungwi sands.",
    "price": 1007000,
    "stars": 5,
    "rating": 4.6,
    "address": "Nungwi Beach, Zanzibar",
    "contact": "+255 777 111 222",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "All Inclusive"
    ]
  },
  {
    "id": 89,
    "name": "Zuri Zanzibar",
    "city": "Kendwa",
    "region": "Unguja North",
    "description": "Luxury bungalows and spice gardens on the pristine Kendwa beach.",
    "price": 1457500,
    "stars": 5,
    "rating": 4.8,
    "address": "Kendwa Beach, Zanzibar",
    "contact": "+255 777 000 007",
    "image": "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600",
    "image2": "https://images.unsplash.com/photo-1535807417876-ceadd6e4815f?w=600",
    "image3": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Garden",
      "Beach Access"
    ]
  },
  {
    "id": 90,
    "name": "Royal Zanzibar Beach Resort",
    "city": "Nungwi",
    "region": "Unguja North",
    "description": "Highlighting infinity pools and direct Nungwi beach views.",
    "price": 1113000,
    "stars": 5,
    "rating": 4.6,
    "address": "Nungwi, Zanzibar",
    "contact": "+255 777 000 008",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
    "image2": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    "image3": "https://images.unsplash.com/photo-1507652313519-d4e917d2e4f4?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Beach Access"
    ]
  },
  {
    "id": 91,
    "name": "Baraza Resort & Spa",
    "city": "Bwejuu",
    "region": "Unguja South",
    "description": "An ultra-luxury all-inclusive boutique resort blending Swahili, Arabic and Indian architecture.",
    "price": 1590000,
    "stars": 5,
    "rating": 4.7,
    "address": "Bwejuu Beach, Zanzibar",
    "contact": "+255 777 222 333",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "image2": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    "image3": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Beach Access",
      "All Inclusive"
    ]
  },
  {
    "id": 92,
    "name": "The Palms Zanzibar",
    "city": "Bwejuu",
    "region": "Unguja South",
    "description": "Private villas and intimate dining settings for an exclusive island getaway.",
    "price": 1987500,
    "stars": 5,
    "rating": 4.8,
    "address": "Bwejuu Beach, Zanzibar",
    "contact": "+255 777 000 009",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "image2": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "image3": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Spa",
      "Private Beach",
      "Restaurant",
      "Bar"
    ]
  },
  {
    "id": 93,
    "name": "Qambani Luxury Resort",
    "city": "Michamvi",
    "region": "Unguja South",
    "description": "Uniquely designed villas and tropical grounds on the Michamvi peninsula.",
    "price": 1537000,
    "stars": 5,
    "rating": 4.7,
    "address": "Michamvi, Zanzibar",
    "contact": "+255 777 000 010",
    "image": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
    "image2": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600",
    "image3": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    "sound_url": "",
    "amenities": [
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Free WiFi",
      "Garden"
    ]
  }
];

HOTELS = HOTELS_FALLBACK;