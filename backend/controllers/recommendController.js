const pool = require('../config/db');

function getFallbackHotels() {
  const data = require('../seeds/hotels_data');
  return data.map((h, i) => ({ id: i + 1, ...h }));
}

const USD_TO_TSH = 2650;

const WEIGHTS = {
  location: 0.40,
  budget: 0.30,
  amenities: 0.20,
  rating: 0.10
};

exports.recommend = async (req, res) => {
  try {
    const { search, city, region, maxBudget, amenities, minStars, strict } = req.body;

    // Fetch hotels with hard filters
    let sql = `SELECT * FROM hotels`;
    const params = [];
    const conditions = [];

    if (city) {
      conditions.push(`city LIKE ?`);
      params.push(`%${city}%`);
    }

    if (region) {
      conditions.push(`region LIKE ?`);
      params.push(`%${region}%`);
    }

    if (search) {
      conditions.push(`(name LIKE ? OR city LIKE ? OR region LIKE ? OR description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    let hotels;

    try {
      [hotels] = await pool.query(sql, params);
      for (let hotel of hotels) {
        const [amenityRows] = await pool.query(
          `SELECT a.name FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id = ?`,
          [hotel.id]
        );
        hotel.amenities = amenityRows.map(a => a.name);
      }
    } catch (dbErr) {
      console.warn('DB recommend query failed, using fallback:', dbErr.message);
      hotels = getFallbackHotels().filter(h => {
        if (city && !h.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (region && !(h.region || '').toLowerCase().includes(region.toLowerCase())) return false;
        if (search) {
          const t = search.toLowerCase();
          if (!h.name.toLowerCase().includes(t) && !h.city.toLowerCase().includes(t) &&
              !(h.region || '').toLowerCase().includes(t) && !h.description.toLowerCase().includes(t)) return false;
        }
        return true;
      });
    }

    // Strict filtering (if strict mode is on, typically for the Hotels Browse page)
    if (strict) {
      if (maxBudget) {
        const budgetUSD = parseInt(maxBudget) / USD_TO_TSH;
        hotels = hotels.filter(h => h.price <= budgetUSD);
      }
      if (minStars) {
        hotels = hotels.filter(h => h.stars >= parseInt(minStars));
      }
      if (region) {
        hotels = hotels.filter(h => h.region && h.region.toLowerCase().includes(region.toLowerCase()));
      }
      if (amenities && amenities.length > 0) {
        hotels = hotels.filter(h => amenities.every(a => h.amenities.includes(a)));
      }
    }

    // Scoring Algorithm
    const scored = hotels.map(hotel => {
      let score = 0;

      // 1. Location Score (40%)
      if (city && hotel.city.toLowerCase().includes(city.toLowerCase())) {
        score += WEIGHTS.location * 100;
      } else if (region && hotel.region && hotel.region.toLowerCase().includes(region.toLowerCase())) {
        score += WEIGHTS.location * 80;
      } else {
        score += WEIGHTS.location * 50;
      }

      // 2. Budget Score (30%)
      if (maxBudget) {
        const budget = parseInt(maxBudget) / USD_TO_TSH;
        if (hotel.price <= budget) {
          const ratio = Math.min(1, (budget - hotel.price) / budget);
          score += WEIGHTS.budget * (70 + ratio * 30);
        } else {
          const over = Math.max(0, 1 - (hotel.price - budget) / (budget * 0.5));
          score += WEIGHTS.budget * (over * 40);
        }
      } else {
        score += WEIGHTS.budget * 50;
      }

      // 3. Amenities Score (20%)
      if (amenities && amenities.length > 0) {
        let matchCount = 0;
        amenities.forEach(a => {
          if (hotel.amenities.includes(a)) matchCount++;
        });
        score += WEIGHTS.amenities * ((matchCount / amenities.length) * 100);
      } else {
        score += WEIGHTS.amenities * 50;
      }

      // 4. Star Rating Score (10%)
      if (minStars) {
        const min = parseInt(minStars);
        const starScore = Math.min(100, (hotel.stars / min) * 100);
        score += WEIGHTS.rating * starScore;
      } else {
        score += WEIGHTS.rating * (hotel.rating / 5) * 100;
      }

      return { ...hotel, matchScore: Math.round(score) };
    });

    // Sort by best match
    scored.sort((a, b) => b.matchScore - a.matchScore);

    // Return all matches
    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
